import { Link, Form, data, useActionData } from "react-router";
import type { Route } from "./+types/appointments";
import { PrismaClient } from 'trs-db'
import AdminNavbar from "../components/AdminNavbar";

const prisma = new PrismaClient();

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "TRS Admin - Appointments" },
        {
            name: "description",
            content: "View all appointments for TRS audits",
        },
    ];
}

export async function loader() {
    const appointments = await prisma.auditAppointment.findMany({
        include: {
            treatReturnApplication: true,
        },
        orderBy: {
            timeslot: 'asc',
        },
    });
    return { appointments };
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "createSlots") {
        const timeslot = formData.get("timeslot");
        const count = formData.get("count");

        if (!timeslot || typeof timeslot !== "string") {
            return data({ error: "Please enter a time slot", intent: "createSlots" }, { status: 400 });
        }

        if (!count || typeof count !== "string") {
            return data({ error: "Please enter a slot count", intent: "createSlots" }, { status: 400 });
        }

        const countNum = parseInt(count, 10);
        if (isNaN(countNum) || countNum < 1) {
            return data({ error: "Slot count must be a positive number", intent: "createSlots" }, { status: 400 });
        }

        const timeslotDate = new Date(timeslot);
        if (isNaN(timeslotDate.getTime())) {
            return data({ error: "Invalid time slot format", intent: "createSlots" }, { status: 400 });
        }

        // Create multiple appointment slots with the same timeslot
        const createPromises = Array.from({ length: countNum }, () =>
            prisma.auditAppointment.create({
                data: {
                    timeslot: timeslotDate,
                },
            })
        );

        await Promise.all(createPromises);

        return data({ success: `Created ${countNum} appointment slot(s) for ${timeslotDate.toLocaleString()}`, intent: "createSlots" });
    }

    if (intent === "bookAppointment") {
        const appointmentId = formData.get("appointmentId");
        const ticketId = formData.get("ticketId");

        if (!appointmentId || typeof appointmentId !== "string") {
            return data({ error: "Please select an appointment", intent: "bookAppointment" }, { status: 400 });
        }

        if (!ticketId || typeof ticketId !== "string") {
            return data({ error: "Please enter a ticket ID", intent: "bookAppointment" }, { status: 400 });
        }

        const appointmentIdNum = parseInt(appointmentId, 10);
        if (isNaN(appointmentIdNum)) {
            return data({ error: "Invalid appointment ID", intent: "bookAppointment" }, { status: 400 });
        }

        // Check if appointment exists and is available
        const appointment = await prisma.auditAppointment.findUnique({
            where: { id: appointmentIdNum },
        });

        if (!appointment) {
            return data({ error: "Appointment not found", intent: "bookAppointment" }, { status: 404 });
        }

        if (appointment.treatReturnApplicationId) {
            return data({ error: "This appointment slot is already booked", intent: "bookAppointment" }, { status: 400 });
        }

        // Check if application exists
        const application = await prisma.treatReturnApplication.findUnique({
            where: { ticketId: ticketId.trim() },
        });

        if (!application) {
            return data({ error: `Application with ticket ID "${ticketId}" not found`, intent: "bookAppointment" }, { status: 404 });
        }

        // Check if application already has an appointment
        const existingAppointment = await prisma.auditAppointment.findUnique({
            where: { treatReturnApplicationId: application.id },
        });

        if (existingAppointment) {
            return data({ error: `Application ${ticketId} already has an appointment booked`, intent: "bookAppointment" }, { status: 400 });
        }

        // Book the appointment
        await prisma.auditAppointment.update({
            where: { id: appointmentIdNum },
            data: {
                treatReturnApplicationId: application.id,
            },
        });

        return data({ success: `Successfully booked appointment for application ${ticketId}`, intent: "bookAppointment" });
    }

    return data({ error: "Invalid action" }, { status: 400 });
}


export default function Appointments({
    loaderData,
}: Route.ComponentProps) {
    const actionData = useActionData<typeof action>();

    return (
        <>
            <AdminNavbar />
            <div className="px-4">
                <h1 className="text-3xl font-bold mt-4 mb-6">Appointments</h1>

                {/* Create New Slots Form */}
                <div className="mb-8 bg-white border border-gray-300 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Create New Appointment Slots</h2>
                    <Form method="post" className="flex flex-col gap-4">
                        <input type="hidden" name="intent" value="createSlots" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="timeslot" className="block text-sm font-medium text-gray-700 mb-1">
                                    Time Slot
                                </label>
                                <input
                                    type="datetime-local"
                                    id="timeslot"
                                    name="timeslot"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Slots
                                </label>
                                <input
                                    type="number"
                                    id="count"
                                    name="count"
                                    min="1"
                                    defaultValue="1"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="bg-trs-blue text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
                            >
                                Create Slots
                            </button>
                        </div>
                        {actionData && 'intent' in actionData && actionData.intent === 'createSlots' && 'error' in actionData && (
                            <p className="text-red-600 text-sm">{String(actionData.error)}</p>
                        )}
                        {actionData && 'intent' in actionData && actionData.intent === 'createSlots' && 'success' in actionData && (
                            <p className="text-green-600 text-sm">{String(actionData.success)}</p>
                        )}
                    </Form>
                </div>

                {/* Book Appointment Form */}
                <div className="mb-8 bg-white border border-gray-300 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Book Appointment Slot</h2>
                    <Form method="post" className="flex flex-col gap-4">
                        <input type="hidden" name="intent" value="bookAppointment" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Available Appointment Slot
                                </label>
                                <select
                                    id="appointmentId"
                                    name="appointmentId"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select a time slot...</option>
                                    {loaderData.appointments
                                        .filter(apt => !apt.treatReturnApplication)
                                        .map((appointment) => (
                                            <option key={appointment.id} value={appointment.id}>
                                                {new Date(appointment.timeslot).toLocaleString()}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Application Ticket ID
                                </label>
                                <input
                                    type="text"
                                    id="ticketId"
                                    name="ticketId"
                                    required
                                    placeholder="e.g., ABC123"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium"
                            >
                                Book Appointment
                            </button>
                        </div>
                        {actionData && 'intent' in actionData && actionData.intent === 'bookAppointment' && 'error' in actionData && (
                            <p className="text-red-600 text-sm">{String(actionData.error)}</p>
                        )}
                        {actionData && 'intent' in actionData && actionData.intent === 'bookAppointment' && 'success' in actionData && (
                            <p className="text-green-600 text-sm">{String(actionData.success)}</p>
                        )}
                    </Form>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Time Slot
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Ticket ID
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loaderData.appointments.map((appointment) => {
                                const isAvailable = !appointment.treatReturnApplication;
                                return (
                                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900" suppressHydrationWarning data-timestamp={appointment.timeslot}>
                                            {new Date(appointment.timeslot).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {isAvailable ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Available
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Claimed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {appointment.treatReturnApplication?.ticketId || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {appointment.treatReturnApplication && (
                                                <Link
                                                    to={`/audit/${appointment.treatReturnApplication.ticketId}`}
                                                    className="text-trs-blue hover:text-blue-700 font-medium"
                                                >
                                                    View Audit
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {loaderData.appointments.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No appointments found.</p>
                    )}
                </div>
            </div>
        </>
    );
}
