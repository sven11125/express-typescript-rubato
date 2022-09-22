import { MediaLink } from './media-link'

export interface Gig {
    gigId: string,
    title: string,
    genre: string[],
    description: string,
    tag: number,
    firstPackage: string,
    firstPrice: number,
    secondPackage?: string,
    secondPrice?: number,
    coverImage: string,
    gallery: string[],
    mediaLinks: MediaLink[]
}