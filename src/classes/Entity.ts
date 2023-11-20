import { replyToPost, replyToPlay, replyToGame } from "../utils/functions";
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
    entityType: "play" | "post" | "game";
    entityId: number;
    constructor(body, client) {
        super(body, client);
        const parentComment = body.parentComment;
        this.entityType = body.playId ? "play" : body.postId ? "post" : "game";
        this.id = parentComment.id;
        this.userId = parentComment.userId;
        this.entityId =
            this.entityType === "play"
                ? body.playId
                : this.entityType === "post"
                ? body.postId
                : body.gameId;
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
        const obj = {
            groupId: this.groupId,
            text: text,
            parentCommentId: this.id,
            playerId: null,
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
            case "game": {
                return replyToGame(
                    this.entityId,
                    obj,
                    this.client,
                    this.sport,
                    group ? true : false
                ).catch((err) => {
                    throw err;
                });
            }
        }
    }
}
