const Rest = require("./rest");
const fs = require(`fs`)
const prisAuth = require('prismarine-auth');
const { getInfo } = require("./getInfo");
const auth = new prisAuth.Authflow('', `./msal/auth`);

const rest = new Rest(auth);

async function getFriends(user) {
    try {
        return (await rest.getXboxFriends((await getInfo(user)).xuid));
    } catch (error) {
        console.error(`Error fetching data`, error);
    }
}

module.exports = { getFriends }