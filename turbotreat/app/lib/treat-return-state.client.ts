import type { Step1State } from "../routes/file-treat-return/steps/1";
import type { Step2State } from "../routes/file-treat-return/steps/2";
import type { Step3State } from "../routes/file-treat-return/steps/3";
import type { Step4State } from "../routes/file-treat-return/steps/4";
import type { Step5State } from "../routes/file-treat-return/steps/5";
import type { Step6State } from "../routes/file-treat-return/steps/6";
import type { Step7State } from "../routes/file-treat-return/steps/7";
import type { Step8State } from "../routes/file-treat-return/steps/8";
import type { Step9State } from "../routes/file-treat-return/steps/9";
import type { Step10State } from "../routes/file-treat-return/steps/10";
import type { Step11State } from "../routes/file-treat-return/steps/11";
import type { Step12State } from "../routes/file-treat-return/steps/12";
import type { Step13State } from "../routes/file-treat-return/steps/13";
import type { Step14State } from "../routes/file-treat-return/steps/14";
import type { Step15State } from "../routes/file-treat-return/steps/15";

export type TreatReturnState = {
  step1: Step1State;
  step2: Step2State;
  step3: Step3State;
  step4: Step4State;
  step5: Step5State;
  step6: Step6State;
  step7: Step7State;
  step8: Step8State;
  step9: Step9State;
  step10: Step10State;
  step11: Step11State;
  step12: Step12State;
  step13: Step13State;
  step14: Step14State;
  step15: Step15State;
};

export const treatReturnStartState: TreatReturnState = {
  step1: { firstName: null, favoriteCandy: null },
  step2: { wearingCostume: null, costumeCategory: null, costumeName: null },
  step3: { attendsSchool: null, schoolYear: null, schoolConditions: null },
  step4: { multipleStreets: null, streetNames: null, allFromArborAve: null, nonArborPercent: null },
  step5: { candyWeight: null, receivedTips: null, tipsPercent: null },
  step6: { investedPTP: null, investedPTPPercent: null, investedREIT: null, investedREITPercent: null, californiaFilm: null, otherSourcesOfCandy: null, filed1040TRES: null, pieces1040TRES: null },
  step7: { completedThreeHomework: null, totalHomeworkCount: null, homeworkAtHomeCount: null },
  step8: { hasSiblings: null, siblings: [] },
  step9: { hasCommute: null, transportMethod: null },
  step10: { willStudy: null, candyForStudy: null, studyCandyPercent: null },
  step11: { livesWithParents: null, parents: [] },
  step12: { beenToDentist: null, dentalWorkFromCandy: null, reimbursedForDental: null },
  step13: { yearsTrickOrTreating: null, flewSweetwest: null, leftoverCandy: null, leftoverCandyPercent: null, smartiesReceived: null, smartiesPercent: null },
  step14: { donateSEF: null},
  step15: { purchasePremium: null },
};

const treatReturnStateLocalStorageKey = "treatReturnState";

// Load treat return state from localStorage.
export function loadTreatReturnState(): TreatReturnState {
  const state = localStorage.getItem(treatReturnStateLocalStorageKey);
  if (!state) {
    return treatReturnStartState;
  }
  try {
    return JSON.parse(state);
  } catch (e) {
    console.error("Failed to parse treat return state", e);
    return treatReturnStartState;
  }
}

// Save treat return state to localStorage.
export function setTreatReturnState(state: TreatReturnState) {
  localStorage.setItem(treatReturnStateLocalStorageKey, JSON.stringify(state));
}
