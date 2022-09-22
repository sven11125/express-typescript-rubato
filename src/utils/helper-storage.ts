import { createUid } from './helpers';
import * as admin from 'firebase-admin';
import { Config } from './config';

export const uploadImageToStorage = async (storagePath: string, base64Image: string, customExtention = ''): Promise<any> => {

    const photoPath = storagePath + createUid() + customExtention;

    // Save the base64 to storage.
    const file = admin.storage().bucket(Config.storageBucket).file(photoPath);

    await file.save(new Buffer(base64Image, 'base64'), {
        metadata: { contentType: base64MimeType(base64Image) },
        public: true,
        validation: 'md5',
    })

    return file;
}

const base64MimeType = (encoded: any) => {
    let result = null;
    if (typeof encoded !== 'string') {
        return result;
    }
    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
        result = mime[1];
    }
    return result;
}