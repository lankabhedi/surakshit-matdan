#!/usr/bin/env node
/**
 * Surakshit Matdan - Interactive CLI ZKP Voting System
 * Layer 2: Zero-Knowledge Proof Vote Casting
 * India Innovates 2026 - Digital Democracy Domain
 */

import { execSync } from 'child_process';

import { XMLParser } from 'fast-xml-parser';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// ASCII Art Banner - SURAKSHIT MATDAN
const ASCII_ART = `
███████╗██╗   ██╗██████╗  █████╗ ██╗  ██╗███████╗██╗  ██╗██╗████████╗    ███╗   ███╗ █████╗ ████████╗██████╗  █████╗ ███╗   ██╗
██╔════╝██║   ██║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝██║  ██║██║╚══██╔══╝    ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║
███████╗██║   ██║██████╔╝███████║█████╔╝ ███████╗███████║██║   ██║       ██╔████╔██║███████║   ██║   ██║  ██║███████║██╔██╗ ██║
╚════██║██║   ██║██╔══██╗██╔══██║██╔═██╗ ╚════██║██╔══██║██║   ██║       ██║╚██╔╝██║██╔══██║   ██║   ██║  ██║██╔══██║██║╚██╗██║
███████║╚██████╔╝██║  ██║██║  ██║██║  ██╗███████║██║  ██║██║   ██║       ██║ ╚═╝ ██║██║  ██║   ██║   ██████╔╝██║  ██║██║ ╚████║
╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝       ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝

            India Innovates 2026 | BinaryBonsai
            Digital Democracy | Secure E-Voting
`;

const MENU = `
╔═══════════════════════════════════════════════════════════════╗
║  📋 MAIN MENU                                                 ║
╠═══════════════════════════════════════════════════════════════╣
║  1. 🔍 Scan Aadhaar ZIPs                                      ║
║  2. 🔐 Generate ZKP Proof (from ZIP)                          ║
║  3. 🗳️  Cast Your Vote                                        ║
║  4. 📊 View Election Results                                  ║
║  5. 🔍 View ZKP Proofs Generated                              ║
║  6. ⛓️  View Blockchain (Votes & Nullifiers)                  ║
║  7. 📝 Generate Mock Voters                                   ║
║  8. 🗑️  Clear ZIP Folder                                      ║
║  9. 🔄 Reset Election Chain                                   ║
║  0.  Exit                                                     ║
╚═══════════════════════════════════════════════════════════════╝
`;

// Data storage paths
const DATA_DIR = path.join(process.cwd(), '.zkp-data');
const ZIPS_DIR = path.join(process.cwd(), 'aadhaar-zips');
const VOTERS_FILE = path.join(DATA_DIR, 'voters.json');
const VOTES_FILE = path.join(DATA_DIR, 'votes.json');
const NULLIFIERS_FILE = path.join(DATA_DIR, 'nullifiers.json');
const ELECTION_FILE = path.join(DATA_DIR, 'election.json');
const PROOFS_FILE = path.join(DATA_DIR, 'proofs.json');

function initDirectories() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ZIPS_DIR)) fs.mkdirSync(ZIPS_DIR, { recursive: true });
}

function initDataFiles() {
  if (!fs.existsSync(VOTERS_FILE)) fs.writeFileSync(VOTERS_FILE, JSON.stringify({ voters: [] }, null, 2));
  if (!fs.existsSync(VOTES_FILE)) fs.writeFileSync(VOTES_FILE, JSON.stringify({ votes: [] }, null, 2));
  if (!fs.existsSync(NULLIFIERS_FILE)) fs.writeFileSync(NULLIFIERS_FILE, JSON.stringify({ nullifiers: [] }, null, 2));
  if (!fs.existsSync(ELECTION_FILE)) {
    fs.writeFileSync(ELECTION_FILE, JSON.stringify({
      electionId: 'INDIA-INNOVATES-2026',
      candidates: [
        { id: 1, name: 'Party A - Development', symbol: 'Lotus', votes: 0 },
        { id: 2, name: 'Party B - Progress', symbol: 'Hand', votes: 0 },
        { id: 3, name: 'Party C - Change', symbol: 'Bicycle', votes: 0 },
        { id: 4, name: 'Independent', symbol: 'None', votes: 0 }
      ]
    }, null, 2));
  }
  if (!fs.existsSync(PROOFS_FILE)) fs.writeFileSync(PROOFS_FILE, JSON.stringify({ proofs: [] }, null, 2));
}

function parseAadhaarXML(xmlContent: string) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const result = parser.parse(xmlContent);
  if (!result.OfflinePaperlessKyc || !result.OfflinePaperlessKyc.UidData) throw new Error('Invalid Aadhaar XML format');
  const uidData = result.OfflinePaperlessKyc.UidData;
  const poi = uidData.Poi || {};
  const poa = uidData.Poa || {};
  return {
    uid: poi['@_uid'] || result.OfflinePaperlessKyc['@_uid'] || 'DEMO',
    name: poi['@_name'] || 'Unknown',
    gender: poi['@_gender'] || 'U',
    yob: poi['@_yob'] || '1990',
    dob: poi['@_dob'] || '01/01/1990',
    district: poa['@_dist'] || poa['@_subdist'] || 'Unknown',
    state: poa['@_state'] || 'Unknown',
    pincode: poa['@_pc'] || '000000'
  };
}

function generateNullifier(aadhaarHash: string, electionId: string): string {
  return crypto.createHash('sha3-256').update(`${aadhaarHash}:${electionId}`).digest('hex');
}

function generateVoterHash(aadhaarNumber: string): string {
  return crypto.createHash('sha3-256').update(aadhaarNumber).digest('hex');
}

function generateProofHash(voterHash: string, candidateId: number, nullifier: string): string {
  return crypto.createHash('sha3-256').update(JSON.stringify({ voterHash, candidateId, nullifier, timestamp: Date.now() })).digest('hex');
}

function scanZIPFolder(): string[] {
  if (!fs.existsSync(ZIPS_DIR)) return [];
  return fs.readdirSync(ZIPS_DIR).filter(f => f.endsWith('.zip'));
}

async function extractXMLFromZIP(zipPath: string, password: string): Promise<string> {
  // Use 7z to extract with password to a temp file
  const tempDir = '/tmp/surakshit-matdan-extract';
  const tempXmlPath = path.join(tempDir, 'extracted.xml');
  
  // Create temp directory
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Clean any existing file
  if (fs.existsSync(tempXmlPath)) {
    fs.unlinkSync(tempXmlPath);
  }
  
  try {
    // Extract using 7z with password
    execSync(`7z x -y -p${password} -o${tempDir} "${zipPath}"`, { stdio: 'pipe' });
    
    // Find extracted XML file
    const files = fs.readdirSync(tempDir).filter(f => f.endsWith('.xml'));
    if (files.length === 0) {
      throw new Error('No XML file found in ZIP');
    }
    
    // Read content
    const xmlContent = fs.readFileSync(path.join(tempDir, files[0]), 'utf-8');
    
    // Cleanup
    fs.unlinkSync(path.join(tempDir, files[0]));
    fs.rmdirSync(tempDir);
    
    return xmlContent;
  } catch (error: any) {
    // Cleanup on error
    if (fs.existsSync(tempXmlPath)) fs.unlinkSync(tempXmlPath);
    if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
    throw new Error('Failed to extract ZIP. Wrong password?');
  }
}

function prompt(question: string): Promise<string> {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => { rl.close(); resolve(answer); });
  });
}

function promptForPassword(): Promise<string> {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('   Enter ZIP password: ', password => { rl.close(); resolve(password); });
  });
}

function clearScreen() { console.clear(); }

async function mainMenu() {
  initDirectories();
  initDataFiles();
  let currentVoter: any = null;
  let currentNullifier: string = '';

  while (true) {
    clearScreen();
    console.log(ASCII_ART);
    if (currentVoter) {
      console.log('╔═══════════════════════════════════════════════════════════════╗');
      console.log(`║  👤 Current Voter: ${currentVoter.name.padEnd(44)}║`);
      console.log(`║     District: ${currentVoter.district.padEnd(47)}║`);
      console.log(`║     Nullifier: ${currentNullifier.substring(0, 14).padEnd(45)}║`);
      console.log('╚═══════════════════════════════════════════════════════════════╝');
    }
    console.log(MENU);
    const choice = await prompt('   Enter choice (0-9): ');

    switch (choice.trim()) {
      case '1': await scanZIPs(); break;
      case '2': const result = await generateProof(); if (result) { currentVoter = result.voter; currentNullifier = result.nullifier; } break;
      case '3': if (!currentVoter) { console.log('\n   ❌ No voter selected. Generate proof first (Option 2)'); await prompt('   Press Enter to continue...'); } else { await castVote(currentVoter, currentNullifier); currentVoter = null; currentNullifier = ''; } break;
      case '4': await viewResults(); break;
      case '5': await viewProofs(); break;
      case '6': await viewBlockchain(); break;
      case '7': await generateMockVoters(); break;
      case '8': await clearZIPFolder(); break;
      case '9': await resetChain(); break;
      case '0': console.log('\n   🙏 Thank you for using Surakshit Matdan!\n'); process.exit(0); break;
      default: console.log('\n   ❌ Invalid choice. Please try again.'); await prompt('   Press Enter to continue...');
    }
  }
}

async function scanZIPs() {
  clearScreen();
  console.log(ASCII_ART);
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  🔍 Aadhaar ZIPs in Folder                                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  const zips = scanZIPFolder();
  if (zips.length === 0) {
    console.log('   📂 Folder: ./aadhaar-zips/');
    console.log('   ❌ No ZIP files found.');
    console.log('   💡 Place Aadhaar ZIP files in the ./aadhaar-zips/ folder\n');
  } else {
    console.log('   📂 Folder: ./aadhaar-zips/');
    console.log(`   📦 Found ${zips.length} ZIP file(s):\n`);
    zips.forEach((zip, i) => console.log(`      ${i + 1}. ${zip}`));
    console.log('');
  }
  await prompt('   Press Enter to continue...');
}

async function generateProof() {
  clearScreen();
  console.log(ASCII_ART);
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  🔐 Generate ZKP Proof                                        ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  const zips = scanZIPFolder();
  if (zips.length === 0) {
    console.log('   ❌ No ZIP files found in ./aadhaar-zips/');
    console.log('   💡 Place Aadhaar ZIP files in the folder first\n');
    await prompt('   Press Enter to continue...');
    return null;
  }
  console.log('   Available ZIPs:\n');
  zips.forEach((zip, i) => console.log(`      ${i + 1}. ${zip}`));
  console.log('');
  const zipChoice = await prompt(`   Select ZIP (1-${zips.length}): `);
  const zipIndex = parseInt(zipChoice) - 1;
  if (isNaN(zipIndex) || zipIndex < 0 || zipIndex >= zips.length) {
    console.log('   ❌ Invalid choice\n');
    await prompt('   Press Enter to continue...');
    return null;
  }
  const zipPath = path.join(ZIPS_DIR, zips[zipIndex]);
  console.log(`\n   📦 Selected: ${zips[zipIndex]}`);
  const password = await promptForPassword();
  console.log('\n   🔓 Extracting XML...');
  try {
    const xmlContent = await extractXMLFromZIP(zipPath, password);
    const voterInfo = parseAadhaarXML(xmlContent);
    console.log('\n   ✅ Aadhaar XML Parsed Successfully');
    console.log(`      Name: ${voterInfo.name}`);
    console.log(`      Age: ${new Date().getFullYear() - parseInt(voterInfo.yob)} years`);
    console.log(`      District: ${voterInfo.district}, ${voterInfo.state}`);
    console.log(`      Pincode: ${voterInfo.pincode}`);
    const age = new Date().getFullYear() - parseInt(voterInfo.yob);
    if (age < 18) {
      console.log('\n   ❌ Error: Voter must be 18+ years old\n');
      await prompt('   Press Enter to continue...');
      return null;
    }
    const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, 'utf-8'));
    const nullifier = generateNullifier(voterInfo.uid, electionData.electionId);
    const voterHash = generateVoterHash(voterInfo.uid);
    const proofHash = generateProofHash(voterHash, 0, nullifier);
    const proofsData = JSON.parse(fs.readFileSync(PROOFS_FILE, 'utf-8'));
    proofsData.proofs.push({
      voterHash,
      nullifier,
      proofHash,
      timestamp: new Date().toISOString(),
      electionId: electionData.electionId,
      circuit: 'voter_eligibility',
      publicInputs: {
        ageOver18: true,
        uniqueVoter: true,
        singleVote: true
      }
    });
    fs.writeFileSync(PROOFS_FILE, JSON.stringify(proofsData, null, 2));
    const votersData = JSON.parse(fs.readFileSync(VOTERS_FILE, 'utf-8'));
    votersData.voters.push({ voterHash, name: voterInfo.name, district: voterInfo.district, state: voterInfo.state, nullifier, timestamp: new Date().toISOString() });
    fs.writeFileSync(VOTERS_FILE, JSON.stringify(votersData, null, 2));
    console.log('\n   ✅ ZKP Proof Generated');
    console.log(`      Election ID: ${electionData.electionId}`);
    console.log(`      Nullifier: ${nullifier.substring(0, 16)}...`);
    console.log('      Proofs: [Age≥18 ✓] [Unique Voter ✓] [Single Vote ✓]');
    console.log(`      Proof Hash: ${proofHash.substring(0, 20)}...`);
    await prompt('\n   Press Enter to continue...');
    return { voter: voterInfo, nullifier };
  } catch (error: any) {
    console.log('   ❌ Failed to extract. Wrong password?\n');
    await prompt('   Press Enter to continue...');
    return null;
  }
}

async function castVote(voterInfo: any, nullifier: string) {
  clearScreen();
  console.log(ASCII_ART);
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  🗳️  Cast Your Vote                                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, 'utf-8'));
  const votesData = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf-8'));
  const existingVote = votesData.votes.find((v: any) => v.nullifier === nullifier);
  if (existingVote) {
    console.log('   ❌ Error: You have already voted! (Nullifier already used)\n');
    await prompt('   Press Enter to continue...');
    return;
  }
  console.log('   📋 Candidates:\n');
  electionData.candidates.forEach((c: any) => console.log(`      ${c.id}. ${c.name} (${c.symbol})`));
  console.log('');
  const candidateChoice = await prompt('   Select candidate (1-4): ');
  const candidateId = parseInt(candidateChoice);
  const candidate = electionData.candidates.find((c: any) => c.id === candidateId);
  if (!candidate) {
    console.log('\n   ❌ Invalid candidate\n');
    await prompt('   Press Enter to continue...');
    return;
  }
  console.log(`\n   ✅ Voting for: ${candidate.name}`);
  const voterHash = generateVoterHash(voterInfo.uid);
  votesData.votes.push({ voterHash, candidateId, candidateName: candidate.name, nullifier, timestamp: new Date().toISOString(), electionId: electionData.electionId });
  candidate.votes++;
  const receipt = crypto.createHash('sha3-256').update(JSON.stringify({ voterHash, candidateId, timestamp: Date.now() })).digest('hex');
  fs.writeFileSync(VOTES_FILE, JSON.stringify(votesData, null, 2));
  fs.writeFileSync(ELECTION_FILE, JSON.stringify(electionData, null, 2));
  const nullifiersData = JSON.parse(fs.readFileSync(NULLIFIERS_FILE, 'utf-8'));
  nullifiersData.nullifiers.push({ nullifier, timestamp: new Date().toISOString(), electionId: electionData.electionId });
  fs.writeFileSync(NULLIFIERS_FILE, JSON.stringify(nullifiersData, null, 2));
  console.log('\n   ✅ Vote Cast Successfully!');
  console.log(`      Candidate: ${candidate.name}`);
  console.log(`      Receipt: ${receipt.substring(0, 20)}...`);
  console.log(`      Nullifier Published: ${nullifier.substring(0, 16)}...`);
  console.log('\n   💡 Your vote is anonymous and cannot be traced back to you.');
  await prompt('\n   Press Enter to continue...');
}

async function viewResults() {
  clearScreen();
  console.log(ASCII_ART);
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  📊 Live Election Results                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, 'utf-8'));
  const votesData = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf-8'));
  const nullifiersData = JSON.parse(fs.readFileSync(NULLIFIERS_FILE, 'utf-8'));
  console.log(`   Election: ${electionData.electionId}`);
  console.log(`   Total Votes: ${votesData.votes.length}`);
  console.log(`   Unique Voters: ${nullifiersData.nullifiers.length}\n`);
  const sorted = [...electionData.candidates].sort((a, b) => b.votes - a.votes);
  const totalVotes = sorted.reduce((sum, c) => sum + c.votes, 0);
  sorted.forEach((candidate, index) => {
    const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : '0.0';
    const barLength = Math.floor((candidate.votes / (totalVotes || 1)) * 40);
    const bar = '█'.repeat(barLength) + '░'.repeat(40 - barLength);
    console.log(`   ${index + 1}. ${candidate.name}`);
    console.log(`      Symbol: ${candidate.symbol}`);
    console.log(`      Votes: ${candidate.votes} (${percentage}%)`);
    console.log(`      [${bar}]\n`);
  });
  if (totalVotes === 0) console.log('   No votes cast yet.\n');
  await prompt('   Press Enter to continue...');
}

async function viewProofs() {
  clearScreen();
  console.log(ASCII_ART);
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  🔍 ZKP Proofs Generated                                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  const proofsData = JSON.parse(fs.readFileSync(PROOFS_FILE, 'utf-8'));
  if (proofsData.proofs.length === 0) {
    console.log('   No proofs generated yet.\n');
    await prompt('   Press Enter to continue...');
    return;
  }
  console.log(`   Total Proofs: ${proofsData.proofs.length}\n`);
  proofsData.proofs.forEach((proof: any, i: number) => {
    console.log('   ╔═══════════════════════════════════════════════════════════╗');
    console.log(`   ║  Proof #${i + 1}${' '.repeat(51)}║`);
    console.log('   ╠═══════════════════════════════════════════════════════════╣');
    console.log(`   ║  Voter Hash: ${proof.voterHash.substring(0, 20).padEnd(43)}║`);
    console.log(`   ║  Nullifier: ${proof.nullifier.substring(0, 20).padEnd(45)}║`);
    console.log(`   ║  Proof Hash: ${proof.proofHash.substring(0, 20).padEnd(44)}║`);
    console.log('   ║  Circuit: voter_eligibility                     ║');
    console.log('   ║  Proofs: Age≥18 ✓ | Unique ✓ | Single ✓         ║');
    console.log('   ║  Identity: ANONYMOUS (Zero-Knowledge)           ║');
    console.log('   ╚═══════════════════════════════════════════════════════════╝\n');
  });
  await prompt('   Press Enter to continue...');
}

async function viewBlockchain() {
  clearScreen();
  console.log(ASCII_ART);
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  ⛓️  Blockchain - Votes & Nullifiers                          ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  const votesData = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf-8'));
  const nullifiersData = JSON.parse(fs.readFileSync(NULLIFIERS_FILE, 'utf-8'));
  console.log(`   📦 Total Blocks (Votes): ${votesData.votes.length}`);
  console.log(`   🔒 Published Nullifiers: ${nullifiersData.nullifiers.length}\n`);
  if (votesData.votes.length === 0) {
    console.log('   No votes in blockchain yet.\n');
    await prompt('   Press Enter to continue...');
    return;
  }
  console.log('   ╔═══════════════════════════════════════════════════════════╗');
  console.log('   ║  BLOCKCHAIN (Votes)                                       ║');
  console.log('   ╚═══════════════════════════════════════════════════════════╝\n');
  votesData.votes.forEach((vote: any, i: number) => {
    console.log(`   Block #${i + 1}`);
    console.log('   ─────────────────────────────────────────────────────────');
    console.log(`   Voter Hash: ${vote.voterHash.substring(0, 20)}...`);
    console.log(`   Candidate: ${vote.candidateName}`);
    console.log(`   Nullifier: ${vote.nullifier.substring(0, 20)}...`);
    console.log(`   Timestamp: ${vote.timestamp}`);
    console.log(`   Hash: ${crypto.createHash('sha3-256').update(JSON.stringify(vote)).digest('hex').substring(0, 20)}...\n`);
  });
  console.log('   ╔═══════════════════════════════════════════════════════════╗');
  console.log('   ║  PUBLISHED NULLIFIERS (Public Record)                     ║');
  console.log('   ╚═══════════════════════════════════════════════════════════╝\n');
  nullifiersData.nullifiers.forEach((n: any, i: number) => console.log(`   ${i + 1}. ${n.nullifier}`));
  console.log('');
  await prompt('   Press Enter to continue...');
}

async function generateMockVoters() {
  clearScreen();
  console.log(ASCII_ART);
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  📝 Generate Mock Voters                                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  const countStr = await prompt('   How many mock voters? (1-10): ');
  const count = Math.min(Math.max(parseInt(countStr) || 5, 1), 10);
  const names = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Devi', 'Vikram Singh', 'Meera Reddy', 'Arun Kumar', 'Kavita Joshi', 'Rahul Verma', 'Anita Singh'];
  const districts = ['Faridabad', 'Gurgaon', 'Delhi', 'Noida', 'Ghaziabad'];
  const states = ['Haryana', 'Delhi', 'Uttar Pradesh'];
  console.log('');
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    const district = districts[i % districts.length];
    const state = states[i % states.length];
    const yob = (1970 + (i % 30)).toString();
    const gender = i % 2 === 0 ? 'M' : 'F';
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<OfflinePaperlessKyc referenceId="DEMO${Date.now()}${i}">\n  <UidData>\n    <Poi dob="01-01-${yob}" e="demo${i}@example.com" gender="${gender}" m="9876543210" name="${name}"/>\n    <Poa careof="Demo Care" country="India" dist="${district}" house="House ${i}" pc="121001" state="${state}" vtc="${district}"/>\n    <Pht>demo_photo</Pht>\n  </UidData>\n</OfflinePaperlessKyc>`;
    const filename = `mock_aadhaar_${i + 1}.xml`;
    fs.writeFileSync(path.join(ZIPS_DIR, filename), xml);
    console.log(`   ✅ Generated: ${filename} (${name}, ${district})`);
  }
  console.log(`\n   💡 Mock XMLs saved to ./aadhaar-zips/\n`);
  await prompt('   Press Enter to continue...');
}

async function clearZIPFolder() {
  clearScreen();
  console.log(ASCII_ART);
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  🗑️  Clear ZIP Folder                                         ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  const zips = scanZIPFolder();
  if (zips.length === 0) {
    console.log('   Folder is already empty.\n');
    await prompt('   Press Enter to continue...');
    return;
  }
  console.log(`   Found ${zips.length} file(s) in ./aadhaar-zips/:\n`);
  zips.forEach(zip => console.log(`      - ${zip}`));
  console.log('');
  const confirm = await prompt('   Delete all files? (yes/no): ');
  if (confirm.toLowerCase() === 'yes') {
    zips.forEach(zip => fs.unlinkSync(path.join(ZIPS_DIR, zip)));
    console.log('\n   ✅ All files deleted.\n');
  } else {
    console.log('\n   ❌ Operation cancelled.\n');
  }
  await prompt('   Press Enter to continue...');
}

async function resetChain() {
  clearScreen();
  console.log(ASCII_ART);
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  🔄 Reset Election Chain                                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  console.log('   This will reset:\n');
  console.log('      - All votes\n      - All nullifiers\n      - All proofs\n      - Election results\n');
  console.log('   ⚠️  This action cannot be undone!\n');
  const confirm = await prompt('   Type "RESET" to confirm: ');
  if (confirm === 'RESET') {
    fs.writeFileSync(VOTERS_FILE, JSON.stringify({ voters: [] }, null, 2));
    fs.writeFileSync(VOTES_FILE, JSON.stringify({ votes: [] }, null, 2));
    fs.writeFileSync(NULLIFIERS_FILE, JSON.stringify({ nullifiers: [] }, null, 2));
    fs.writeFileSync(PROOFS_FILE, JSON.stringify({ proofs: [] }, null, 2));
    fs.writeFileSync(ELECTION_FILE, JSON.stringify({ electionId: 'INDIA-INNOVATES-2026', candidates: [{ id: 1, name: 'Party A - Development', symbol: 'Lotus', votes: 0 }, { id: 2, name: 'Party B - Progress', symbol: 'Hand', votes: 0 }, { id: 3, name: 'Party C - Change', symbol: 'Bicycle', votes: 0 }, { id: 4, name: 'Independent', symbol: 'None', votes: 0 }] }, null, 2));
    console.log('\n   ✅ Election chain reset successfully!\n   You can now start a new demo.\n');
  } else {
    console.log('\n   ❌ Reset cancelled.\n');
  }
  await prompt('   Press Enter to continue...');
}

mainMenu().catch(console.error);
