import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CartsByUser, StatusCart } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDTO } from './dto/cart.dto';
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

  async createCartByUser({ products }: CreateCartParams, id: number) {
    const status: StatusCart = 'ACTIVE'; // Defina o status como 'ACTIVE' por padrão

    const user = await this.prismaService.user.findUnique({
      where: {
        id: id
      }
    });

    if (!user) {
      throw new NotFoundException();
    }

    const customer = await this.prismaService.customer.findFirst({
      where: {
        userId: user.id
      }
    });

    const findProducts = await this.prismaService.product.findMany({
      where: {
        id: {
          in: products
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
    } else {
      const cartTotalValue = findProducts.reduce((total, product) => {
        return total + product.price;
      }, 0);

      if (cartTotalValue > verifyBalance.balance) {
        throw new UnauthorizedException("Insufficient balance");
      }

      const cart = await this.prismaService.cartsByUser.create({
        data: {
          customerId: customer.id,
          status: status // Use o status definido anteriormente
        },
      });

      for (const product of findProducts) {
        await this.prismaService.productsByCart.create({
          data: {
            cartsByUserId: cart.id,
            productId: product.id,
            qntd: 1,
            total_value: product.price,
          },
        });
      }

      return 'Cart has been created'
      
    }
  }


  async getCartsByUser(id: number) {

    const user = await this.prismaService.user.findFirst({
      where: {
        id: id
      }
    })

    if(!user){
      throw new NotFoundException('User not found in our system!')
    }

    const carts = await this.prismaService.cartsByUser.findMany({
      where: {
        customerId: user.id,
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
        customer: {
          select: {
            balance: {
              select: {
                balance: true
              }
            }
          }
        }
      },
    });

    const transformedCarts = carts.map((cart) => ({
      id: cart.id,
      cart: {
        status: cart.status,
        products: cart.ProductsByCart,
      },
    }));

    return transformedCarts;
  }

  async updateStatusCart({ userId, cartId, status }: UpdateCartStatus) {

    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId
      }
    })

    const customer = await this.prismaService.customer.findFirst({
      where: {
        userId: user.id
      }
    })

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

