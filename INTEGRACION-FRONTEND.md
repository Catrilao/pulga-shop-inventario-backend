# Integración Frontend - Backend

## 🔌 Configuración de URLs

### Backend
- **URL Base**: `http://localhost:16014/api`
- **Documentación Swagger**: `http://localhost:16014/docs`

### Endpoints Principales

#### 🏪 Tiendas
- `GET /api/tiendas` - Listar todas las tiendas (público)
- `GET /api/tiendas/:id_tienda` - Obtener detalles de una tienda (público)
- `POST /api/tiendas` - Crear tienda (requiere autenticación como vendedor)

#### 📦 Productos
- `GET /api/productos/:sku` - Obtener producto por SKU (público)
- `GET /api/productos?id_tienda=1` - Listar productos (requiere autenticación)
- `POST /api/productos` - Crear producto (requiere autenticación como vendedor)
- `PATCH /api/productos/:sku` - Actualizar producto (requiere autenticación como vendedor)
- `DELETE /api/productos/:sku` - Eliminar producto (requiere autenticación como vendedor)

#### 📋 Reservas
- `POST /api/reservas` - Crear reserva (requiere autenticación)
- `PATCH /api/reservas/:id` - Actualizar estado de reserva (requiere autenticación)

---

## 🔐 Autenticación JWT

### Endpoints Protegidos
Los endpoints marcados como "requiere autenticación" necesitan un token JWT en el header `Authorization`.

### Formato del Header
```
Authorization: Bearer <token>
```

### Estructura del Token (Payload)
```json
{
  "sub": "VEND_001",        // ID del vendedor (string)
  "email": "user@mail.com", // Email del usuario
  "role": "vendedor",       // Rol: "vendedor", "administrador", "usuario"
  "iat": 1733138523         // Timestamp de emisión
}
```

### Roles Disponibles
- **`vendedor`**: Puede gestionar sus propias tiendas y productos
- **`administrador`**: Tiene acceso completo a todos los recursos
- **`usuario`**: Acceso básico (solo reservas)
- **`""`** (vacío): Usuario sin rol especial

---

## 🧪 Token de Prueba

Para probar la integración, puedes usar el siguiente token JWT generado para `VEND_001`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJWRU5EXzAwMSIsImVtYWlsIjoiY29ycmVvQGNvcnJlby5jb20iLCJyb2xlIjoidmVuZGVkb3IiLCJpYXQiOjE3NjQ2NTQyOTl9.RrcsmZ5QbRTGBUICc50culf6khoo70P2EG81wAm0eI8
```

Este token permite acceder como el vendedor `VEND_001` que posee:
- **Tienda 1**: TecnoCentral Santiago (ciudad: Arica)
- **Tienda 2**: TecnoCentral Valpo (ciudad: Camarones)
- **Productos**: 3 productos activos en estas tiendas (producto NB-ASUS-001 fue eliminado en las pruebas)

**⚠️ IMPORTANTE**: Este token usa el secreto `EstoEsUnSecretoSuperSeguro` configurado en `docker-compose.yml`. En producción debes cambiar este secreto.

### Generar Nuevos Tokens
```bash
# Token para vendedor VEND_001
npm run ts-node src/auth/test/generate-test-token.ts --role vendedor --vendedor VEND_001

# Token para vendedor VEND_002
npm run ts-node src/auth/test/generate-test-token.ts --role vendedor --vendedor VEND_002

# Token para administrador
npm run ts-node src/auth/test/generate-test-token.ts --role administrador --vendedor ADMIN_001
```

---

## 📝 Ejemplos de Uso

### 1. Consultar Productos (Endpoint Público)
```javascript
// No requiere autenticación
const response = await fetch('http://localhost:16014/api/productos/NB-ASUS-001');
const producto = await response.json();
```

### 2. Listar Productos de una Tienda (Requiere Auth)
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const response = await fetch('http://localhost:16014/api/productos?id_tienda=1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data, meta } = await response.json();
console.log('Productos:', data);
console.log('Paginación:', meta);
```

### 3. Crear Producto (Requiere Auth + Rol Vendedor)
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const nuevoProducto = {
  id_tienda: 1,
  nombre: 'Mouse Logitech MX',
  stock: 10,
  costo: 45000,
  condicion: 'NUEVO',
  categoria: 'ELECTRÓNICA',
  marca: 'Logitech',
  descripcion: 'Mouse ergonómico',
  peso: 0.2,
  alto: 5,
  largo: 12,
  ancho: 8
};

const response = await fetch('http://localhost:16014/api/productos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(nuevoProducto)
});

const producto = await response.json();
```

### 4. Eliminar Producto (Requiere Auth + Verificación de Propiedad)
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Solo puede eliminar si el producto pertenece a una tienda del vendedor
const response = await fetch('http://localhost:16014/api/productos/NB-ASUS-001', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

if (response.ok) {
  console.log('Producto eliminado');
}
```

---

## 🔒 Validaciones de Seguridad

### Endpoints Protegidos por Vendedor
Los endpoints `PATCH`, `DELETE` y `POST` de productos validan que:
1. El token JWT sea válido
2. El usuario tenga rol `vendedor` o `administrador`
3. El producto pertenezca a una tienda del vendedor autenticado

### Respuestas de Error Comunes

#### 401 - No Autorizado (Sin Token)
```json
{
  "statusCode": 401,
  "message": "Token no encontrado",
  "error": "NO_AUTORIZADO"
}
```

#### 401 - Token Inválido
```json
{
  "statusCode": 401,
  "message": "Sesión no iniciada",
  "error": "NO_AUTORIZADO"
}
```

#### 400 - Sin Permisos para el Recurso
```json
{
  "statusCode": 400,
  "message": "No tienes permisos para eliminar este producto",
  "error": "NO_AUTORIZADO"
}
```

---

## 📊 Datos de Prueba

### Vendedores
| ID | Tiendas | Productos |
|----|---------|-----------|
| VEND_001 | TecnoCentral Santiago (1), TecnoCentral Valpo (2) | 4 productos |
| VEND_002 | Moda Urbana (3), Moda Urbana Sur (4) | 4 productos |
| VEND_003 | ElectroHogar (5), ElectroHogar Stgo (6) | 4 productos |

### Ciudades Disponibles
- 345 ciudades de Chile (desde Arica hasta Torres del Paine)

### Enums Disponibles

#### Categorías
`ELECTRÓNICA`, `ROPA`, `CALZADO`, `HOGAR`, `JUGUETES`, `DEPORTES`, `LIBROS`, `ALIMENTOS`, `BELLEZA`, `OFICINA`, `AUTOMOTRIZ`, `MASCOTAS`, `GENERAL`

#### Condiciones
`NUEVO`, `USADO`, `REACONDICIONADO`

---

## 🚀 Próximos Pasos

1. **Implementar Login Real**: El backend actualmente solo valida tokens JWT pero no tiene endpoint de login. Necesitarás:
   - Crear endpoint `POST /api/auth/login` que valide credenciales
   - Devolver token JWT firmado con el `id_vendedor` real

2. **Integrar con tu Sistema de Autenticación**: 
   - El token debe incluir el `id_vendedor` real del usuario logueado
   - El campo `sub` del JWT debe coincidir con el `id_vendedor` de la tabla `tienda`

3. **Almacenar Token en Frontend**:
   - Guardar el token en `localStorage` o `sessionStorage`
   - Adjuntarlo automáticamente en todas las peticiones protegidas

4. **Manejo de Expiración**:
   - Implementar refresh token o renovación automática
   - Redirigir al login cuando el token expire

---

## 🐛 Troubleshooting

### Problema: "No tienes permisos para eliminar este producto"
**Causa**: El `id_vendedor` del token no coincide con el `id_vendedor` de la tienda que posee el producto.

**Solución**: Verifica que:
- El token tenga el `sub` correcto (ejemplo: `VEND_001`)
- El producto pertenezca a una tienda de ese vendedor
- Consulta: `SELECT * FROM tienda WHERE id_vendedor = 'VEND_001'`

### Problema: "Token no encontrado"
**Causa**: El header `Authorization` no está presente o tiene formato incorrecto.

**Solución**:
```javascript
headers: {
  'Authorization': `Bearer ${token}` // No olvidar "Bearer " antes del token
}
```

### Problema: CORS Error
**Causa**: El backend está configurado para aceptar peticiones desde `http://localhost:16004`.

**Solución**: Si tu frontend usa otro puerto, actualiza `CORS_ORIGINS` en `docker-compose.yml`:
```yaml
environment:
  - CORS_ORIGINS=http://localhost:16004,http://localhost:3000
```
