import type { TreatReturnApplication } from "trs-db";

export type CandyCountResult = {
  candyCount: number;
  amtApplied: boolean;
};

/**
 * Maps school year from database to grade category for candy calculation
 */
function mapSchoolYearToGrade(schoolYear: string | null): string {
  if (!schoolYear) return "adult";

  if (schoolYear === "Pre-K") {
    return "pre-k";
  } else if (
    [
      "Elementary",
      "1st Grade",
      "2nd Grade",
      "3rd Grade",
      "4th Grade",
      "5th Grade",
    ].includes(schoolYear)
  ) {
    return "elementary";
  } else if (["6th Grade", "7th Grade", "8th Grade"].includes(schoolYear)) {
    return "middle";
  } else if (
    ["9th Grade", "10th Grade", "11th Grade", "12th Grade"].includes(schoolYear)
  ) {
    return "high";
  } else {
    return "adult";
  }
}

/**
 * Calculates the treat return candy count from a TreatReturnApplication
 */
export function calculateCandyCountFromApplication(
  application: TreatReturnApplication
): CandyCountResult {
  // Grade
  const grade = mapSchoolYearToGrade(application.school_year);

  // Total candy weight
  const totalCandyWeight = application.collected_candy_weight_lbs || 0;

  // Home Office Treat Credit (homework done at home percentage)
  const homeOfficeTreatCredit =
    application.total_homework_count && application.homework_at_home_count
      ? (application.homework_at_home_count / application.total_homework_count) *
        100
      : 0;

  // Dependents Treat Credit - check if ANY sibling will eat candy
  let dependentsTreatCredit = false;
  if (application.has_siblings && application.siblings) {
    const siblings = application.siblings as Array<{ willEatCandy: boolean }>;
    siblings.forEach((sibling) => {
      if (sibling.willEatCandy) {
        dependentsTreatCredit = true;
      }
    });
  }

  // Green Transportation Treat Credit
  const greenMethods = [
    "bike",
    "scooter",
    "skateboard",
    "roller_skating",
    "walking",
    "running",
    "electric_vehicle",
  ];
  const greenTreatCredit = greenMethods.includes(
    application.transport_method || ""
  );

  // American Opportunity Treat Credit
  const opportunityTreatCredit = application.will_study ?? false;

  // Research and Development Treat Credit
  const researchTreatCredit = application.study_candy_percent || 0;

  // Local Tax Treat Credit - check if ANY parent will eat candy
  let localTreatCredit = false;
  if (application.lives_with_parents && application.parents) {
    const parents = application.parents as Array<{ willEatCandy: boolean }>;
    parents.forEach((parent) => {
      if (parent.willEatCandy) {
        localTreatCredit = true;
      }
    });
  }

  // Unreimbursed Dentist Visits Treat Credit
  const dentalTreatCredit = application.dental_work_from_candy ?? false;

  // Savers Treat Credit
  const saversTreatCredit = application.leftover_candy_percent || 0;

  // Smarties Subsidy
  const smartiesTreatCredit = application.smarties_percent || 0;

  // Sweetwest customer Treat Credit
  const sweetwestTreatCredit = application.flew_sweetwest ?? false;

  // Premium
  const premiumTreatCredit = application.purchase_premium ?? false;

  return calculateTreatReturnCandyCount(
    grade,
    totalCandyWeight,
    homeOfficeTreatCredit,
    dependentsTreatCredit,
    greenTreatCredit,
    opportunityTreatCredit,
    researchTreatCredit,
    localTreatCredit,
    dentalTreatCredit,
    sweetwestTreatCredit,
    saversTreatCredit,
    smartiesTreatCredit,
    premiumTreatCredit
  );
}

/**
 * Calculates treat return candy count based on individual parameters
 */
export function calculateTreatReturnCandyCount(
  grade: string,
  totalCandyWeight: number,
  homeOfficeTreatCredit: number,
  dependentsTreatCredit: boolean,
  greenTreatCredit: boolean,
  opportunityTreatCredit: boolean,
  researchTreatCredit: number,
  localTreatCredit: boolean,
  dentalTreatCredit: boolean,
  sweetwestTreatCredit: boolean,
  saversTreatCredit: number,
  smartiesTreatCredit: number,
  premiumTreatCredit: boolean
): CandyCountResult {
  let candyCount = 0;

  // Grade-based candy (item 1)
  switch (grade) {
    case "pre-k":
    case "elementary":
      candyCount += 2;
      break;
    case "middle":
      candyCount += 1.25;
      break;
    case "high":
    case "adult":
      candyCount += 0;
      break;
  }

  // Total candy weight (item 1d)
  if (totalCandyWeight <= 0.25) {
    candyCount += 2;
  } else if (totalCandyWeight <= 0.5) {
    candyCount += 1.75;
  } else if (totalCandyWeight <= 1) {
    candyCount += 1.5;
  } else if (totalCandyWeight <= 1.5) {
    candyCount += 1;
  } else if (totalCandyWeight <= 2) {
    candyCount += 0.75;
  } else {
    // 3+ lbs
    candyCount += 0.5;
  }

  // 3a) Home Office Treat Credit
  if (homeOfficeTreatCredit === 0) {
    candyCount += 0;
  } else if (homeOfficeTreatCredit < 50) {
    candyCount += 0.25;
  } else {
    // > 50%
    candyCount += 0.5;
  }

  // 3b) Dependents Treat Credit
  if (dependentsTreatCredit) {
    candyCount += 0.5;
  }

  // 3c) Green Transportation Treat Credit
  if (greenTreatCredit) {
    candyCount += 1;
  }

  // 3d) American Opportunity Treat Credit
  if (opportunityTreatCredit) {
    candyCount += 0.25;
  }

  // 3e) Research and Development Treat Credit
  if (researchTreatCredit === 0) {
    candyCount += 0;
  } else if (researchTreatCredit < 50) {
    candyCount += 0.125;
  } else {
    // > 50%
    candyCount += 0.25;
  }

  // 3f) Local Tax Treat Credit
  if (localTreatCredit) {
    candyCount += 0.25;
  }

  // 3g) Unreimbursed Dentist Visits Treat Credit
  if (dentalTreatCredit) {
    candyCount += 0.25;
  }

  // 3h) Savers Treat Credit
  if (saversTreatCredit === 0) {
    candyCount += 0;
  } else if (saversTreatCredit < 50) {
    candyCount += 0.25;
  } else {
    // > 50%
    candyCount += 0.5;
  }

  // 3i) Smarties Subsidy
  if (smartiesTreatCredit === 0) {
    candyCount += 0;
  } else if (smartiesTreatCredit < 5) {
    candyCount += 0.25;
  } else if (smartiesTreatCredit < 10) {
    candyCount += 0.5;
  } else {
    // 10% or above
    candyCount += 0.75;
  }

  // 3j) Sweetwest customer Treat Credit
  if (sweetwestTreatCredit) {
    candyCount += 0.5;
  }

  // TurboTreat fee
  candyCount -= 1;

  // Premium deduction
  if (premiumTreatCredit) {
    candyCount -= 1;
  }

  // Floor the result
  candyCount = Math.floor(candyCount);

  // Apply Alternative Minimum Treat Tax (AMT)
  let amtApplied = false;
  let minCandy = 0;
  let maxCandy = 0;

  switch (grade) {
    case "pre-k":
    case "elementary":
      minCandy = 3;
      maxCandy = 6;
      break;
    case "middle":
      minCandy = 2;
      maxCandy = 5;
      break;
    case "high":
      minCandy = 1;
      maxCandy = 3;
      break;
    case "adult":
      // No AMT for adults
      return { candyCount, amtApplied: false };
  }

  // Check if AMT needs to be applied
  if (candyCount < minCandy) {
    candyCount = minCandy;
    amtApplied = true;
  } else if (candyCount > maxCandy) {
    candyCount = maxCandy;
    amtApplied = true;
  }

  return { candyCount, amtApplied };
}
