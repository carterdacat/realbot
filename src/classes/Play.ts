import { replyToPost } from "../utils/functions";
import replyToPlay from "../utils/replyToPlay";
import Comment from "./Comment";
import Reply from "./Reply";
import User from "./User";
type reqObj = {
    groupId: number;
    text: string;
    parentCommentId: string;
};
export default class Play extends Comment {
    comments: any;
    postCreatedAt: string;
    playId: number;
    constructor(body, client) {
        super(body, client);
        const comment = body.parentComment;
        this.id = comment.id;
        this.userId = comment.userId;
        this.playId = comment.playId;
        this.parentCommentId = body.comments[0].parentCommentId;
        this.replyingToCommentId = comment.replyingToCommentId;
        this.replyingToUserId = comment.replyingToUserId;
        this.replyNum = comment.replyNum;
        this.content = comment.content;
        this.replyCount = comment.replyCount;
        this.depth = comment.depth;
        this.createdAt = comment.createdAt;
        this.sport = comment.sport;
        this.user = new User(comment.user);
        this.groupId = comment.groupId;
        this.repliesDisabled = comment.repliesClosed;
    }
    async reply(text: string, group?: boolean): Promise<Reply> {
        const obj: reqObj = {
            groupId: this.groupId,
            text: text,
            parentCommentId: this.parentCommentId,
        };
        return replyToPlay(this.playId, obj, this.client, group ? true : false).catch((err) => {
            throw err;
        });
    }
}
