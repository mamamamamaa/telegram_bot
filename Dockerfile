FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 9999

CMD ["node", "dist/main.js"]

HEALTHCHECK --interval=15s --timeout=3s --start-period=15s CMD curl -f https://first-tg-bot.onrender.com/health