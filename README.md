# API Inventario - Pulga Shop

## 📖 Documentación de la API

La especificación completa de la API se encuentra documentada en OpenAPI 3.0 y está disponible en múltiples formatos:

- **Especificación OpenAPI:** [`docs/docs.yaml`](./docs/docs.yaml)
- **Documentación interactiva:** [API Inventario (HTML)](https://catrilao.github.io/pulga-shop-inventario-backend/#/)
- **Swagger UI local:** [http://localhost:3000/docs](http://localhost:3000/docs) _(cuando el servidor esté ejecutándose)_

## 🔧 Instalación y Configuración

### Variables de Entorno

Crea un archivo `.env` con estas configuraciones:

```bash
# Base de datos
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Servidor
PORT=3000
NODE_ENV=development
```

### Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar migraciones de base de datos
npm run prisma:migrate

# Modo desarrollo
npm run start:dev

# Modo producción
npm start:prod
```

## 🚀 Endpoints Principales

### 📦 Productos

- `POST /productos` → Añadir producto y setear stock inicial
- `GET /productos` → Listar todos los productos con filtros opcionales
- `GET /productos/{sku}` → Consultar producto específico por SKU
- `PATCH /productos/{sku}` → Actualizar información del producto
- `DELETE /productos/{sku}` → Eliminar producto del inventario

### 📋 Reservas

- `POST /reservas` → Reservar stock (inicio del proceso de checkout)
- `PATCH /reservas/{id_orden}/confirmar` → Confirmar reserva tras pago exitoso
- `PATCH /reservas/{id_orden}/cancelar` → Cancelar reserva y liberar stock

### 🏪 Tiendas

- `POST /tiendas` → Crear nueva tienda con vendedor asociado
- `GET /tiendas/{id_tienda}` → Obtener información completa de una tienda
- `PATCH /tiendas/{id_tienda}` → Actualizar datos de la tienda

## 📊 Diagramas y Arquitectura

### Diagramas de Flujo

#### 📦 Flujo de Productos

Gestión del inventario y productos

![Diagrama de Productos](./docs/diagrams/diagramas_productos.png)

#### 📋 Flujo de Reservas

Proceso de reserva y confirmación de stock

![Diagrama de Reservas](./docs/diagrams/diagramas_reservas.png)

#### 🏪 Flujo de Tiendas

Gestión de tiendas y vendedores asociados

![Diagrama de Tiendas](./docs/diagrams/diagramas_tienda.png)

### Modelo de Base de Datos

#### 🗄️ Modelo Relacional

Estructura de la base de datos Postgres

![Modelo Relacional](./docs/diagrams/bd/modelo_relacional.png)

## 🗄️ Base de Datos

### Arquitectura Híbrida

El sistema utiliza una arquitectura de base de datos híbrida:

- **Postgree**: Almacenamiento persistente de tiendas y productos
- **Redis**: Gestión temporal de reservas con expiración automática

### Estructura de Datos

#### Base de Datos Relacional (Postgree)

**Tabla: `ciudad`**
| Atributo | Tipo | Nulo | Clave | Descripción |
|----------|------|------|-------|-------------|
| `id_ciudad` | INT AUTO_INCREMENT | NO | PK | Identificador único de la ciudad |
| `nombre` | VARCHAR(100) | NO | UNIQUE | Nombre oficial de la ciudad |

**Tabla: `tienda`**
| Atributo | Tipo | Nulo | Clave | Valor por defecto |Descripción |
|----------|------|------|-------|-------------------|------------|
| `id_tienda` | INT AUTO_INCREMENT | NO | PK | - | Identificador único de la tienda |
| `id_vendedor` | VARCHAR(24) | NO | - | - | Referencia al vendedor dueño (módulo externo) |
| `nombre` | VARCHAR(100) | NO | - | - | Nombre de la tienda |
| `id_ciudad` | INT | NO | FK | - | Clave foranea para la ciudad |
| `direccion` | VARCHAR(200) | NO | - | - | Dirección física de la tienda |
| `descripcion` | text | NO | - | - | Descripcion de la tienda |
| `telefono` | VARCHAR(20) | NO | - | - | Teléfono de contacto |
| `fecha_creacion` | TIMESTAMP | SI | - | CURRENT_TIMESTAMP | Fecha y hora en que la tienda fue registrada en el sistema |
| `online` | BOOLEAN | NO | - | - | Indica si la tienda tiene presencia online |
| `activo` | BOOLEAN | SI | - | TRUE | Indica la disponibilidad de la tienda. |

**Tabla: `producto`**
| Atributo | Tipo | Nulo | Clave | Valor por defecto | Descripción |
|----------|------|------|-------|-------------------|-------------|
| `id_producto` | INT AUTO_INCREMENT | NO | PK | - | Identificador único del producto |
| `id_tienda` | INT | NO | FK | - | Identificador de la tienda a la que pertenece el producto |
| `nombre` | VARCHAR(100) | NO | - | - | Nombre del producto |
| `stock` | INT | NO | - | - | Cantidad disponible en inventario para este producto |
| `costo` | INT | NO | - | - | Precio del producto. |
| `sku` | VARCHAR(36) | NO | - | - | Código único de identificación del producto (Stock Keeping Unit) |
| `condicion` | ENUM | SI | - | 'NUEVO' | Estado del producto (Nuevo, Usado, reacondicionado) |
| `fecha_creacion` | TIMESTAMP | SI | - | CURRENT_TIMESTAMP | Fecha y hora de creación del registro del producto |
| `marca` | VARCHAR(50) | SI | - | 'Genérica' | Marca del producto |
| `categoria` | ENUM | SI | - | 'OTRO' | Categoría o tipo de producto |
| `descripcion` | TEXT | SI | - | 'Sin descripción' | Descripción detallada del producto |
| `activo` | BOOLEAN | SI | - | TRUE | Indica la disponibilidad del producto. |
| `foto_referencia` | TEXT | SI | - | - | URL de la imagen de referencia del producto, almacenada en Cloudinary. |
| `peso` | DECIMAL(4,1) | SI | - | 0.0 | Peso del producto en kg. |
| `alto` | INT | SI | - | 0 | Alto del producto en cm. |
| `largo` | INT | SI | - | 0 | Largo del producto en cm. |
| `ancho` | INT | SI | - | 0 | Ancho del producto en cm. |


#### Base de Datos en Memoria (Redis)

**Estructura: `reserva`**
| Atributo | Tipo | Tipo Redis | Descripción |
|----------|------|------------|-------------|
| `id_orden` | INT | KEY | Identificador único de la reserva |
| `expira_en` | DATETIME | VALUE | Tiempo de expiración de la reserva |

**Estructura: `items`**
| Atributo | Tipo | Tipo Redis | Descripción |
|----------|------|------------|-------------|
| `id_orden` | INT | VALUE | Identificador de la reserva |
| `sku` | STRING | VALUE | Producto reservado |
| `cantidad_reservada` | INTEGER | VALUE | Cantidad apartada para la orden |

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

---

📚 **Para más detalles:** Consulta la [documentación completa de la API](https://catrilao.github.io/pulga-shop-inventario-backend/#/) o revisa la especificación OpenAPI en [`docs/docs.yaml`](./docs/docs.yaml).
