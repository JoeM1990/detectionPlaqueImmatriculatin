# Détection de Plaques d'Immatriculation avec TensorFlow.js

Ce projet utilise **TensorFlow.js** pour détecter et reconnaître les plaques d'immatriculation à partir d'un flux vidéo en direct via la caméra. Le modèle de détection est utilisé pour identifier la plaque dans l'image, et un modèle OCR (Reconnaissance Optique de Caractères) est appliqué pour lire et renvoyer le numéro de la plaque.

## Fonctionnalités

- Activation/Désactivation de la caméra.
- Détection des plaques d'immatriculation dans les images.
- Reconnaissance des caractères sur la plaque.
- Interface utilisateur simple pour afficher les résultats de la détection.

## Pré-requis

Avant de commencer, assurez-vous que vous avez bien installé ou configuré les éléments suivants :

- Un navigateur supportant **WebGL** pour l'exécution de **TensorFlow.js**
- Une caméra intégrée ou connectée à votre appareil

## Installation

1. Clonez ce dépôt sur votre machine locale :

    ```bash
    git clone https://github.com/JoeM1990/detectionPlaqueImmatriculatin.git
    cd detectionPlaqueImmatriculatin
    ```

2. Téléchargez les modèles de détection et OCR et placez-les dans le dossier `models` :

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


## Scripts Principaux

- **script.js** : Gère l'activation de la caméra, la capture d'images et l'exécution des modèles de détection et OCR.

## Contribuer

Les contributions sont les bienvenues ! Si vous avez des suggestions ou des corrections, veuillez ouvrir une issue ou un pull request sur GitHub.

### Comment Contribuer

1. Fork le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

## Remerciements

- [TensorFlow.js](https://www.tensorflow.org/js) pour l'exécution de modèles de machine learning dans le navigateur.
- [Font Awesome](https://fontawesome.com/) pour les icônes utilisées dans l'interface utilisateur.

## Auteur

- [Joe Monkila](https://github.com/JoeM1990) - Créateur et Développeur Principal



