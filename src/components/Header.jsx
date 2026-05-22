import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Sidebar from "@/components/Sidebar";

export default function Header() {
    return (
        <header className="sticky top-0 z-20 h-14 w-full border-b bg-background">
            <div className="flex h-14 items-center gap-3 px-4 md:px-6">
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Abrir menu"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="text-sm font-semibold">A</span>
                    </div>
                    <div className="leading-tight">
                        <div className="text-sm font-semibold">ACME Clínica</div>
                        <div className="text-xs text-muted-foreground">
                            Painel administrativo
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
