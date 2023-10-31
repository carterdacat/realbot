import Bot from "../main/Bot"

module.exports = class mention {
    client: Bot
    constructor(client: Bot) {
        this.client = client
    }
    async run(data) {
        console.log(1)
        console.log(data)
    }
}