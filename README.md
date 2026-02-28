# Proyecto de Videojuegos 🎮

Este es un proyecto full-stack para la gestión de videojuegos, desarrollado con React (Frontend) y Node.js/Express/MongoDB (Backend).

## 🚀 Cómo iniciar el proyecto

Sigue estos pasos para poner en marcha la aplicación:

### 1. Requisitos previos
- Tener instalado **Docker** y **Docker Compose**.
- Tener instalado **Node.js** (v18 o superior) y **npm**.

### 2. Levantar el Backend (Base de Datos y API)
El backend está contenedorizado con Docker para facilitar su despliegue y configuración de MongoDB.

Desde la carpeta raíz del proyecto, ejecuta:
```bash
docker-compose up -d
```
Esto levantará:
- **MongoDB**: En el puerto `27017` (configurado con Replica Set para Prisma).
- **Node.js API**: En el puerto `3000`.

*Nota: La primera vez puede tardar unos minutos mientras se descargan las imágenes y se instala todo.*

### 3. Levantar el Frontend (React)
Una vez que el backend esté corriendo:

1. Entra en la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en **http://localhost:5173**.

---

## 🔑 Credenciales de Acceso (Test)

Para entrar y ver los videojuegos, necesitas iniciar sesión. Puedes usar estas credenciales:

- **Email**: `admin@test.com`
- **Contraseña**: `admin123`

---

## 🛠️ Tecnologías utilizadas

- **Frontend**: React, Material UI, Vite, React Router, Axios.
- **Backend**: Node.js, Express, Prisma ORM, JWT, MongoDB.
- **Infraestructura**: Docker, Docker Compose.
