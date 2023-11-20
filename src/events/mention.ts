import Bot from "../main/Bot"
import coinflip from "coinflip"
module.exports = class mention {
    client: Bot
    constructor(client: Bot) {
        this.client = client
    }
    async run(data) {
        // Extract the number from the path property
        const path = data[1].path;
        const match = path.match(/\/(\d+)$/);
        // If a match is found, extract the number
        const commentId = match ? match[1] : null;
        const acitvity = await this.client.getActivity(commentId);
        const entity = await acitvity.getEntity()
        this.client.logger.log(`Question Asked By ${entity.user.userName}!`, "log")
        const reply = entity.reply(coinflip() ? "Yes!" : "No!")
        //GET GROUP
        //https://web.realsports.io/comments/groups/16494/replies/4621013?limit=10
        //GET COMMENT POST
        //https://web.realsports.io/comments/posts/99313/replies/5014904?limit=10
        //REPLY (POST)
        //https://web.realsports.io/comments/posts/99313
        // Make these "Bot" functions where you go client.getComment("99313") => commentData
    }
}

