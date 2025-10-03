FROM node:20-alpine

# install build tools for sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# copy package.json first
COPY package*.json ./

# install inside container (ensures sqlite3 builds correctly for Linux)
RUN npm install

# copy source code
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
