import io from "socket.io-client";

const query = {
    socketType: "user",
    userId: "KnA6mEEJ",
    auth: "KnA6mEEJ!Y35g7vRG!801a60f9-9b0e-4811-b4f7-82cd53442a7b",
};

const socket = io("wss://web.realsports.io", {
    query: query,
    transports: ["websocket"],
});



socket.on("popup", function (msg) {
    console.log("hello: ", msg);
});

socket.on("connect", function () {
    console.log("Client connected to the server via Socket.IO");
    const engine = socket.io.engine
    engine.on("packet", ({ type, data }) => {
        const mentionRegEx = new RegExp('\"(UserActivityUpdated)\"');
        if (mentionRegEx.test(data)) {
            const cleanedData = data.replace(/^\d+\[/, "[");
            const dataArray = JSON.parse(cleanedData);
            console.log(dataArray);
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
        }
    })
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
