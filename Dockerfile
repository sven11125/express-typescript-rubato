FROM node:15.11.0-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

COPY . /app

# Add FFMPEG
RUN apk add  --no-cache ffmpeg

# Add Libvips
RUN apk --update add make g++ 
RUN apk add libimagequant-dev --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main
RUN apk add vips-dev --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

RUN apk update && apk add bash

RUN npm install
EXPOSE 8080

RUN npm run build

# CMD npm run start
CMD ["npm", "run", "start"]
