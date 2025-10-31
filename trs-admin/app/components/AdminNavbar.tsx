import { Link } from "react-router";

export default function AdminNavbar() {
    return (
        <header className="h-18 py-4 bg-trs-blue flex items-center justify-between px-6">
            <div className="flex items-center">
            <Link to="/"><img src="/trs-logo-white.png" className="h-10 inline-block" /></Link>
            </div>
            <div className="flex items-center gap-4">
                <p className="text-white text-xl">SEARCH</p>
                <div className="w-px h-4 bg-white"></div>
                <p className="text-white text-xl">SIGN IN</p>
            </div>
        </header>
    );
}
