import { MediaLink } from '../models/media-link';
import { Config } from './config';

export const randomDummyProfilePhoto = (): MediaLink => {
    const randomPhotoUrl = Config.dummyProfilePhotos[Math.floor(Math.random() * Config.dummyProfilePhotos.length)];
    return {
        url: randomPhotoUrl,
        type: 'photo',
    }
}


export const addDummyIfNoPhotos = (mediaLinks: Array<MediaLink>): Array<MediaLink> => {
    if (mediaLinks) {
        if (Array.isArray(mediaLinks)) {
            if (mediaLinks.length === 0) {
                mediaLinks.push(randomDummyProfilePhoto())
            }
            return mediaLinks;
        } else {
            mediaLinks = [];
            mediaLinks.push(randomDummyProfilePhoto())
            return mediaLinks;
        }
    }
    return [randomDummyProfilePhoto()];
}