FROM node:latest

WORKDIR /app

COPY package*.json ./

COPY . .

RUN rm -rf node_modules package-lock.json


RUN npm install

EXPOSE 4000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4000"]