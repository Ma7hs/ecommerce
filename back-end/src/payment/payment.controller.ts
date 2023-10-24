// pix.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PixRequestDTO } from './dto/pix.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly pixService: PaymentService) {}

  @Post('pix')
  async createOrder(
    @Body() requestBody: PixRequestDTO) {
    return this.pixService.createOrderPix(requestBody);
  }
}
