
import { User } from '../../src/models/user'

declare global {
    namespace Express {
        export interface Request {
            user?: User;
            jwt?: string;
        }
    }
}