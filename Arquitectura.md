# Arquitectura del Proyecto - Anótalo UI

Este documento describe la estructura de carpetas del proyecto y el esquema de los datos persistidos en el almacenamiento local (`localStorage`).

## 1. Estructura de Carpetas

El proyecto sigue una arquitectura modular basada en componentes de React, organizada por funcionalidades principales.

```text
src/
├── constants/          # Constantes globales (Tipos de movimientos, colores, formas de pago).
├── context/            # Contextos de React (Autenticación, Estado global).
├── hooks/              # Custom hooks reutilizables (Manejo de fechas locales, lógica compartida).
├── pages/              # Páginas principales de la aplicación.
│   ├── Movimientos/    # Gestión y visualización del historial de transacciones.
│   │   └── components/ # Componentes específicos (Filtros, Detalle, Agrupadores).
│   └── POSAnotalo/     # Flujo de Punto de Venta (Paso a paso).
│       └── components/
│           └── steps/  # Componentes de cada paso del flujo (Importe, Entidad, etc.).
│               └── components/ # Sub-componentes compartidos (Calculadora, Selector de Entidad).
├── services/           # Lógica de persistencia y comunicación con el storage.
└── utils/              # Funciones de ayuda y formateo.
```

## 2. Persistencia de Datos (LocalStorage)

La aplicación utiliza `localStorage` para la persistencia offline de los datos. Se utilizan tres claves principales:

### 2.1 Movimientos (`movimientos_db`)

Almacena el historial de todas las operaciones realizadas.

**Estructura del Objeto JSON:**

```json
{
  "id": 1714041600000, // Timestamp único
  "tipo": "Venta", // "Venta", "Pago", "Ingreso", "Retiro"
  "importe": 1500.5, // Valor numérico
  "formaPago": "Efectivo", // "Efectivo", "Debito", "Cta Corriente", etc.
  "entidad": {
    // Objeto de la entidad relacionada
    "id": 123456789,
    "nombre": "Juan Pérez",
    "nro": 1
  },
  "fecha": "2024-04-25T21:00:00-03:00", // Formato ISO local (Argentina)
  "usuario": "admin" // Usuario que registró el movimiento
}
```

### 2.2 Clientes (`db_clientes`)

Almacena el padrón de clientes registrados.

**Estructura del Objeto JSON:**

```json
{
  "id": 1714041600000,
  "nro": 1, // Número correlativo de cliente
  "nombre": "Consumidor Final",
  "activo": true, // Estado lógico
  "fechaAlta": "2024-04-20T10:00:00"
}
```

### 2.3 Proveedores (`db_proveedores`)

Almacena el padrón de proveedores registrados.

**Estructura del Objeto JSON:**

```json
{
  "id": 1714041600000,
  "nro": 1,
  "nombre": "Distribuidora Central",
  "activo": true,
  "fechaAlta": "2024-04-15T09:30:00"
}
```

## 3. Lógica de Negocio Relevante

- **Zonas Horarias:** Se utiliza el hook `useArgentineDate` para forzar la zona horaria `America/Argentina/Buenos_Aires` al guardar registros, evitando desfases UTC.
- **Paginación Local:** La página de movimientos implementa una carga segmentada (limit) para optimizar el rendimiento del DOM al manejar grandes volúmenes de datos desde el storage.
- **Validaciones de Edición:** Solo se permite la edición de la entidad asociada en movimientos de tipo `Venta` y `Pago`.

---

_Última actualización: Abril 2024_
