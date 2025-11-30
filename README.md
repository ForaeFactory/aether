# Aether 🌌

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

![Aether Dashboard](public/assets/aether_shot.png)

**Aether** is a next-generation 3D data visualization dashboard designed to render massive datasets as interactive "galaxies" of information. Built with performance and aesthetics in mind, it combines the power of **React Three Fiber** for WebGL rendering with a cinematic, sci-fi inspired HUD interface.

> **Note**: This project is currently in active development.

## ✨ Key Features

- **High-Performance Rendering**: Capable of rendering 10,000+ interactive particles using instanced meshes and custom shaders.
- **Cinematic UI**: A fully responsive, "Sci-Fi" inspired Heads-Up Display (HUD) featuring glassmorphism, scanning lines, and animated data widgets.
- **AI-Driven Navigation**: Integrated "Command Terminal" allows users to control the camera and filter data using natural language queries (e.g., "Focus on the high-value cluster").
- **Interactive Data**: Hover over individual particles to reveal detailed metadata in real-time.
- **Advanced Post-Processing**: Includes Bloom, Depth of Field, and chromatic aberration for a premium visual experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Core**: [React 19](https://react.dev/)
- **3D Engine**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Three.js)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/aether.git
    cd aether
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

## 📂 Project Structure

```bash
aether/
├── app/
│   ├── api/            # API routes (AI chat)
│   ├── globals.css     # Global styles & Tailwind v4 config
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main entry point
├── components/
│   ├── canvas/         # 3D R3F components (Scene, Galaxy)
│   │   └── shaders/    # GLSL shaders
│   └── ui/             # 2D UI components (Overlay, HUD)
├── hooks/              # Custom React hooks (useMockChat)
├── store/              # Zustand state store
└── public/             # Static assets
```

## 🔮 Roadmap

- [x] **Phase 1**: Core Architecture & R3F Setup
- [x] **Phase 2**: Galaxy Particle System & Shaders
- [x] **Phase 3**: AI Integration (Mock) & Camera Control
- [x] **Phase 4**: UI Overhaul (Cinematic HUD)
- [ ] **Phase 5**: Real Data Integration & Filtering
- [ ] **Phase 6**: Performance Optimization (WebWorkers)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
