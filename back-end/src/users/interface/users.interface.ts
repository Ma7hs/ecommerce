import { MovementType, UserType } from '@prisma/client';

export interface FilterUsers {
    userType?: UserType
}

export interface UserInfo {
    name: string;
    id: number;
    exp: number;
    iat: number;
}

export interface UpdateUsersParams {
    name?: string;
    password?: string;
    email?: string;
    photo?: string;
}

export interface MovementExtract {
    value: number
    movementType?: MovementType
    customerID: number
}