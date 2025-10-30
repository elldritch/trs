import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { MagnifyingGlassIcon, CalendarDaysIcon } from '@heroicons/react/24/solid'

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
            <header className="h-18 py-4 bg-trs-blue flex items-center justify-between px-6">
                <div className="flex items-center">
                {/* <img src="/trs-logo.png" className="h-14 inline-block" /> */}
                <Link to="/"><p className="inline-block text-white font-serif text-4xl">TRS</p></Link>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-white text-xl">SEARCH</p>
                    <div className="w-px h-4 bg-white"></div>
                    <p className="text-white text-xl">SIGN IN</p>
                </div>
            </header>
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
