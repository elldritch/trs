/*
  Warnings:

  - The values [AVAILABLE,CLAIMED] on the enum `PrintJobStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [IN_PROGRESS,SUBMITTED] on the enum `TreatReturnApplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `pdfBlob` on the `PrintJob` table. All the data in the column will be lost.
  - You are about to drop the column `finalCandyPayout` on the `TreatReturnApplication` table. All the data in the column will be lost.
  - You are about to drop the column `finalResponses` on the `TreatReturnApplication` table. All the data in the column will be lost.
  - You are about to drop the column `pdfFilePath` on the `TreatReturnApplication` table. All the data in the column will be lost.
  - You are about to drop the column `pdfMappings` on the `TreatReturnApplication` table. All the data in the column will be lost.
  - You are about to drop the `AuditAppointment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `treatReturnApplicationId` to the `PrintJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renderedPdf` to the `TreatReturnApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PrintJobStatus_new" AS ENUM ('UNSTARTED', 'STARTED', 'COMPLETED');
ALTER TABLE "public"."PrintJob" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PrintJob" ALTER COLUMN "status" TYPE "PrintJobStatus_new" USING ("status"::text::"PrintJobStatus_new");
ALTER TYPE "PrintJobStatus" RENAME TO "PrintJobStatus_old";
ALTER TYPE "PrintJobStatus_new" RENAME TO "PrintJobStatus";
DROP TYPE "public"."PrintJobStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TreatReturnApplicationStatus_new" AS ENUM ('IN_REVIEW', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."TreatReturnApplication" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TreatReturnApplication" ALTER COLUMN "status" TYPE "TreatReturnApplicationStatus_new" USING ("status"::text::"TreatReturnApplicationStatus_new");
ALTER TYPE "TreatReturnApplicationStatus" RENAME TO "TreatReturnApplicationStatus_old";
ALTER TYPE "TreatReturnApplicationStatus_new" RENAME TO "TreatReturnApplicationStatus";
DROP TYPE "public"."TreatReturnApplicationStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."AuditAppointment" DROP CONSTRAINT "AuditAppointment_applicationId_fkey";

-- AlterTable
ALTER TABLE "PrintJob" DROP COLUMN "pdfBlob",
ADD COLUMN     "treatReturnApplicationId" INTEGER NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TreatReturnApplication" DROP COLUMN "finalCandyPayout",
DROP COLUMN "finalResponses",
DROP COLUMN "pdfFilePath",
DROP COLUMN "pdfMappings",
ADD COLUMN     "auditAppointmentTimeSlot" TIMESTAMP(3),
ADD COLUMN     "renderedPdf" BYTEA NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."AuditAppointment";

-- AddForeignKey
ALTER TABLE "PrintJob" ADD CONSTRAINT "PrintJob_treatReturnApplicationId_fkey" FOREIGN KEY ("treatReturnApplicationId") REFERENCES "TreatReturnApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
