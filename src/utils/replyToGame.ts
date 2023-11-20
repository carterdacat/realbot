import axios from "axios";
import Bot from "../main/Bot";
import Reply from "../classes/Reply";
import { error } from "console";
type reqObj = {
    groupId: number;
    text: string;
    parentCommentId: string;
    playerId: number | null
};
export default async function replyToGame(
    gameId: number,
    req: reqObj,
    client: Bot,
    sport: string,
    group?: boolean
): Promise<Reply> {
    if (group) {
        client.logger.log("Groups not supported yet", "warn");
    }
    try {
        const res = await axios.post(`https://web.realsports.io/comments/games/${gameId}/sports/${sport}`, req, {
            method: "post",
            headers: {
                "real-auth-info": process.env.auth,
                "real-device-uuid": "178ae57e-6575-4119-bb26-9b7102fd5b69",
                "real-device-type": "desktop_web",
                "real-device-token": "token",
            },
        });
        if (res.status < 200 || res.status > 299) {
            throw error(`Message game error; Code ${res.status}`);
        }
        return new Reply(res.data, client);
    } catch (error) {
        // Handle errors if necessary
        throw error;
    }
}
