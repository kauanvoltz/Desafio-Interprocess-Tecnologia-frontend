import { NavLink } from "react-router-dom";
import { CalendarCheck, UserRound } from "lucide-react";

const menuItems = [
    { to: "/patients", label: "Pacientes", icon: UserRound },
    { to: "/appointments", label: "Atendimentos", icon: CalendarCheck },
];

export default function Sidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 z-30 w-16 border-r bg-background md:w-64">
            <div className="flex h-full flex-col">

                <div className="flex h-14 items-center justify-center gap-3 border-b px-3 md:justify-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="text-sm font-semibold">M</span>
                    </div>

                    <div className="hidden md:block">
                        <div className="text-sm font-semibold leading-tight">ACME Clínica</div>
                        <div className="text-xs text-muted-foreground">Painel administrativo</div>
                    </div>
                </div>


                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-4">
                    <div className="mb-2 px-2 text-xs font-medium text-muted-foreground md:px-3">
                        Geral
                    </div>

                    <nav className="flex flex-col gap-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink key={item.to} to={item.to} className={({ isActive }) =>
                                    [
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                        "md:px-4",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-foreground hover:bg-muted",
                                    ].join(" ")
                                }
                                >
                                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                                    <span className="hidden md:block">{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </aside>
    );
}
