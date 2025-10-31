/*
  Warnings:

  - You are about to drop the column `candy_was_gained_from_crime` on the `TreatReturnApplication` table. All the data in the column will be lost.
  - You are about to drop the column `received_tips_percent` on the `TreatReturnApplication` table. All the data in the column will be lost.
  - You are about to drop the column `will_save_candy_to_eoy` on the `TreatReturnApplication` table. All the data in the column will be lost.
  - Made the column `already_submitted_1040tres` on table `TreatReturnApplication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TreatReturnApplication" DROP COLUMN "candy_was_gained_from_crime",
DROP COLUMN "received_tips_percent",
DROP COLUMN "will_save_candy_to_eoy",
ADD COLUMN     "all_from_arbor_ave" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "attends_school" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "been_to_dentist" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "candy_for_study" BOOLEAN,
ADD COLUMN     "completed_three_homework" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "costume_category" TEXT,
ADD COLUMN     "dental_work_from_candy" BOOLEAN,
ADD COLUMN     "donate_sef" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "favorite_candy" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "flew_sweetwest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "has_commute" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "has_siblings" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "homework_at_home_count" INTEGER,
ADD COLUMN     "invested_ptp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "invested_reit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leftover_candy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leftover_candy_percent" DOUBLE PRECISION,
ADD COLUMN     "lives_with_parents" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "multiple_streets" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "non_arbor_percent" DOUBLE PRECISION,
ADD COLUMN     "other_sources_of_candy" BOOLEAN,
ADD COLUMN     "parents" JSONB,
ADD COLUMN     "pieces_1040tres" INTEGER,
ADD COLUMN     "purchase_premium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "received_tips" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "school_conditions" TEXT,
ADD COLUMN     "siblings" JSONB,
ADD COLUMN     "smarties_percent" DOUBLE PRECISION,
ADD COLUMN     "smarties_received" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "study_candy_percent" DOUBLE PRECISION,
ADD COLUMN     "tips_percent" DOUBLE PRECISION,
ADD COLUMN     "total_homework_count" INTEGER,
ADD COLUMN     "transport_method" TEXT,
ADD COLUMN     "wearing_costume" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "will_study" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "years_trick_or_treating" INTEGER,
ALTER COLUMN "already_submitted_1040tres" SET NOT NULL,
ALTER COLUMN "already_submitted_1040tres" SET DEFAULT false;
