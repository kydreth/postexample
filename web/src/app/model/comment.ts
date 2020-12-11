import {Deserializable} from './deserializable';
import {SimpleChanges} from '@angular/core';
import {User} from './user';

export class Comment implements Deserializable {
  id?: string;
  user?: User;
  // post?: Post;
  description?: string;

  // audit model
  createdAt?: any;
  updatedAt?: any;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
  onChanges(changes: SimpleChanges): void {
    // this.id = changes.comment.currentValue.id;
    console.log(changes);
  }
  getCreatedAtDate(): Date {
    if (this.createdAt) {
      return this.createdAt;
    }
  }
  displayDescription(): string {
    return this.description.replace(new RegExp('\n', 'g'), `<br />`);
  }
}
