import { PrismaClient } from "trs-db";
import type { Route } from "./+types/view-recent";
import { Link } from "react-router";
import AdminNavbar from "../components/AdminNavbar";

const prisma = new PrismaClient();


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "TRS Admin - View Recent Applications" },
        {
            name: "description",
            content: "View recent applications for TRS audits",
        },
    ];
}


export async function loader() {
    const applications = await prisma.treatReturnApplication.findMany({
        include: {
            auditAppointment: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 50,
    });
    return { applications };
}

type ApplicationWithAppointment = Awaited<ReturnType<typeof loader>>['applications'][number];


export default function ViewRecent({ loaderData }: Route.ComponentProps) {
    return <>
        <AdminNavbar />
        <div className="px-4 mt-6">
            <h1 className="text-2xl font-semibold mb-4">View Recent Applications</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                Ticket Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                Has Appointment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loaderData.applications.map((application: ApplicationWithAppointment) => (
                            <tr key={application.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {application.ticketId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(application.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {application.auditAppointment ? 'Yes' : 'No'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Link
                                        to={`/audit/${application.ticketId}`}
                                        className="text-trs-blue hover:underline font-medium"
                                    >
                                        View Application
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>;
}
