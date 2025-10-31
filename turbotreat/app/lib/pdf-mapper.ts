import type { TreatReturnState } from "./treat-return-state.client";
import type { SchoolYear } from "../routes/file-treat-return/steps/3";

export type FormFields = {
  // Basic information
  first_name?: string;
  costume_name?: string;
  fav_candy?: string;
  date?: string;

  // Sibling information
  sibling_first_names?: string;
  sibling_costume_names?: string;
  sibling_fav_candies?: string;

  // Street addresses
  "1a_streetname"?: string;
  "1b_streetname"?: string;
  "1c_streetname"?: string;

  // Percentage fields
  tips_percent?: string;
  business_percent?: string;
  payments_pcs?: string;
  home_office_percent?: string;
  rnd_percent?: string;
  savers_percent?: string;
  smarties_percent?: string;
  nonarbor_percent?: string;

  // School level (radio group)
  school_prek?: boolean;
  school_elementary?: boolean;
  school_middle?: boolean;
  school_high?: boolean;
  school_adult?: boolean;

  // Candy weight (radio group)
  candy_weight_025?: boolean;
  candy_weight_050?: boolean;
  candy_weight_100?: boolean;
  candy_weight_150?: boolean;
  candy_weight_200?: boolean;
  candy_weight_300?: boolean;

  // Yes/No questions
  film_yes?: boolean;
  film_no?: boolean;
  illegal_yes?: boolean;
  illegal_no?: boolean;
  dependents_yes?: boolean;
  dependents_no?: boolean;
  green_yes?: boolean;
  green_no?: boolean;
  opportunity_yes?: boolean;
  opportunity_no?: boolean;
  local_yes?: boolean;
  local_no?: boolean;
  dental_yes?: boolean;
  dental_no?: boolean;
  sweetwest_yes?: boolean;
  sweetwest_no?: boolean;
  election_yes?: boolean;
  election_no?: boolean;
}

/**
 * Maps TreatReturnState from the form to FormFields for the PDF
 */
export function mapStateToFormFields(state: TreatReturnState): FormFields {
  const fields: FormFields = {};

  // Step 1: Basic information
  if (state.step1.firstName) {
    fields.first_name = state.step1.firstName;
  }
  if (state.step1.favoriteCandy) {
    fields.fav_candy = state.step1.favoriteCandy;
  }

  // Step 2: Costume
  if (state.step2.costumeName) {
    fields.costume_name = state.step2.costumeName;
  } else {
    fields.costume_name = "N/A";
  }

  // Step 3: School
  mapSchoolFields(state.step3.schoolYear, fields);
  if (state.step3.attendsSchool) {
    fields.opportunity_yes = state.step3.attendsSchool;
    fields.opportunity_no = !state.step3.attendsSchool;
  }

  // Step 4: Streets and non-Arbor percentage
  if (state.step4.multipleStreets && state.step4.streetNames) {
    const streets = state.step4.streetNames.split(',').map(s => s.trim());
    if (streets[0]) fields["1a_streetname"] = streets[0];
    if (streets[1]) fields["1b_streetname"] = streets[1];
    if (streets[2]) fields["1c_streetname"] = streets[2];
  }
  if (state.step4.nonArborPercent) {
    fields.nonarbor_percent = state.step4.nonArborPercent.toString();
  } else {
    fields.nonarbor_percent = "0";
  }

  // Step 5: Candy weight and tips
  mapCandyWeightFields(state.step5.candyWeight, fields);
  // Tips received - no direct field match in PDF, skipping for now
  if (state.step5.tipsPercent) {
    fields.tips_percent = state.step5.tipsPercent.toString();
  } else {
    fields.tips_percent = "0";
  }

  // Step 6: Investments and film
  let totalInvestedDividendsPercent = 0;
  if (state.step6.investedPTP && state.step6.investedPTP) {
    totalInvestedDividendsPercent += state.step6.investedPTPPercent || 0;
  }
  if (state.step6.investedREIT && state.step6.investedREIT) {
    totalInvestedDividendsPercent += state.step6.investedREITPercent || 0;
  }
  fields.business_percent = totalInvestedDividendsPercent.toString();
  if (state.step6.otherSourcesOfCandy) {
    fields.illegal_yes = state.step6.otherSourcesOfCandy;
    fields.illegal_no = !state.step6.otherSourcesOfCandy;
  }
  if (state.step6.californiaFilm) {
    fields.film_yes = state.step6.californiaFilm;
    fields.film_no = !state.step6.californiaFilm;
  }
  if (state.step6.pieces1040TRES) {
    fields.payments_pcs = state.step6.pieces1040TRES.toString();
  } else {
    fields.payments_pcs = "0";
  }

  // Step 7: Homework (home office deduction)
  if (state.step7.totalHomeworkCount && state.step7.homeworkAtHomeCount) {
    const homeOfficePercent = (state.step7.homeworkAtHomeCount / state.step7.totalHomeworkCount) * 100;
    fields.home_office_percent = homeOfficePercent.toFixed(2);
  }

  // Step 8: Siblings (dependents)
  if (state.step8.hasSiblings) {
    // Check each sibling to see if any of them eat your candy
    state.step8.siblings?.forEach(sibling => {
      if (sibling.willEatCandy) {
        fields.dependents_yes = true;
      }
    });
    if (!fields.dependents_yes) {
      fields.dependents_no = true;
    }
  }
  if (state.step8.siblings && state.step8.siblings.length > 0) {
    fields.sibling_first_names = state.step8.siblings.map(s => s.name).join(', ');
    fields.sibling_costume_names = state.step8.siblings.map(s => s.costume).join(', ');
    fields.sibling_fav_candies = state.step8.siblings.map(s => s.favoriteCandy).join(', ');
  }

  // Step 9: Green transportation
  if (state.step9.transportMethod) {
    const greenMethods = ['bike', 'scooter', 'skateboard', 'roller_skating', 'walking', 'running', 'electric_vehicle'];
    const isGreen = greenMethods.includes(state.step9.transportMethod);
    fields.green_yes = isGreen;
    fields.green_no = !isGreen;
  }
  if (!fields.green_yes && !fields.green_no) {
    fields.green_no = true; // Default to no if unknown
  }

  // Step 10: Study candy (education/R&D credit)
  if (state.step10.studyCandyPercent) {
    fields.rnd_percent = state.step10.studyCandyPercent.toString();
  } else {
    fields.rnd_percent = "0";
  }

  // Step 11: Parents/guardians - no direct PDF field mapping
   if (state.step11.livesWithParents) {
    // Check each parent to see if any of them eat your candy
    state.step11.parents?.forEach(parent => {
      if (parent.willEatCandy) {
        fields.local_yes = true;
      }
    });
    if (!fields.local_yes) {
      fields.local_no = true;
    }
  }

  // Step 12: Dental
  if (state.step12.dentalWorkFromCandy) {
    fields.dental_yes = state.step12.dentalWorkFromCandy;
    fields.dental_no = !state.step12.dentalWorkFromCandy;
  }
  if (!fields.dental_yes && !fields.dental_no) {
    fields.dental_no = true; // Default to no if unknown
  }

  // Step 13: Sweetwest Airlines
  if (state.step13.flewSweetwest) {
    fields.sweetwest_yes = state.step13.flewSweetwest;
    fields.sweetwest_no = !state.step13.flewSweetwest;
  }

  // Step 13: Leftover candy
  if (state.step13.leftoverCandyPercent) {
    fields.savers_percent = state.step13.leftoverCandyPercent.toString();
  } else {
    fields.savers_percent = "0";
  }

  // Step 13: Smarties
  if (state.step13.smartiesPercent) {
    fields.smarties_percent = state.step13.smartiesPercent.toString();
  } else {
    fields.smarties_percent = "0";
  }

  // Step 14: Election fund donation
  if (state.step14.donateSEF) {
    fields.election_yes = state.step14.donateSEF;
    fields.election_no = !state.step14.donateSEF;
  }

  // Step 15: Premium - no direct PDF field mapping

  // Add current date
  fields.date = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });

  return fields;
}

/**
 * Maps school year to appropriate school level checkboxes
 */
function mapSchoolFields(schoolYear: SchoolYear, fields: FormFields): void {
  if (!schoolYear) {
    fields.school_adult = true; // Default to adult if unknown
    return;
  }

  if (schoolYear === "Pre-K") {
    fields.school_prek = true;
  } else if (["Elementary", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade"].includes(schoolYear)) {
    fields.school_elementary = true;
  } else if (["6th Grade", "7th Grade", "8th Grade"].includes(schoolYear)) {
    fields.school_middle = true;
  } else if (["9th Grade", "10th Grade", "11th Grade", "12th Grade"].includes(schoolYear)) {
    fields.school_high = true;
  } else if (["College", "Graduate"].includes(schoolYear)) {
    fields.school_adult = true;
  }
}

/**
 * Maps candy weight to appropriate weight bracket checkbox
 */
function mapCandyWeightFields(candyWeight: number | null, fields: FormFields): void {
  if (candyWeight === null) {
    fields.candy_weight_025 = true; // Default to lowest bracket if unknown
  }
  // Determine weight bracket
  else if (candyWeight < 0.5) {
    fields.candy_weight_025 = true;
  } else if (candyWeight < 1.0) {
    fields.candy_weight_050 = true;
  } else if (candyWeight < 1.5) {
    fields.candy_weight_100 = true;
  } else if (candyWeight < 2.0) {
    fields.candy_weight_150 = true;
  } else if (candyWeight < 3.0) {
    fields.candy_weight_200 = true;
  } else {
    fields.candy_weight_300 = true;
  }
}
