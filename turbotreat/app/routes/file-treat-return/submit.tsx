import { Form, useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types/submit";

// import { prisma } from "trs-db";
import {
  loadTreatReturnState,
  setTreatReturnState,
  treatReturnStartState,
  type TreatReturnState,
} from "~/lib/treat-return-state.client";
import * as step1 from "./steps/1";
import * as step2 from "./steps/2";
// import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

export function clientLoader() {
  return loadTreatReturnState();
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const stateJson = formData.get("state");

  if (!stateJson || typeof stateJson !== "string") {
    throw new Error("Application state not provided");
  }

  const state: TreatReturnState = JSON.parse(stateJson);
  // const flattenedResponses = flattenResponses(state);
  // const finalCandyPayout = calculateFinalCandyPayout(state);
  // const pdfMappings = convertStateToPdfMappings(state);
  // let application = await prisma.treatReturnApplication.create({
  //   data: {
  //     ticketId: generateTicketId(),
  //     status: "SUBMITTED",
  //     finalResponses: flattenedResponses ?? undefined,
  //     finalCandyPayout: finalCandyPayout ?? undefined,
  //     pdfMappings: pdfMappings ?? undefined
  //   },
  // });
  return { ticketId: "123" };
}

export default function Submit({ loaderData }: Route.ComponentProps) {
  const treatReturnState = loaderData;
  const navigate = useNavigate();

  useEffect(() => {
    if (!step1.isCompleted(treatReturnState.step1)) {
      navigate("/file/step/1");
    }
    if (!step2.isCompleted(treatReturnState.step2)) {
      navigate("/file/step/2");
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
                {/* <ArrowPathIcon className="animate-spin h-20 mx-auto" /> */}
              </div>
            )}
          </>
        )}
      </fetcher.Form>
    </main>
  );
}
