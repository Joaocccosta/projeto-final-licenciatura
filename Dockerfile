# Etapa de build do frontend
FROM node:20 as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Etapa final
FROM node:20
WORKDIR /app

# Copia o backend
COPY backend/ ./backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copia build do frontend para dentro do backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Define porta
EXPOSE 3000
CMD ["node", "backend/index.js"]