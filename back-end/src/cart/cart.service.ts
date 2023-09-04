import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MovementType } from '@prisma/client';
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

  async createCartByUser({ products, status = 'ACTIVE' }: CreateCartParams, id: number) {

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

    const idProducts = products.map((i) => i[0])

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
    } else {
      const cartTotalValue = findProducts.reduce((total, product) => {
        return total + product.price;
      }, 0);

      if (cartTotalValue > verifyBalance.balance) {
        throw new UnauthorizedException("Insufficient balance");
      } else {

        const cart = await this.prismaService.cartsByUser.create({
          data: {
            customerId: customer.id,
            status: status
          },
        });

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

        for (const product of findProducts) {
          const findProduct = products.find((p) => p[0] === product.id);
          
          if(!findProduct){
            throw new NotFoundException()
          } else {
            const productQntd = findProduct[1];
            console.log(productQntd)
            await this.prismaService.productsByCart.create({
              data: {
                cartsByUserId: cart.id,
                productId: product.id,
                qntd: productQntd,
                total_value: product.price * productQntd,
              },
            });
          }
        }
        return 'Cart has been created'
      }
    }
}

  async getCartsByUser(id: number) {

    const user = await this.prismaService.user.findFirst({
      where: {
        id: id
      }
    })

    if (!user) {
      throw new NotFoundException('User not found in our system!')
    }

    const customer = await this.prismaService.customer.findFirst({
      where: {
        userId: user.id
      }
    });

    const findShoppingCart = await this.prismaService.cartsByUser.findFirst({
      where: {
        customerId: customer.id
      }
    })

    if(!findShoppingCart){
      throw new NotFoundException("User without carts")
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

