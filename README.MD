# 🛒 Sistema de Gestión de Inventarios y Compras

API REST backend desarrollada con Java y Spring Boot para la gestión integral de inventarios, productos, compras, ventas, clientes, proveedores, caja y usuarios.

Este proyecto fue desarrollado como proyecto personal para fortalecer y demostrar conocimientos en desarrollo backend, diseño de APIs REST, arquitectura por capas, persistencia de datos, seguridad y buenas prácticas de desarrollo.

---

## 🚀 Funcionalidades

- 📦 Gestión de productos e inventario
- 🏷️ Gestión de categorías
- 🚚 Gestión de proveedores
- 👥 Gestión de clientes
- 🛒 Registro y gestión de compras
- 📋 Gestión de detalles de compra
- 💰 Gestión de ventas
- 🧾 Gestión de detalles de venta
- 💵 Control y gestión de caja
- 📒 Gestión de fiados y abonos
- 🔄 Registro de movimientos de inventario
- 👤 Gestión de usuarios y roles
- 🔐 Autenticación y autorización
- 📊 Dashboard con información del sistema
- ✅ Validación de datos
- ⚠️ Manejo global de excepciones

---

## 🔐 Seguridad

El proyecto implementa mecanismos de seguridad utilizando Spring Security y JWT.

Características principales:

- Autenticación mediante usuario y contraseña
- Generación y validación de tokens JWT
- Autorización basada en roles
- Protección de endpoints
- Contraseñas almacenadas utilizando BCrypt
- Configuración de sesión stateless

---

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura por capas.

Controller → Service → Repository → Database

### Principales capas

- Controller: expone los endpoints de la API REST.
- Service: contiene la lógica de negocio.
- Repository: gestiona el acceso a los datos mediante Spring Data JPA.
- Entity: representa las entidades persistentes.
- DTO: controla los datos enviados y recibidos por la API.
- Mapper: convierte entidades y DTOs utilizando MapStruct.
- Security: contiene la configuración de Spring Security y JWT.
- Exception: centraliza el manejo de excepciones.

---

## 🛠️ Tecnologías utilizadas

### Backend

- ☕ Java
- 🌱 Spring Boot
- 🔐 Spring Security
- 🔑 JWT
- 🌐 REST API
- 🗄️ Spring Data JPA
- Hibernate
- 🔄 MapStruct
- Bean Validation

### Base de datos

- 🐘 PostgreSQL
- SQL

### Herramientas

- 📦 Maven
- 🔧 Git
- 🐙 GitHub
- 💻 IntelliJ IDEA

---

## 📦 Módulos principales

- Productos
- Categorías
- Proveedores
- Compras
- Ventas
- Clientes
- Caja
- Fiados
- Abonos
- Movimientos de Inventario
- Usuarios
- Roles
- Dashboard
- Autenticación

---

## 🗄️ Base de datos

El proyecto utiliza PostgreSQL como sistema de gestión de base de datos.

La persistencia se implementa mediante:

- Spring Data JPA
- Hibernate
- Relaciones entre entidades
- Repositorios JPA

---

## 🔌 API REST

La aplicación expone diferentes endpoints REST para realizar operaciones sobre los recursos del sistema.

### Principales recursos

- /productos
- /categorias
- /proveedores
- /compras
- /ventas
- /clientes
- /caja
- /fiados
- /abonos
- /usuarios
- /dashboard
- /auth

Los endpoints protegidos requieren autenticación mediante JWT.

---

## 📁 Estructura del proyecto

El proyecto está organizado de la siguiente manera:

src/main/java/com/tienda/faltantes

- controller
- dto
  - request
  - response
- entity
- enums
- exception
- mapper
- repository
- security
  - config
  - jwt
  - properties
  - service
- service

---

## ⚙️ Requisitos

Para ejecutar el proyecto necesitas:

- Java
- Maven
- PostgreSQL
- Git

---

## ▶️ Ejecución del proyecto

### 1. Clonar el repositorio

git clone https://github.com/AndresChaguendo13/faltantes.git

### 2. Entrar al proyecto

cd faltantes

### 3. Configurar PostgreSQL

Crear una base de datos llamada:

faltantes_db

Configurar las credenciales de conexión en:

src/main/resources/application.properties

### 4. Ejecutar el proyecto

mvn spring-boot:run

También puedes ejecutarlo directamente desde IntelliJ IDEA.

---

## 🧪 Pruebas de la API

La API puede probarse utilizando herramientas como:

- Postman
- Insomnia

---

## 🎯 Objetivo del proyecto

El objetivo principal es desarrollar una aplicación backend completa aplicando conceptos utilizados en proyectos reales de desarrollo de software.

### Conocimientos aplicados

- Desarrollo de APIs REST
- Arquitectura por capas
- Programación orientada a objetos
- Persistencia de datos
- Relaciones entre entidades
- DTOs
- MapStruct
- Autenticación y autorización
- JWT
- Manejo de excepciones
- Validación de datos
- Control de versiones con Git

---

## 👨‍💻 Autor

Andres Chaguendo

Ingeniero de Sistemas | Backend Java Developer

📍 Colombia

🔗 LinkedIn:
https://www.linkedin.com/in/andreschaguendo/

🔗 GitHub:
https://github.com/AndresChaguendo13
