import {Deserializable} from './deserializable';
import {Tag} from './tag';
import {User} from './user';
import {Comment} from './comment';
import {SimpleChanges} from '@angular/core';

export class Post implements Deserializable {
    id?: string;
    user?: User;
    title: string;
    description: string;
    businessCase?: string;
    active?: boolean;
    comments?: Comment[];
    tags?: Tag[];
    status?: any; // TODO: enforce Post.StatusEnum

    // audit model
    createdAt?: Date;
    updatedAt?: Date;

    deserialize(input: any) {
        Object.assign(this, input);
        this.user = new User().deserialize(input.user);
        // TODO: comments
        if (this.comments) {
            console.error('Post.deserialize', this.comments);
        }
        // TODO: tags
        if (this.tags) {
            console.error('Post.deserialize', this.tags);
        }
        // TODO: status
        if (this.status) {
            console.error('Post.deserialize', this.status);
        }
        return this;
    }
    displayStatus(): string {
        // console.log(this.status);
        // console.log(Post.Statuses);
        return 'Draft'; // TODO: display status
    }
    onChanges(changes: SimpleChanges): void {
        // this.id = changes.selectedPost.currentValue.id;;
        console.log(changes);
    }
}
export namespace Post {
    export type StatusEnum = 'STATUS_DRAFT' | 'STATUS_SUBMITTED' | 'STATUS_REVIEWED' | 'STATUS_IN_PROGRESS' | 'STATUS_COMPLETED' |
      'STATUS_DEPLOYED' | 'STATUS_ARCHIVED';
    export const Statuses: { [key: string]: StatusEnum } = {
        Draft: 'STATUS_DRAFT' as StatusEnum,
        Submitted: 'STATUS_SUBMITTED' as StatusEnum,
        Reviewed: 'STATUS_REVIEWED' as StatusEnum,
        InProgress: 'STATUS_IN_PROGRESS' as StatusEnum,
        Completed: 'STATUS_COMPLETED' as StatusEnum,
        Deployed: 'STATUS_DEPLOYED' as StatusEnum,
        Archived: 'STATUS_ARCHIVED' as StatusEnum
    };
}
