# 🌿 EcoSort AI – Smart Waste Classification System

An intelligent, modern, and responsive web application designed to help individuals and communities classify waste with AI computer vision, navigate proper recycling protocols, track environmental impact, and reduce landfill contamination.

---

## 🌟 Key Features

### 1. 🔍 AI Waste Classification Studio
- **Multi-Input Ingestion**: Drag-and-drop file upload, file explorer selection, and direct webcam/camera snapshot support.
- **Accepted Formats**: JPG, JPEG, PNG, and WebP (up to 15MB).
- **Neural Scanning Effect**: Futuristic vertical laser radar sweep during image inference.
- **One-Click Sample Selector**: Test immediately with preloaded samples:
  - 🍼 Plastic Water Bottle (PETE #1)
  - 🍎 Organic Apple Core (Compostable)
  - 📦 Corrugated Cardboard Box (Paper Fiber)
  - 🥫 Aluminum Soda Can (Infinitely Recyclable Metal)
  - 📱 Damaged Smartphone & Battery (Hazardous E-Waste)
  - 🍾 Green Glass Bottle (100% Inert Glass)
- **Real-Time Client-Side AI**: Powered by TensorFlow.js and MobileNet v2 with a comprehensive Waste Knowledge Mapping Engine (1000+ classes).

### 2. 📊 Rich Classification Results Dashboard
- **Category Badge & AI Confidence Score Meter**: Visual percentage indicator with color coding.
- **Color-Coded Bin Recommendation**: Clear guidance with standardized international bin colors:
  - 🔵 **Blue Bin**: Plastics & Dry Recyclable Packaging
  - 🟢 **Green Bin**: Organic Biomass & Food Compost
  - 🟤 **Brown Bin**: Paper & Corrugated Cardboard
  - 🟡 **Yellow / Slate Bin**: Aluminum & Metal Tins
  - 🔴 **Red Bin / Drop-off**: Hazardous Electronics, Batteries & Chemicals
  - 🟣 **Purple Bin**: Textiles & Fabric Donation
- **Step-by-Step Preparation Checklist**: Clear instructions (e.g., rinse clean, compress, separate caps).
- **Do's & Don'ts**: Quick comparison of acceptable items vs. common contaminants.
- **Environmental Impact Metrics**: CO₂ avoided (kg), water conserved (liters), and landfill decomposition lifespan.
- **Eco Upcycling Inspiration**: Creative repurposing suggestions for each item.
- **🔊 Voice Assistant (TTS)**: Built-in Text-to-Speech audio reader that speaks disposal steps aloud.
- **📋 Copy Summary**: Instant clipboard copy of the full disposal protocol.

### 3. 📖 Waste Encyclopedia & Recycling Guide
- Comprehensive reference covering 8 major waste streams: Plastics, Organics, Paper, Metals, Glass, E-Waste, Hazardous, and Textiles.
- Real-time search bar with instant fuzzy filtering.
- Category tabs and detailed modal popup for full protocols, resin identification codes (PET 1, HDPE 2, PP 5, etc.), and contamination warnings.

### 4. 📈 Environmental Analytics & Impact Dashboard
- **Chart.js Visualizations**:
  - Waste Stream Distribution (Donut Chart)
  - Weekly Sorting Volume (Bar Chart)
  - Cumulative Carbon Offset (Smooth Line Chart)
- **Personal Scan History Table**: Tracks thumbnails, assigned bins, confidence %, and carbon offset with local persistence.
- **Gamification & EcoPoints**: Level up from 🌱 *Eco Seedling* to 🌿 *Eco Scout*, 🛡️ *Green Guardian*, and 🌍 *Earth Champion*.

### 5. 🗺️ Eco Drop-Off Locator
- Directory of municipal recovery hubs, community compost yards, certified e-waste kiosks, and glass drop-offs with operating hours and accepted materials.

### 6. 🏆 Interactive Eco Sorting Quiz
- 5 real-world recycling trivia scenarios with instant feedback, explanations, and bonus EcoPoints.

---

## 🚀 Quick Start Guide

### Option 1: Using Node.js (Zero external dependencies)
```bash
# Start the built-in server
npm start
# Or: node server.js
```
Open your browser and navigate to:
```
http://localhost:3000
```

### Option 2: Using Python
```bash
python -m http.server 3000
```

### Option 3: Direct File Opening
You can also open `index.html` directly in any modern web browser.

---

## 🎨 Design System
- **Colors**: Deep Forest Green (`#0D2818`), Emerald Accent (`#10B981`), Mint Backgrounds (`#ECFDF5`), and Clean Greys (`#F8FAFC`, `#0F172A`).
- **Typography**: Google Fonts *Outfit* (Headings) and *Inter* (Body).
- **Theme**: Persistent Dark Mode and Light Mode support.
- **Responsiveness**: 100% fluid layouts with collapsible sidebar drawer for mobile and tablets.
