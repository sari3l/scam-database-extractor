const fs = require('fs-extra');
const path = require('path');
const https = require('https');

// Path to the scam-database directory
const scamDatabasePath = path.resolve(__dirname, '../scam-database');
const addressJsonPath = path.join(scamDatabasePath, 'blacklist', 'address.json');
const domainsJsonPath = path.join(scamDatabasePath, 'blacklist', 'domains.json');
const blackAddressPath = path.join(__dirname, 'black-address.json');
const littleSnitchBlocklistPath = path.join(__dirname, 'little-snitch-blocklist.json');

async function extractData() {
  try {
    // Check if scam-database exists
    if (!fs.existsSync(scamDatabasePath)) {
      console.error('Error: scam-database directory not found');
      return;
    }

    // Extract addresses
    await extractAddresses();
    
    // Extract domains and create blocklist
    await extractDomains();
    
    console.log('All data extraction completed successfully');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function extractAddresses() {
  try {
    // Read address.json file
    const addressesData = await fs.readJson(addressJsonPath);
    
    // Create output structure
    const blackAddressData = {
      description: "Scam addresses extracted from scam-database",
      blackAddress: addressesData
    };
    
    // Write output to file
    await fs.writeJson(blackAddressPath, blackAddressData, { spaces: 2 });
    
    console.log(`Successfully extracted ${addressesData.length} addresses to ${blackAddressPath}`);
  } catch (error) {
    console.error('Error extracting addresses:', error.message);
  }
}

async function extractDomains() {
  try {
    // Read domains.json file
    const domainsData = await fs.readJson(domainsJsonPath);
    
    // Create Little Snitch blocklist
    await createLittleSnitchBlocklist(domainsData);
    
    console.log('Domains extraction and blocklist creation completed successfully');
  } catch (error) {
    console.error('Error extracting domains:', error.message);
  }
}

async function createLittleSnitchBlocklist(domains) {
  try {
    // Create Little Snitch blocklist in JSON format
    const littleSnitchData = {
      "description": "Blocklist of scam and phishing domains from the Scam Sniffer database",
      "name": "Scam Database Block Domains",
      "rules": [
        {
          "action": "deny",
          "remote": "list",
          "remote-list": {
            "domainNames": domains,
            "hostNames": [],
            "ipAddressRanges": [],
            "unapprovedDomainNames": [],
            "unapprovedHostNames": [],
            "unapprovedIPAddressRanges": []
          }
        }
      ]
    };
    
    // Write to file
    await fs.writeJson(littleSnitchBlocklistPath, littleSnitchData, { spaces: 2 });
    
    console.log(`Successfully created Little Snitch blocklist with ${domains.length} domains at ${littleSnitchBlocklistPath}`);
  } catch (error) {
    console.error('Error creating Little Snitch blocklist:', error.message);
  }
}

// Run the extraction
extractData();