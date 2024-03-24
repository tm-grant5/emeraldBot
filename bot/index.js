const bedrock = require('bedrock-protocol');
const uuid = require('uuid')
const requestId = uuid.v4()
const colors = require(`colors`)
const fs = require(`fs`);
const { Client, IntentsBitField, EmbedBuilder, Colors, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandStringOption, AttachmentBuilder, Embed, StringSelectMenuOptionBuilder, Guild, GuildChannel, TextChannel } = require('discord.js');
const { getInfo } = require(`./utils/getInfo`);
const { getFriends } = require(`./utils/getFriends`);
const os = require('os-utils');
const types = require(`./types`);

const discordClient = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildIntegrations,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages
  ]
});

discordClient.on(`ready`, (async () => {
  function getSystemUsage() {
    return new Promise((resolve, reject) => {
      let systemUsage = {
        cpu: 0,
        mem: `${os.freemem().toFixed(0)}/${os.totalmem().toFixed(0)}`,
        memPercentage: os.freememPercentage().toFixed(2) + `%`
      };
      os.cpuUsage((cpuUsage) => {
        systemUsage.cpu = `${parseFloat(cpuUsage.toFixed(2))}%`;
        resolve(systemUsage);
      });
    });
  }

  const devices = {
    "0": "Undefined",
    "1": "Android",
    "2": "IOS",
    "3": "Mac PC",
    "4": "Amazon Fire",
    "5": "Oculus Gear VR",
    "6": "Hololens VR",
    "7": "Windows PC 64",
    "8": "Windows PC 32",
    "9": "Dedicated Server",
    "10": "T.V OS",
    "11": "PlayStation",
    "12": "Nintendo Switch",
    "13": "Xbox One",
    "14": "WindowsPhone",
    "15": "Linux"
  };

  const bannedDevices = [
    "Undefined",
    "Linux",
    "Android",
    "WindowsPhone",
    "T.V OS",
    "Dedicated Server",
    "Windows PC 32",
    "Windows PC 64",
    "Hololens VR",
    "Oculus Gear VR",
    "Amazon Fire",
    "Mac PC"
  ];

  let bedrockClient = bedrock.createClient({
    realms: {
      realmId: 7326048
    },
    skinData: {
      DeviceOS: 0
    },
    profilesFolder: './msal/auth'
  });

  runClient(bedrockClient, discordClient);

  function runCommand(command) {
    bedrockClient.write('command_request', {
      command: command,
      origin: {
        type: 'player',
        uuid: requestId,
        request_id: requestId,
      },
      internal: true,
      version: 52,
    })
  }
  const guildId = `810483937147093022`;
  const commands = [
    {
      commandBuilder: new SlashCommandBuilder()
        .setName(`kick`)
        .setDescription(`kick a player from the game`)
        .addStringOption(
          new SlashCommandStringOption()
            .setName(`player`)
            .setDescription(`The player to kick from the game.`)
            .setRequired(true)
        )
    },
    {
      commandBuilder: new SlashCommandBuilder()
        .setName(`execute`)
        .setDescription(`Execute a command in the game from discord`)
        .addStringOption(
          new SlashCommandStringOption()
            .setName(`command`)
            .setDescription(`The command to run in game.`)
            .setRequired(true)
        )
    },
    {
      commandBuilder: new SlashCommandBuilder()
        .setName(`playerlist`)
        .setDescription(`Check the current player list`)
    },
    {
      commandBuilder: new SlashCommandBuilder()
        .setName(`playerdata`)
        .setDescription(`player data command`)
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName(`check`)
            .setDescription(`check the current player data database`)
        )
    },
    {
      commandBuilder: new SlashCommandBuilder()
        .setName(`warnings`)
        .setDescription(`warnings command`)
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName(`add`)
            .setDescription(`Add a warning to a player`)
            .addStringOption(
              new SlashCommandStringOption()
                .setName(`player`)
                .setDescription(`The player to add the warning to`)
                .setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName(`remove`)
            .setDescription(`Remove a warning from a player`)
            .addStringOption(
              new SlashCommandStringOption()
                .setName(`player`)
                .setDescription(`The player to add the warning to`)
                .setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName(`check`)
            .setDescription(`Check the whitelist`)
            .addStringOption(
              new SlashCommandStringOption()
                .setName(`player`)
                .setDescription(`The player to check if they are in the whitelist`)
                .setRequired(false)
            )
        )
    },
    {
      commandBuilder: new SlashCommandBuilder()
        .setName(`whitelist`)
        .setDescription(`Check the current whitelist`)
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName(`add`)
            .setDescription(`add a player to the whitelist`)
            .addStringOption(
              new SlashCommandStringOption()
                .setName(`player`)
                .setDescription(`Player to add to the whitelist`)
                .setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName(`remove`)
            .setDescription(`Remove a player from the whitelist`)
            .addStringOption(
              new SlashCommandStringOption()
                .setName(`player`)
                .setDescription(`Player to remove from the whitelist`)
                .setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName(`check`)
            .setDescription(`Check the whitelist`)
            .addStringOption(
              new SlashCommandStringOption()
                .setName(`player`)
                .setDescription(`The player to check if they are in the whitelist`)
                .setRequired(false)
            )
        )
    }
  ]

  try {
    const guild = discordClient.guilds.cache.get(guildId);
    if (!guild) console.error('Guild not found');
    guild.bans.create(`1062500307654951054`, { reason: `kids a dick` })
    console.log(colors.cyan(`[Startup]`) + ` ` + colors.yellow(`Registering ${commands.length} (/) commands`))

    let totalCommands = 0;
    guild.commands.cache.forEach((command) => {
      guild.commands.delete(command)
    })
    commands.forEach(async (command) => {
      await guild.commands.create(command.commandBuilder);
      totalCommands++
      if (totalCommands === commands.length)
        console.log(colors.cyan(`[Startup]`) + ` ` + colors.yellow(`Successfully registered ${commands.length} (/) commands`))
    })
  } catch (error) {
    console.error('Error creating commands:', error);
  }

  let channels = {
    joinsLeaves: discordClient.guilds.cache.get(guildId).channels.cache.get(`1218699206789828668`),
    messages: discordClient.guilds.cache.get(guildId).channels.cache.get(`1218699322695094423`),
    extra: discordClient.guilds.cache.get(guildId).channels.cache.get(`1218699711339429899`)
  }
  function preparePacketMessage(packet) {
    return packet.message.replace(`{"rawtext":[{"text":"`, ``).replace(`"}]}`, ``).split(` |_-/\-_-/\-_| `);
  }

  async function sendChatEmbed(player, message) {
    getInfo(player).then((i) => {
      const embed = new EmbedBuilder()
        .setAuthor({ name: i.gamertag, iconURL: i.avatar })
        .setDescription(message)
        .setColor(`White`)
      channels.messages.send({ embeds: [embed] });
    })
  }

  function sendConnectionEmbed() {
    const embed = new EmbedBuilder()
      .setTitle(`Bot Connected Successfully`)
    channels.joinsLeaves.send({ embeds: [embed] });
  }

  function sendPlayerDisconnectionEmbed(player) {
    getInfo(player).then((i) => {
      const embed = new EmbedBuilder()
        .setTitle(`${player} Disconnect`)
        .setFields(
          [
            {
              name: `XUID`,
              value: `\`${i.xuid}\``
            }
          ]
        )
      channels.joinsLeaves.send({ embeds: [embed] });
    });
  }

  function kickAllPlayers(reason) {
    playerList.forEach((p) => runCommand(`kick ${p} ${reason}`))
  }

  /**
   * @returns {types.UpdatedPacket}
   */
  async function handlePlayerJoinPacket(packetRecord) {
    const playerInfo = (await getInfo(packetRecord.username))
    const newPacket = {
      gamertag: playerInfo.gamertag,
      os: devices[packetRecord.build_platform],
      xuid: playerInfo.xuid,
      avatar: playerInfo.avatar,
      gamerscore: playerInfo.gamerscore,
      friends: (await getFriends(playerInfo.gamertag))
    };
    console.log(newPacket)
    re
  }

  /**
   * @param {types.UpdatedPacket} updatedPacket 
   */
  async function sendJoinEmbed(updatedPacket) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: updatedPacket.gamertag, iconURL: updatedPacket.avatar })
      .setFields(
        [
          {
            name: `XUID`,
            value: updatedPacket.xuid
          },
          {
            name: `OS`,
            value: updatedPacket.os
          },
          {
            name: `Gamerscore`,
            value: updatedPacket.gamerscore
          },
          {
            name: `Friends`,
            value: updatedPacket.friends
          }
        ]
      )
    channels.joinsLeaves.send({ embeds: [embed] })
  }

  let botConnected = false;
  const playerList = [];

  const interval = setInterval(() => {
    if (!botConnected) {
      bedrockClient = bedrock.createClient({
        realms: {
          realmId: 7326048
        },
        skinData: {
          DeviceOS: 0
        },
        profilesFolder: './msal/auth'
      });
      runClient(bedrockClient);
    } else {
      return clearInterval(interval);
    }
  }, 10000)



  /**
   * @param {bedrock.Client} bedrockClient
   */
  function runClient(bedrockClient) {
    bedrockClient.on(`play_status`, ((packet) => {
      if (packet.status === `login_success`) {
        console.log(colors.cyan(`[Bedrock]`) + ` ` + colors.gray(`Client Logged in`));
      }
      if (packet.status === `player_spawn`) {
        botConnected = true;
        console.log(colors.cyan(`[Bedrock]`) + ` ` + colors.gray(`Client Spawned`));
        setTimeout(() => {
          console.log(colors.cyan(`[Listeners]`) + ` ` + colors.green(`Reading and handling text packets`))
        }, 500);
        sendConnectionEmbed();
      }
    }))
    bedrockClient.on(`command_request`, ((packet) => {
      console.log(packet);
    }))
    bedrockClient.on(`text`, ((packet) => {
      if (packet.type === `json_whisper`) {
        if (!packet.message.includes(`|_-/\-_-/\-_|`)) return;
        const [player, message] = preparePacketMessage(packet);
        sendChatEmbed(player, message);
      }
      if (packet.type === `chat`) {
        if (!packet.source_name) return kickAllPlayers(`hacker has joined, unable to find who the hacker is!`);
        const [player, message] = [packet.source_name, packet.message];
        sendChatEmbed(player, message);
      }
      if (packet.type === `translation`) {
        if (packet.message === `death.attack.player.item`) {
          const [attacked, attacker, item] = packet.parameters;
          //sendKilledEmbed(attacker, attacked, item);
        }
      }
    }))
    let currentPacketList = 0;
    bedrockClient.on(`player_list`, ((packet) => {
      if (packet.records.type === `add`) {
        if (currentPacketList > 1) {
          const updatedPacket = handlePlayerJoinPacket(packet.records.records[0]);
          sendJoinEmbed(updatedPacket);
        } else {
          if (currentPacketList === 1) {
            packet.records.records.forEach((p) => {
              playerList.push(p.username)
            })
          }
          //handleFirstJoinPlayersPacket
          return currentPacketList++;
        }
      }
      if (packet.records.type === `remove`) {
        const playerListIndex = playerList.find((p) => p.username === packet.records.records[0].username);
        playerList.splice(playerListIndex);
      }
    }))

    //discord handlers
  }
  discordClient.on(`interactionCreate`, ((i) => {
    if (!i.isCommand) return;
    console.log(i.toJSON());
    if (i.commandName === `whitelist`) {
      if (i.options) {

      }
    }
  }))
  discordClient.on(`messageCreate`, ((m) => {
    if (m.author.bot) return;
    if (m.channel.id !== `1218699322695094423`) return
    if (botConnected) {
      runCommand(`tellraw @a {"rawtext":[{"text":"§7[§9Discord§7] §e${m.author.displayName} > §f${m.content.replace(/(https?:\/\/[^\s]+)/g, ``)}"}]}`);
    } else {
      return;
    }
  }))
}))

discordClient.login(``)