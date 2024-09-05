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
        detectionModel = await cocoSsd.load();  
        ocrModel = await loadOcrModel();        // Charger le modèle OCR ici
        showAlert('Les modèles sont chargés et prêts.');
        console.log('Les modèles sont chargés et prêts.');
    } catch (error) {
        console.error('Erreur lors du chargement des modèles:', error);
        showAlert('Erreur lors du chargement des modèles. Veuillez réessayer.');
    }
})();

// Charger le modèle OCR (Assurez-vous que le modèle et la méthode sont corrects)
async function loadOcrModel() {
    // Remplacer par le chargement correct du modèle OCR
    return await tf.loadLayersModel();
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
        const predictions = await detectionModel.detect(video);
        const plates = predictions.filter(prediction => prediction.class === 'car'); // Remplacer par une classe de plaque si possible

        if (plates.length > 0) {
            // Détecter les caractères réels sur la plaque avec OCR
            const plateNumber = await ocrModel.recognize(video); // Utiliser la vidéo ou l'image capturée pour lire les caractères

            if (plateNumber) {
                stopScanning(); // Arrêter l'animation de balayage après une détection réussie
                resultDiv.innerText = plateNumber;
                // checkLicensePlate(plateNumber); // Décommenter si vous avez une fonction pour vérifier dans Firebase
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
