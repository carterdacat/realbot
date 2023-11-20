import fs, { readdir } from "fs";
import dotenv from "dotenv";
import Bot from "./main/Bot";
import path, { join } from "path";

dotenv.config();

const client = new Bot();

const start = async () => {
    client.login();

    readdir(join(__dirname, "./events"), (_, files: string[]) => {
        client.logger.log(`Loading a total of ${files.length} events.`, "log");
        files.forEach(async (file) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const eventName: any = file.split(".")[0];
            client.logger.log(`Loading Event: ${eventName}`);
            const event = new (require(join(__dirname, `./events/${file}`)))(client);
            client.on(eventName, (...args) => {
                event.run(...args);
            });
            delete require.cache[require.resolve(join(__dirname, `./events/${file}`))];
        });
    });
};

const test = async () => {
    /*const postCommentPath = "./examples/replyRes.json";

    // Read the JSON data from the file

    const postCommentData = fs.readFileSync(postCommentPath, "utf8");

    // Parse the JSON data into an object
    const postComment = JSON.parse(postCommentData);

    // Create an instance of the Mention class with the parsed JSON data
    const mention = new Mention(postComment, client);*/

    let activty = await client.getActivity(5357490);
    const entity = await activty.getEntity()
    entity.reply("test!")
};

start();
//start();

client.on("disconnect", () => {
    client.socket.connect();
    client.logger.log("Client Disconnected", "warn");
    client.login()
});

client.on("connect_error", (err) => {
    const errorMessage = JSON.stringify(err, null, 2);

    // Log to the console
    client.logger.log(err.message, "error");

    // Generate a formatted timestamp (e.g., "2023-10-31_153024")
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");

    // Define the directory path for log files
    const logDir = "./logs/connection";

    // Create the directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    // Generate a filename using the formatted timestamp
    const filename = `connect_error_log_${timestamp}.txt`;

    // Generate the full path to the log file
    const logFilePath = path.join(logDir, filename);

    // Log the error message to the file
    fs.appendFile(logFilePath, errorMessage, (error) => {
        if (error) {
            console.error("Error writing to the log file: " + error.message);
        }
    });
});

process.on("unhandledRejection", (err: Error) => {
    // Log to the console
    client.logger.log(err.message, "error");

    // Generate a formatted timestamp (e.g., "2023-10-31_153024")
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");

    // Define the directory path for log files
    const logDir = "./logs/system";

    // Create the directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    // Generate a filename using the formatted timestamp
    const filename = `unhandledRejection_log_${timestamp}.txt`;

    // Generate the full path to the log file
    const logFilePath = path.join(logDir, filename);

    // Log the error message to the file
    fs.appendFile(logFilePath, err.stack, (error) => {
        if (error) {
            console.error("Error writing to the log file: " + error.message);
        }
    });
});

process.on("uncaughtException", (err: Error) => {
    // Log to the console
    client.logger.log(err.message, "error");

    // Generate a formatted timestamp (e.g., "2023-10-31_153024")
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");

    // Define the directory path for log files
    const logDir = "./logs/system";

    // Create the directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    // Generate a filename using the formatted timestamp
    const filename = `uncaughtException_log_${timestamp}.txt`;

    // Generate the full path to the log file
    const logFilePath = path.join(logDir, filename);

    // Log the error message to the file
    fs.appendFile(logFilePath, err.stack, (error) => {
        if (error) {
            console.error("Error writing to the log file: " + error.message);
        }
    });
});

process.on("exit", (code) => {
    client.logger.log(`About to exit with code: ${code}`, "log");
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
  "message": "[ryan_mountaincastle] yesorno mentioned you in a post comment",
  "path": "/v5ijHe7vL79HQdbV/5357490",
  "activityInfo": {
    "bumpedAt": "2023-11-15T15:57:20.565Z",
    "count": 1
  },
  "userId": "KnA6mEEJ"
}
            GET GROUP
            https://web.realsports.io/comments/groups/16494/replies/4621013?limit=10
            GET COMMENT POST
            https://web.realsports.io/comments/posts/99313/replies/5014904?limit=10   
            REPLY (POST)
            https://web.realsports.io/comments/posts/99313
            */
