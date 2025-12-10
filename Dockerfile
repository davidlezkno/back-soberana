FROM public.ecr.aws/docker/library/node:18

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Install pm2 globally
RUN npm install pm2 -g

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application with pm2
CMD [ "pm2-runtime", "start", "npm", "--", "start:prod" ]

