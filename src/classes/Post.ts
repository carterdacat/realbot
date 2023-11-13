import replyToPost from "../utils/replyToPost";
import Comment from "./Comment";
import Reply from "./Reply";
import User from "./User";
type reqObj = {
    groupId: number;
    text: string;
    parentCommentId: string;
};
export default class Post extends Comment {
    comments: any;
    postCreatedAt: string;
    constructor(body, client) {
        super(body, client);
        this.postId = body.parentComment.postId;
        this.postCreatedAt = body.parentComment.postCreatedAt;
        this.parentComment = body.parentComment;
        this.comments = body.comments;
        this.id = this.parentComment.id;
        this.groupId = this.parentComment.groupId;
        this.userId = this.parentComment.userId;
        this.parentCommentId = this.parentComment.parentCommentId;
        this.replyingToCommentId = this.parentComment.replyingToCommentId;
        this.replyingToUserId = this.parentComment.replyingToUserId;
        this.replyNum = this.parentComment.replyNum;
        this.content = this.parentComment.content;
        this.replyCount = this.parentComment.replyCount;
        this.depth = this.parentComment.depth;
        this.createdAt = this.parentComment.createdAt;
        this.sport = this.parentComment.sport;
        this.user = new User(this.parentComment.user);
        this.repliesDisabled = body.repliesDisabled;
    }
    async reply(text: string, group?: boolean): Promise<Reply> {
        const obj: reqObj = {
            groupId: this.groupId,
            text: text,
            parentCommentId: this.parentCommentId,
        };
        return replyToPost(this.postId, obj, this.client, group ? true : false).catch((err) => {
            throw err;
        });
    }
}
