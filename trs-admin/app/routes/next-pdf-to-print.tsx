import { PrismaClient } from 'trs-db'
import type { Route } from "./+types/next-pdf-to-print";
import { data } from "react-router";

const prisma = new PrismaClient();


export async function loader() {
    const printJob = await prisma.printJob.findFirst({
        where: { status: 'UNSTARTED' },
        include: {
            treatReturnApplication: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    if (!printJob) {
        return data({ error: 'No PDFs to print' }, { status: 404 });
    }

    await prisma.printJob.update({
        where: { id: printJob.id },
        data: { status: 'STARTED' },
    });

    const ticketId = printJob.treatReturnApplication.ticketId;
    const pdfData = printJob.treatReturnApplication.renderedPdf;

    return new Response(pdfData, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="TRS_${ticketId}.pdf"`,
        },
    });
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const filename = formData.get("filename");

    if (!filename || typeof filename !== "string") {
        return data({ error: 'Invalid filename' }, { status: 400 });
    }

    const match = filename.match(/TRS_(.+)\.pdf$/);
    if (!match) {
        return data({ error: 'Invalid filename format' }, { status: 400 });
    }

    const ticketId = match[1];

    const printJob = await prisma.printJob.findFirst({
        where: {
            status: 'STARTED',
            treatReturnApplication: {
                ticketId: ticketId
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    if (!printJob) {
        return data({
            error: `No STARTED print job found for ticket ${ticketId}`
        }, { status: 404 });
    }
    await prisma.printJob.update({
        where: { id: printJob.id },
        data: { status: 'COMPLETED' },
    });

    return data({ success: true, ticketId }, { status: 200 });
}
