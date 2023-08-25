import { UserType } from '@prisma/client';

export class FilterUsers {
    userType?: UserType
}

export class UpdateUsersParams {
    name?: string;
    password?: string;
    email?: string;
    photo?: string;
}