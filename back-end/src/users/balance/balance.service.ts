import { Injectable, NotFoundException } from '@nestjs/common';
import { BalanceParams } from './interface/balance.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { MovementType } from '@prisma/client';
import { UserBalanceDTO, UserBalanceResponseDTO } from './dto/balance.dto';

@Injectable()
export class BalanceService {

    constructor(private readonly prismaService: PrismaService) { }

    async balanceCustomer({ cpf, value, movementType }: BalanceParams) {
        const user = await this.prismaService.user.findUnique({
            where: {
                cpf: cpf,
            },
        });

        if (!user) {
            throw new NotFoundException();
        }

        const customer = await this.prismaService.customer.findFirst({
            where: {
                userId: user.id,
            },
        });

        if (!customer) {
            throw new NotFoundException("Customer not found for the given user ID");
        }

        const movementExtract = await this.prismaService.movementExtract.create({
            data: {
                movementType: movementType,
                value: value,
                customerId: customer.id,
            },
        });

        let newBalance = 0;

        const balance = await this.prismaService.balance.findFirst({
            where: {
                customerId: movementExtract.customerId,
            },
        });

        if (!balance) {
            await this.prismaService.balance.create({
                data: {
                    balance: movementExtract.value,
                    customerId: movementExtract.customerId,
                },
            });
            newBalance = movementExtract.value;
        }
        
        if (movementType === MovementType.DEPOSIT) {
            newBalance = balance.balance + movementExtract.value;
        } else if (movementType === MovementType.SPEND) {
            newBalance = balance.balance - movementExtract.value;
        }

        await this.prismaService.balance.updateMany({
            data: {
                balance: newBalance,
            },
            where: {
                customerId: movementExtract.customerId,
            },
        });
        


        return new UserBalanceResponseDTO(movementExtract);
    }



}

