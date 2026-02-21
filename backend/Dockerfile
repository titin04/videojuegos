FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# We use nodemon for dev, but for docker we'll likely use node index.js
# Or a script that runs migrations then starts
CMD ["npm", "run", "dev"]
