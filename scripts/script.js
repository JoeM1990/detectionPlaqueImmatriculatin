const video = document.getElementById('video');
const resultDiv = document.getElementById('result');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const scanLine = document.getElementById('scanLine');

let stream = null;
let scanning = false;
let detectionModel = null;  
let ocrModel = null;        

// Charger les modèles dès le chargement de la page
(async function() {
    try {
        detectionModel = await tf.loadLayersModel('../models/model.json');
        ocrModel = await loadOcrModel();        
        showAlert('Les modèles sont chargés et prêts.');
        console.log('Les modèles sont chargés et prêts.');
    } catch (error) {
        console.error('Erreur lors du chargement des modèles:', error);
        showAlert('Erreur lors du chargement des modèles. Veuillez réessayer.');
    }
})();

// Charger le modèle OCR personnalisé
async function loadOcrModel() {
    return await tf.loadLayersModel('../models/ocr/model.tflite');
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
            console.error('Erreur lors de l\'activation de la caméra:', error);
            showAlert('Impossible d\'accéder à la caméra.');
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
        showAlert('Les modèles ne sont pas encore chargés. Veuillez patienter.');
        return;
    }

    try {
        // Capturer une image de la vidéo
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convertir l'image en tenseur pour le modèle de détection
        const imgTensor = tf.browser.fromPixels(canvas).expandDims(0).toFloat().div(255);

        // Prédiction du modèle de détection
        const predictions = await detectionModel.executeAsync(imgTensor);

        // Filtrer les prédictions pour ne garder que les véhicules (selon votre modèle)
        const plates = predictions[0].arraySync().filter(prediction => prediction[4] > 0.5); // Ajuster le seuil selon votre modèle

        if (plates.length > 0) {
            // Extraire la région d'intérêt (plaque d'immatriculation) pour le modèle OCR
            const plateTensor = imgTensor.slice([0, 0, 0], [1, 3, 640, 640]);  // Ajustez la dimension selon vos besoins

            // Utiliser le modèle OCR pour reconnaître les caractères
            const ocrPredictions = await ocrModel.executeAsync(plateTensor);
            const plateNumber = ocrPredictions.dataSync(); // Récupérer la prédiction du texte

            if (plateNumber) {
                stopScanning();
                resultDiv.innerText = `Plaque détectée : ${plateNumber}`;
            } else {
                resultDiv.innerText = 'Impossible de lire la plaque.';
            }
        } else {
            resultDiv.innerText = 'Aucune plaque détectée.';
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
        showAlert('Veuillez d\'abord activer la caméra.');
    }
});

function showAlert(message) {
    document.getElementById('infos-message').textContent = message;
    document.getElementById("messageModal").style.display = "block";

    setTimeout(function() {
        document.getElementById("messageModal").style.display = "none";
    }, 1500);
}
