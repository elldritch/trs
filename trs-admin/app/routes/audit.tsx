import { PrismaClient } from "trs-db";
import type { Route } from "./+types/audit";
import { redirect, data, Form, useActionData } from "react-router";
import type { TreatReturnApplication } from "node_modules/trs-db/generated/prisma/client";
import AdminNavbar from "../components/AdminNavbar";

const prisma = new PrismaClient();


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "TRS Admin - Look up an application" },
        {
            name: "description",
            content: "Look up an application by ticket ID",
        },
    ];
}


export async function loader() {
    const applications: TreatReturnApplication[] = await prisma.treatReturnApplication.findMany({
        include: {
            auditAppointment: true,
        },
    });
    return { applications };
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const ticketId = formData.get("ticketId");

    if (!ticketId || typeof ticketId !== "string") {
        return data({ error: "Please enter a ticket ID" }, { status: 400 });
    }

    const application = await prisma.treatReturnApplication.findUnique({
        where: { ticketId },
    });

    if (!application) {
        return data({ error: `No application found with ticket ID "${ticketId}"` }, { status: 404 });
    }

    return redirect(`/audit/${ticketId}`);
}


export default function Audit({ loaderData }: Route.ComponentProps) {
    const actionData = useActionData<typeof action>();

    return <>
        <AdminNavbar />
        <h1 className="text-3xl font-bold mt-4 px-4 text-gray-900 dark:text-gray-100">Look up an application by ticket ID</h1>
        <Form method="post" className="flex flex-col gap-2 px-4">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    name="ticketId"
                    placeholder="Enter ticket ID"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <button type="submit" className="bg-trs-blue text-white px-4 py-2 rounded-md">Search</button>
            </div>
            {actionData?.error && (
                <p className="text-red-600 dark:text-red-400 text-sm">{actionData.error}</p>
            )}
        </Form>
        <ul>
            {/* {loaderData.applications.map((application: TreatReturnApplication & { auditAppointment: AuditAppointment[] }) => (
            <li key={application.id}>{application.ticketId} -
            <Link to={`/audit/${application.ticketId}`}>View Application</Link>
            </li>
        ))} */}
        </ul>
    </>;
}
