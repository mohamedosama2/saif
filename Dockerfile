# Installing dependencies:
 
FROM node:14-alpine3.14 AS install-dependencies
 
WORKDIR /user/src/app
 
COPY package.json package-lock.json ./
 
RUN npm ci --force 
 
COPY . .
 
 
# Creating a build:
 
FROM node:14-alpine3.14 AS create-build
 
WORKDIR /user/src/app
 
COPY --from=install-dependencies /user/src/app ./
 
RUN npm run build
 
USER node
 
 
# Running the application:
 
FROM node:14-alpine3.14 AS run
 
WORKDIR /user/src/app
 
COPY --from=install-dependencies /user/src/app/node_modules ./node_modules
COPY --from=create-build /user/src/app/dist ./dist
COPY package.json ./
 
CMD ["npm", "run", "start:prod"]
