/* Author: Jonathan Monkila */

const video = document.getElementById('video');
const resultDiv = document.getElementById('result');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const scanLine = document.getElementById('scanLine');

let config = {};

let stream = null;
let scanning = false;
let detectionModel = null;
let ocrModel = null;



// Charger les modèles dès le chargement de la page
(async function () {
    try {
        // await tf.setBackend('wasm');
        // await tf.ready();

        detectionModel = await tf.loadGraphModel('../models/model.json');
        ocrModel = await loadOcrModel();
        showAlert('Les modèles sont chargés et prêts.', 1000);

        fetch('../config.json')
            .then(response => response.json())
            .then(data => {
                config = data;
            })
            .catch(error => console.error('Erreur de chargement de la configuration :', error));

    } catch (error) {
        showAlert('Erreur lors du chargement des modèles: ' + error + '\n' + 'Veuillez réessayer.', 1500);
    }
})();

// Charger le modèle OCR personnalisé
async function loadOcrModel() {
    try {
        // await tf.setBackend('wasm');
        // await tf.ready();
        const ocrModel = await tf.loadGraphModel('../models/crnn/model.json');
        return ocrModel;
    } catch (error) {
        console.error("Erreur lors du chargement du modèle OCR:", error);
        throw error;
    }
}

// Activer/Désactiver la caméra
toggleCameraButton.addEventListener('click', async () => {
    if (!stream) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            toggleCameraButton.innerHTML = '<i class="fas fa-video-slash"></i>';
            startScanning();
        } catch (error) {
            showAlert('Impossible d\'accéder à la caméra. \n' + error, 1500);
        }
    } else {
        stopCamera();
    }
});

function stopCamera() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        toggleCameraButton.innerHTML = '<i class="fas fa-video"></i>';
        stopScanning();
    }
}

// Commencer l'animation de balayage
function startScanning() {
    scanLine.style.display = 'block';
    scanning = true;
}

// Arrêter l'animation de balayage
function stopScanning() {
    scanLine.style.display = 'none';
    scanning = false;
}

// Détecter les plaques d'immatriculation
async function detectLicensePlates() {
    if (!detectionModel || !ocrModel) {
        showAlert('Les modèles ne sont pas encore chargés. Veuillez patienter.', 1500);
        return;
    }

    try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convertir l'image en tenseur pour le modèle de détection
        let imgTensor = tf.browser.fromPixels(canvas).expandDims(0).toFloat().div(255);

        // Redimensionner l'image à [1, 640, 640, 3]
        imgTensor = tf.image.resizeBilinear(imgTensor, [640, 640]);

        // Réarranger les dimensions pour correspondre à la forme [1, 3, 640, 640]
        imgTensor = tf.transpose(imgTensor, [0, 3, 1, 2]);

        // Prédiction du modèle de détection
        const predictions = await detectionModel.executeAsync({ images: imgTensor });

        // Vérification si la sortie existe
        if (predictions && predictions.length > 0 && predictions[0]) {
            const predictionTensor = predictions[0];

            // Vérification si le tenseur contient des données
            if (typeof predictionTensor.arraySync === 'function') {
                // Filtrer les prédictions pour ne garder que les véhicules (ajuster selon votre modèle)
                const plates = predictionTensor.arraySync().filter(prediction => prediction[4] > 0.5);

                if (plates.length > 0) {
                    // Extraire la région d'intérêt (plaque d'immatriculation) pour le modèle OCR
                    const plateTensor = imgTensor.slice([0, 0, 0], [1, 640, 640, 3]);

                    // Utiliser le modèle OCR pour reconnaître les caractères
                    const ocrPredictions = await ocrModel.executeAsync(plateTensor);
                    const plateNumber = ocrPredictions.dataSync(); // Récupérer la prédiction du texte

                    if (plateNumber) {
                        stopScanning();
                        resultDiv.innerText = `Plaque détectée : ${plateNumber}`;

                        //Verification du numero dans la base de donnees
                        checkNumPlate(plateNumber);

                    } else {
                        resultDiv.innerText = 'Impossible de lire la plaque.';
                    }
                } else {
                    resultDiv.innerText = 'Aucune plaque détectée.';
                }
            } else {
                console.error('Le tenseur de prédiction ne contient pas de fonction arraySync().');
            }
        } else {
            showAlert('Les prédictions ne sont pas valides.', 1500);
        }
    } catch (error) {
        console.error('Erreur lors de la détection:', error);
        resultDiv.innerText = 'Erreur lors de la détection.';
    }
}

// Déclencher la détection sur le clic du bouton
document.getElementById('captureButton').addEventListener('click', () => {
    if (stream && scanning) {
        detectLicensePlates();
    } else {
        showAlert('Veuillez d\'abord activer la caméra.', 1500);
    }
});

function showAlert(message, time) {
    document.getElementById('infos-message').textContent = message;
    document.getElementById("messageModal").style.display = "block";

    setTimeout(function () {
        document.getElementById("messageModal").style.display = "none";
    }, time);
}

function checkNumPlate(number) {

}

function verifyPlate() {
    let numero = document.getElementById('numeroVerify').value;
    const apiUrl = config.apiUrl;

    fetch(`${apiUrl}/cars?numero=` + numero)
        .then(response => response.json())
        .then(data => {
            closeVerifyModal();
            showAlert('Numéro de plaque : ' + data[0]['numero'] + '\n' + 'État : ' + data[0]['statut'], 3000);
        })
        .catch(error => {
            showAlert('Error: ' + error, 1500);
        });
}


function addPlateInfos() {
    const apiUrl = config.apiUrl;

    let numero = document.getElementById('numero').value;
    let statut = document.getElementById('etat').value;
    let proprietaire = document.getElementById('proprietaire').value;

    const formData = {
        'numero': numero,
        'statut': statut,
        'proprietaire': proprietaire,
    };

    fetch(`${apiUrl}/cars`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            closeAddModal();
            showAlert('Effectué', 3000);
        })
        .catch(error => {
            console.log('error :', error);
            showAlert('Error: ' + error, 1500);
        });
}


function openModal() {
    document.getElementById("infoModal").style.display = "block";
}

function closeModal() {
    document.getElementById("infoModal").style.display = "none";
}

function openAddModal() {
    document.getElementById("addModal").style.display = "block";
}

function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
}

function openVerifyModal() {
    document.getElementById("verifyModal").style.display = "block";
}

function closeVerifyModal() {
    document.getElementById("verifyModal").style.display = "none";
}