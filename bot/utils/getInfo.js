const Rest = require("./rest");
const fs = require(`fs`)
const prisAuth = require('prismarine-auth')
const auth = new prisAuth.Authflow('', `./msal/auth`);

const rest = new Rest(auth);

async function getInfo(user) {
    try {
        const playerData = JSON.parse(fs.readFileSync(`./playerData.json`));
        if (!playerData.map((p) => p.gamertag.toLowerCase()).includes(user.toLowerCase())) {
            const profile = await rest.getXboxProfile(user);
            playerData.push({
                xuid: profile.xuid,
                avatar: profile.avatar,
                gamerscore: profile.gamerscore,
                gamertag: profile.gamertag,
                lastUpdated: Date.now()
            });
            fs.writeFileSync(`./playerData.json`, JSON.stringify(playerData, '', 4));
            return {
                xuid: profile.xuid,
                avatar: profile.avatar,
                gamerscore: profile.gamerscore,
                gamertag: profile.gamertag
            };
        } else {
            const playersDataIndex = playerData.findIndex((p) => p.gamertag.toLowerCase() === user.toLowerCase());
            const playersData = playerData[playersDataIndex];
            if ((Date.now() - playersData.lastUpdated) > 86400000) {
                const profile = await rest.getXboxProfile(user);
                playersData.gamerscore = profile.gamerscore;
                playersData.avatar = profile.avatar;
                playersData.xuid = profile.xuid;
                playersData.lastUpdated = Date.now();
                // Move the updated player data to the end of the array
                playerData.splice(playersDataIndex, 1)
                playerData.push(playerData.splice(playersDataIndex, 1)[0]);
                fs.writeFileSync(`./playerData.json`, JSON.stringify(playerData, '', 4));
            }
            return {
                xuid: playersData.xuid,
                avatar: playersData.avatar,
                gamerscore: playersData.gamerscore,
                gamertag: playersData.gamertag
            };
        }
    } catch {
        console.error(`Error fetching data`);
    }
}

/**getInfo("NotTMGrant").then(async (i) => {
    //console.log(info)
    console.log(i)
})*/

module.exports = { getInfo }