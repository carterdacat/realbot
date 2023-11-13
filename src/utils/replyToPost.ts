import axios from "axios";
import Bot from "../main/Bot";
import Reply from "../classes/Reply";
import { error } from "console";
type reqObj = {
    groupId: number;
    text: string;
    parentCommentId: string;
};
export default async function replyToPost(
    postId: number,
    req: reqObj,
    client: Bot,
    group?: boolean
): Promise<Reply> {
    if (group) {
        client.logger.log("Groups not supported yet", "warn");
    }
    try {
        const res = await axios.post(`https://web.realsports.io/comments/posts/${postId}`, req, {
            method: "post",
            headers: {
                "real-auth-info": "KnA6mEEJ!Y35g7vRG!801a60f9-9b0e-4811-b4f7-82cd53442a7b",
                "real-device-uuid": "178ae57e-6575-4119-bb26-9b7102fd5b69",
                "real-device-type": "desktop_web",
                "real-device-token": "token",
            },
        });
        if (res.status < 200 || res.status > 299) {
            throw error(`Message POST error; Code ${res.status}`);
        }
        return new Reply(res.data, client);
    } catch (error) {
        // Handle errors if necessary
        throw error;
    }
}
