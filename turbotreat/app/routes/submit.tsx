import { Form } from "react-router";
import type { Route } from "./+types/submit";
import { useAppState } from "~/contexts/ApplicationStateContext";
import type { ApplicationState } from "~/lib/types";
import { prisma } from "trs-db";


function generateTicketId() {
  const TICKET_ID_LENGTH = 6
  // I removed some confusing similar characters (I, 1, L, O, 0) to avoid confusion
  const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
  let result = ""
  for (let i = 0; i < TICKET_ID_LENGTH; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}

function flattenResponses(state: ApplicationState) {
  // TODO: Flatten the state into a single object
  // {
  //   step1: {
  //     question1: "answer1",
  //     question2: "answer2",
  //   },
  //   step2: {
  //     question3: "answer3",
  //     question4: "answer4",
  //   },
  // }
  // into
  // {
  //   question1: "answer1",
  //   question2: "answer2",
  //   question3: "answer3",
  //   question4: "answer4",
  // }
  throw new Error("Not implemented");
}

function convertStateToPdfMappings(state) {
  // TODO: Use the mappings in the spreadsheet, tab
  // "Questions for TurboTreat", column "Relevant Fillable form key",
  // and produce a dict for use when filling out the fillable pdf
  throw new Error("Not implemented");
}

function calculateFinalCandyPayout(state) {
  // TODO: Use the formula in the spreadsheet, tab
  // "FINAL: Treat Taxes", to calculate a final candy return
  throw new Error("Not implemented");
}

export async function action({
  request,
}: Route.ActionArgs) {
  const formData = await request.formData();
  const stateJson = formData.get("state");

  if (!stateJson || typeof stateJson !== "string") {
    throw new Error("Application state not provided");
  }

  const state: ApplicationState = JSON.parse(stateJson);
  const flattenedResponses = flattenResponses(state);
  const finalCandyPayout = calculateFinalCandyPayout(state);
  const pdfMappings = convertStateToPdfMappings(state);
  let application = await prisma.treatReturnApplication.create({
    data: {
      ticketId: generateTicketId(),
      status: "SUBMITTED",
      finalResponses: flattenedResponses ?? undefined,
      finalCandyPayout: finalCandyPayout ?? undefined,
      pdfMappings: pdfMappings ?? undefined
    },
  });
  return application;
}


export default function Submit({
  actionData,
}: Route.ComponentProps) {
  const { state } = useAppState() as { state: ApplicationState };

  return (
    <div>
      <h1>Submit</h1>
      {/* TODO: Add the "review form" UI here too */}
      <Form method="post">
        <input type="hidden" name="state" value={JSON.stringify(state)} />
        <button className="mt-6 rounded-md bg-sky-700 font-medium text-lg text-white w-full py-2" type="submit">
          Submit
        </button>
      </Form>
      {actionData ? (
        <p>Your ticket code is {actionData.ticketId}. Thank you for using TurboTreat(c)</p>
      ) : null}
    </div>
  );
}
