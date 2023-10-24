export interface PixRequestDTO {
    reference_id: string;
    customer: {
      name: string;
      email: string;
      tax_id: string;
      phones: {
        country: number;
        area: number;
        number: number;
        type: string;
      }[];
    };
    items: {
      name: string;
      quantity: number;
      unit_amount: number;
    }[];
    qr_codes: {
      amount: {
        value: number;
      };
      expiration_date: string;
    }[];
    shipping: {
      address: {
        street: string;
        number: string;
        complement: string;
        locality: string;
        city: string;
        region_code: string;
        country: string;
        postal_code: string;
      };
    };
    notification_urls: string[];
  }
  