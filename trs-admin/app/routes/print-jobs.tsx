import { Link } from "react-router";
import type { Route } from "./+types/print-jobs";
import { PrismaClient } from 'trs-db'
import AdminNavbar from "../components/AdminNavbar";
import { ClockIcon, CheckIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

const prisma = new PrismaClient();

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "TRS Admin - Print Jobs" },
        {
            name: "description",
            content: "View the status of all print jobs",
        },
    ];
}

export async function loader() {
    const printJobs = await prisma.printJob.findMany({
        include: {
            treatReturnApplication: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return { printJobs };
}

export default function PrintJobs({
    loaderData,
}: Route.ComponentProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UNSTARTED':
                return 'bg-yellow-100 text-yellow-800';
            case 'STARTED':
                return 'bg-blue-100 text-blue-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'UNSTARTED':
                return <ClockIcon className="size-4 inline-block text-gray-500" />;
            case 'STARTED':
                return <ClockIcon className="size-4 inline-block text-blue-500" />;
            case 'COMPLETED':
                return <CheckIcon className="size-4 inline-block text-green-500" />;
            default:
                return <QuestionMarkCircleIcon className="size-4 inline-block text-gray-500" />;
        }
    };

    return (
        <>
            <AdminNavbar />
            <div className="px-4">
                <h1 className="text-3xl font-bold mt-4">Print Jobs</h1>
                <p className="text-gray-600 mt-2">Track the status of all print jobs</p>

                <div className="mt-6">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ticket ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Updated
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loaderData.printJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            No print jobs found
                                        </td>
                                    </tr>
                                ) : (
                                    loaderData.printJobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {job.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {job.treatReturnApplication.ticketId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                                    {getStatusIcon(job.status)} {job.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" suppressHydrationWarning data-timestamp={job.createdAt}>
                                                {new Date(job.createdAt).toISOString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" suppressHydrationWarning data-timestamp={job.updatedAt}>
                                                {new Date(job.updatedAt).toISOString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    to={`/audit/${job.treatReturnApplication.ticketId}`}
                                                    className="text-trs-blue hover:underline"
                                                >
                                                    View Application
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('UNSTARTED')}`}>
                                {getStatusIcon('UNSTARTED')} UNSTARTED
                            </span>
                            <span className="text-sm text-gray-600">- Waiting to be printed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('STARTED')}`}>
                                {getStatusIcon('STARTED')} STARTED
                            </span>
                            <span className="text-sm text-gray-600">- Currently printing</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('COMPLETED')}`}>
                                {getStatusIcon('COMPLETED')} COMPLETED
                            </span>
                            <span className="text-sm text-gray-600">- Successfully printed</span>
                        </div>
                    </div>
                </div>
            </div>
            <script dangerouslySetInnerHTML={{__html: `
                // Format timestamps in Los Angeles timezone
                document.querySelectorAll('[data-timestamp]').forEach(el => {
                    const date = new Date(el.getAttribute('data-timestamp'));
                    el.textContent = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
                });
            `}} />
        </>
    );
}
