import axios from "axios";
import Bot from "../main/Bot";
import Post from "../classes/Post";

export default async function getPostFunction(
    client: Bot,
    postId: number,
    commentId: number
): Promise<Post> {
    try {
        const res = await axios.get(
            `https://web.realsports.io/comments/posts/${postId}/replies/${commentId}?limit=10`,
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
        return new Post(res.data, client);
    } catch (error) {
        // Handle errors if necessary
        throw error;
    }
}
// https://web.realsports.io/comments/posts/99313/replies/5014904?limit=10
