# BBS By Salma • Cosmétiques d'Exception 🌸

Boutique en ligne e-commerce haut de gamme et Progressive Web App (PWA) pour la marque de soins corporels **BBS By Salma** (Laits de corps nourrissants & Savons artisanaux naturels au Sénégal).

---

## ✨ Fonctionnalités Clés

- **Design Mobile & Desktop de Luxe** : Conforme à la maquette mobile (fond nude crème, typographies serif raffinées, teintes terracotta et chocolat).
- **Catalogue Soins Corporels & Savons** :
  - *Laits de corps* (Karité Sublime, Coco Velours, Hydratation Intense).
  - *Savons artisanaux surgras* (Papaye Éclat, Curcuma & Miel).
- **Paiement Wave Sénégal Intégré** :
  - La cliente saisit ses coordonnées et valide sa commande d'abord.
  - Dès validation, un bouton dédié ouvre directement l'application Wave avec le montant exact pré-rempli (`https://pay.wave.com/m/M_sn_UoRxc-HJ7lK-/c/sn/?amount=[TOTAL]`).
- **Accès Administrateur Secret** :
  - **Zéro bouton visible sur l'en-tête**.
  - Déverrouillage secret en **cliquant 5 fois consécutivement sur le logo**.
  - Identifiants par défaut : `admin@bbsbysalma.com` / `admin123`.
- **Hébergement Photos Cloudinary** : Prêt avec bascule automatique dès que les clés sont renseignées dans le `.env`.
- **Progressive Web App (PWA)** :
  - Installable sur smartphone (iOS Safari & Android Chrome) comme une vraie application native.
  - Fonctionnement hors-ligne grâce au Service Worker (`sw.js`).
  - Icônes de prestige générées en 192x192, 512x512, maskable et Apple Touch Icon.
- **Déploiement Vercel & GitHub Ready** : Configuration `vercel.json` et `.gitignore` étanches prêts pour la production.

---

## 📁 Architecture du Projet

```
bby-by-salma/
├── api/                      # Point d'entrée Serverless Vercel (api/index.ts)
├── backend/                  # API REST Express + TypeScript
│   ├── data/                 # Base de données persistante (store.json)
│   ├── routes/               # Routes API (auth, products, orders, upload, etc.)
│   ├── uploads/              # Stockage local temporaire des photos
│   ├── db.ts                 # Moteur de base de données
│   ├── index.ts              # Serveur Express (Port 5000)
│   └── .env.example          # Modèle de configuration backend
│
├── frontend/                 # Application Client React 19 + Vite + Tailwind CSS
│   ├── public/               # Manifest PWA, Service Worker, Icônes, Assets
│   │   ├── manifest.json     # Configuration PWA Web App Manifest
│   │   ├── sw.js             # Service Worker PWA
│   │   ├── favicon.svg       # Favicon officiel
│   │   ├── pwa-192x192.png   # Icône Android / Chrome
│   │   ├── pwa-512x512.png   # Icône HD
│   │   └── apple-touch-icon.png # Icône iOS Safari
│   ├── src/                  # Composants, Pages, Context, Hooks
│   └── vite.config.ts        # Configuration Vite
│
├── scripts/                  # Scripts utilitaires (génération d'icônes PWA, etc.)
├── .env.example              # Exemple de variables d'environnement
├── .gitignore                # Fichiers exclus du versionnement Git
├── vercel.json               # Configuration officielle de déploiement Vercel
├── package.json              # Scripts npm unifiés
└── README.md
```

---

## 🚀 Démarrage en Local

### 1. Cloner et installer les dépendances
```bash
git clone https://github.com/votre-compte/bby-by-salma.git
cd bby-by-salma
npm install
```

### 2. Configurer les variables d'environnement
Copiez `.env.example` en `.env` :
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Renseignez vos identifiants Cloudinary dans `.env` :
```env
PORT=5000
JWT_SECRET=votre_cle_jwt_secrete

# Cloudinary (https://console.cloudinary.com/)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
CLOUDINARY_FOLDER=bbs-by-salma

# Wave Sénégal
WAVE_PAYMENT_URL=https://pay.wave.com/m/M_sn_UoRxc-HJ7lK-/c/sn/
```

### 3. Lancer l'application
```bash
npm run dev
```
- **Boutique Client** : [http://localhost:3000](http://localhost:3000)
- **API Backend** : [http://localhost:5000](http://localhost:5000)

---

## 🐙 Comment Pusher sur GitHub

Le projet est déjà initialisé avec une branche `main` et un `.gitignore` sécurisé qui exclut vos `.env` et les `node_modules`.

Exécutez simplement les commandes suivantes :

```bash
# 1. Ajouter tous les fichiers
git add .

# 2. Créer le commit initial
git commit -m "feat: complete BBS By Salma store with mobile mockup, Wave payment, Cloudinary & PWA"

# 3. Lier votre dépôt GitHub distant (remplacez avec votre URL GitHub)
git remote add origin https://github.com/votre-utilisateur/bby-by-salma.git

# 4. Pousser vers GitHub
git branch -M main
git push -u origin main
```

---

## ⚡ Déploiement sur Vercel

Le fichier `vercel.json` est déjà configuré à la racine pour un déploiement clé en main :

### Option 1 : Déploiement Automatique via GitHub (Recommandé)
1. Rendez-vous sur [vercel.com](https://vercel.com) et connectez-vous.
2. Cliquez sur **Add New...** > **Project**.
3. Importez votre dépôt GitHub **bby-by-salma**.
4. Dans **Environment Variables**, ajoutez :
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `WAVE_PAYMENT_URL` (optionnel, valeur par défaut déjà incluse)
5. Cliquez sur **Deploy** ! Vercel compilera le frontend et déploiera l'API serverless automatiquement.

### Option 2 : Déploiement via le CLI Vercel
```bash
npm i -g vercel
vercel
vercel --prod
```

---

## 📱 Utilisation en PWA (Sur Mobile)

L'application respecte 100% des standards PWA :

- **Sur iPhone (iOS Safari)** :
  1. Ouvrez le site dans Safari.
  2. Appuyez sur le bouton **Partager** (icône carré avec flèche vers le haut).
  3. Sélectionnez **Sur l'écran d'accueil**.
  4. L'icône de luxe BBS By Salma apparaît sur votre écran d'accueil et s'ouvre en plein écran sans barre d'adresse !
- **Sur Android (Google Chrome)** :
  1. Une bannière élégante **« Installer BBS By Salma »** s'affiche automatiquement en bas de l'écran.
  2. Cliquez sur **Installer** pour ajouter l'application directement à vos applications Android.

---

## 🔐 Espace Administrateur Secret

- **URL d'accès** : Cliquez **5 fois consécutives sur le logo BBS** en haut à gauche de n'importe quelle page (ou rendez-vous sur `/admin`).
- **Email** : `admin@bbsbysalma.com`
- **Mot de passe** : `admin123`
- **Fonctionnalités admin** :
  - Gestion des produits (ajout, modification, suppression, upload de photos avec Cloudinary).
  - Gestion des catégories & rituels corporels.
  - Suivi des commandes en temps réel et statut des livraisons.
  - Statistiques de ventes & clients.
  - Modération des avis clientes.
