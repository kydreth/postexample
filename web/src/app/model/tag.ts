import {Deserializable} from './deserializable';

export class Tag implements Deserializable {
    id?: number;
    name?: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
