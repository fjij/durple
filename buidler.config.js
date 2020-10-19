usePlugin("@nomiclabs/buidler-waffle");
require('dotenv').config();

// The next line is part of the sample project, you don't need it in your
// project. It imports a Buidler task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

let networks = {};
if (process.env.NETWORK_NAME) {
  networks[process.env.NETWORK_NAME] = {
    url: process.env.NETWORK_ENDPOINT,
    accounts: [ `0x${process.env.NETWORK_PRIVATE_KEY}` ],
    prettyName: process.env.NETWORK_NAME_PRETTY,
    networkId: process.env.NETWORK_ID
  };
}

module.exports = {
  networks
};
