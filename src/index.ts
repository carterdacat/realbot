import { readdir } from "fs";
import dotenv from "dotenv";
import Bot from "./main/Bot";
import { join } from "path";

dotenv.config();

const client = new Bot();

const start = async () => {
    client.connect();
};

start();

process.on("unhandledRejection", (error: Error) => {
    //client.logger.log(error.message, "error");
});

process.on("uncaughtException", (error: Error) => {
    //client.logger.log(error.message, "error");
});
process.on("exit", (code) => {
    console.log(`About to exit with code: ${code}`);
});

/* NOTE
            websocket is a "notifier", and does NOT send message content. Two options for checking that messeage contents.
            1. Fetch activites
                Would need to get message ID to be able to filter it in activities
                would require sorting
                IMPORTANT. CAN FIND ACTIVITY BASED ON COMMENT ID (SEE BELOW)
            2. Find the message its self and read its data
                We are given a "path". Will need to investigate
                  {
                    message: '[ryan_mountaincastle] realbot2 mentioned you in a group comment',
                    path: '/G4ckFWB1HYmB/4588746',
                        Number is commentID
                        need to solve what Letters are
                    activityInfo: { bumpedAt: '2023-10-30T21:22:26.504Z', count: 7 },
                    userId: 'KnA6mEEJ'
            */
