usePlugin("@nomiclabs/buidler-waffle");
require('dotenv').config();

// The next line is part of the sample project, you don't need it in your
// project. It imports a Buidler task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

module.exports = {
    networks: {
        goerli: {
            url: process.env.NETWORK_ENDPOINT,
            accounts: [ `0x${process.env.NETWORK_PRIVATE_KEY}` ]
        }
    }
};
