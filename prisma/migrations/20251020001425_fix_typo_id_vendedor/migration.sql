/*
  Warnings:

  - You are about to alter the column `id_vendedor` on the `Tienda` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tienda" (
    "id_tienda" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_vendedor" BIGINT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "telefono" TEXT,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Tienda" ("descripcion", "direccion", "fecha_creacion", "id_tienda", "id_vendedor", "nombre", "telefono") SELECT "descripcion", "direccion", "fecha_creacion", "id_tienda", "id_vendedor", "nombre", "telefono" FROM "Tienda";
DROP TABLE "Tienda";
ALTER TABLE "new_Tienda" RENAME TO "Tienda";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
