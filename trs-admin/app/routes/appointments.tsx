import { Link } from "react-router";
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
    });
    return { appointments };
}


export default function Appointments({
    loaderData,
}: Route.ComponentProps) {
    return (
        <>
            <AdminNavbar />
            <h1 className="text-3xl font-bold mt-4 px-4">Appointments</h1>
            <ul>
                {loaderData.appointments.map((appointment) => (
                    <li key={appointment.id}>
                        <span suppressHydrationWarning data-timestamp={appointment.timeslot}>
                            {new Date(appointment.timeslot).toISOString()}
                        </span> - {appointment.treatReturnApplication?.ticketId}
                        {appointment.treatReturnApplication && (
                            <Link to={`/audit/${appointment.treatReturnApplication.ticketId}`}> View Application</Link>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}
