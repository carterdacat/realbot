import Bot from "../main/Bot"

module.exports = class mention {
    client: Bot
    constructor(client: Bot) {
        this.client = client
    }
    async run(data) {
        console.log(data)
            //GET GROUP
            //https://web.realsports.io/comments/groups/16494/replies/4621013?limit=10
            //GET COMMENT POST
            //https://web.realsports.io/comments/posts/99313/replies/5014904?limit=10   
            //REPLY (POST)
            //https://web.realsports.io/comments/posts/99313
            // Make these "Bot" functions where you go client.getComment("99313") => commentData
    }
}