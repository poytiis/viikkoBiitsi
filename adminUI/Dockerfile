FROM node:18-alpine AS builder
WORKDIR /app
ENV NODE_ENV development
ENV REACT_APP_API_URL=http://localhost:8081/

COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf