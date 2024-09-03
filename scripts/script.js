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


