export default class User {
    userName: string;
    id: string;
    avatarKey: any;
    isRealPro: boolean;
    constructor(user: {
        id: string;
        userName: string;
        avatarKey: number;
        realProTier: null | number;
    }) {
        this.id = user.id;
        this.userName = user.userName;
        this.avatarKey = user.avatarKey;
        this.isRealPro = user.realProTier !== null ? true : false;
    }
}
