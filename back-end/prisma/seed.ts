import { PrismaService } from '../src/prisma/prisma.service'; // Importe o seu serviço Prisma
import * as bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker';
import * as fakerbr from 'faker-br'
import { UserType } from '@prisma/client';

const TOTAL_RECORDS = 1000; // Número de registros falsos a serem inseridos

async function generateFakeData() {
  const prismaService = new PrismaService(); // Substitua pelo seu serviço Prisma

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const cpf = fakerbr.br.cpf();
    const password = await bcrypt.hash(faker.internet.password(), 5);

    try {
      const client = await prismaService.user.create({
        data: {
          name,
          email,
          cpf,
          password,
          userType: UserType.CUSTOMER, // Defina o userType conforme necessário
        },
      });
      console.log(`Cliente criado: ${client.email}`);
    } catch (error) {
      console.error(`Erro ao criar cliente: ${error.message}`);
    }
  }

  prismaService.$disconnect(); // Desconecte-se do Prisma quando terminar
}

generateFakeData();
