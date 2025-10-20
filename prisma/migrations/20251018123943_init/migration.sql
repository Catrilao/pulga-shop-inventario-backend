-- CreateTable
CREATE TABLE "Tienda" (
    "id_tienda" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_vendedor" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT,
    "fecha_creacion" DATETIME NOT NULL
);
