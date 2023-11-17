import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MovementType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartParams, UpdateCartStatus } from './interface/cart.interface';
import { FilterCarts } from './interface/filters.interface';

const selectProducts = {
  name: true,
  photo: true,
  description: true,
  price: true,
  productType: true,
}

const selectCarts = {
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
  preparationTime: true,
  created_at: true,
  customer: {
    select: {
      user: {
        select: {
          email: true
        }
      }
    }
  }
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
  };

  private async findCustomerById(id: number) {
    const customer = await this.findUserById(id)
    return await this.prismaService.customer.findFirst({
      where: {
        userId: customer.id
      }
    })
  };

  async createCartByUser({ products, status = 'ACTIVE', preparationTime }: CreateCartParams, userId: number) {
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
        status: status,
        preparationTime: preparationTime
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

    return { message: "Cart has been created", statusCode: 201 };
  };

  async getCartsByUser(id: number) {
    const customer = await this.findCustomerById(id);

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
        customerId: customer.id
      },
      select: {
        ...selectCarts
      },
    });

    const transformedCarts = carts.map((cart) => ({
      id: cart.id,
      cart: {
        status: cart.status,
        products: cart.ProductsByCart,
        total: cart.ProductsByCart.reduce((total, product) => total + product.total_value, 0)
      },
      preparationTime: cart.preparationTime,
      createdAt: cart.created_at
    }));

    return transformedCarts;
  };

  async getCartById(id: number) {
    const cart = await this.prismaService.cartsByUser.findUnique({
      where: {
        id: id
      }
    })

    if (!cart) {
      throw new NotFoundException()
    }

    const findCart = await this.prismaService.cartsByUser.findUnique({
      where: {
        id: id
      },
      select: {
        ...selectCarts
      }
    })



    const totalValue = findCart.ProductsByCart.reduce((total, product) => total + product.total_value, 0);

    const transformedCart = {
      id: findCart.id,
      customerEmail: findCart.customer.user.email,
      status: findCart.status,
      products: findCart.ProductsByCart,
      total: totalValue,
      preparationTime: findCart.preparationTime,
      createdAt: findCart.created_at
    };

    return transformedCart;

  };

  async getCartWithPreparationTime() {
    const cartsWithPreparationTime = await this.prismaService.cartsByUser.findMany({
      select: {
        ...selectCarts
      },
      where: {
        preparationTime: {
          not: null,
        },
      },
    });
  
    const transformedCarts = await Promise.all(cartsWithPreparationTime.map(async (cart) => {
      const totalValue = cart.ProductsByCart.reduce((total, product) => total + product.total_value, 0);
      
      const transformedCart = {
        id: cart.id,
        customerEmail: cart.customer.user.email,
        status: cart.status,
        products: cart.ProductsByCart,
        total: totalValue,
        preparationTime: cart.preparationTime,
        createdAt: cart.created_at
      };
  
      return transformedCart;
    }));
  
    return transformedCarts;
  };
  

  async getCartWithStatusDisable() {
    const carts = await this.prismaService.cartsByUser.findMany({
      where: {
        status: {
          not: "ACTIVE"
        }
      },
      select: {
        ...selectCarts
      }
    })

    const transformedCart = carts.map(cart => ({
      id: cart.id,
      customerEmail: cart.customer.user.email,
      customerId: cart.customerId,
      status: cart.status,
      produtos: cart.ProductsByCart,
      preparationTime: cart.preparationTime,
      created_at: cart.created_at,
    }))

    return transformedCart

  }

  async updateStatusCart({ cartId, status }: UpdateCartStatus) {
    const cart = await this.prismaService.cartsByUser.findUnique({
      where: {
        id: cartId
      }
    });

    if (!cart) {
      throw new NotFoundException()
    };

    await this.prismaService.cartsByUser.update({
      data: {
        status: status
      },
      where: cart
    });

    return { message: "Status has been updated", statusCode: 201 }
  };
}

