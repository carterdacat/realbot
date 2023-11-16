import { replyToPost, replyToPlay } from "../utils/functions";
import Comment from "./Comment";
import Reply from "./Reply";
import User from "./User";
type reqObj = {
    groupId: number;
    text: string;
    parentCommentId: string;
};
export default class Entitiy extends Comment {
    comments: any;
    postCreatedAt: string;
    playId: number;
    entityType: "play" | "post";
    entityId: number;
    constructor(body, client) {
        super(body, client);
        const parentComment = body.parentComment;
        this.entityType = body.playId ? "play" : "post";
        this.id = parentComment.id;
        this.userId = parentComment.userId;
        this.entityId = this.entityType === "play" ? body.playId : body.postId;
        this.parentCommentId = parentComment.parentCommentId;
        this.replyingToCommentId = parentComment.replyingToCommentId;
        this.replyingToUserId = parentComment.replyingToUserId;
        this.replyNum = parentComment.replyNum;
        this.content = parentComment.content;
        this.replyCount = parentComment.replyCount;
        this.depth = parentComment.depth;
        this.createdAt = parentComment.createdAt;
        this.sport = parentComment.sport;
        this.user = new User(parentComment.user);
        this.groupId = parentComment.groupId;
        this.repliesDisabled = parentComment.repliesClosed;
    }
    async reply(text: string, group?: boolean): Promise<Reply> {
        const obj: reqObj = {
            groupId: this.groupId,
            text: text,
            parentCommentId: this.id,
        };
        switch (this.entityType) {
            case "play": {
                return replyToPlay(this.entityId, obj, this.client, group ? true : false).catch(
                    (err) => {
                        throw err;
                    }
                );
            }
            case "post": {
                return replyToPost(this.entityId, obj, this.client, group ? true : false).catch(
                    (err) => {
                        throw err;
                    }
                );
            }
        }
    }
}
