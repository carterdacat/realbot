import Logger from "./Logger";
import util from "utils";
import { EventEmitter } from "events";
import io from "socket.io-client";
import dotenv from "dotenv";

dotenv.config();

const eventEmitter = new EventEmitter();

const query = {
    socketType: "user",
    userId: "KnA6mEEJ",
    auth: process.env.socketAuth,
};

const socket = io("wss://web.realsports.io", {
    query: query,
    transports: ["websocket"],
});

export default class Bot {
    //logger: Logger;
    // wait: { (ms: number): Promise<any>; (ms: number, value: any): Promise<any> };
    constructor() {
        //    this.wait = util.promisify(setTimeout);
        //    this.logger = new Logger();
    }
    on(event: string, listener) {
        eventEmitter.on(event, listener);
    }

    // Method to remove custom event listeners
    off(event: string, listener) {
        eventEmitter.off(event, listener);
    }
    connect() {
        socket.on("popup", function (msg) {
            console.log("hello: ", msg);
        });
        const mentionRegex = /\[([^\]]+)\] ([a-zA-Z\d\w]+) mentioned you in/g;
        const replyRegex = /\[([^\]]+)\] ([a-zA-Z\d\w]+) replied to your/g;
        socket.on("connect", function () {
            console.log("Client connected to the server via Socket.IO");
            const engine = socket.io.engine;
            engine.on("packet", ({ type, data }) => {
                const mentionRegEx = new RegExp('"(UserActivityUpdated)"');
                if (mentionRegEx.test(data)) {
                    const cleanedData = data.replace(/^\d+\[/, "[");
                    const dataArray = JSON.parse(cleanedData);
                    const message = dataArray[1].message;
                    if (mentionRegex.test(message)) {
                        console.log(`Mention: ${message}`);
                        //eventEmitter.emit("dataReceived", msg);
                    } else if (replyRegex.test(message)) {
                        console.log(`Reply: ${message}`);
                    } else {
                        console.log(`Not a mention or reply: ${message}`);
                    }
                }
            });
        });

        socket.on("disconnect", function () {
            console.log("Client disconnected from the server via Socket.IO");
        });

        socket.on("connect_error", function (err) {
            console.log("Client connect_error: ", err);
        });

        socket.on("connect_timeout", function (err) {
            console.log("Client connect_timeout: ", err);
        });
    }
}
