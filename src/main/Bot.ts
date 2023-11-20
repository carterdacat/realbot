import Logger from "./Logger";
import util from "util";
import { EventEmitter } from "events";
import io from "socket.io-client";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
<<<<<<< HEAD
import { getPost, getPlay, getGame } from "../utils/functions";
import packagejs from "../../package.json";

import getActivity from "../utils/getActivity";
import Entity from "../classes/Entity";
=======
import { getPost, getPlay } from "../utils/functions";
import Post from "../classes/Post";
import Play from "../classes/Play";

dotenv.config();

const eventEmitter = new EventEmitter();

const query = {
    socketType: "user",
    userId: process.env.userID,
    auth: process.env.socketAuth,
};

export default class Bot {
    logger: Logger;
    socket: any;
    wait: { (ms: number): Promise<any>; (ms: number, value: any): Promise<any> };
    startTime: string;
    token: string;
    constructor() {
        this.wait = util.promisify(setTimeout);
        this.socket = io("wss://web.realsports.io", {
            query: query,
            transports: ["websocket"],
        });
        this.startTime = new Date().toISOString().replace(/[-:.]/g, "_");
        this.logger = new Logger(this.startTime);
        this.token = process.env.socketAuth;
    }
    on(event: string, listener: (...args: any[]) => void) {
        eventEmitter.on(event, listener);
    }
    // Method to remove custom event listeners
    off(event: string, listener: (...args: any[]) => void) {
        eventEmitter.off(event, listener);
    }
    getPost(postId: number, commentId: number): Promise<Entity> {
        return getPost(this, postId, commentId);
    }
    getPlay(playId: number, commentId: number): Promise<Entity> {
        return getPlay(this, playId, commentId);
    }
    login() {
        const mentionRegex = /\[([^\]]+)\] ([a-zA-Z\d\w]+) mentioned you in/g;
        const replyRegex = /\[([^\]]+)\] ([a-zA-Z\d\w]+) replied to your/g;
        const engine = this.socket.io.engine;
        engine.on("packet", ({ type, data }) => {
            const initialDataRegEx = new RegExp('"(SocketInitialData)"');
            const userActivityRegEx = new RegExp('"(UserActivityUpdated)"');
            if (initialDataRegEx.test(data)) {
                const cleanedData = data.replace(/^\d+\[/, "[");
                const dataArray = JSON.parse(cleanedData);
                if (dataArray[1].userId === process.env.userID) {
                    this.logger.log(
                        "Client Sucsessfully loged in with ID" + process.env.userID,
                        "ready"
                    );
                } else {
                    this.logger.log("Client Unsucsessfully logged in... trying again", "warn");
                    axios
                        .post(
                            "https://web.realsports.io/login",
                            {
                                login: process.env.login,
                                password: process.env.password,
                            },
                            {
                                method: "post",
                                headers: {
                                    "real-auth-info":
                                        "KnA6mEEJ!Y35g7vRG!801a60f9-9b0e-4811-b4f7-82cd53442a7b",
                                    "real-device-uuid": "178ae57e-6575-4119-bb26-9b7102fd5b69",
                                    "real-device-type": "desktop_web",
                                    "real-device-token": "token",
                                },
                            }
                        )
                        .then((response) => {
                            if (response.data.success === true) {
                                this.token = `${process.env.userID}!${response.data.deviceId}!${response.data.token}`;
                                process.env.socketAuth = this.token;
                                const envData = Object.keys(process.env)
                                    .map((key) => `${key}=${process.env[key]}`)
                                    .join("\n");
                                fs.writeFileSync(".env", envData);
                            }
                        });
                }
            }
            if (userActivityRegEx.test(data)) {
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
