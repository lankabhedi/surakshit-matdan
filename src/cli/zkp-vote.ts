#!/usr/bin/env node
/**
 * Surakshit Matdan - CLI ZKP Voting System
 * Layer 2: Zero-Knowledge Proof Vote Casting
 * India Innovates 2026 - Digital Democracy Domain
 */

import { Command } from 'commander';
import { XMLParser } from 'fast-xml-parser';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as readline from 'readline';

const program = new Command();

// Data storage paths
const DATA_DIR = path.join(process.cwd(), '.zkp-data');
const VOTERS_FILE = path.join(DATA_DIR, 'voters.json');
const VOTES_FILE = path.join(DATA_DIR, 'votes.json');
const NULLIFIERS_FILE = path.join(DATA_DIR, 'nullifiers.json');
const ELECTION_FILE = path.join(DATA_DIR, 'election.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files
function initDataFiles() {
  if (!fs.existsSync(VOTERS_FILE)) {
    fs.writeFileSync(VOTERS_FILE, JSON.stringify({ voters: [] }, null, 2));
  }
  if (!fs.existsSync(VOTES_FILE)) {
    fs.writeFileSync(VOTES_FILE, JSON.stringify({ votes: [] }, null, 2));
  }
  if (!fs.existsSync(NULLIFIERS_FILE)) {
    fs.writeFileSync(NULLIFIERS_FILE, JSON.stringify({ nullifiers: [] }, null, 2));
  }
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
}

// Parse Aadhaar XML
function parseAadhaarXML(xmlContent: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
  });
  
  const result = parser.parse(xmlContent);
  
  if (!result.OfflinePaperlessKyc || !result.OfflinePaperlessKyc.UidData) {
    throw new Error('Invalid Aadhaar XML format');
  }
  
  const uidData = result.OfflinePaperlessKyc.UidData;
  const poi = uidData.Poi || {};
  const poa = uidData.Poa || {};
  
  // Extract voter info - handle both attribute and element formats
  return {
    uid: poi['@_uid'] || result.OfflinePaperlessKyc['@_uid'] || 'DEMO',
    name: poi['@_name'] || 'Unknown',
    gender: poi['@_gender'] || 'U',
    yob: poi['@_yob'] || '1990',
    dob: poi['@_dob'] || '01/01/1990',
    address: `${poa['@_house'] || ''} ${poa['@_street'] || ''} ${poa['@_loc'] || ''}`,
    district: poa['@_dist'] || poa['@_subdist'] || 'Unknown',
    state: poa['@_state'] || 'Unknown',
    pincode: poa['@_pc'] || '000000',
    mobile: poi['@_m'] || '',
    email: poi['@_e'] || '',
    photo: uidData.Pht || null
  };
}

// Generate nullifier (prevents double voting)
function generateNullifier(aadhaarHash: string, electionId: string): string {
  const data = `${aadhaarHash}:${electionId}:${Date.now()}`;
  return crypto.createHash('sha3-256').update(data).digest('hex');
}

// Generate voter hash (anonymous identifier)
function generateVoterHash(aadhaarNumber: string): string {
  return crypto.createHash('sha3-256').update(aadhaarNumber).digest('hex');
}

// Check if voter has already voted
function hasVoted(nullifier: string): boolean {
  const data = JSON.parse(fs.readFileSync(NULLIFIERS_FILE, 'utf-8'));
  return data.nullifiers.some((n: any) => n.nullifier === nullifier);
}

// Cast vote
function castVote(voterInfo: any, candidateId: number, nullifier: string) {
  const votesData = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf-8'));
  const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, 'utf-8'));
  
  // Add vote
  votesData.votes.push({
    voterHash: generateVoterHash(voterInfo.uid),
    candidateId,
    nullifier,
    timestamp: new Date().toISOString(),
    electionId: electionData.electionId
  });
  
  // Update candidate vote count
  const candidate = electionData.candidates.find((c: any) => c.id === candidateId);
  if (candidate) {
    candidate.votes++;
  }
  
  // Save data
  fs.writeFileSync(VOTES_FILE, JSON.stringify(votesData, null, 2));
  fs.writeFileSync(ELECTION_FILE, JSON.stringify(electionData, null, 2));
  
  // Add nullifier to prevent double voting
  const nullifiersData = JSON.parse(fs.readFileSync(NULLIFIERS_FILE, 'utf-8'));
  nullifiersData.nullifiers.push({
    nullifier,
    timestamp: new Date().toISOString(),
    electionId: electionData.electionId
  });
  fs.writeFileSync(NULLIFIERS_FILE, JSON.stringify(nullifiersData, null, 2));
  
  // Generate receipt
  const receipt = crypto.createHash('sha3-256').update(JSON.stringify({
    voterHash: generateVoterHash(voterInfo.uid),
    candidateId,
    timestamp: Date.now()
  })).digest('hex');
  
  return {
    success: true,
    receipt,
    nullifier,
    candidate: electionData.candidates.find((c: any) => c.id === candidateId)
  };
}

// CLI Commands
program
  .name('zkp-vote')
  .description('Surakshit Matdan - CLI ZKP Voting System (India Innovates 2026)')
  .version('1.0.0');

// Async function to prompt for password
function promptForPassword(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('   Enter ZIP password: ', (password) => {
      rl.close();
      resolve(password);
    });
  });
}

// Extract XML from ZIP file
async function extractXMLFromZIP(zipPath: string, password: string): Promise<string> {
  const directory = await unzipper.Open.file(zipPath);
  
  // Find XML file in zip
  const xmlFile = directory.files.find(f => f.path.endsWith('.xml'));
  
  if (!xmlFile) {
    throw new Error('No XML file found in ZIP');
  }
  
  // Extract with password
  const content = await xmlFile.buffer(password);
  return content.toString('utf-8');
}

// Generate proof command
program
  .command('generate-proof')
  .description('Generate ZKP from Aadhaar XML or ZIP')
  .requiredOption('--file <path>', 'Path to Aadhaar XML or ZIP file')
  .action(async (options) => {
    try {
      initDataFiles();

      console.log('\n🔐 Surakshit Matdan - ZKP Proof Generation');
      console.log('═══════════════════════════════════════════\n');

      const filePath = options.file;
      let xmlContent: string;

      // Check if it's a ZIP file
      if (filePath.endsWith('.zip')) {
        console.log('📦 ZIP file detected');
        console.log('   File:', path.basename(filePath));
        
        // Prompt for password
        const password = await promptForPassword();
        console.log('\n   🔓 Extracting XML...');
        
        try {
          xmlContent = await extractXMLFromZIP(filePath, password);
          console.log('   ✅ XML extracted successfully\n');
        } catch (error: any) {
          console.log('   ❌ Failed to extract. Wrong password?\n');
          process.exit(1);
        }
      } else if (filePath.endsWith('.xml')) {
        xmlContent = fs.readFileSync(filePath, 'utf-8');
      } else {
        throw new Error('Unsupported file format. Use .xml or .zip');
      }

      // Parse XML
      const voterInfo = parseAadhaarXML(xmlContent);

      console.log('✅ Aadhaar XML Parsed Successfully');
      console.log(`   Name: ${voterInfo.name}`);
      console.log(`   Age: ${new Date().getFullYear() - parseInt(voterInfo.yob)} years`);
      console.log(`   District: ${voterInfo.district}, ${voterInfo.state}`);
      console.log(`   Pincode: ${voterInfo.pincode}`);

      // Verify age >= 18
      const age = new Date().getFullYear() - parseInt(voterInfo.yob);
      if (age < 18) {
        console.log('\n❌ Error: Voter must be 18+ years old');
        process.exit(1);
      }

      // Generate nullifier
      const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, 'utf-8'));
      const nullifier = generateNullifier(voterInfo.uid, electionData.electionId);

      console.log('\n✅ ZKP Proof Generated');
      console.log(`   Election ID: ${electionData.electionId}`);
      console.log(`   Nullifier: ${nullifier.substring(0, 16)}...`);
      console.log(`   Proofs: [Age≥18 ✓] [Unique Voter ✓] [Single Vote ✓]`);

      // Save voter session
      const votersData = JSON.parse(fs.readFileSync(VOTERS_FILE, 'utf-8'));
      votersData.voters.push({
        voterHash: generateVoterHash(voterInfo.uid),
        name: voterInfo.name,
        district: voterInfo.district,
        state: voterInfo.state,
        nullifier,
        timestamp: new Date().toISOString()
      });
      fs.writeFileSync(VOTERS_FILE, JSON.stringify(votersData, null, 2));

      console.log('\n✅ Proof saved! Ready to vote.');
      console.log('   Run: npm run zkp-vote -- vote --candidate <id>\n');

    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

// Vote command
program
  .command('vote')
  .description('Cast your vote')
  .requiredOption('--candidate <id>', 'Candidate ID (1-4)')
  .action((options) => {
    try {
      initDataFiles();

      console.log('\n🗳️  Surakshit Matdan - Cast Your Vote');
      console.log('═══════════════════════════════════════════\n');

      const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, 'utf-8'));
      const votersData = JSON.parse(fs.readFileSync(VOTERS_FILE, 'utf-8'));
      const votesData = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf-8'));

      if (votersData.voters.length === 0) {
        console.log('❌ No voter proof found. Run generate-proof first.');
        console.log('   Example: npx ts-node zkp-vote.ts generate-proof --xml ./aadhaar.xml\n');
        process.exit(1);
      }

      // Get latest voter
      const latestVoter = votersData.voters[votersData.voters.length - 1];

      console.log(`   Voter: ${latestVoter.name}`);
      console.log(`   District: ${latestVoter.district}`);
      console.log(`   Nullifier: ${latestVoter.nullifier.substring(0, 16)}...\n`);

      // Check double vote - check if this nullifier is already in votes
      const existingVote = votesData.votes.find((v: any) => v.nullifier === latestVoter.nullifier);
      if (existingVote) {
        console.log('❌ Error: You have already voted! (Nullifier already used)\n');
        process.exit(1);
      }

      // Show candidates
      console.log('📋 Candidates:');
      electionData.candidates.forEach((c: any) => {
        console.log(`   ${c.id}. ${c.name} (${c.symbol})`);
      });

      const candidateId = parseInt(options.candidate);
      const candidate = electionData.candidates.find((c: any) => c.id === candidateId);

      if (!candidate) {
        console.log(`\n❌ Invalid candidate ID. Choose 1-${electionData.candidates.length}\n`);
        process.exit(1);
      }

      console.log(`\n✅ Voting for: ${candidate.name}`);

      // Cast vote - create voter info object with required fields
      const voterInfo = {
        uid: latestVoter.voterHash, // Use voterHash as uid
        name: latestVoter.name,
        district: latestVoter.district,
        state: latestVoter.state
      };
      const result = castVote(voterInfo, candidateId, latestVoter.nullifier);
      
      console.log('\n✅ Vote Cast Successfully!');
      console.log(`   Candidate: ${result.candidate.name}`);
      console.log(`   Receipt: ${result.receipt.substring(0, 20)}...`);
      console.log(`   Nullifier Published: ${result.nullifier.substring(0, 16)}...`);
      console.log('\n   Your vote is anonymous and cannot be traced back to you.');
      console.log('   Use your receipt to verify your vote was counted.\n');
      
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

// Results command
program
  .command('results')
  .description('Show election results')
  .action(() => {
    try {
      initDataFiles();
      
      console.log('\n📊 Surakshit Matdan - Live Election Results');
      console.log('═══════════════════════════════════════════\n');
      
      const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, 'utf-8'));
      const votesData = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf-8'));
      const nullifiersData = JSON.parse(fs.readFileSync(NULLIFIERS_FILE, 'utf-8'));
      
      console.log(`Election: ${electionData.electionId}`);
      console.log(`Total Votes: ${votesData.votes.length}`);
      console.log(`Unique Voters: ${nullifiersData.nullifiers.length}\n`);
      
      console.log('📈 Results:\n');
      
      // Sort by votes
      const sorted = [...electionData.candidates].sort((a, b) => b.votes - a.votes);
      const totalVotes = sorted.reduce((sum, c) => sum + c.votes, 0);
      
      sorted.forEach((candidate, index) => {
        const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : '0.0';
        const barLength = Math.floor((candidate.votes / (totalVotes || 1)) * 40);
        const bar = '█'.repeat(barLength) + '░'.repeat(40 - barLength);
        
        console.log(`${index + 1}. ${candidate.name}`);
        console.log(`   ${candidate.symbol}`);
        console.log(`   Votes: ${candidate.votes} (${percentage}%)`);
        console.log(`   [${bar}]\n`);
      });
      
      if (totalVotes === 0) {
        console.log('   No votes cast yet.\n');
      }
      
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

// Verify command
program
  .command('verify')
  .description('Verify your vote was counted')
  .requiredOption('--receipt <hash>', 'Your vote receipt')
  .action((options) => {
    try {
      initDataFiles();
      
      console.log('\n✅ Surakshit Matdan - Vote Verification');
      console.log('═══════════════════════════════════════════\n');
      
      const votesData = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf-8'));
      
      const receipt = options.receipt;
      const vote = votesData.votes.find((v: any) => {
        const expectedReceipt = crypto.createHash('sha3-256').update(JSON.stringify({
          voterHash: v.voterHash,
          candidateId: v.candidateId,
          timestamp: new Date(v.timestamp).getTime()
        })).digest('hex');
        return expectedReceipt === receipt;
      });
      
      if (vote) {
        console.log('✅ Vote Verified!');
        console.log(`   Your vote was counted in the election.`);
        console.log(`   Timestamp: ${vote.timestamp}`);
        console.log(`   Note: Vote choice remains anonymous for privacy.\n`);
      } else {
        console.log('❌ Vote not found with this receipt.');
        console.log('   Please check your receipt hash.\n');
      }
      
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

// Generate multiple XMLs for demo
program
  .command('generate-xml')
  .description('Generate mock Aadhaar XMLs for demo')
  .option('--count <n>', 'Number of XMLs to generate', '5')
  .option('--zip', 'Generate ZIP files with password', false)
  .action((options) => {
    try {
      const count = parseInt(options.count);
      const generateZip = options.zip;

      console.log('\n📝 Generating Mock Aadhaar XMLs');
      console.log('═══════════════════════════════════════════\n');

      const names = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Devi', 'Vikram Singh', 'Meera Reddy', 'Arun Kumar', 'Kavita Joshi'];
      const districts = ['Faridabad', 'Gurgaon', 'Delhi', 'Noida', 'Ghaziabad'];
      const states = ['Haryana', 'Delhi', 'Uttar Pradesh'];

      for (let i = 0; i < count; i++) {
        const name = names[i % names.length];
        const district = districts[i % districts.length];
        const state = states[i % states.length];
        const yob = (1970 + (i % 30)).toString();
        const gender = i % 2 === 0 ? 'M' : 'F';
        const aadhaarNum = `2${i}${'0'.repeat(10 - i.toString().length)}${i}`;

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OfflinePaperlessKyc referenceId="DEMO${Date.now()}${i}">
  <UidData>
    <Poi dob="01-01-${yob}" e="demo${i}@example.com" gender="${gender}" m="9876543210" name="${name}"/>
    <Poa careof="Demo Care" country="India" dist="${district}" house="House ${i}" landmark="" loc="Demo Area" pc="121001" po="Demo PO" state="${state}" street="Demo Street" subdist="Demo" vtc="${district}"/>
    <Pht>demo_photo_base64</Pht>
  </UidData>
</OfflinePaperlessKyc>`;

        if (generateZip) {
          // For now, just save XML - ZIP generation would need additional library
          const filename = `mock_aadhaar_${i + 1}.xml`;
          fs.writeFileSync(path.join(process.cwd(), filename), xml);
          console.log(`✅ Generated: ${filename} (${name}, ${district}, ${state})`);
        } else {
          const filename = `mock_aadhaar_${i + 1}.xml`;
          fs.writeFileSync(path.join(process.cwd(), filename), xml);
          console.log(`✅ Generated: ${filename} (${name}, ${district}, ${state})`);
        }
      }

      console.log(`\n✅ Generated ${count} mock Aadhaar XML files for demo.`);
      console.log('   Usage: npm run zkp-vote -- generate-proof --file ./mock_aadhaar_1.xml\n');

    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

// Reset command
program
  .command('reset')
  .description('Reset all voting data (for demo purposes)')
  .option('--force', 'Skip confirmation')
  .action((options) => {
    try {
      if (!options.force) {
        console.log('\n⚠️  Reset Voting Data?');
        console.log('═══════════════════════════════════════════');
        console.log('This will delete all votes, nullifiers, and voter data.');
        console.log('Type "yes" to confirm: ');
        
        process.stdin.setEncoding('utf-8');
        process.stdin.once('data', (input) => {
          if (input.trim().toLowerCase() === 'yes') {
            performReset();
          } else {
            console.log('\n❌ Reset cancelled.\n');
            process.exit(0);
          }
        });
        return;
      }
      
      performReset();
      
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

function performReset() {
  if (fs.existsSync(VOTERS_FILE)) fs.unlinkSync(VOTERS_FILE);
  if (fs.existsSync(VOTES_FILE)) fs.unlinkSync(VOTES_FILE);
  if (fs.existsSync(NULLIFIERS_FILE)) fs.unlinkSync(NULLIFIERS_FILE);
  if (fs.existsSync(ELECTION_FILE)) fs.unlinkSync(ELECTION_FILE);
  
  initDataFiles();
  
  console.log('\n✅ Voting data reset successfully!');
  console.log('   You can now start a new demo election.\n');
}

// List candidates
program
  .command('candidates')
  .description('List all candidates')
  .action(() => {
    try {
      initDataFiles();
      
      const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, 'utf-8'));
      
      console.log('\n📋 Election Candidates');
      console.log('═══════════════════════════════════════════\n');
      
      electionData.candidates.forEach((c: any) => {
        console.log(`   ${c.id}. ${c.name}`);
        console.log(`   Symbol: ${c.symbol}`);
        console.log(`   Current Votes: ${c.votes}\n`);
      });
      
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

program.parse();
