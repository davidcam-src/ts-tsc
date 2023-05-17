FROM --platform=linux/arm64 node:19.5.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 4000

CMD ["npm", "start"]

