import Comment from "./Comment"
import User from "./User"
export default class Reply extends Comment{
    playId: number
    constructor(body, client) {
        super(body, client)
        const comment = body.comment
        this.id = comment.id
        this.userId = comment.userId
        this.postId = comment.postId
        this.playId = comment.playId
        this.parentCommentId = comment.parentCommentId
        this.replyingToCommentId = comment.replyingToCommentId
        this.replyingToUserId = comment.replyingToUserId
        this.replyNum = comment.replyNum
        this.content = comment.content
        this.replyCount = comment.replyCount
        this.depth = comment.depth
        this.createdAt = comment.createdAt
        this.sport = comment.sport
        this.user = new User(comment.user)
        this.groupId = comment.groupId
        this.repliesDisabled = comment.repliesClosed
    }
}