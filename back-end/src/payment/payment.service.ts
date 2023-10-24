import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PixRequestDTO } from './dto/pix.dto';

@Injectable()
export class PaymentService {
  async createOrderPix(requestBody: PixRequestDTO) {
    const url = 'https://sandbox.api.pagseguro.com/orders';
    const token = '4D928E6816FF4126B4C3CB4C5985154F';

    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
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
