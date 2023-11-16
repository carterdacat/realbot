import axios from "axios";
import { error } from "console";

export default async function getWiki(prompt: string): Promise<string> {
    const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${prompt}`);
    if (res.status === 404) {
        throw error("404 error");
    }
    if (res.status === 200) {
        return res.data.extract;
    }
}
