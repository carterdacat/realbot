import axios from "axios";
import Bot from "../main/Bot";
import Entity from "../classes/Entity";

export default async function getGameFunction(
    client: Bot,
    gameId: number,
    commentId: number | string,
    sport: string
): Promise<Entity> {
    try {
        const res = await axios.get(
            `http://web.realsports.io/comments/games/${gameId}/sports/${sport}/replies/${commentId}?limit=10`, // <-- Added trailing slash here
            {
                method: "get",
                headers: {
                    "real-auth-info": process.env.auth,
                    "real-device-uuid": "178ae57e-6575-4119-bb26-9b7102fd5b69",
                    "real-device-type": "desktop_web",
                    "real-device-token": "token",
                    "real-version": 10,
                },
            }
        );
        return new Entity(res.data, client);
    } catch (error) {
        // Handle errors if necessary
        throw error;
    }
}
// https://web.realsports.io/comments/posts/99313/replies/5014904?limit=10
