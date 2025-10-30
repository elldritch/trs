import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { MagnifyingGlassIcon, CalendarDaysIcon } from '@heroicons/react/24/solid'
import AdminNavbar from "../components/AdminNavbar";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "TRS Admin - Dashboard" },
        {
            name: "description",
            content: "Dashboard for all TRS admin functionality",
        },
    ];
}


export default function Dashboard({
}: Route.ComponentProps) {
    return (
        <>
            <AdminNavbar />
            <h1 className="text-3xl font-bold mt-4 px-4">
                How can we help you?
            </h1>
            <ul className="">
                <li className="py-4 px-4"><MagnifyingGlassIcon className="size-10 inline-block text-trs-blue font-bold"/>
                <p className="inline-block text-trs-blue font-bold px-4"><Link to="/audit">Look up an application</Link></p></li>
                <li className="py-4 px-4"><CalendarDaysIcon className="size-10 inline-block text-trs-blue font-bold"/>
                <p className="inline-block text-trs-blue font-bold px-4"><Link to="/appointments">Book an audit appointment</Link></p></li>
            </ul>
        </>
    );
}
