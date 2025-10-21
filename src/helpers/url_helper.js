//REGISTER
export const TOKEN_KEY = "token";
export const LOBBY_KEY = "lobby-type";
export const LOBBY_MOB_PERM = "lobby_mob_type";
export const LOBBY_WEB_PERM = "lobby_web_type";
export const LOBBY_VERSION_KEY = "lobby_app_version";
export const API_PREFIX = "";
export const APPLICATION_EXT = "/user-api";
export const ARCADE_MS_EXT = "/arcade-api";
export const PLAYER_MS_EXT = "/player-api";
export const MASTER_MS_EXT = "/master";
export const ADMIN_MS_EXT = "/admin";

export const EXCLUDE_LOADER = [
    "/getUserBalance",
    "/checkNickname",
    "/getUserEventBonusCoin",
    "/checkDevice"
];

export const PLAYER_API = {
    updateUserLanguage: "/updateUserLanguage",
    addUserSession: "/addUserSession",
    getUser: "/getUser",
    getGlobalConfig: "/getGlobalConfig",
    getUserBalance: "/getUserBalance",
    listNotification: "/listNotification",
    getNotification: "/getNotification",
    listTransaction: "/listTransaction",
    getTransaction: "/getTransaction",
    listEventBonus: "/listEventBonus",
    listTurnover: "/listTurnover",
    getTurnover: "/getTurnover",
    getHistoryDetail: "/getHistoryDetail",
    listReferral: "/listReferral",
    listReferralBonus: "/listReferralBonus",
    getReferralBonus: "/getReferralBonus",
    generateNickname: "/generateNickname",
    checkNickname: "/checkNickname",
    updateNickname: "/updateNickname",
    updateAvatar: "/updateAvatar",
    logout: "/logout",
    getFtpUrl: "/getFtpUrl",
    getAvatar: "/getAvatar",
    getCoinReward: "/getCoinReward",
    updateReward: "/updateReward",
    getUserEventBonusCoin: "/getUserEventBonusCoin",
    checkDevice: "/checkDevice",
    getCoachDetails: "/getCoachDetails",
    updateCoachMarkStatus: "/updateCoachMarkStatus",
    getPromoBanner: "/getPromoBanner",
    fetchLoader: "/fetchLoader",
    redirectLobby: "/redirectLobby",
}
export const ARCADE_API = {
    launchGame: "/launchGame",
    gameList: "/gameList"
}
