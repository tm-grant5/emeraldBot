const axios = require('axios')

class Rest {
  constructor(authflow, options = {}) {
    this.auth = authflow;
    this.options = options;
  }

  async get(url, config = {}) {
    return await this._request('GET', { url, ...config });
  }

  async post(url, config = {}) {
    return await this._request('POST', { url, ...config });
  }

  async put(url, config = {}) {
    return await this._request('PUT', { url, ...config });
  }

  async delete (url, config = {}) {
    return await this._request('DELETE', { url, ...config });
  }

  async _request(method, config) {
    const auth = await this.auth.getXboxToken('http://xboxlive.com');

    const payload = {
      method,
      url: config.url,
      headers: {
        'Authorization': `XBL3.0 x=${auth.userHash};${auth.XSTSToken}`,
        'accept-language': 'en-US',
        ...(this.options.headers || {}),
        ...(config.headers || {}),
      },
    };

    if (config.contractVersion) payload.headers['x-xbl-contract-version'] = config.contractVersion;
    if (config.params) payload.params = config.params;
    if (config.data) payload.data = config.data;

    return await axios(payload).then(e => e.data);
  }

  async getxboxProfileBatch(xuids) {
    const people = await this.post('https://peoplehub.xboxlive.com/users/me/people/batch/decoration/detail,preferredcolor', { data: { xuids }, contractVersion: 5 }).then(e => e.people).catch(() => []);
    return people.map(response => {
      return {
        xuid: response.xuid,
        avatar: response.displayPicRaw,
        gamerscore: response.gamerScore,
        gamertag: response.gamertag,
        tier: response.detail.accountTier,
        reputation: response.xboxOneRep,
        colour: {
          primaryColour: response.preferredColor.primaryColor,
          secondaryColour: response.preferredColor.secondaryColor,
          tertiaryColour: response.preferredColor.tertiaryColor,
        },
        realname: response.realName,
        bio: response.detail.bio,
        location: response.detail.location,
        modernGamertag: response.modernGamertag,
        modernGamertagSuffix: response.modernGamertagSuffix,
        uniqueModernGamertag: response.uniqueModernGamertag,
        realnameOverride: response.realNameOverride,
        tenureLevel: response.detail.tenure,
        watermarks: response.detail.watermarks,
        isQuarantined: response.isQuarantined,
        linkedAccounts: response.linkedAccounts,
      };
    });
  }

  async getXboxProfile(input) {
    const auth = await this.auth.getXboxToken('http://xboxlive.com')

    const settings = 'GameDisplayPicRaw,Gamerscore,Gamertag,AccountTier,XboxOneRep,PreferredColor,RealName,Bio,Location,ModernGamertag,ModernGamertagSuffix,UniqueModernGamertag,RealNameOverride,TenureLevel,Watermarks,IsQuarantined,DisplayedLinkedAccounts';

    const target = `gt(${input})`;

    const response = await this.get(`https://profile.xboxlive.com/users/${target}/profile/settings`, { params: { settings }, contractVersion: 2 });

    const [avatar, gamerscore, gamertag, tier, reputation, colour, realname, bio, location, modernGamertag, modernGamertagSuffix, uniqueModernGamertag, realnameOverride, tenureLevel, watermarks, isQuarantined, linkedAccounts] = response.profileUsers[0].settings.map(e => e.value);
    const colourData = await axios.get(colour, { timeout: 5000 })
      .then(e => e.data)
      .catch(() => ({ primaryColor: '000000', secondaryColor: '000000', tertiaryColor: '000000' }));

    return {
      xuid: response.profileUsers[0].id,
      avatar: avatar.replace(/&background=0xababab&mode=Padding&format=png/g, ''),
      gamerscore,
      gamertag,
    };
  }

  async getXboxTitleHistory(xuid) {
    return await this.get(`https://titlehub.xboxlive.com/users/xuid(${xuid})/titles/titlehistory/decoration/detail?maxItems=5000`, { contractVersion: 2 }).then(res => res.titles);
  }

  async getXboxFriends(xuid) {
    return await this.get(`https://peoplehub.xboxlive.com/users/xuid(${xuid})/people/social/decoration/detail,preferredColor,follower`, { contractVersion: 5 }).then(res => res.people.length)
  }

  async getXboxFollowers(xuid) {
    return await this.get(`https://peoplehub.xboxlive.com/users/xuid(${xuid})/people/followers/decoration/follower`, { contractVersion: 5 }).then(res => res.people.length)
  }

  async addXboxFriend(xuid) {
    return await this.put(`https://social.xboxlive.com/users/me/people/xuid(${xuid})`, { contractVersion: 2 });
  }

  async removeXboxFriend(xuid) {
    return await this.delete(`https://social.xboxlive.com/users/me/people/xuid(${xuid})`, { contractVersion: 2 });
  }

  #parseXboxProfile(profile) {
    return {
      ...profile,
      xuid: profile.xuid,
      avatar: profile.displayPicRaw,
      gamerscore: profile.gamerScore,
      gamertag: profile.gamertag,
      realname: profile.realName,
      bio: profile.detail.bio,
      location: profile.detail.location,
      modernGamertag: profile.modernGamertag,
      linkedAccounts: profile.linkedAccounts,
    };
  }
};

module.exports = Rest;