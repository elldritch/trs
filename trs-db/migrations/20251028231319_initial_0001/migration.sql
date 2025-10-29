-- CreateEnum
CREATE TYPE "TreatReturnApplicationStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PrintJobStatus" AS ENUM ('AVAILABLE', 'CLAIMED', 'COMPLETED');

-- CreateTable
CREATE TABLE "TreatReturnApplication" (
    "id" SERIAL NOT NULL,
    "ticketId" TEXT NOT NULL,
    "status" "TreatReturnApplicationStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "finalResponses" JSONB,
    "finalCandyPayout" INTEGER,
    "pdfMappings" JSONB,
    "pdfFilePath" TEXT,

    CONSTRAINT "TreatReturnApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditAppointment" (
    "id" SERIAL NOT NULL,
    "timeslot" TIMESTAMP(3) NOT NULL,
    "applicationId" INTEGER NOT NULL,

    CONSTRAINT "AuditAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintJob" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "PrintJobStatus" NOT NULL DEFAULT 'AVAILABLE',
    "pdfBlob" BYTEA,

    CONSTRAINT "PrintJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TreatReturnApplication_ticketId_key" ON "TreatReturnApplication"("ticketId");

-- AddForeignKey
ALTER TABLE "AuditAppointment" ADD CONSTRAINT "AuditAppointment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "TreatReturnApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
