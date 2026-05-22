import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AppLayout() {
    return (
        <div className="min-h-dvh bg-background">
            <Sidebar />
            <div className="md:pl-64 pl-16">
                <Header />
                <main className="mx-auto w-full px-4 py-6 md:px-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
