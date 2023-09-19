FROM node:16.14.2

WORKDIR /usr/app

COPY package*.json ./
RUN npm install --force

COPY . .

RUN npx prisma generate 
RUN npm run build 

EXPOSE 3000

CMD ["npm", "run", "build"]