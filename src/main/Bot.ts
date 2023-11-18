import Logger from "./Logger";
import util from "util";
import { EventEmitter } from "events";
import io from "socket.io-client";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import { getPost, getPlay, getGame } from "../utils/functions";
import packagejs from "../../package.json";

import getActivity from "../utils/getActivity";
import Entity from "../classes/Entity";

dotenv.config();

const eventEmitter = new EventEmitter();

const query = {
    socketType: "user",
    userId: process.env.userID,
    auth: process.env.auth,
};

export default class Bot {
    logger: Logger;
    socket: any;
    wait: { (ms: number): Promise<any>; (ms: number, value: any): Promise<any> };
    startTime: string;
    token: string;
    auth: string;
    version: any;
    constructor() {
        this.wait = util.promisify(setTimeout);
        this.socket = io("wss://web.realsports.io", {
            query: query,
            transports: ["websocket"],
        });
        this.startTime = new Date().toISOString().replace(/[-:.]/g, "_");
        this.logger = new Logger(this.startTime);
        this.token = process.env.auth;
        this.version = packagejs.version;
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
    getActivity(commentId: number | string) {
        return getActivity(this, commentId);
    }
    getGame(gameId: number, commentId: number, sport: string): Promise<Entity> {
        return getGame(this, gameId, commentId, sport);
    }
    login() {
        const mentionRegex = /\[([^\]]+)\] ([a-zA-Z\d\w]+) mentioned you in/;
        const replyRegex = /\[([^\]]+)\] ([a-zA-Z\d\w]+) replied to your/;

        const loginAttempt = (i) => {
            this.logger.log("Client Connecting...", "ready");
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
                            "real-device-uuid": "178ae57e-6575-4119-bb26-9b7102fd5b69",
                            "real-device-type": "desktop_web",
                            "real-device-token": "token",
                            "real-version": 10,
                        },
                    }
                )
                .then((res) => {
                    if (res.status < 200 || res.status > 299) {
                        this.logger.log(
                            "Unsuccessfully Logged In \n" +
                                res.data.statusCode +
                                " " +
                                res.data.message,
                            "error"
                        );
                        setTimeout(() => loginAttempt(i), 5000); // Retry after 5 seconds
                        return;
                    }
                    // Successful login logic here
                    this.logger.log("Logged In - User ID: " + process.env.userID, "ready");
                    this.token = `${process.env.userID}!${res.data.deviceId}!${res.data.token}`;
                    process.env.auth = this.token;
                    const envData = Object.keys(process.env)
                        .map((key) => `${key}=${process.env[key]}`)
                        .join("\n");
                    fs.writeFileSync(".env", envData);
                })
                .catch((err) => {
                    throw err;
                });
        };

        let loginAttempts = 0;
        const initiateLogin = () => {
            loginAttempt(loginAttempts);
        };

        initiateLogin();
        const engine = this.socket.io.engine;
        engine.on("packet", ({ type, data }) => {
            const initialDataRegEx = new RegExp('"(SocketInitialData)"');
            const userActivityRegEx = new RegExp('"(UserActivityUpdated)"');
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
