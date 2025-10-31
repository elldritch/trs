import fs from "fs/promises";
import path from "path";

import { useEffect } from "react";
import { useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types/submit";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { customAlphabet } from "nanoid";

import { prisma } from "~/lib/db.server";
import {
  loadTreatReturnState,
  setTreatReturnState,
  treatReturnStartState,
  type TreatReturnState,
} from "~/lib/treat-return-state.client";
import * as step1 from "./steps/1";
import * as step2 from "./steps/2";
import * as step3 from "./steps/3";
import * as step4 from "./steps/4";
import * as step5 from "./steps/5";
import * as step6 from "./steps/6";
import * as step7 from "./steps/7";
import * as step8 from "./steps/8";
import * as step9 from "./steps/9";
import * as step10 from "./steps/10";
import * as step11 from "./steps/11";
import * as step12 from "./steps/12";
import * as step13 from "./steps/13";
import * as step14 from "./steps/14";
import * as step15 from "./steps/15";
import { render1040 } from "~/lib/pdf.server";
import { mapStateToFormFields } from "~/lib/pdf-mapper";

export function clientLoader() {
  return loadTreatReturnState();
}

const ticketIdAlphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(ticketIdAlphabet, 7);

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const stateJson = formData.get("state");

  if (!stateJson || typeof stateJson !== "string") {
    throw new Error("Application state not provided");
  }

  // Map the state to PDF form fields
  const state: TreatReturnState = JSON.parse(stateJson);
  const formFields = mapStateToFormFields(state);
  const pdfBytes = await render1040(formFields);

  const ticketId = nanoid();

  // Write out a return for fun and debugging purposes.
  const returnsDir = path.join(process.cwd(), "public", "returns");
  await fs.mkdir(returnsDir, { recursive: true });
  await fs.writeFile(path.join(returnsDir, `${ticketId}.pdf`), pdfBytes);

  await prisma.treatReturnApplication.create({
    data: {
      ticketId,
      status: "IN_REVIEW",
      renderedPdf: pdfBytes as any,
      // Step 1
      first_name: state.step1.firstName,
      favorite_candy: state.step1.favoriteCandy,
      // Step 2
      wearing_costume: state.step2.wearingCostume ?? false,
      costume_category: state.step2.costumeCategory,
      costume_name: state.step2.costumeName,
      // Step 3
      attends_school: state.step3.attendsSchool ?? false,
      school_year: state.step3.schoolYear,
      school_conditions: state.step3.schoolConditions,
      // Step 4
      multiple_streets: state.step4.multipleStreets ?? false,
      street_names: state.step4.streetNames,
      all_from_arbor_ave: state.step4.allFromArborAve ?? false,
      non_arbor_percent: state.step4.nonArborPercent,
      // Step 5
      collected_candy_weight_lbs: state.step5.candyWeight,
      received_tips: state.step5.receivedTips ?? false,
      tips_percent: state.step5.tipsPercent,
      // Step 6
      invested_ptp: state.step6.investedPTP ?? false,
      ptp_invested_percent: state.step6.investedPTPPercent,
      invested_reit: state.step6.investedREIT ?? false,
      reit_invested_percent: state.step6.investedREITPercent,
      candy_to_be_used_for_film: state.step6.californiaFilm,
      other_sources_of_candy: state.step6.otherSourcesOfCandy,
      already_submitted_1040tres: state.step6.filed1040TRES ?? false,
      pieces_1040tres: state.step6.pieces1040TRES,
      // Step 7
      completed_three_homework: state.step7.completedThreeHomework ?? false,
      total_homework_count: state.step7.totalHomeworkCount,
      homework_at_home_count: state.step7.homeworkAtHomeCount,
      // Step 8
      has_siblings: state.step8.hasSiblings ?? false,
      siblings: state.step8.siblings as any,
      // Step 9
      has_commute: state.step9.hasCommute ?? false,
      transport_method: state.step9.transportMethod,
      // Step 10
      will_study: state.step10.willStudy ?? false,
      candy_for_study: state.step10.candyForStudy,
      study_candy_percent: state.step10.studyCandyPercent,
      // Step 11
      lives_with_parents: state.step11.livesWithParents ?? false,
      parents: state.step11.parents as any,
      // Step 12
      been_to_dentist: state.step12.beenToDentist ?? false,
      dental_work_from_candy: state.step12.dentalWorkFromCandy,
      reimbursed_for_dental: state.step12.reimbursedForDental,
      // Step 13
      years_trick_or_treating: state.step13.yearsTrickOrTreating,
      flew_sweetwest: state.step13.flewSweetwest ?? false,
      leftover_candy: state.step13.leftoverCandy ?? false,
      leftover_candy_percent: state.step13.leftoverCandyPercent,
      smarties_received: state.step13.smartiesReceived ?? false,
      smarties_percent: state.step13.smartiesPercent,
      // Step 14
      donate_sef: state.step14.donateSEF ?? false,
      // Step 15
      purchase_premium: state.step15.purchasePremium ?? false,
    },
  });

  return { ticketId };
}

export default function Submit({ loaderData }: Route.ComponentProps) {
  const treatReturnState = loaderData;
  const navigate = useNavigate();

  useEffect(() => {
    if (!step1.isCompleted(treatReturnState.step1)) {
      navigate("/file/step/1");
      return;
    }
    if (!step2.isCompleted(treatReturnState.step2)) {
      navigate("/file/step/2");
      return;
    }
    if (!step3.isCompleted(treatReturnState.step3)) {
      navigate("/file/step/3");
      return;
    }
    if (!step4.isCompleted(treatReturnState.step4)) {
      navigate("/file/step/4");
      return;
    }
    if (!step5.isCompleted(treatReturnState.step5)) {
      navigate("/file/step/5");
      return;
    }
    if (!step6.isCompleted(treatReturnState.step6)) {
      navigate("/file/step/6");
      return;
    }
    if (!step7.isCompleted(treatReturnState.step7)) {
      navigate("/file/step/7");
      return;
    }
    if (!step8.isCompleted(treatReturnState.step8)) {
      navigate("/file/step/8");
      return;
    }
    if (!step9.isCompleted(treatReturnState.step9)) {
      navigate("/file/step/9");
      return;
    }
    if (!step10.isCompleted(treatReturnState.step10)) {
      navigate("/file/step/10");
      return;
    }
    if (!step11.isCompleted(treatReturnState.step11)) {
      navigate("/file/step/11");
      return;
    }
    if (!step12.isCompleted(treatReturnState.step12)) {
      navigate("/file/step/12");
      return;
    }
    if (!step13.isCompleted(treatReturnState.step13)) {
      navigate("/file/step/13");
      return;
    }
    if (!step14.isCompleted(treatReturnState.step14)) {
      navigate("/file/step/14");
      return;
    }
    if (!step15.isCompleted(treatReturnState.step15)) {
      navigate("/file/step/15");
      return;
    }
  }, [treatReturnState]);

  const fetcher = useFetcher();
  if (fetcher.data) {
    setTreatReturnState(treatReturnStartState);
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-light text-gray-900 text-center">
        {fetcher.data ? "Your return has been submitted" : "Submit your return"}
      </h1>
      {!fetcher.data && (
        <>
          <p className="mt-4">
            Please verify your treat return answers and then click "submit"
            below to submit your return.
          </p>
          {/* TODO: Implement preview/review UI. */}
          <p className="mt-4">
            UPON SUBMITTING, PLEASE DO NOT REFRESH OR NAVIGATE AWAY FROM THIS
            PAGE UNTIL YOU RECEIVE YOUR TREAT RETURN ID.
          </p>
        </>
      )}
      <fetcher.Form method="post">
        <input
          type="hidden"
          name="state"
          value={JSON.stringify(treatReturnState)}
        />
        {fetcher.data ? (
          <div className="mt-4 text-center flex flex-col gap-4">
            <p>Your treat return ID is:</p>
            <h2 className="text-4xl font-light">{fetcher.data.ticketId}</h2>
            <p>WRITE DOWN THIS RETURN ID. IT WILL NOT BE SHOWN TO YOU AGAIN.</p>
            <p>
              Your return can be downloaded at{" "}
              <a
                href={`/returns/${fetcher.data.ticketId}.pdf`}
                className="text-blue-500 underline"
              >
                returns/{fetcher.data.ticketId}.pdf
              </a>
            </p>
            <p>
              Thank you for using TurboTreat&copy;.
              <br />
              You may now safely leave this page.
            </p>
          </div>
        ) : (
          <>
            {fetcher.state === "idle" ? (
              <button
                className="mt-6 rounded-md bg-sky-700 font-medium text-lg text-white w-full py-2"
                type="submit"
              >
                Submit
              </button>
            ) : (
              <div className="mt-2">
                <ArrowPathIcon className="animate-spin h-20 mx-auto" />
              </div>
            )}
          </>
        )}
      </fetcher.Form>
    </main>
  );
}
