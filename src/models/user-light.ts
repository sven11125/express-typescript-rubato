import { MediaLink } from './media-link'

export interface UserLight {
    uid: string,
    username: string,
    bio: string,
    mediaLinks: MediaLink[],
}
