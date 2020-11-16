FROM buildkite/puppeteer:latest
WORKDIR /usr/src/app

ENV PORT 8080
EXPOSE 8080

# COPY package.json .
# COPY static .
# COPY index.js .

COPY . .

# Instalando dependências do backend
RUN npm i
RUN npm install puppeteer --unsafe-perm=true --allow-root

# Instalando dependências do frontend
RUN cd frontend && npm i && npm run build

# Criando build de produção do frontend
RUN mv /usr/src/app/frontend/build /usr/src/app/static

# Removendo itens do build que não são necessários
RUN rm -Rf /usr/src/app/frontend && cd /usr/src/app

CMD ["node", "./index.js"]