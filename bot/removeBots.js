const bedrock = require(`bedrock-protocol`);

let bedrockClient = bedrock.createClient({
    realms: {
        realmInvite: `https://realms.gg/${JSON.parse(fs.readFileSync(`realmCode.json`)).code}`,
    },
    profilesFolder: './msal/auth',
});

bedrockClient.on(`connect`, ((p) => {
    console.log(p);
}))