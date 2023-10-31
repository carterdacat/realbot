import Logger from "./Logger";
import util from "util";
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

export default class Bot {
    logger: Logger;
    socket: any;
    wait: { (ms: number): Promise<any>; (ms: number, value: any): Promise<any> };
    startTime: string;
    constructor() {
        this.wait = util.promisify(setTimeout);
        this.socket = io("wss://web.realsports.io", {
            query: query,
            transports: ["websocket"],
        });
        this.startTime = new Date().toISOString().replace(/[-:.]/g, "_");
        this.logger = new Logger(this.startTime);
    }
    on(event: string, listener: (...args: any[]) => void) {
        eventEmitter.on(event, listener);
    }
    // Method to remove custom event listeners
    off(event: string, listener: (...args: any[]) => void) {
        eventEmitter.off(event, listener);
    }
    connect() {
        this.socket.on("popup", function (msg: string) {
            this.logger.log("hello: " + msg, "log");
        });
        const mentionRegex = /\[([^\]]+)\] ([a-zA-Z\d\w]+) mentioned you in/g;
        const replyRegex = /\[([^\]]+)\] ([a-zA-Z\d\w]+) replied to your/g;
        this.socket.on("connect", () => {
            this.logger.log("Client connected to the Real via Socket.IO", "ready");
            const engine = this.socket.io.engine;
            engine.on("packet", ({ type, data }) => {
                const mentionRegEx = new RegExp('"(UserActivityUpdated)"');
                if (mentionRegEx.test(data)) {
                    const cleanedData = data.replace(/^\d+\[/, "[");
                    const dataArray = JSON.parse(cleanedData);
                    const message = dataArray[1].message;
                    if (mentionRegex.test(message)) {
                        eventEmitter.emit("mention", dataArray);
                    } else if (replyRegex.test(message)) {
                        eventEmitter.emit("reply", dataArray);
                    } else {
                        return;
                    }
                }
            });
        });

        this.socket.on("disconnect", function () {
            eventEmitter.emit("disconnect");
        });

        this.socket.on("connect_error", function (err) {
            eventEmitter.emit("connect_error", err);
        });

        this.socket.on("connect_timeout", function (err) {
            eventEmitter.emit("connect_timeout", err);
        });
    }
}
