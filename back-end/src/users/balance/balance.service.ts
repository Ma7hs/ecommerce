import { Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { BalanceParams } from './interface/balance.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { MovementType } from '@prisma/client';
import { UserBalanceResponseDTO } from './dto/balance.dto';

@Injectable()
export class BalanceService {

    constructor(private readonly prismaService: PrismaService) { }

    async balanceCustomer({ email, value, movementType }: BalanceParams) {
        const customer = await this.findCustomer(email)

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
        } else {
            if (movementType === MovementType.DEPOSIT) {
                newBalance = balance.balance + movementExtract.value;
            } else if (movementType === MovementType.SPEND) {
                if (balance.balance === 0 || movementExtract.value > balance.balance) {
                    throw new MethodNotAllowedException('Transaction not allowed!');
                } else {
                    newBalance = balance.balance - movementExtract.value;
                }
            }
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
    
    async findCustomer(email: string){
        const user = await this.prismaService.user.findUnique({
            where: {
                email: email,
            },
        });
    
        if (!user) {
            throw new NotFoundException();
        }

        console.log(user)

        const customer = await this.prismaService.customer.findFirst({
            where: {
                userId: user.id,
            },
        });
    
        if (!customer) {
            throw new NotFoundException("Customer not found for the given user ID");
        }

        return customer
    }

}

