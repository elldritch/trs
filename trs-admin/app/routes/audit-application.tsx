import type { TreatReturnApplication } from "node_modules/trs-db/generated/prisma/client";
import type { Route } from "./+types/audit-application";
import { PrismaClient } from "trs-db";
import { data, redirect } from "react-router";
import AdminNavbar from "../components/AdminNavbar";
import { Form } from "react-router";
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

const prisma = new PrismaClient();

export function meta({ }: Route.MetaArgs) {
  return [
      { title: "TRS Admin - Audit application" },
  ];
}


function flagUnusualResponses(application: TreatReturnApplication) {
  const flaggedResponses = [];

  // Collected candy weight
  if (application.collected_candy_weight_lbs && (application.collected_candy_weight_lbs > 5 || application.collected_candy_weight_lbs < 0)) {
    flaggedResponses.push(`Treatpayer claims to have collected ${application.collected_candy_weight_lbs} lbs of candy`);
  }

  // Received tips
  if (application.received_tips) {
    flaggedResponses.push(`Treatpayer received candy as tips for services rendered`);
  }

  // PTP/REIT investments
  if ((application.ptp_invested_percent && application.ptp_invested_percent > 0)
    || (application.reit_invested_percent && application.reit_invested_percent > 0)) {
    const totalInvestment = (application.ptp_invested_percent ?? 0) + (application.reit_invested_percent ?? 0);
    flaggedResponses.push(`Treatpayer claims to have invested ${totalInvestment}% in a PTP and/or REIT`);
  }

  // Candy for film production
  if (application.candy_to_be_used_for_film) {
    flaggedResponses.push(`Treatpayer claims candy will be used for film/TV production`);
  }

  // Other sources of candy
  if (application.other_sources_of_candy) {
    flaggedResponses.push(`Treatpayer has other sources of candy`);
  }

  // Already submitted 1040-TR-ES
  if (application.already_submitted_1040tres) {
    flaggedResponses.push(`Treatpayer already submitted form 1040-TR-ES`);
  }

  // Total homework count
  if (application.total_homework_count && (application.total_homework_count > 200 || application.total_homework_count < 0)) {
    flaggedResponses.push(`Treatpayer claims ${application.total_homework_count} total homework assignments`);
  }

  // Homework at home count
  if (application.homework_at_home_count && (application.homework_at_home_count > 200 || application.homework_at_home_count < 0)) {
    flaggedResponses.push(`Treatpayer claims ${application.homework_at_home_count} homework assignments completed at home`);
  }

  // Unusual transport methods
  const unusualTransportMethods = ["Riding a horse", "Running", "Riding a skateboard", "Riding a scooter"];
  if (application.transport_method && unusualTransportMethods.includes(application.transport_method)) {
    flaggedResponses.push(`Treatpayer uses unusual transport method: ${application.transport_method}`);
  }

  // Study candy percent
  if (application.study_candy_percent !== null && application.study_candy_percent !== undefined &&
      (application.study_candy_percent < 0 || application.study_candy_percent > 50)) {
    flaggedResponses.push(`Treatpayer claims ${application.study_candy_percent}% of candy for study activities`);
  }

  // Leftover candy
  if (application.leftover_candy) {
    flaggedResponses.push(`Treatpayer expects to have leftover candy at end of year`);
  }

  // Non-arbor percent too high or low
  if (application.non_arbor_percent !== null && application.non_arbor_percent !== undefined &&
      (application.non_arbor_percent < 0 || application.non_arbor_percent > 50)) {
    flaggedResponses.push(`Treatpayer claims ${application.non_arbor_percent}% of candy from non-Arbor streets`);
  }

  return flaggedResponses;
}


export async function loader({ params }: Route.LoaderArgs) {
  const { ticketId } = params;
  // Uncomment this when we have real data in the db
  const application: TreatReturnApplication | null = await prisma.treatReturnApplication.findUnique({
      where: {
        ticketId: ticketId,
      },
      include: {
          auditAppointment: true,
      },
  });


  if (!application) {
      return redirect('/audit');
  }
  return { application };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const applicationId = formData.get("applicationId");
  if (!applicationId || typeof applicationId !== "string") {
    return data({ error: "Invalid application ID" }, { status: 400 });
  }
  await prisma.printJob.create({
    data: {
      status: "UNSTARTED",
      treatReturnApplicationId: parseInt(applicationId),
    },
  });
  return data({ success: "Application sent to print" }, { status: 200 });
}

export default function AuditApplication({ loaderData }: Route.ComponentProps) {
  const { application } = loaderData;
  return <>
    <AdminNavbar />
    <h1 className="text-3xl font-bold mt-4 px-4">Audit Application for {application.ticketId}</h1>
    <div className="px-4">
      <Form method="post">
        <input type="hidden" name="applicationId" value={application.id} />
        <button type="submit" className="bg-trs-blue text-white px-4 py-2 rounded-md mt-4 font-bold">Print Application</button>
      </Form>
    </div>
    <div className="px-4">
      {flagUnusualResponses(application).map((message) => (
        <p className="bg-trs-warning outline outline-1 outline-trs-accent-gold px-4 py-2 mt-4 font-bold" key={message}>
          <ExclamationTriangleIcon className="size-10 inline-block mr-2 text-trs-error" />
          {message}
        </p>
      ))}
    </div>
    <h2 className="text-2xl font-bold mt-4 px-4">Detailed Responses</h2>
    <div className="px-4 space-y-6">
      {/* Step 1: Basic Info */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 1: Basic Information</h3>
        <p>First Name: {application.first_name || "N/A"}</p>
        <p>Favorite Candy: {application.favorite_candy || "N/A"}</p>
      </div>

      {/* Step 2: Costume */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 2: Costume</h3>
        <p>Wearing Costume: {application.wearing_costume ? "Yes" : "No"}</p>
        <p>Costume Category: {application.costume_category || "N/A"}</p>
        <p>Costume Name: {application.costume_name || "N/A"}</p>
      </div>

      {/* Step 3: School */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 3: School</h3>
        <p>Attends School: {application.attends_school ? "Yes" : "No"}</p>
        <p>School Year: {application.school_year || "N/A"}</p>
        <p>School Conditions: {application.school_conditions || "N/A"}</p>
      </div>

      {/* Step 4: Streets */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 4: Streets</h3>
        <p>Multiple Streets: {application.multiple_streets ? "Yes" : "No"}</p>
        <p>Street Names: {application.street_names || "N/A"}</p>
        <p>All from Arbor Ave: {application.all_from_arbor_ave ? "Yes" : "No"}</p>
        <p>Non-Arbor Percent: {application.non_arbor_percent ? `${application.non_arbor_percent * 100}%` : "N/A"}</p>
      </div>

      {/* Step 5: Candy Collection */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 5: Candy Collection</h3>
        <p>Collected Candy Weight: {application.collected_candy_weight_lbs ? `${application.collected_candy_weight_lbs} lbs` : "N/A"}</p>
        <p>Received Tips: {application.received_tips ? "Yes" : "No"}</p>
        <p>Tips Percent: {application.tips_percent ? `${application.tips_percent * 100}%` : "N/A"}</p>
      </div>

      {/* Step 6: Investments & Other Sources */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 6: Investments & Other Sources</h3>
        <p>Invested in PTP: {application.invested_ptp ? "Yes" : "No"}</p>
        <p>PTP Invested Percent: {application.ptp_invested_percent ? `${application.ptp_invested_percent}%` : "N/A"}</p>
        <p>Invested in REIT: {application.invested_reit ? "Yes" : "No"}</p>
        <p>REIT Invested Percent: {application.reit_invested_percent ? `${application.reit_invested_percent}%` : "N/A"}</p>
        <p>Candy to be Used for Film: {application.candy_to_be_used_for_film !== null ? (application.candy_to_be_used_for_film ? "Yes" : "No") : "N/A"}</p>
        <p>Other Sources of Candy: {application.other_sources_of_candy !== null ? (application.other_sources_of_candy ? "Yes" : "No") : "N/A"}</p>
        <p>Already Submitted 1040-TR-ES: {application.already_submitted_1040tres ? "Yes" : "No"}</p>
        <p>Pieces in 1040-TR-ES: {application.pieces_1040tres || "N/A"}</p>
      </div>

      {/* Step 7: Homework */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 7: Homework</h3>
        <p>Completed Three Homework: {application.completed_three_homework ? "Yes" : "No"}</p>
        <p>Total Homework Count: {application.total_homework_count || "N/A"}</p>
        <p>Homework at Home Count: {application.homework_at_home_count || "N/A"}</p>
      </div>

      {/* Step 8: Siblings */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 8: Siblings</h3>
        <p>Has Siblings: {application.has_siblings ? "Yes" : "No"}</p>
        {application.siblings && (
          <p>Siblings: {JSON.stringify(application.siblings)}</p>
        )}
      </div>

      {/* Step 9: Commute */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 9: Commute</h3>
        <p>Has Commute: {application.has_commute ? "Yes" : "No"}</p>
        <p>Transport Method: {application.transport_method || "N/A"}</p>
      </div>

      {/* Step 10: Study */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 10: Study</h3>
        <p>Will Study: {application.will_study ? "Yes" : "No"}</p>
        <p>Candy for Study: {application.candy_for_study !== null ? (application.candy_for_study ? "Yes" : "No") : "N/A"}</p>
        <p>Study Candy Percent: {application.study_candy_percent ? `${application.study_candy_percent}%` : "N/A"}</p>
      </div>

      {/* Step 11: Parents */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 11: Parents</h3>
        <p>Lives with Parents: {application.lives_with_parents ? "Yes" : "No"}</p>
        {application.parents && (
          <p>Parents: {JSON.stringify(application.parents)}</p>
        )}
      </div>

      {/* Step 12: Dental */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 12: Dental</h3>
        <p>Been to Dentist: {application.been_to_dentist ? "Yes" : "No"}</p>
        <p>Dental Work from Candy: {application.dental_work_from_candy !== null ? (application.dental_work_from_candy ? "Yes" : "No") : "N/A"}</p>
        <p>Reimbursed for Dental: {application.reimbursed_for_dental !== null ? (application.reimbursed_for_dental ? "Yes" : "No") : "N/A"}</p>
      </div>

      {/* Step 13: History & Leftovers */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 13: History & Leftovers</h3>
        <p>Years Trick-or-Treating: {application.years_trick_or_treating || "N/A"}</p>
        <p>Flew Sweetwest: {application.flew_sweetwest ? "Yes" : "No"}</p>
        <p>Leftover Candy: {application.leftover_candy ? "Yes" : "No"}</p>
        <p>Leftover Candy Percent: {application.leftover_candy_percent ? `${application.leftover_candy_percent}%` : "N/A"}</p>
        <p>Smarties Received: {application.smarties_received ? "Yes" : "No"}</p>
        <p>Smarties Percent: {application.smarties_percent ? `${application.smarties_percent}%` : "N/A"}</p>
      </div>

      {/* Step 14: Donations */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 14: Donations</h3>
        <p>Donate to SEF: {application.donate_sef ? "Yes" : "No"}</p>
      </div>

      {/* Step 15: Premium */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Step 15: Premium</h3>
        <p>Purchase Premium: {application.purchase_premium ? "Yes" : "No"}</p>
      </div>
    </div>
    
  </>;
}
