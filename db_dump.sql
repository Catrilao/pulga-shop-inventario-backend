-- db_dump.sql
-- SQL dump for Pulga Shop Inventario (schema + sample data)
-- Place this file in pgAdmin Query Tool and execute against your Postgres database.
-- This creates enums, tables, indexes, foreign keys and inserts a few sample rows.

-- NOTE: review and run in a test DB first. Some identifiers (enums) may already exist.

BEGIN;

-- Create enums (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'condicion') THEN
        CREATE TYPE "Condicion" AS ENUM ('NUEVO', 'USADO', 'REACONDICIONADO');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'categoria') THEN
        CREATE TYPE "Categoria" AS ENUM (
            'ELECTRÓNICA', 'ROPA', 'CALZADO', 'HOGAR', 'JUGUETES',
            'DEPORTES', 'LIBROS', 'ALIMENTOS', 'BELLEZA', 'OFICINA',
            'AUTOMOTRIZ', 'MASCOTAS', 'GENERAL'
        );
    END IF;
END$$;

-- Create ciudad
CREATE TABLE IF NOT EXISTS ciudad (
    id_ciudad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Create tienda
CREATE TABLE IF NOT EXISTS tienda (
    id_tienda SERIAL PRIMARY KEY,
    id_vendedor BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    id_ciudad INTEGER NOT NULL REFERENCES ciudad(id_ciudad) ON DELETE RESTRICT ON UPDATE CASCADE,
    direccion VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    telefono VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    online BOOLEAN NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true
);

-- Create producto
CREATE TABLE IF NOT EXISTS producto (
    id_producto SERIAL PRIMARY KEY,
    id_tienda INTEGER NOT NULL REFERENCES tienda(id_tienda) ON DELETE CASCADE ON UPDATE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    stock INTEGER NOT NULL,
    costo INTEGER NOT NULL,
    sku VARCHAR(36) NOT NULL UNIQUE,
    condicion "Condicion" DEFAULT 'NUEVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marca VARCHAR(50),
    categoria "Categoria" DEFAULT 'GENERAL',
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT true,
    foto_referencia TEXT,
    peso DECIMAL(4,1),
    alto INTEGER,
    largo INTEGER,
    ancho INTEGER
);

-- Indexes
CREATE INDEX IF NOT EXISTS producto_id_tienda_idx ON producto(id_tienda);
CREATE INDEX IF NOT EXISTS tienda_id_vendedor_idx ON tienda(id_vendedor);

-- Sample seed data
-- Insert a sample city
INSERT INTO ciudad (nombre)
    VALUES ('Ciudad Test')
    ON CONFLICT (nombre) DO NOTHING;

-- Insert a sample tienda (assumes ciudad id 1 exists or the one we just added)
INSERT INTO tienda (id_vendedor, nombre, id_ciudad, direccion, descripcion, telefono, online, activo)
    VALUES (123456789, 'Tienda Test',
            (SELECT id_ciudad FROM ciudad WHERE nombre = 'Ciudad Test' LIMIT 1),
            'Calle Falsa 123', 'Tienda de ejemplo para desarrollo', '+56912345678', true, true)
    ON CONFLICT DO NOTHING;

-- Insert a sample producto
INSERT INTO producto (id_tienda, nombre, stock, costo, sku, condicion, marca, categoria, descripcion, activo, peso, alto, largo, ancho)
    VALUES (
        (SELECT id_tienda FROM tienda WHERE nombre = 'Tienda Test' LIMIT 1),
        'Producto Test', 100, 10000, 'sku-0001', 'NUEVO', 'Marca Test', 'GENERAL', 'Producto de ejemplo', true, 1.0, 10, 10, 10
    )
    ON CONFLICT (sku) DO NOTHING;

COMMIT;

-- End of dump
