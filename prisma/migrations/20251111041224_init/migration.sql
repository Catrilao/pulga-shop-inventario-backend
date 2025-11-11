/*
  Warnings:

  - You are about to drop the `Producto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tienda` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Condicion" AS ENUM ('NUEVO', 'USADO', 'REACONDICIONADO');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('ELECTRÓNICA', 'ROPA', 'CALZADO', 'HOGAR', 'JUGUETES', 'DEPORTES', 'LIBROS', 'ALIMENTOS', 'BELLEZA', 'OFICINA', 'AUTOMOTRIZ', 'MASCOTAS', 'GENERAL');

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_id_tienda_fkey";

-- DropTable
DROP TABLE "Producto";

-- DropTable
DROP TABLE "Tienda";

-- CreateTable
CREATE TABLE "tienda" (
    "id_tienda" SERIAL NOT NULL,
    "id_vendedor" BIGINT NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_ciudad" INTEGER NOT NULL,
    "direccion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "telefono" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "online" BOOLEAN NOT NULL,

    CONSTRAINT "tienda_pkey" PRIMARY KEY ("id_tienda")
);

-- CreateTable
CREATE TABLE "ciudad" (
    "id_ciudad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "ciudad_pkey" PRIMARY KEY ("id_ciudad")
);

-- CreateTable
CREATE TABLE "producto" (
    "id_producto" SERIAL NOT NULL,
    "id_tienda" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "precio" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "condicion" "Condicion" NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marca" TEXT,
    "categoria" "Categoria",
    "descripcion" TEXT,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateIndex
CREATE UNIQUE INDEX "ciudad_nombre_key" ON "ciudad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "producto_sku_key" ON "producto"("sku");

-- AddForeignKey
ALTER TABLE "tienda" ADD CONSTRAINT "tienda_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "ciudad"("id_ciudad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_id_tienda_fkey" FOREIGN KEY ("id_tienda") REFERENCES "tienda"("id_tienda") ON DELETE CASCADE ON UPDATE CASCADE;
