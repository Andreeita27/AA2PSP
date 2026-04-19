# 🧠 Discord Backend API - NestJS

## 📌 Descripción del proyecto

Este proyecto consiste en el desarrollo de una API REST utilizando **NestJS** que simula el funcionamiento de una plataforma de comunicación en tiempo real inspirada en Discord.

La aplicación permite gestionar:

* Usuarios
* Servidores (Guilds)
* Canales
* Mensajes

Además, se ha implementado lógica de negocio para permitir que los usuarios se unan a servidores y canales, replicando un comportamiento realista de este tipo de aplicaciones.

---

## 🎯 Objetivo

El objetivo principal es construir un backend robusto que:

* Siga una arquitectura REST completa
* Gestione correctamente las relaciones entre entidades
* Controle el acceso mediante autenticación JWT
* Garantice la integridad de los datos
* Sea desplegable mediante Docker

---

## 🛠️ Tecnologías utilizadas

* **NestJS** → Framework backend
* **TypeScript** → Lenguaje principal
* **Prisma ORM** → Gestión de base de datos
* **PostgreSQL** → Base de datos
* **Docker / Docker Compose** → Contenerización
* **JWT (JSON Web Tokens)** → Autenticación
* **Swagger** → Documentación de la API

---

## 🧱 Arquitectura

La aplicación sigue una arquitectura basada en módulos propia de NestJS:

* `auth` → Autenticación y JWT
* `users` → Gestión de usuarios
* `servers` → Gestión de servidores
* `channels` → Gestión de canales
* `messages` → Gestión de mensajes

---

## 🗂️ Modelo de datos

Se han definido las siguientes entidades principales:

* **User**
* **Server**
* **Channel**
* **Message**

### 🔗 Relaciones

* Un **Server** pertenece a un **User** (owner)
* Un **Channel** pertenece a un **Server**
* Un **Message** pertenece a un **Channel** y a un **User**

### 🧠 Lógica tipo Discord (extra)

Se han añadido tablas intermedias para gestionar membresías:

* `ServerMember`
* `ChannelMember`

Esto permite:

* Que un usuario pueda unirse a servidores
* Que un usuario pueda unirse a canales
* Controlar que solo los usuarios registrados puedan enviar mensajes

---

## 🔐 Seguridad

Se ha implementado autenticación mediante JWT:

* Registro de usuario
* Login
* Protección de rutas mediante Guards

Solo los usuarios autenticados pueden acceder a la mayoría de endpoints.

---

## 📡 Endpoints principales

### 👤 Usuarios

* Registro
* Login

### 🏠 Servidores

* CRUD completo
* Unirse a servidor
* Salir de servidor
* Obtener servidores del usuario

### 💬 Canales

* CRUD completo
* Crear canal dentro de servidor
* Unirse a canal
* Salir de canal
* Obtener canales por servidor

### 📨 Mensajes

* Enviar mensaje (requiere pertenecer al canal)
* Obtener mensajes por canal
* Eliminar mensaje propio

---

## 📊 Logs y monitorización

Se ha implementado un **middleware personalizado** que registra:

* Método HTTP
* URL
* Código de estado
* Tiempo de respuesta

Los logs se almacenan en:

* Consola
* Archivo `logs.txt`

Esto permite analizar el comportamiento de la API y medir el rendimiento de cada petición.

---

## 🐳 Despliegue con Docker

El proyecto incluye configuración con Docker para facilitar su despliegue.

### ▶️ Ejecutar el proyecto

```bash
docker-compose up --build
```

Esto levanta:

* Backend NestJS
* Base de datos PostgreSQL

---

## 🧪 Documentación API

Swagger está disponible en:

```
http://localhost:3000/api/docs
```

Desde ahí se pueden probar todos los endpoints.

---

## 🚀 Posibles mejoras

* WebSockets para mensajería en tiempo real
* Sistema de roles (admin, miembro, etc.)
* Subida de archivos (imágenes, avatares)
* Tests automatizados con Jest
* Integración con servicios de logging externos

---

## 👨‍💻 Autor

Andrea Fernández de la Rosa

Proyecto realizado para la asignatura de Programación de Servicios y Procesos (PSP)
Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)

---

## 📄 Licencia

Uso académico
