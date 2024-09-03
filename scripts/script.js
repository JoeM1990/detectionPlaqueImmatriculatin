const video = document.getElementById('video');
const resultDiv = document.getElementById('result');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const scanLine = document.getElementById('scanLine');

let stream = null;
let scanning = false;

// Charger le modèle OCR (Optical Character Recognition)
async function loadOcrModel() {
  // Exemple: Charger le modèle OCR personnalisé
  const model = await tf.ocr.Model.load();
  return model;
}
