# Etapa de build do frontend
FROM node:20-alpine as frontend-builder
WORKDIR /app/dashboard
COPY dashboard/package*.json ./
RUN npm install
COPY dashboard/ .
RUN npm run build

# Etapa final
FROM node:20-alpine
WORKDIR /app

# Copia o backend
COPY api/ ./api
COPY api/package*.json ./api/
RUN cd api && npm install

# Copia build do frontend para dentro do backend
COPY --from=frontend-builder /app/dashboard/dist ./dashboard/dist

# Define portas
EXPOSE 3000 25565

# Inicia o backend primeiro e mantém o container ativo
CMD ["sh", "-c", "node api/index.js & tail -f /dev/null"]