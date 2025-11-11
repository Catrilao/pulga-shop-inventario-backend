-- AlterTable
ALTER TABLE "producto" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "tienda" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "producto_id_tienda_idx" ON "producto"("id_tienda");

-- CreateIndex
CREATE INDEX "tienda_id_vendedor_idx" ON "tienda"("id_vendedor");
