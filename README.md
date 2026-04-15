# HaritNavinya

HaritNavinya is a comprehensive agricultural support platform designed to empower farmers with AI-driven insights, real-time disaster alerts, market information, and soil health management. The application provides personalized recommendations for crop selection, fertilizer usage, and connects farmers with agricultural officers.

## 🌾 Features

### Core Functionalities

- **AI Chatbot** - Interactive chatbot providing agricultural guidance and answers to farmer queries
- **Crop Recommendation** - Personalized crop suggestions based on soil conditions and location
- **Fertilizer Recommendation** - Data-driven fertilizer recommendations for optimal crop yield
- **Disaster Alerts** - Real-time alerts for weather disasters and agricultural emergencies
- **Soil Health Management** - Soil testing integration and health card dataset analysis
- **Mandi Market API** - Access to agricultural market prices and trading information
- **Farmer-Officer Connect** - Direct communication channel between farmers and agricultural officers
- **Weather Monitoring** - Weather services and forecasting
- **Soil Testing Centers** - Directory of nearby soil testing centers

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JavaScript** - Programming language
- **CSV Data Processing** - Nutrient and soil health datasets

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **CSS** - Styling

### Data & Services
- **JSON** - Data format for soil testing centers
- **CSV** - Datasets for soil health cards and nutrient information
- **REST API** - Communication protocol

## 📁 Project Structure

```
HaritNavinya/
├── backend/                      # Node.js backend services
│   ├── src/
│   │   ├── app.js               # Main application setup
│   │   ├── server.js            # Server initialization
│   │   ├── chatbot-server.js    # Chatbot service
│   │   ├── disaster-server.js   # Disaster alerts service
│   │   ├── controllers/         # Business logic controllers
│   │   │   ├── chatbotController.js
│   │   │   ├── mandiController.js
│   │   │   ├── soilController.js
│   │   │   └── weather.controller.js
│   │   ├── routes/              # API routes
│   │   ├── services/            # Core services
│   │   ├── models/              # Data models
│   │   ├── utils/               # Utility functions
│   │   ├── disaster/            # Disaster management system
│   │   └── soil-api/            # Soil API integration
│   ├── package.json             # Backend dependencies
│   ├── start-all-servers.bat    # Windows startup script
│   └── start-all-servers.ps1    # PowerShell startup script
│
├── frontend/                     # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Entry point
│   │   ├── components/          # Reusable React components
│   │   │   ├── AIChatbot.tsx
│   │   │   ├── CropRecommendation.tsx
│   │   │   ├── DisasterAlerts.tsx
│   │   │   ├── FertilizerRecommendation.tsx
│   │   │   ├── FarmerOfficerConnect.tsx
│   │   │   └── ...
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Utility functions
│   │   └── styles/              # Global styles
│   ├── public/                  # Static assets
│   │   └── data/                # Dataset files
│   ├── build/                   # Production build output
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.ts           # Vite configuration
│   └── tsconfig.json            # TypeScript configuration
│
├── soil-testing-centers.json    # Soil testing centers directory
├── render.yaml                   # Render deployment config
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Python** (optional, for some data processing)

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd HaritNavinya
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Option 1: Windows Batch Script
```bash
cd backend
./start-all-servers.bat
```

#### Option 2: PowerShell Script
```bash
cd backend
./start-all-servers.ps1
```

#### Option 3: Manual Start

**Start Backend Services:**
```bash
cd backend
npm start
```

**Start Frontend Development Server:**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` by default.

## 📡 API Services

### Chatbot Service
Provides AI-driven agricultural guidance and Q&A capabilities.

**Quick Start:** See [CHATBOT_QUICK_START.md](backend/CHATBOT_QUICK_START.md)

### Mandi Market API
Access agricultural market prices and trading information.

**Documentation:** See [README-MANDI-API.md](backend/README-MANDI-API.md)

### Disaster Alert System
Real-time disaster and emergency notifications.

**Documentation:** See [README-DISASTER-SYSTEM.md](backend/README-DISASTER-SYSTEM.md)

### Soil API
Soil health management and testing center integration.

**Quick Start:** See [soil-api/QUICK_START.md](backend/src/soil-api/QUICK_START.md)

## 📊 Datasets

- **Soil Health Card Dataset** - soil_health_card_dataset_2025_26.csv
- **Nutrient Information** - Nutrient.csv
- **Remote Sensing Data** - RS_Session_*.csv
- **Soil Testing Centers** - soil-testing-centers.json

## 🔧 Configuration

Key configuration files:
- `backend/src/config/` - Backend configuration
- `frontend/vite.config.ts` - Frontend build configuration
- `frontend/tsconfig.json` - TypeScript configuration

Environment variables should be configured in `.env` files within respective directories.

## 📚 Documentation

Detailed documentation is available in backend directory:
- [CHATBOT_IMPLEMENTATION.md](backend/CHATBOT_IMPLEMENTATION.md)
- [API_KEY_STATUS.md](backend/API_KEY_STATUS.md)
- [MANDI-SETUP-GUIDE.md](backend/MANDI-SETUP-GUIDE.md)
- [SETUP-COMPLETE.md](backend/SETUP-COMPLETE.md)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push to your branch
6. Create a Pull Request

## 📝 License

This project is licensed under appropriate terms. Please see individual components for specific licensing information.

## 🆘 Troubleshooting

### Port Already in Use
If you encounter port conflicts, check and modify the port configurations in:
- Backend: `backend/src/server.js`
- Frontend: `frontend/vite.config.ts`

### Build Issues
For frontend build issues:
```bash
npm install --legacy-peer-deps
npm run build
```

### API Connection Issues
Ensure backend services are running before starting the frontend application.

## 📧 Support

For issues, questions, or suggestions, please create an issue in the repository or contact the development team.

---

**Last Updated:** April 2026  
**Version:** 1.0.0
