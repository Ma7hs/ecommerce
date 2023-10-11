import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MovementType} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartParams, UpdateCartStatus } from './interface/cart.interface';

const selectProducts = {
  name: true,
  photo: true,
  description: true,
  price: true,
  productType: true,
}

@Injectable()
export class CartService {

  constructor(private readonly prismaService: PrismaService) { }

  private async findUserById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id
      }
    })

    if (!user) {
      throw new NotFoundException();
    }

    return user
  }

  private async findCustomerById(id: number) {
    const customer = await this.findUserById(id)
    return await this.prismaService.customer.findFirst({
      where: {
        userId: customer.id
      }
    })

  }
  
  async createCartByUser({ products, status = 'ACTIVE' }: CreateCartParams, userId: number) {
    const customer = await this.findCustomerById(userId);
    console.log(customer);

    const idProducts = products.map((i) => i[0]);

    const findProducts = await this.prismaService.product.findMany({
      where: {
        id: {
          in: idProducts
        }
      }
    });

    const verifyBalance = await this.prismaService.balance.findFirst({
      where: {
        customerId: customer.id
      }
    });

    if (!verifyBalance || verifyBalance.balance === 0) {
      throw new UnauthorizedException("Without balance");
    }

    let cartTotalValue = 0;


    const cart = await this.prismaService.cartsByUser.create({
      data: {
        customerId: customer.id,
        status: status
      },
    });

    for (const product of findProducts) {
      const findProduct = products.find((p) => p[0] === product.id);

      if (!findProduct) {
        throw new NotFoundException();
      } else {
        const productQntd = findProduct[1];
        const totalValue = product.price * productQntd;

        if (totalValue > verifyBalance.balance) {
          throw new UnauthorizedException("Transaction not authorized: Insufficient balance");
        }

        cartTotalValue += totalValue;

        await this.prismaService.productsByCart.create({
          data: {
            cartsByUserId: cart.id,
            productId: product.id,
            qntd: productQntd,
            total_value: totalValue,
          },
        });
      }
    }

    if (cartTotalValue > verifyBalance.balance) {
      throw new UnauthorizedException("Transaction not authorized: Insufficient balance");
    }

    await this.prismaService.movementExtract.create({
      data: {
        movementType: MovementType.SPEND,
        value: cartTotalValue,
        customerId: customer.id,
      },
    });

    const newBalance = verifyBalance.balance - cartTotalValue;

    await this.prismaService.balance.updateMany({
      data: {
        balance: newBalance,
      },
      where: {
        customerId: customer.id,
      },
    });

    return 'Cart has been created';
  }

  async getCartsByUser(id: number) {
    const customer = await this.findCustomerById(id);
    console.log(customer);

    const findShoppingCart = await this.prismaService.cartsByUser.findFirst({
        where: {
            customerId: customer.id
        }
    });

    if (!findShoppingCart) {
        throw new NotFoundException("User without carts");
    }

    const carts = await this.prismaService.cartsByUser.findMany({
        where: {
            customerId: customer.id,
        },
        select: {
            id: true,
            customerId: true,
            status: true,
            ProductsByCart: {
                select: {
                    product: {
                        select: {
                            ...selectProducts
                        },
                    },
                    qntd: true,
                    total_value: true,
                }, 
            },
            created_at: true
        },
    });

    const transformedCarts = carts.map((cart) => ({
        id: cart.id,
        cart: {
            status: cart.status,
            products: cart.ProductsByCart,
            total: cart.ProductsByCart.reduce((total, product) => total + product.total_value, 0)
        },
    }));

    return transformedCarts;
  }

  async updateStatusCart({id ,cartId, status }: UpdateCartStatus) {

    const customer = await this.findCustomerById(id)

    const cart = await this.prismaService.cartsByUser.findUnique({
      where: {
        id: cartId,
        customerId: customer.id
      }
    })

    if (!cart) {
      throw new NotFoundException()
    }

    await this.prismaService.cartsByUser.update({
      data: {
        status: status
      },
      where: cart
    })

    return "Status has been updated"

  }
  

}

