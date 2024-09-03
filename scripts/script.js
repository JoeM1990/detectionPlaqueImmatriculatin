const video = document.getElementById('video');
const resultDiv = document.getElementById('result');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const scanLine = document.getElementById('scanLine');

let stream = null;
let scanning = false;

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
        //   stopScanning();
    }
}
