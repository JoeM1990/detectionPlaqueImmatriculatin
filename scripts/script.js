const video = document.getElementById('video');
const resultDiv = document.getElementById('result');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const scanLine = document.getElementById('scanLine');

let stream = null;
let scanning = false;

function openModal() {
    document.getElementById("infoModal").style.display = "block";
}

function closeModal() {
    document.getElementById("infoModal").style.display = "none";
}

// Charger le modèle OCR (Optical Character Recognition)
async function loadOcrModel() {
    const model = await tf.ocr.Model.load();
    return model;
}

toggleCameraButton.addEventListener('click', async () => {
    if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        toggleCameraButton.innerHTML = '<i class="fas fa-video-slash"></i>';
        startScanning();
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
async function detectLicensePlates(model) {
    const predictions = await model.detect(video);
    const plates = predictions.filter(prediction => prediction.class === 'car');
  
    if (plates.length > 0) {
      // Détecter les caractères réels sur la plaque avec OCR
      const ocrModel = await loadOcrModel();
      const plateNumber = await ocrModel.recognize(video); // Utiliser la vidéo ou l'image capturée pour lire les caractères
  
      if (plateNumber) {
        stopScanning(); // Arrêter l'animation de balayage après une détection réussie
        //Verifier dans la base de donnees
        // checkLicensePlate(plateNumber);
      } else {
        resultDiv.innerText = 'Impossible de lire la plaque.';
      }
    } else {
      resultDiv.innerText = 'Aucune plaque détectée.';
    }
  }


