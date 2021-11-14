require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

console.log(process.env);

module.exports = {
    solidity: "0.8.0",
    networks: {
        rinkeby: {
            url: process.env.STAGING_ALCHEMY_KEY,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
};