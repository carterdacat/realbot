import axios from "axios";
import Bot from "../main/Bot";
import Activity from "../classes/Activity";

export default async function getActivity(
    client: Bot,
    commentId: string | number
): Promise<Activity> {
    try {
        const res = await axios.get(`https://web.realsports.io/activity`, {
            method: "get",
            headers: {
                "real-auth-info": process.env.auth,
                "real-device-uuid": "178ae57e-6575-4119-bb26-9b7102fd5b69",
                "real-device-type": "desktop_web",
                "real-device-token": "token",
                "real-version": 10,
            },
        });
        const activities = res.data.activities;
        const findActivity = async function (id): Promise<Activity> {
            for (let i = 0; i < activities.length; i++) {
                if (activities[i].commentId === id) {
                    return new Activity(activities[i], client);
                }
            }
        };
        return await findActivity(commentId.toString());
    } catch (error) {
        throw error;
    }
}
