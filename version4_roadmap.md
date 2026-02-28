# Roadmap Versión 4 🚀

Este documento detalla las iteraciones necesarias para completar la Versión 4. Debes pasarme estas instrucciones una a una para que yo las implemente y tú puedas realizar los commits correspondientes.

## 📋 Lista de Iteraciones

Cada iteración corresponde a un requisito específico y debe finalizar con un commit.

### 1. Paginación de Videojuegos
- **Instrucción**: "Implementa la paginación en la lista de videojuegos. El usuario debe poder seleccionar el número de juegos por página mediante un desplegable (MUI Select)."
- **Cambios**: Backend (Prisma skip/take), Frontend (Pagination controls).

### 2. Sistema de Votaciones (Backend)
- **Instrucción**: "Crea el modelo de Votos en la base de datos y los endpoints para que un usuario pueda dar Like o Dislike (solo un voto por usuario y juego)."
- **Cambios**: Prisma schema, nuevas rutas y controladores de votos.

### 3. Visualización y Ordenación por Popularidad
- **Instrucción**: "Muestra el conteo de likes/dislikes en las GameCards y añade una opción en el menú para ordenar el listado por popularidad (Likes - Dislikes)."
- **Cambios**: Frontend (Card UI, logic de ordenación).

### 4. Sistema de Comentarios (Básico)
- **Instrucción**: "Implementa la posibilidad de añadir comentarios a cada videojuego. Los comentarios deben guardarse en la base de datos asociados al usuario."
- **Cambios**: Modelo Comment, API de creación y visualización en GameDetails.

### 5. Gestión de Comentarios (Eliminación)
- **Instrucción**: "Permite que los usuarios borren sus propios comentarios (si no tienen respuestas) y que el admin pueda borrar cualquier comentario."
- **Cambios**: Lógica de permisos en backend y botón de borrado en frontend.

### 6. Reporte de Contenido Inapropiado
- **Instrucción**: "Añade la funcionalidad para que cualquier usuario pueda reportar un videojuego como inapropiado."
- **Cambios**: Campo `reported` en el modelo, botón de reporte en UI.

### 7. Panel de Administración de Reportes
- **Instrucción**: "Crea una ruta protegida solo para administradores que muestre la lista de juegos reportados y permita eliminarlos definitivamente."
- **Cambios**: Nueva página `AdminReports.jsx`, protección de ruta por rol, API de gestión de reportes.

---

## 🛠️ Cómo proceder
Copia la instrucción del punto **1** y envíamela cuando estés listo para empezar.
