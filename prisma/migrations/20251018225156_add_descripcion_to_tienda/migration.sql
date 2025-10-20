/*
  Warnings:

  - Added the required column `descripcion` to the `Tienda` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tienda" (
    "id_tienda" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_vendedor" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "telefono" TEXT,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Tienda" ("direccion", "fecha_creacion", "id_tienda", "id_vendedor", "nombre", "telefono") SELECT "direccion", "fecha_creacion", "id_tienda", "id_vendedor", "nombre", "telefono" FROM "Tienda";
DROP TABLE "Tienda";
ALTER TABLE "new_Tienda" RENAME TO "Tienda";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
