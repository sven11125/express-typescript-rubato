import { UserLight } from '../models/user-light';
import { User } from '../models/user';
import { RouteError } from './route-error';
import { mongoDb } from './helpers-mongo';

export const createUserLight = (user: User) => {
    const userLight: UserLight = {
        uid: user.uid,
        username: user.username,
        mediaLinks: user.mediaLinks,
        bio: user.bio,
    };
    return userLight;
}

/**
 * Returns undefined if there's no user.
 */
export const fetchUser = async (uid: string): Promise<User> => {
    let user = await mongoDb.collection<User | null>('users').findOne({ uid })
    if (!user) {
        throw new RouteError('no-user', 'No user exists.')
    }
    return user;
}
