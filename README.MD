# Sistema de Gestión de Inventario y Compras

API REST backend desarrollada con Java y Spring Boot para la gestión de inventario, productos, compras, ventas, clientes, proveedores y usuarios.

Este proyecto fue desarrollado como proyecto personal para fortalecer conocimientos en desarrollo backend, arquitectura por capas, APIs REST, persistencia de datos y seguridad.

## 🚀 Funcionalidades

- Gestión de productos e inventario
- Gestión de categorías
- Gestión de proveedores
- Gestión de clientes
- Registro y gestión de compras
- Gestión de detalles de compra
- Gestión de ventas
- Gestión de detalles de venta
- Control de caja
- Gestión de fiados y abonos
- Movimientos de inventario
- Gestión de usuarios y roles
- Autenticación y autorización
- Dashboard con información del sistema
- Validación de datos
- Manejo global de excepciones

## 🔐 Seguridad

El proyecto implementa seguridad mediante:

- Spring Security
- JWT (JSON Web Token)
- Autenticación de usuarios
- Autorización basada en roles
- Contraseñas almacenadas utilizando BCrypt

Las credenciales y claves utilizadas durante el desarrollo se mantienen fuera del repositorio mediante archivos de configuración locales.

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura por capas:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database