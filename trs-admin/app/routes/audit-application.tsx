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
  if ((application.ptp_invested_percent && application.ptp_invested_percent > 0)
    || (application.reit_invested_percent && application.reit_invested_percent > 0)) {
    const totalInvestment = (application.ptp_invested_percent ?? 0) + (application.reit_invested_percent ?? 0);
    flaggedResponses.push(`Treatpayer claims to have invested ${totalInvestment}% in a PTP and/or REIT`);
  }
  if (application.collected_candy_weight_lbs && application.collected_candy_weight_lbs > 5) {
    flaggedResponses.push(`Treatpayer claims to have collected ${application.collected_candy_weight_lbs} lbs of candy`);
  }
  // TODO: Flag more unusual responses here...
  return flaggedResponses;
}


export async function loader({ params }: Route.LoaderArgs) {
  const { ticketId } = params;
  // Uncomment this when we have real data in the db
  // const application: TreatReturnApplication | null = await prisma.treatReturnApplication.findUnique({
  //     where: {
  //       ticketId: ticketId,
  //     },
  //     include: {
  //         auditAppointment: true,
  //     },
  // });

  // Below is placeholder data for testing.
  const application = {
    id: 1,
    ticketId: "1234567890",
    status: "IN_REVIEW",
    createdAt: new Date("2025-10-29T10:00:00Z"),
    updatedAt: new Date("2025-10-29T10:00:00Z"),
    costume_name: "Batman",
    school_year: "6th",
    street_names: "123 Main St, 456 Oak Ave, 789 Pine St",
    collected_candy_weight_lbs: 10.5,
    received_tips_percent: 0.1,
    ptp_invested_percent: 0.2,
    reit_invested_percent: 0.3,
    candy_to_be_used_for_film: true,
    candy_was_gained_from_crime: false,
    already_submitted_1040tres: true,
    reimbursed_for_dental: false,
    will_save_candy_to_eoy: true,
  };
  // End of placeholder data :)

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
      {flagUnusualResponses(application as TreatReturnApplication).map((message) => (
        <p className="bg-trs-warning outline outline-1 outline-trs-accent-gold px-4 py-2 mt-4 font-bold" key={message}>
          <ExclamationTriangleIcon className="size-10 inline-block mr-2 text-trs-error" />
          {message}
        </p>
      ))}
    </div>
    <h2 className="text-2xl font-bold mt-4 px-4">Detailed Responses</h2>
    <div className="px-4">
      <p>Costume Name: {application.costume_name}</p>
      <p>School Year: {application.school_year}</p>
      <p>Street Names: {application.street_names}</p>
      <p>Collected Candy Weight: {application.collected_candy_weight_lbs} lbs</p>
      <p>Received Tips Percent: {application.received_tips_percent * 100}%</p>
      <p>PTP Invested Percent: {application.ptp_invested_percent * 100}%</p>
      <p>REIT Invested Percent: {application.reit_invested_percent * 100}%</p>
      <p>Candy to be Used for Film: {application.candy_to_be_used_for_film ? "Yes" : "No"}</p>
      <p>Candy was Gained from Crime: {application.candy_was_gained_from_crime ? "Yes" : "No"}</p>
      <p>Already Submitted 1040-TR-ES: {application.already_submitted_1040tres ? "Yes" : "No"}</p>
      <p>Reimbursed for Dental: {application.reimbursed_for_dental ? "Yes" : "No"}</p>
      <p>Will Save Candy to End of Year: {application.will_save_candy_to_eoy ? "Yes" : "No"}</p>
    </div>
    
  </>;
}
