import {Entity, EntityKeys, EntityLike} from "../types/index.js";

export const isKeyOf =
    <T extends EntityLike<T>,
        Keys extends EntityKeys<T>
    >({fieldKeys}: Entity<T>) =>
        (key: PropertyKey): key is Keys => key in fieldKeys;