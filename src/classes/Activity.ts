import Bot from "../main/Bot";
import { getPlay, getPost } from "../utils/functions";
import Entity from "./Entity";
import User from "./User";

export default class Activity {
    activity: any;
    id: string;
    userId: string;
    bumpedAt: string;
    type: "mention" | string;
    createdBy: User;
    sport: string;
    commentId: string;
    entity: "play" | "post";
    client: Bot;
    entityId: number;
    constructor(body, client) {
        this.client = client;
        this.activity = body;
        this.id = body.id;
        this.userId = body.userId;
        this.bumpedAt = body.bumpedAt;
        this.type = body.type;
        this.createdBy = new User(body.createdBy);
        this.sport = body.sport;
        this.commentId = body.commentId;
        this.entity = body.entity;
        this.entityId = body.contentId;
    }
    async getEntity(): Promise<Entity> {
        switch (this.entity) {
            case "play": {
                return await getPlay(this.client, this.entityId, this.commentId);
            }
            case "post": {
                return await getPost(this.client, this.entityId, this.commentId);
            }
        }
    }
}
