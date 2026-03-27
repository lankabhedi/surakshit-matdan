# 🔐 Surakshit Matdan - CLI ZKP Voting System

**India Innovates 2026 | Digital Democracy Domain | IIT Jodhpur**

A command-line Zero-Knowledge Proof voting system that implements Layer 2 of the Surakshit Matdan architecture.

---

## 🚀 Quick Start

### Interactive Menu (Recommended)
```bash
npm run zkp-interactive
```

### Place Aadhaar ZIPs
Put your Aadhaar ZIP files in `./aadhaar-zips/` folder:
```bash
cp your-aadhaar.zip ./aadhaar-zips/
```

### Use the Menu
1. **Scan Aadhaar ZIPs** - See all ZIPs in folder
2. **Generate ZKP Proof** - Extract ZIP, parse XML, create proof
3. **Cast Your Vote** - Vote anonymously
4. **View Results** - Live election results
5. **View ZKP Proofs** - See all generated proofs
6. **View Blockchain** - See votes & nullifiers
7. **Generate Mock Voters** - Create demo voters
8. **Clear ZIP Folder** - Delete all ZIPs
9. **Reset Chain** - Reset election for new demo

---

## 📋 All Commands

### Interactive Mode (Recommended)
```bash
npm run zkp-interactive
```

### Command-Line Mode
| Command | Description |
|---------|-------------|
| `generate-proof --file <path>` | Generate ZKP from Aadhaar XML or ZIP |
| `vote --candidate <id>` | Cast your vote (1-4) |
| `results` | Show live election results |
| `verify --receipt <hash>` | Verify your vote was counted |
| `candidates` | List all candidates |
| `generate-xml --count <n>` | Generate mock Aadhaar XMLs for demo |
| `reset` | Reset all voting data |

---

## 🎯 Demo Flow

### Option 1: Real Aadhaar ZIP
```bash
# 1. Generate proof from your Aadhaar ZIP
npm run zkp-vote -- generate-proof --file ./offlineaadhaar20260328014717031.zip
# Enter password: 0000

# 2. Vote
npm run zkp-vote -- vote --candidate 1

# 3. See results
npm run zkp-vote -- results
```

### Option 2: Multiple Mock Voters
```bash
# 1. Generate mock voters
npm run zkp-vote -- generate-xml --count 5

# 2. Vote with each voter
npm run zkp-vote -- generate-proof --file ./mock_aadhaar_1.xml
npm run zkp-vote -- vote --candidate 1

npm run zkp-vote -- generate-proof --file ./mock_aadhaar_2.xml
npm run zkp-vote -- vote --candidate 2

npm run zkp-vote -- generate-proof --file ./mock_aadhaar_3.xml
npm run zkp-vote -- vote --candidate 3

# 3. See results
npm run zkp-vote -- results
```

---

## 🔒 Security Features

### Nullifier-Based Double Vote Prevention
- Each voter gets a unique **nullifier**: `SHA-3(aadhaar_hash + election_id)`
- Nullifier is published publicly after voting
- Second vote attempt is **mathematically rejected**

### Anonymous Voting
- Vote choice is **never linked** to voter identity
- Receipt proves your vote was counted (not how you voted)
- Privacy-preserving tally

### Aadhaar XML Parsing
- Parses UIDAI-signed Offline KYC XML
- Extracts: name, age, district, state, pincode
- Verifies age ≥ 18 automatically

---

## 📊 Architecture (Layer 2)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Aadhaar XML    │ ──▶ │  ZKP Proof       │ ──▶ │  Vote Record    │
│  (ZIP/Password) │     │  - Age≥18        │     │  - Nullifier    │
│                 │     │  - Unique Voter  │     │  - Receipt      │
│                 │     │  - Single Vote   │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js + TypeScript |
| CLI Framework | Commander.js |
| XML Parsing | fast-xml-parser |
| ZIP Extraction | unzipper |
| Hashing | SHA-3 (crypto) |
| Storage | Local JSON files |

---

## 📁 Data Storage

### Folders
```
surakshit-matdan/
├── aadhaar-zips/          # 📦 Place Aadhaar ZIP files here
│   ├── voter1.zip
│   └── voter2.zip
├── .zkp-data/             # 🔐 Internal data (auto-created)
│   ├── voters.json        # Voter sessions
│   ├── votes.json         # Cast votes (blockchain)
│   ├── nullifiers.json    # Published nullifiers
│   ├── election.json      # Election config & candidates
│   └── proofs.json        # ZKP proofs generated
└── src/cli/
    ├── zkp-vote.ts        # Command-line mode
    └── zkp-vote-interactive.ts  # Interactive menu mode
```

### Data Files
| File | Description |
|------|-------------|
| `voters.json` | Voter sessions |
| `votes.json` | Cast votes (blockchain) |
| `nullifiers.json` | Used nullifiers (prevents double-vote) |
| `election.json` | Election config & candidates |
| `proofs.json` | ZKP proofs generated |

---

## 🎤 Hackathon Demo Script

### Interactive Mode (Recommended)
```bash
# 1. Start interactive menu
npm run zkp-interactive

# 2. Place your Aadhaar ZIP in ./aadhaar-zips/

# 3. Follow the menu:
#    - Option 1: Scan ZIPs
#    - Option 2: Generate ZKP (enter password: 0000)
#    - Option 3: Cast Vote
#    - Option 4: View Results
#    - Option 5: View ZKP Proofs
#    - Option 6: View Blockchain
#    - Option 9: Reset Chain (for new demo)
```

### Command-Line Mode
```bash
# Introduction
echo "Surakshit Matdan - Layer 2 ZKP Voting System"

# Reset for clean demo
npm run zkp-vote -- reset --force

# Voter 1: Real Aadhaar ZIP
npm run zkp-vote -- generate-proof --file ./offlineaadhaar20260328014717031.zip
# Enter: 0000
npm run zkp-vote -- vote --candidate 1

# Voter 2: Mock XML
npm run zkp-vote -- generate-proof --file ./mock_aadhaar_1.xml
npm run zkp-vote -- vote --candidate 2

# Voter 3: Mock XML
npm run zkp-vote -- generate-proof --file ./mock_aadhaar_2.xml
npm run zkp-vote -- vote --candidate 3

# Try double-vote (should fail)
npm run zkp-vote -- vote --candidate 1
# Error: You have already voted!

# Show results
npm run zkp-vote -- results

# Verify vote
npm run zkp-vote -- verify --receipt <receipt_from_step_2>
```

---

## 🏆 India Innovates 2026

**Team:** BinaryBonsai  
**Domain:** Digital Democracy  
**Problem:** Secure E-Voting System  

**Features Implemented:**
- ✅ Aadhaar-based identity verification
- ✅ Nullifier-based double vote prevention
- ✅ Anonymous voting with receipts
- ✅ Real-time results
- ✅ ZIP password authentication
- ✅ Mock voter generation for demos

---

## ⚠️ Disclaimer

This is a **hackathon prototype** for demonstration purposes. Production deployment requires:
- Real blockchain integration (Hyperledger Fabric)
- CRYSTALS-Kyber/Dilithium post-quantum crypto
- Full ZKP circuits (circom/snarkjs)
- UIDAI AUA/KUA licensing for Aadhaar API
- Election Commission of India approval

---

**Built with ❤️ for Secure Democracy**
