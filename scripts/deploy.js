require('dotenv').config();

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "buidlerevm") {
    console.warn(
      "You are trying to deploy a contract to the Buidler EVM network, which" +
        "gets automatically created and destroyed every time. Use the Buidler" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const subNames = ["funny", "gaming", "AskDurple", "TIDU"];

  const SubFactory = await ethers.getContractFactory("Sub");
  const SubAddresses = []

  for (let i = 0; i < subNames.length; i ++) {
    const contract = await SubFactory.deploy(subNames[i]);
    await contract.deployed();
    console.log("Address for d/"+subNames[i]+":", contract.address);
    SubAddresses.push(contract.address);
  }

  const OfficialDurpleSubFactory = await ethers.getContractFactory("OfficialDurpleSub");
  const officialDurpleSubContract = await OfficialDurpleSubFactory.deploy("durple");
  await officialDurpleSubContract.deployed();
  console.log("Address for d/durple:", officialDurpleSubContract.address);

  // Deploy Profile Contract
  const ProfileFactory = await ethers.getContractFactory("Profile");
  const profileContract = await ProfileFactory.deploy();
  await profileContract.deployed();
  for (let i = 0; i < SubAddresses.length; i ++) {
    await profileContract.addFeaturedSub(SubAddresses[i], subNames[i]);
  }
  await profileContract.addFeaturedSub(officialDurpleSubContract.address, "durple");
  console.log("Address for Profile:", profileContract.address);

  saveFrontendFiles(profileContract);
}

const fs = require("fs");
const contractsDir = __dirname + "/../frontend/src/contracts";

const ipfs = {
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
}

function saveFrontendFiles(profileContract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  if (network.name === "localhost") {
    writeConfig({
      name: network.config.url,
      ipfs,
      rpc: {
        url: network.config.url,
        allowInsecure: true
      },
      networkId: "31337",
      profileAddress: profileContract.address
    });

  } else {
    writeConfig({
      name: network.config.prettyName,
      ipfs,
      rpc: {
        url: network.config.url,
        allowInsecure: false
      },
      networkId: network.config.networkId,
      profileAddress: profileContract.address
    });
  }



  copyArtifact("Sub");
  copyArtifact("Profile");
}

function writeConfig(config) {
  fs.writeFileSync(
    contractsDir + "/config.json",
    JSON.stringify(config, undefined, 2)
  );
}

function copyArtifact(name) {
  fs.copyFileSync(
    __dirname + `/../artifacts/${name}.json`,
    contractsDir + `/${name}.json`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
