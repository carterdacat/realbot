import axios from "axios";
import Bot from "../main/Bot";
import Play from "../classes/Play";

export default async function getPlayFunction(
    client: Bot,
    playId: number,
    commentId: number
): Promise<Play> {
    try {
        const res = await axios.get(
            `http://web.realsports.io/comments/plays/1905724130/replies/24765814?limit=10`, // <-- Added trailing slash here
            {
                method: "get",
                headers: {
                    "real-auth-info": "KnA6mEEJ!Y35g7vRG!801a60f9-9b0e-4811-b4f7-82cd53442a7b",
                    "real-device-uuid": "178ae57e-6575-4119-bb26-9b7102fd5b69",
                    "real-device-type": "desktop_web",
                    "real-device-token": "token",
                    "real-version": 10,
                },
            }
        );
        return new Play(res.data, client);
    } catch (error) {
        // Handle errors if necessary
        throw error;
    }
}
// https://web.realsports.io/comments/posts/99313/replies/5014904?limit=10
