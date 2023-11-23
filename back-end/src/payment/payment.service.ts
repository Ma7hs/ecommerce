import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PixRequestDTO } from './dto/pix.dto';

@Injectable()
export class PaymentService {
  async createOrderPix(requestBody: PixRequestDTO) {
    const url = 'https://sandbox.api.pagseguro.com/orders';
    const token = 'D45AC97034604500BE131589914021B5';

    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responsePix = {
        copy: response.data.qr_codes[0].text,
        qrcode: response.data.qr_codes[0].links[0].href
      }

      return responsePix;
      
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
