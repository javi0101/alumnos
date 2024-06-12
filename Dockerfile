# Utiliza la imagen oficial de Node.js como base
FROM node:16

# Establece el directorio de trabajo en la aplicación
WORKDIR /usr/src/app

# Copia los archivos de la aplicación
COPY package*.json ./
COPY server.js ./
COPY public ./public
COPY views ./views
COPY models ./models

# Instala las dependencias de la aplicación
RUN npm install

# Expone el puerto en el que la aplicación se ejecuta
EXPOSE 3000

# Ejecuta la aplicación cuando el contenedor se inicia
CMD ["node", "server.js"]
