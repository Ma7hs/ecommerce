import { MovementType } from '@prisma/client';

export class BalanceParams {
    email: string;
    value: number
    movementType: MovementType
}