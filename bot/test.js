const axios = require('axios');
const { getInfo } = require('./utils/getInfo');

const XSTSToken = `eyJlbmMiOiJBMTI4Q0JDK0hTMjU2IiwiYWxnIjoiUlNBLU9BRVAiLCJjdHkiOiJKV1QiLCJ6aXAiOiJERUYiLCJ4NXQiOiIxZlVBejExYmtpWklFaE5KSVZnSDFTdTVzX2cifQ.Rmos_h7-LRytm-wlmUS7MkOgbB6VMZdHH3WV6FdasEpvsmuJlOn8y0PFdea4zKtat7-PpMkwQgqVmg1hOAFqVMVIEh5jUeSVowBlA0X35uju1P7P7RGkhOl7lmd_SpTpuQKhwY34JqBo4JHRGF3O0pz6LPnTwvpmjSyb9JgqSTQ.w-2jtaFmie11vVk24YimIw.23m0YHnX673Tu_EJqgkY-SqNUgY-_SJeTgJ0Y3M4nUZi3VncJDm3umwt4Fhpp8SwWW5K0-YBzo5NZWrkJtwcMQVX_BHFoDZfqaBNit3Bvw7sTRl7T_CahGqpUhrpQHfEe5XkY8VTtLFabq_BMIBoRQPhf3APAdkj_9mKBRrOxs8IxxQk5olcNGd67FrHQIuODFTcMl3xpsf4Y6jLVVPTRoctlRAp0PH0nkel5UXzTvvkwN6KY0SksAKzsPb7gl11EaK3eH7QqLZmDKTfLsqcIPn-Fy6hESWoDbTzrtOXRq70wcWYrriwf1ztCnZIWa2kKC4uW6b9HfO4x7uaUBVAOO60sgCzOZ68MjQd52fuXpyPwCAoFJyJJF4ri3qMnGCsSo88pJGLlaL2kogeWt-vaaNP0OfCwMJBTw0Vw4sj_zeIGsIg0HIPFXPZHSlP2Dr1Uof_QArBx36RXZYM4jVO57lAtDlRnodiCTeraiHJtANgtvPaVrqxFW0cF0tlJSW0xZd1TLA790c9qqQhQddUxYG-FG2n-VXKFQJ9-Hgy9T6iXoGyakAes8lj0sMGXWEeqUAoHGn14QmC4qk1hSACSwXofrLmVlNR0Mpst2SMuUOSviK_JL-BTwzqNiAkaDYJMSg3vZ5--2OpD2be4oIv_sC6AkPxe3Cgwv8LkzzwC7a0HRc0ApwAgWJXi8HKcORqsvGM6rpUgDdYhpKBsBL984tk_EqnLkPeh0iRtdy0VyBMVtbyMP_hXmgwAe8JKFAadgfeK6nkCPbfso2cThf9qqKTYipVxd1sIp7X3vQdTciIyPutV2CB71o6OgIUg0jmZXSnUNCwU8DCPkbPeBt8adk5HXy6_ht8bRN199Rnvw6cV8Uj0ezJ-UzpccZ4AWV0lWFWt38DIZi-w6k---K9s_RpYLqdpqfNyZVsV8KLSXA5GSrwKOurVUqpeSOlwm0CkkvM3JaMI5mUPvbOX2EUkBAQW-oLbSoEBUb7WQP3LbakQ2HBqznOXXb_ozA4eTTvNw9hqkT5HjwUriWbnQbPWxhSMMsgQbR5B8C28_A8iiHjBqd8J3vphovhcvTbBvSlwJOyzLbl4XbQVzxUH8gc_nXIbIItoezTwEcfgYoKZdJrJzhfom28t07-OWIDadX2ENWwvQ4QFCodMXFDmjXgDv-OaXoxrtMELAA8SXaYfYX_bty4vYmFyPReYuL2etubZN_G48XzrlRYmUr_69X7b8INOlFDbgZod54EfSPGupIF-177WrxBiz7DdqNnxTruEjiUngo96QPLsC_IE-72VPbVtHBFbb1LmLDCEQiOtTGgHulZk5CtM6mCnF8VadWab4Gn57n4tnWrwc9gzhYGHSrRWPnhEVb1Ofrs2LFGCGM_kUsE64xuS0esourWt_b1DhP5lkostSc_Bg6_dq--VeCpCf39bakbEK3gpccDGllDKd9ZNnlxeVXSHjRoP7wfhcGb9U2DUXcFMBO7aPPEIu4zCS19EiRHSipAkicNqW4BeLVLbJlczdt37YFPfTH4OFYkp8J7dfImWzjr4v0wPG5cbO-PAcg9Mc38x_sH5XZ_bvmxZeeojckqGk3ZvObV9kSmdthHTY7bdipHawYgWNq6mQf8iZtK-sj71f9hFaZeFUv6W5MST60wT6A_p4TYOdayXugafJqP1ZlDL40CEajql4ilgPsAjoYN1bcgcUT_Px6Dgt7p-XJLy4dBF5PltiLNKmFYM78OMFzarDHMGRPf-CPS9JuqUgmOtvN4HHpOkGGCVaoiSOp9u_q76fpe2ckcCQQjsuhyruaS_QBXVpCaMYfBZ3Xz1Blz_BU3etj1cEaePLGztBAo9r48PdRcLYJp5W3RboWI4wcEsCx1IBbDXxBkfqrgdiQQHzrPACMWzQ6wi2JEvbjEHuQyJjdiXX8nC3iiyv1VrgnK6lIo7TyJjtHzeKbG3gXhKVowaikfROcf3-jiQ6x-OhndlOGEqy7ByDZ-zthpsi5uwgWdUQ.7ZYwZAb9_wa6hVOwa6cPomnxATD7vOoRB6ROE-JmNFo`
const userHash = '16142254282483923194'; // Add your user hash here
async function getTitleHistory(user) {
	const xuid = (await getInfo(user)).xuid;
	const response = await fetch(`https://titlehub.xboxlive.com/users/xuid(${xuid})/titles/titleHistory/decoration/GamePass,TitleHistory,Achievement,Stats`, {
		method: "GET",
		headers: {
			"x-xbl-contract-version": 2,
			"Accept-Encoding": "gzip, deflate",
			"Accept": "application/json",
			"MS-CV": "unkV+2EFWDGAoQN9",
			"User-Agent": "WindowsGameBar/5.823.1271.0",
			"Accept-Language": "en-US",
			"Authorization": `XBL3.0 x=${userHash};${XSTSToken}`,
			"Host": "titlehub.xboxlive.com",
			"Connection": "Keep-Alive"
		}
	});

	if (response.status === 400) return null;
	if (response.status !== 200) console.log({ errorMsg: `${response.status} ${response.statusText} ${await response.text()}` });

	const titles = (await response.json()).titles;

	return titles;
}

getTitleHistory(`NotTMGrant`)