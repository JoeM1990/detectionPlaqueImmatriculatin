const video = document.getElementById('video');
const resultDiv = document.getElementById('result');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const scanLine = document.getElementById('scanLine');

let stream = null;
let scanning = false;
let detectionModel = null;

// Charger les modèles dès le chargement de la page
(async function() {
    try {
        detectionModel = await cocoSsd.load();  
        showAlert('Le modèle de détection est chargé et prêt.');
        console.log('Le modèle de détection est chargé et prêt.');
    } catch (error) {
        console.error('Erreur lors du chargement du modèle de détection:', error);
        showAlert('Erreur lors du chargement du modèle. Veuillez réessayer.');
    }
})();

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
    if (!detectionModel) {
        showAlert('Le modèle de détection n\'est pas encore chargé. Veuillez patienter.');
        return;
    }

    try {
        const predictions = await detectionModel.detect(video);
        const plates = predictions.filter(prediction => prediction.class === 'car'); // Remplacer par une classe de plaque si possible

        if (plates.length > 0) {
            // Capture d'une image de la vidéo pour l'OCR
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Détection des caractères sur la plaque avec Tesseract.js
            Tesseract.recognize(
                canvas,
                'eng',
                {
                    logger: info => console.log(info), // Suivi de la progression
                }
            ).then(({ data: { text } }) => {
                stopScanning(); // Arrêter l'animation de balayage après une détection réussie
                resultDiv.innerText = `Plaque détectée : ${text.trim()}`;
            }).catch(error => {
                console.error('Erreur OCR:', error);
                resultDiv.innerText = 'Erreur lors de la reconnaissance de la plaque.';
            });
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
