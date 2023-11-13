import User from "./User";
import axios from "axios";
import Bot from "../main/Bot";
import { getPost, replyToPost } from "../utils/functions";
import Reply from "./Reply";

type contentObj = {
    nodes: [
        {
            type: Text;
            children: [
                {
                    text: string;
                    type: string;
                }
            ];
        }
    ];
};

export default class Comment {
    id: string;
    postId: number
    parentComment: any;
    userId: string;
    groupId: number;
    parentCommentId: string | null;
    replyingToCommentId: string | null;
    replyingToUserId: string | null;
    replyNum: number | null;
    content: contentObj;
    replyCount: number;
    depth: number;
    createdAt: string;
    sport: string;
    user: User;
    repliesDisabled: boolean;
    client: any;
    body: any;
    constructor(body, client) { 
        this.body = body
        this.client = client
    }
}

/*
Receive mention/reply
Fetch activity and match Id to activity?
read message data
reply()
*/
