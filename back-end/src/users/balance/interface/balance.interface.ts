import { MovementType } from '@prisma/client';

export class BalanceParams {
    cpf: string;
    value: number
    movementType: MovementType
}