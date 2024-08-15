# **VideoMaker**

Une application pour automatiser la création de vidéos en combinant une image et une piste audio, développée avec React, Next.js et FFMpeg.

## **Table des matières**

1. [Aperçu](#aperçu)
2. [Fonctionnalités](#fonctionnalités)
3. [Installation](#installation)
4. [Usage](#usage)

## **Aperçu**

Passionné par la composition musicale, j'ai créé une chaîne YouTube il y a 4 ans pour partager mes productions. La création de mes vidéos impliquait un processus manuel et répétitif avec Da Vinci Resolve. Le processus consistait à importer une image au format carré et une piste audio, à les placer dans la timeline, à ajuster la durée et la position de l'image, et enfin à exporter la vidéo. Ce processus était non seulement chronophage, mais aussi inutilement complexe puisque aucun montage créatif n'était requis.

Pour optimiser ce processus, j'ai développé **VideoMaker**, un outil d'automatisation qui simplifie la création de vidéos en utilisant React, Next.js et la librairie FFMpeg. Désormais, il suffit d'importer une image et une piste audio dans l'application pour générer automatiquement une vidéo au format correct, réduisant ainsi considérablement le temps nécessaire à la production.

## **Fonctionnalités**

- Importez une image et une piste audio.
- Générez automatiquement une vidéo avec l'image centrée et ajustée à l'échelle.
- Traitement rapide et sans besoin de logiciel de montage vidéo.

## **Installation**

Pour installer l'application sur votre machine locale, suivez ces étapes :

```bash
# Clonez le dépôt
git clone https://github.com/maelzchli/video-maker.git

# Allez dans le répertoire du projet
cd video-maker

# Installez les dépendances
npm install
```

## **Usage**

Après avoir installé l'application, voici comment l'utiliser :

```bash
# Démarrez le serveur de développement
npm run dev
```
Ouvrez votre navigateur et accédez à `http://localhost:3000`.

- Importez votre image et votre piste audio dans l'interface utilisateur.
- Cliquez sur "Créer la vidéo" pour obtenir votre fichier vidéo.
L'application s'occupera automatiquement du reste : ajustement de la durée de l'image, centrage, mise à l'échelle, et génération de la vidéo.
- Vous n'avez plus qu'à la télécharger
