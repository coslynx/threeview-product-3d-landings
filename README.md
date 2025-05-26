<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>

<h1 align="center">
saas-3d-landing-page
</h1>
<h4 align="center">Visually engaging SaaS landing page with interactive 3D models & animations.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Framework-React-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/3D_Library-Three.js-DD0031?logo=three.js&logoColor=white" alt="Three.js">
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/threeview-product-3d-landings?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/threeview-product-3d-landings?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/threeview-product-3d-landings?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- ⚙️ Key Features
- 🧰 Tech Stack
- 📂 Project Structure
- 🚀 Installation
- 🎮 Usage
- 🌍 Hosting
- 📄 License & Attribution

## 📍 Overview
This repository showcases an engaging 3D landing page for a SaaS product, built with React and Three.js. It features interactive 3D models, smooth animations, and parallax scrolling, designed to captivate potential customers.

## ⚙️ Key Features

| Feature                      | Description                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Interactive 3D Models        | Showcase key product features with engaging, interactive 3D elements.                                         |
| Smooth Animations          | Enhance user experience with polished animations using GSAP and React Three Fiber.                        |
| Parallax Scrolling Effects  | Create a sense of depth and visual interest.                                                                 |
| Modern, Minimalist Design    | Clean, professional design focused on showcasing the product.                                               |
| Responsive Layout            | Adapts seamlessly to different screen sizes and devices.                                                    |
| Optimized Performance        | Ensures smooth 3D rendering through careful optimization of models and animations.                           |

## 🧰 Tech Stack
*   **React:** JavaScript library for building user interfaces.
*   **Three.js:** JavaScript 3D library.
*   **React Three Fiber:** React renderer for Three.js.
*   **React Three Drei:** Helpers and abstractions for R3F.
*   **GSAP:** JavaScript library for high-performance animations.
*   **Lucide React:** Pixel-perfect icons.
*   **Vite:** Fast frontend build tool.
*   **Tailwind CSS:** Utility-first CSS framework.
*   **TypeScript:** Superset of JavaScript with static typing.
*   **EsLint**: Code linter for JavaScript and TypeScript.
*   **Prettier**: Code formatter.
*   **Jest**: JavaScript testing framework.

## 📂 Project Structure
```
saas-3d-landing-page/
├── src/
│   ├── components/
│   │   ├── 3D/
│   │   │   ├── AdvancedScene.tsx    # Component for advanced 3D scenes
│   │   │   ├── ThreeScene.tsx       # Core 3D scene component
│   │   │   ├── ModelLoader.tsx      # Component for loading 3D models
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Site header component
│   │   │   ├── MinimalLayout.tsx    # Base layout component
│   │   │   └── Footer.tsx           # Site footer component
│   │   └── sections/
│   │   │   └── LandingHero.tsx      # Landing page hero section
│   ├── hooks/
│   │   ├── use3DAnimation.tsx     # Custom hook for 3D animations
│   │   ├── useScrollAnimation.tsx # Custom hook for scroll-triggered animations
│   │   └── useToggle.tsx          # Custom hook for boolean toggles
│   ├── pages/
│   │   ├── AboutPage.tsx          # About page component
│   │   ├── ContactPage.tsx        # Contact page component
│   │   ├── ExperiencePage.tsx     # Immersive experience page
│   │   └── ModelShowcasePage.tsx  # Page for showcasing 3D models
│   ├── styles/
│   │   ├── components/           # Component-specific styles
│   │   ├── layout/             # Layout-specific styles
│   │   └── pages/              # Page-specific styles
│   ├── utils/
│   │   ├── format.ts            # Utility functions for formatting
│   │   ├── modelManager.ts      # Utility functions for managing 3D models
│   │   └── three-helpers.ts     # Utility functions for Three.js
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Entry point
│   └── vite-env.d.ts          # Environment type definitions
├── public/
│   ├── models/            # 3D models (.glb, .gltf)
│   └── textures/          # Textures for 3D models
├── .eslintrc.cjs        # ESLint configuration
├── .gitignore           # Specifies intentionally untracked files that Git should ignore
├── package.json           # Project dependencies and scripts
├── postcss.config.cjs   # PostCSS configuration
├── README.md              # Project documentation
├── tailwind.config.cjs  # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🚀 Installation
> [!WARNING]
> ### ⚠️ Prerequisites
> - Node.js v18 or higher
> - npm v8 or higher

### ⚙️ Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/coslynx/threeview-product-3d-landings.git
   cd threeview-product-3d-landings
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## 🎮 Usage

### 💻 Running the MVP
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`.

> [!TIP]
> ### 💡 Configuration
> - Detailed explanation of configuration files and their purposes
> - Instructions on how to modify key settings
> - Any environment-specific configurations

### 📝 Examples
Key aspects for interacting with the landing page
1.  **Explore the 3D model:**
    -   Use your mouse to click on the model to highlight it.

2.  **Check site sections:**
    -   Use the header to navigate to new sections.

## 🌍 Hosting
### 🚀 Deployment Instructions
Steps to deploy to Netlify

1.  **Install the Netlify CLI:**
    ```bash
    npm install -g netlify-cli
    ```

2.  **Build:**
    ```bash
    npm run build
    ```

3.  **Deploy:**
    ```bash
    netlify deploy --prod
    ```

> [!NOTE]
> For automated deploys connect this repository to your Netlify account.
### 🔑 Environment Variables
* VITE_APP_TITLE : "The Name of the app"
* VITE_MODEL_PATH : "Where 3D models exist. If local it will be /models/, otherwise it can be an external link"
* VITE_TEXTURE_PATH : "Texture path to load"
* VITE_DRAGO_DECODER_PATH : " Draco path for compression",
* VITE_ENVIRONMENT_MAP_PATH : "Enviroment details",
* VITE_PERFORMANCE_MONITOR : "Whether to implement monitor or not. TRUE/FALSE"
* VITE_API_BASE_URL : "The URL for data loading or submissions"

## 📄 License & Attribution

### 📜 License
This Minimum Viable Product (MVP) is licensed under the [MIT License](https://choosealicense.com/licenses/mit/) license.

### 🤖 AI-Generated MVP
This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).

No human was directly involved in the coding process of the repository: threeview-product-3d-landings

### 📞 Contact
For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
- Website: [CosLynx.com](https://coslynx.com)
- Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

<p align="center">
  <h1 align="center">🌐 CosLynx.com</h1>
</p>
<p align="center">
  <em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
</p>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
<img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
</div>