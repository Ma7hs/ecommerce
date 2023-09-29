import { Body, Controller, Param, ParseEnumPipe, ParseFloatPipe, Patch, Post } from '@nestjs/common';
import { MovementType } from '@prisma/client';
import { UserBalanceDTO } from './dto/balance.dto';
import { BalanceService } from './balance.service';

@Controller('users/balance')
export class BalanceController {

    constructor(private readonly balanceService: BalanceService){}

    @Post('/:movementType')
    createBalance(
        @Param('movementType', new ParseEnumPipe(MovementType)) movementType: MovementType,
        @Body() {email, value}: UserBalanceDTO
    ): Promise<UserBalanceDTO> {  
        console.log(movementType)
        return this.balanceService.balanceCustomer({email, movementType, value});
    }

}
