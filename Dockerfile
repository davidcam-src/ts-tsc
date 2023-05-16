FROM node:16-alpine3.14

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 4000

CMD ["npm", "start"]

# Specify the architecture as arm64
FROM --platform=linux/arm64/v8 node:16-alpine3.14
