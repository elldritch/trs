import { Link } from "react-router";

export default function AdminNavbar() {
    return (
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
    );
}
