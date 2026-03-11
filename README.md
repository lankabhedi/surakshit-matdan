<p align="center">
  <img src="https://raw.githubusercontent.com/lankabhedi/surakshit-matdan/main/public/logo.svg" alt="Surakshit Matdan Logo" width="150"/>
</p>

<h1 align="center">Surakshit Matdan</h1>

<p align="center">
  <strong>Secure Blockchain Voting System</strong><br>
  A hackathon-ready prototype for secure, transparent, and immutable voting powered by blockchain technology.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue?style=flat&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.5-blue?style=flat&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-3.4-blue?style=flat&logo=tailwind-css" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Vite-5.4-blue?style=flat&logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/Framer%20Motion-11.3-purple?style=flat" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="License"/>
</p>

---

## ✨ Features

### 🔐 Multi-Factor Authentication
- **Aadhaar Integration** - Secure identity verification using India's UID system
- **OTP Verification** - One-time password sent to registered mobile
- **Biometric Auth** - Fingerprint and facial recognition
- **Wallet Connection** - MetaMask blockchain wallet integration

### 🗳️ Voting System
- **Active Elections** - Real-time display of ongoing elections
- **Candidate Selection** - Clean, intuitive voting interface
- **Vote Confirmation** - Transaction hash on blockchain
- **Live Results** - Real-time vote counting with progress bars

### 👨‍💼 Admin Panel
- **Election Management** - Create, edit, and manage elections
- **Live Monitoring** - Track voting activity in real-time
- **Result Analytics** - Detailed candidate performance
- **Election Control** - Start/stop elections instantly

### 🎨 UI/UX
- **Modern Design** - Beautiful gradient themes
- **Smooth Animations** - Framer Motion transitions
- **Responsive** - Works on all devices
- **Dark Theme Landing** - Eye-catching hero section

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/lankabhedi/surakshit-matdan.git

# Navigate to project
cd surakshit-matdan

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🔑 Demo Credentials

| Role | Aadhaar Number | OTP |
|------|---------------|-----|
| Voter | `123456789012` | `123456` |
| Admin | `123456789012` | `123456` |

> **Note:** This is a prototype. For demo purposes, use OTP `123456` to verify.

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion 11 |
| State | Zustand |
| Routing | React Router 6 |
| Blockchain | Ethers.js |
| Build | Vite 5 |

---

## 📁 Project Structure

```
surakshit-matdan/
├── src/
│   ├── components/        # Reusable components
│   │   └── VotedModal.tsx
│   ├── pages/           # Page components
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── VoterDashboard.tsx
│   │   ├── Vote.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── Results.tsx
│   ├── store/           # State management
│   │   └── useStore.ts
│   ├── data/            # Mock data
│   │   └── mockData.ts
│   ├── utils/           # Utility functions
│   │   ├── auth.ts
│   │   └── blockchain.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🔒 Security Features

- ✅ Aadhaar-based identity verification
- ✅ OTP validation
- ✅ Biometric authentication support
- ✅ Blockchain immutable records
- ✅ Wallet-based transaction verification

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspiration from modern voting systems
- Built for hackathon demonstration
- Blockchain integration with Ethers.js

---

<p align="center">
  Made with ❤️ for secure democracy
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=lankabhedi&repo=surakshit-matdan&label=Views&color=blue" alt="Profile Views"/>
</p>
