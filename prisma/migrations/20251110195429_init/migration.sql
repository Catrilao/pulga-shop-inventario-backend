-- CreateTable
CREATE TABLE "Tienda" (
    "id_tienda" SERIAL NOT NULL,
    "id_vendedor" BIGINT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "telefono" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tienda_pkey" PRIMARY KEY ("id_tienda")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id_producto" SERIAL NOT NULL,
    "id_tienda" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "precio" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "condicion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marca" TEXT,
    "categoria" TEXT,
    "descripcion" TEXT,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_sku_key" ON "Producto"("sku");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_id_tienda_fkey" FOREIGN KEY ("id_tienda") REFERENCES "Tienda"("id_tienda") ON DELETE CASCADE ON UPDATE CASCADE;
