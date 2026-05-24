import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Modal({ open, onOpenChange, title, description, children, trigger, side = "right", }) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {trigger ? trigger : null}

            <SheetContent
                side={side}
                className="w-full sm:max-w-xl h-[calc(100vh-2rem)] overflow-y-auto"
            >
                <SheetHeader>
                    {title ? <SheetTitle>{title}</SheetTitle> : null}
                    {description ? (
                        <SheetDescription>{description}</SheetDescription>
                    ) : null}
                </SheetHeader>

                <div className="mt-4">{children}</div>

                <div className="mt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange?.(false)}
                        className="hidden"
                    >
                        Close
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
