-- CreateTable
CREATE TABLE "Producto" (
    "sku" TEXT NOT NULL PRIMARY KEY,
    "id_tienda" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "precio" INTEGER NOT NULL,
    "disponible" BOOLEAN NOT NULL,
    CONSTRAINT "Producto_id_tienda_fkey" FOREIGN KEY ("id_tienda") REFERENCES "Tienda" ("id_tienda") ON DELETE CASCADE ON UPDATE CASCADE
);
