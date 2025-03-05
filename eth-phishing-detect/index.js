const fs = require('fs-extra');
const path = require('path');

// Path to the eth-phishing-detect directory
const ethPhishingDetectPath = path.resolve(__dirname, '../eth-phishing-detect');
const configJsonPath = path.join(ethPhishingDetectPath, 'src', 'config.json');
const littleSnitchBlocklistPath = path.join(__dirname, 'little-snitch-blocklist.json');

async function extractData() {
  try {
    // Check if eth-phishing-detect exists
    if (!fs.existsSync(ethPhishingDetectPath)) {
      console.error('Error: eth-phishing-detect directory not found');
      return;
    }

    // Extract domains and create blocklist
    await extractDomains();
    
    console.log('Data extraction completed successfully');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function extractDomains() {
  try {
    // Read config.json file
    const configData = await fs.readJson(configJsonPath);
    
    // Check if blacklist exists
    if (!configData || !configData.blacklist) {
      throw new Error('Invalid config data or missing blacklist');
    }
    
    const blacklist = configData.blacklist;
    
    // Create Little Snitch blocklist
    await createLittleSnitchBlocklist(blacklist);
    
    console.log('Domains extraction and blocklist creation completed successfully');
  } catch (error) {
    console.error('Error extracting domains:', error.message);
  }
}

async function createLittleSnitchBlocklist(domains) {
  try {
    // Create Little Snitch blocklist in JSON format
    const littleSnitchData = {
      "description": "Blocklist of phishing domains from MetaMask eth-phishing-detect",
      "name": "MetaMask Phishing Domains Blocklist",
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