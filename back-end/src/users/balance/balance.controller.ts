import { Body, Controller, Param, ParseEnumPipe, ParseFloatPipe, Patch, Post } from '@nestjs/common';
import { MovementType } from '@prisma/client';
import { UserBalanceDTO } from './dto/balance.dto';
import { BalanceService } from './balance.service';
import { BalanceParams } from './interface/balance.interface';

@Controller('users/balance')
export class BalanceController {

    constructor(private readonly balanceService: BalanceService){}

    @Post(':cpf/:movementType/:value')
    createBalance(
        @Param('cpf') cpf: string,
        @Param('movementType', new ParseEnumPipe(MovementType)) movementType: MovementType,
        @Param('value', ParseFloatPipe) value: number,
    ): Promise<UserBalanceDTO>{  
    return this.balanceService.balanceCustomer({cpf, movementType, value});
    }
}
