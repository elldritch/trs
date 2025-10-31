-- AlterTable
ALTER TABLE "TreatReturnApplication" ADD COLUMN     "already_submitted_1040tres" BOOLEAN,
ADD COLUMN     "candy_to_be_used_for_film" BOOLEAN,
ADD COLUMN     "candy_was_gained_from_crime" BOOLEAN,
ADD COLUMN     "collected_candy_weight_lbs" DOUBLE PRECISION,
ADD COLUMN     "costume_name" TEXT,
ADD COLUMN     "ptp_invested_percent" DOUBLE PRECISION,
ADD COLUMN     "received_tips_percent" DOUBLE PRECISION,
ADD COLUMN     "reimbursed_for_dental" BOOLEAN,
ADD COLUMN     "reit_invested_percent" DOUBLE PRECISION,
ADD COLUMN     "school_year" TEXT,
ADD COLUMN     "street_names" TEXT,
ADD COLUMN     "will_save_candy_to_eoy" BOOLEAN;
