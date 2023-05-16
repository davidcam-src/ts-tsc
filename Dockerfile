FROM arm64v8/ubuntu

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 4000

CMD ["npm", "start"]