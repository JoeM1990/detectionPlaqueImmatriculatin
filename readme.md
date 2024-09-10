# Détection de Plaques d'Immatriculation avec TensorFlow.js

Ce projet utilise **TensorFlow.js** pour détecter et reconnaître les plaques d'immatriculation à partir d'un flux vidéo en direct via la caméra. Le modèle de détection est utilisé pour identifier la plaque dans l'image, et un modèle OCR (Reconnaissance Optique de Caractères) est appliqué pour lire et renvoyer le numéro de la plaque.

## Fonctionnalités

- Activation/Désactivation de la caméra.
- Détection des plaques d'immatriculation dans les images.
- Reconnaissance des caractères sur la plaque.
- Interface utilisateur simple pour afficher les résultats de la détection.

## Pré-requis

Avant de commencer, assurez-vous que vous avez bien installé ou configuré les éléments suivants :

- [Node.js](https://nodejs.org/) (optionnel pour la gestion de dépendances avec npm)
- Un navigateur supportant **WebGL** pour l'exécution de **TensorFlow.js**
- Une caméra intégrée ou connectée à votre appareil

## Installation

1. Clonez ce dépôt sur votre machine locale :

    ```bash
    git clone https://github.com/votre-utilisateur/votre-projet.git
    cd votre-projet
    ```

2. Installez les dépendances (si vous avez un fichier `package.json` pour gérer les dépendances avec npm) :

    ```bash
    npm install
    ```

3. Téléchargez les modèles de détection et OCR et placez-les dans le dossier `models` :

    - `detection_model.json` et les fichiers associés
    - `ocr_model.json` et les fichiers associés

## Utilisation

1. Ouvrez le fichier `index.html` dans un navigateur :

    - Si vous avez un serveur local comme **Live Server** dans **VS Code**, vous pouvez simplement cliquer sur "Open with Live Server".
    - Vous pouvez aussi démarrer un serveur local en utilisant un outil comme **http-server** :

      ```bash
      npx http-server
      ```

2. Cliquez sur le bouton pour activer la caméra.

3. Appuyez sur "Détecter" pour capturer l'image de la vidéo, détecter la plaque et afficher le résultat.


