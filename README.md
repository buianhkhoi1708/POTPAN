# POTPAN 🍳
### Smart Fridge & Recipe Suggestion App

POTPAN is a smart mobile application that helps users manage ingredients inside their fridge and discover delicious recipes based on available food items. Built with modern mobile technologies, POTPAN provides a simple and intuitive cooking experience powered by smart ingredient matching.

---

## ✨ Features

### 🔐 Authentication
- Secure Login & Register using Supabase Authentication
- Persistent user sessions
- Protected user data

### 🥬 Smart Fridge Management
- Add, update, and remove ingredients
- Organize ingredients by categories
- Easy ingredient tracking

### 🍽 Recipe Suggestion
- Smart recipe recommendations based on available ingredients
- Reduce food waste efficiently
- Quick meal discovery

### 👤 Profile Management
- Update personal information
- Upload and change avatar
- Personalized user experience

---

## 🛠 Tech Stack

| Technology | Description |
|---|---|
| React Native | Mobile application framework |
| Expo SDK 50 | Development platform |
| TypeScript | Type-safe JavaScript |
| Zustand | State management |
| Supabase | Backend-as-a-Service |
| Supabase Auth | Authentication system |

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/buianhkhoi1708/potpan.git
cd potpan
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run The App

```bash
npx expo start
```

Then:

- Press `i` → Open iOS Simulator
- Press `a` → Open Android Emulator
- Scan QR Code → Run on physical device with Expo Go

---

## 📂 Project Structure

```bash
potpan/
│── assets/             # Images & static files
│── components/         # Reusable UI components
│── screens/            # Application screens
│── services/           # API & Supabase services
│── store/              # Zustand state management
│── types/              # TypeScript definitions
│── utils/              # Utility functions
│── App.tsx             # Main entry point
```

---

## 🎯 Project Goals

- Help users manage fridge ingredients effectively
- Suggest recipes intelligently
- Reduce food waste
- Improve cooking convenience

---

## 👨‍💻 Team Information

**Course:** IE307.Q12  
**Group:** 9

---

## 📌 Future Improvements

- AI-powered recipe recommendations
- Expiration date tracking
- Nutrition analysis
- Shopping list generation
- Barcode scanner integration
- Multi-language support

---

## 📄 License

This project is developed for educational purposes.
