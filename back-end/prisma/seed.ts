import { PrismaService } from '../src/prisma/prisma.service'; // Importe o seu serviço Prisma
import * as bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker';
import * as fakerbr from 'faker-br'
import { UserType } from '@prisma/client';

const TOTAL_RECORDS = 1000;

async function generateFakeData() {
  const prismaService = new PrismaService(); 

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = await bcrypt.hash(faker.internet.password(), 5);

    try {
      const client = await prismaService.user.create({
        data: {
          name,
          email,
          password,
          userType: UserType.CUSTOMER, 
        },
      });
      console.log(`Cliente criado: ${client.email}`);
    } catch (error) {
      console.error(`Erro ao criar cliente: ${error.message}`);
    }
  }

  prismaService.$disconnect();
}

generateFakeData();
