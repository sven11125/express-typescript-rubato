import * as configLoader from 'config'

export let Config: ConfigI;

export const loadConfig = () => {
    const configLoadeded = configLoader.util.toObject() as any
    Config = configLoadeded
}

export interface ConfigI {
    productName: string;
    productId: string;
    clientEmail: string;
    privateKey: string;
    storageBucket: string;
    googleCloudApiKey: string;
    jwtSecret: string;
    dummyProfilePhotos: Array<string>;
    monogUrl: string;
    mongoDatabase: string;
}

export const isProduction = () => {
    return process.env.NODE_ENV === 'production'
}
