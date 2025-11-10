FROM node:22.17.0

ENV NODE_ENV=staging

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

COPY .env.development .env

RUN npm install

# Jalankan command dibawah jika ada update pada file seed
# RUN npm run generate:dev && \
#     npm run push-force:dev && \
#     npm run seed:dev

EXPOSE 3000
CMD ["npm", "run", "dev"]