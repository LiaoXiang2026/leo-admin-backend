/*
  Warnings:

  - You are about to drop the `_MenuToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MenuToUser" DROP CONSTRAINT "_MenuToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MenuToUser" DROP CONSTRAINT "_MenuToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "menus" DROP CONSTRAINT "menus_parent_id_fkey";

-- DropTable
DROP TABLE "_MenuToUser";

-- DropTable
DROP TABLE "menus";
