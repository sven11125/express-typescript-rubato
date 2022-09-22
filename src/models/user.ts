import { MediaLink } from './media-link'

export interface User {
    uid: string,
    username: string,
    email: string,
    birthDate?: string,
    gender?: string,
    phoneNumber?: string,
    address?: string,
    genre?: string[],
    mediaLinks: MediaLink[],
    mainPhoto?: string,
    photos?: string[],
    bio?: string,
    createdISO: string,
    lastOpenedAppISO: string,
    isBanned: boolean,
    isDeleted: boolean,
    /**
     * The user who reported this user + why.
     */
    reports: { [userUid: string]: string },
    role: 'standard' | 'admin',
    /**
     * Make sure to delete this.
     */
    password: string,
}