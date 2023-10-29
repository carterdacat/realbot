const axios = require("axios");

const adress = "https://web.realsports.io/comments/groups/16494";

const data = {
    groupId: 16494,
    text: "WHO",
    parentCommentId: null,
};
const defaultAdress = "https://web.realsports.io/comments/";
const headers = {
    headers: {
        "Real-Auth-Info": "KnA6mEEJ!wGRopY5A!25b46d5d-671d-40a8-a1c7-b2807fe97c68",
    },
};
const adress2 = "https://web.realsports.io/activity";
const sendMessage = () => {
    axios
        .get(adress2, headers)
        .then((res) => {
            console.log(res)
            if (res.data.activities[0].type === "mention") {
                axios
                    .post(
                        `${defaultAdress}${res.entity === "group" ? "groups" : "groups"}/${
                            res.data.activities[0].groupId
                        }`,
                        {
                            groupId: 16494,
                            text: `Hello! the time is ${Date.now()}`,
                            parentCommentId: null,
                        },
                        headers
                    )
                    .then((res) => console.log(res.data))
                    .catch((err) => console.error(err));
            }
        })
        .catch((err) => console.error(err));
};

var i = 1; 

function myLoop() {
    setTimeout(function () {
        sendMessage();
        i++; 
        if (i < 10) {
            myLoop(); 
        } 
    }, 3000);
}

myLoop();

/*{
    id: '29149674',
    userId: 'KnA6mEEJ',
    version: 1,
    bumpedAt: '2023-10-29T18:43:57.746Z',
    type: 'mention',
    entity: 'group',
    createdBy: {
      id: '7Jk5PAj3',
      userName: 'realbot2',
      avatarKey: null,
      flairId: null,
      isVerified: false,
      supporterTier: null,
      realProTier: null,
      entityAvatars: null
    },
    sport: null,
    contentId: 16494,
    commentId: '4547926',
    additionalInfo: {
      avatar: null,
      entity: 'group',
      comment: {
        id: '4547926',
        depth: 0,
        sport: null,
        detail: null,
        filter: 'clean',
        userId: '7Jk5PAj3',
        content: [Object],
        groupId: 16494,
        numEdits: 0,
        priority: null,
        replyNum: null,
        createdAt: '2023-10-29T18:43:57.734Z',
        deletedAt: null,
        flaggedAt: null,
        replyCount: 0,
        pinPriority: null,
        priorityType: null,
        repliesClosed: false,
        priorityAvatar: null,
        attributionInfo: null,
        parentCommentId: null,
        replyingToUserId: null,
        replyingToReplyNum: null,
        replyingToCommentId: null
      },
      entityId: '16494',
      avatarSource: null
    },
    section: null,
    groupId: 16494,
    deletedAt: null
  }*/
