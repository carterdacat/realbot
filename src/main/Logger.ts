import bgBlue from "chalk";
import black from "chalk";
import green from "chalk";
import { loggerTypes } from "./Types";
import fs from "fs";
import path from "path";

/**
 * Formats partitons of the timestamp
 * @category Classes.logger
 * @internal
 * @param value the string/number to format
 * @param digits how long to make it
 */
function dateTimePad(value: string | number, digits: number): string | number {
    while (value.toString().length < digits) {
        value = "0" + value;
    }
    return value;
}
/**
 * Formats a date to a logger timestamp
 * @category Classes.logger
 * @internal
 * @param tDate The date to format
 */
function format(tDate: Date): string {
    return (
        tDate.getFullYear() +
        "-" +
        dateTimePad(tDate.getMonth() + 1, 2) +
        "-" +
        dateTimePad(tDate.getDate(), 2) +
        " " +
        dateTimePad(tDate.getHours(), 2) +
        ":" +
        dateTimePad(tDate.getMinutes(), 2) +
        ":" +
        dateTimePad(tDate.getSeconds(), 2) +
        "." +
        dateTimePad(tDate.getMilliseconds(), 3)
    );
}

export default class Logger {
    startTime: string;
    constructor(startTime: string) {
        this.startTime = startTime;
    }
    /**
     * The function used to log the log
     * @category Functions.logger
     * @param content The content to log
     * @param type
     */
    public log(content: string, type: loggerTypes = "log") {
        const date = `[${format(new Date(Date.now()))}]:`;

        // Define the directory path for log files
        const logDir = "./logs";

        // Create the directory if it doesn't exist
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        // Generate a filename using the formatted timestamp
        const filename = `log_${this.startTime}.txt`;

        // Generate the full path to the log file
        const logFilePath = path.join(logDir, filename);
        switch (type) {
            // Check the message type and then print it in the console
            case "log": {
                fs.appendFile(logFilePath, `${date} ${type.toUpperCase()} ${content } \n`, (error) => {
                    if (error) {
                        console.error("Error writing to the log file: " + error.message);
                    }
                });
                return console.log(`${date} ${bgBlue(type.toUpperCase())} ${content} `);
            }
            case "warn": {
                fs.appendFile(logFilePath, `${date} ${type.toUpperCase()} ${content} \n`, (error) => {
                    if (error) {
                        console.error("Error writing to the log file: " + error.message);
                    }
                });
                return console.log(`${date} ${black.bgYellow(type.toUpperCase())} ${content} `);
            }
            case "error": {
                fs.appendFile(logFilePath, `${date} ${type.toUpperCase()} ${content} \n`, (error) => {
                    if (error) {
                        console.error("Error writing to the log file: " + error.message);
                    }
                });
                return console.log(`${date} ${black.bgRed(type.toUpperCase())} ${content} `);
            }
            case "debug": {
                fs.appendFile(logFilePath, `${date} ${type.toUpperCase()} ${content} \n`, (error) => {
                    if (error) {
                        console.error("Error writing to the log file: " + error.message);
                    }
                });
                return console.log(`${date} ${green(type.toUpperCase())} ${content} `);
            }
            case "cmd": {
                fs.appendFile(logFilePath, `${date} ${type.toUpperCase()} ${content} \n`, (error) => {
                    if (error) {
                        console.error("Error writing to the log file: " + error.message);
                    }
                });
                return console.log(`${date} ${black.bgWhite(type.toUpperCase())} ${content}`);
            }
            case "ready": {
                fs.appendFile(logFilePath, `${date} ${type.toUpperCase()} ${content} \n`, (error) => {
                    if (error) {
                        console.error("Error writing to the log file: " + error.message);
                    }
                });
                return console.log(`${date} ${black.bgGreen(type.toUpperCase())} ${content}`);
            }
            default:
                throw new TypeError(
                    "Logger type must be either warn, debug, log, ready, cmd, rest, or error."
                );
        }
    }
}
