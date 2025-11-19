FROM node:22-alpine

WORKDIR /app
COPY components components
COPY lib lib
COPY models models
COPY public public
COPY scripts scripts
COPY src src
COPY types types
COPY eslint.config.mjs ./
COPY next.config.ts ./
COPY package.json ./
COPY postcss.config.mjs ./
COPY tsconfig.json ./
COPY logo.webp ./

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]