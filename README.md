# Farm Rental Equipment App

A comprehensive farm equipment rental platform with AI-powered crop equipment advisor, live tracking, and booking management system.

## Features

### 🔐 Authentication
- Role-based login system (Farmer and Owner)
- Secure session management
- Demo accounts available

### 👨‍🌾 Farmer Features
- Browse available equipment
- Search and filter equipment
- Book equipment with date selection
- View booking history
- **AI Crop Equipment Advisor** - Get personalized equipment recommendations based on crop type, season, and farm size
- **Live Equipment Tracking** - Real-time location tracking of rented equipment

### 👔 Owner Features
- Add and manage equipment listings
- View all bookings
- Accept/reject booking requests
- Track equipment status
- Monitor revenue and statistics

### 🤖 AI Crop Equipment Advisor
- Intelligent recommendations based on:
  - Crop type (Wheat, Corn, Rice, Soybean, etc.)
  - Season (Spring, Summer, Fall, Winter)
  - Farm size
- Provides reasoning for recommendations
- Suggests optimal equipment combinations

### 📍 Live Equipment Tracking
- Real-time GPS tracking
- Equipment status monitoring (idle, in-use, moving)
- Map visualization
- Location history

### 📅 Booking System
- Date range selection
- Automatic price calculation
- Booking status management
- Rental workflow (Pending → Confirmed → Active → Completed)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **date-fns** for date manipulation

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Demo Accounts

**Farmer Account:**
- Email: `farmer@demo.com`
- Password: `demo123`

**Owner Account:**
- Email: `owner@demo.com`
- Password: `demo123`

*Note: You can also use any email/password combination for demo purposes*

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AIAdvisor.tsx
│   ├── AddEquipmentModal.tsx
│   ├── BookingList.tsx
│   ├── BookingModal.tsx
│   ├── EquipmentList.tsx
│   └── TrackingMap.tsx
├── context/             # React Context providers
│   ├── AuthContext.tsx
│   └── EquipmentContext.tsx
├── pages/               # Page components
│   ├── Login.tsx
│   ├── FarmerDashboard.tsx
│   └── OwnerDashboard.tsx
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Features in Detail

### AI Crop Equipment Advisor
The AI advisor analyzes your farming requirements and provides intelligent equipment recommendations. It considers:
- Crop-specific needs
- Seasonal requirements
- Farm size optimization
- Equipment compatibility

### Live Tracking
- Real-time location updates every 5 seconds
- Visual map representation
- Equipment status indicators
- Historical location data

### Rental Process
1. **Farmer** searches and selects equipment
2. **Farmer** creates booking request with dates
3. **Owner** reviews and confirms/rejects booking
4. **Owner** marks booking as active when equipment is delivered
5. **Owner** completes rental when equipment is returned

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Future Enhancements

- Integration with real GPS tracking devices
- Payment gateway integration
- Advanced AI recommendations using machine learning
- Mobile app version
- Equipment maintenance scheduling
- Reviews and ratings system
- Chat/messaging between farmers and owners

## License

MIT

