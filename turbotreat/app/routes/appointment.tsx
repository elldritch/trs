import { Form, data, useActionData, Link } from "react-router";
import type { Route } from "./+types/appointment";
import { PrismaClient } from 'trs-db'

const prisma = new PrismaClient();

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TurboTreat® - Book Appointment" },
    {
      name: "description",
      content: "Book your TRS audit appointment",
    },
  ];
}

interface TimeSlotGroup {
  timeslot: Date;
  availableCount: number;
  appointmentIds: number[];
}

export async function loader() {
  // Get all appointments
  const appointments = await prisma.auditAppointment.findMany({
    where: {
      treatReturnApplicationId: null, // Only available slots
    },
    orderBy: {
      timeslot: 'asc',
    },
  });

  // Group by timeslot and count available slots
  const timeSlotMap = new Map<string, TimeSlotGroup>();

  for (const appointment of appointments) {
    const timeslotKey = appointment.timeslot.toISOString();
    if (!timeSlotMap.has(timeslotKey)) {
      timeSlotMap.set(timeslotKey, {
        timeslot: appointment.timeslot,
        availableCount: 0,
        appointmentIds: [],
      });
    }
    const group = timeSlotMap.get(timeslotKey)!;
    group.availableCount++;
    group.appointmentIds.push(appointment.id);
  }

  const timeSlots = Array.from(timeSlotMap.values());

  return { timeSlots };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const timeslotKey = formData.get("timeslot");
  const ticketId = formData.get("ticketId");

  if (!timeslotKey || typeof timeslotKey !== "string") {
    return data({ error: "Please select a time slot" }, { status: 400 });
  }

  if (!ticketId || typeof ticketId !== "string") {
    return data({ error: "Please enter your treat return ID" }, { status: 400 });
  }

  // Check if application exists
  const application = await prisma.treatReturnApplication.findUnique({
    where: { ticketId: ticketId.trim() },
  });

  if (!application) {
    return data({ error: `Treat return ID "${ticketId}" not found. Please check your ID and try again.` }, { status: 404 });
  }

  // Check if application already has an appointment
  const existingAppointment = await prisma.auditAppointment.findUnique({
    where: { treatReturnApplicationId: application.id },
  });

  if (existingAppointment) {
    return data({
      error: `Your return (${ticketId}) already has an appointment booked for ${new Date(existingAppointment.timeslot).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`
    }, { status: 400 });
  }

  // Find an available appointment for this timeslot
  const timeslotDate = new Date(timeslotKey);
  const availableAppointment = await prisma.auditAppointment.findFirst({
    where: {
      timeslot: timeslotDate,
      treatReturnApplicationId: null,
    },
  });

  if (!availableAppointment) {
    return data({ error: "This time slot is no longer available. Please select another time slot." }, { status: 400 });
  }

  // Book the appointment
  await prisma.auditAppointment.update({
    where: { id: availableAppointment.id },
    data: {
      treatReturnApplicationId: application.id,
    },
  });

  return data({
    success: `Appointment successfully booked for ${new Date(timeslotDate).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}!`,
    ticketId
  });
}

export default function Appointment({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();

  return (
    <>
      <header className="h-8 px-4 mt-4">
        <img src="/unintuit-turbotreat.png" className="h-full" />
      </header>
      <main className="p-4">
        <div className="rounded-lg bg-stone-100 py-10 px-8">
          <h1 className="text-2xl font-light text-center mb-6">
            Book Your TRS Audit Appointment
          </h1>

          {actionData && 'success' in actionData ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <p className="text-green-800 font-medium">{actionData.success}</p>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Your appointment confirmation for treat return ID <strong>{actionData.ticketId}</strong> has been recorded.
                Please arrive on time for your audit appointment.
              </p>
              <Link to="/">
                <button className="rounded-md bg-sky-700 font-medium text-lg text-white w-full py-2">
                  Return to Home
                </button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-center text-gray-600 mb-6">
                Select an available appointment time and enter your treat return ID to book your audit appointment.
              </p>

              <Form method="post" className="flex flex-col gap-6">
                <div>
                  <label htmlFor="timeslot" className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  {loaderData.timeSlots.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <p className="text-yellow-800 text-sm">
                        No appointment slots are currently available. Please check back later.
                      </p>
                    </div>
                  ) : (
                    <select
                      id="timeslot"
                      name="timeslot"
                      required
                      className="w-full p-3 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="">Select a time slot...</option>
                      {loaderData.timeSlots.map((slot) => (
                        <option key={slot.timeslot.toISOString()} value={slot.timeslot.toISOString()}>
                          {new Date(slot.timeslot).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} ({slot.availableCount} slot{slot.availableCount !== 1 ? 's' : ''} available)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Treat Return ID
                  </label>
                  <input
                    type="text"
                    id="ticketId"
                    name="ticketId"
                    required
                    placeholder="e.g., ABC123D"
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is the ID you received after submitting your treat return.
                  </p>
                </div>

                {actionData && 'error' in actionData && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800 text-sm">{actionData.error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loaderData.timeSlots.length === 0}
                  className="rounded-md bg-sky-700 font-medium text-lg text-white w-full py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Book Appointment
                </button>
              </Form>

              <div className="mt-6 text-center">
                <Link to="/" className="text-sky-700 hover:text-sky-800 text-sm">
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
