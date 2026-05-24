export default function EmptyState({
    title = "Nada por aqui",
    description = "Não encontramos dados para exibir.",
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-10 text-center">
            <div className="text-sm font-medium">{title}</div>
            <div className="mt-1 text-sm text-muted-foreground">
                {description}
            </div>
        </div>
    );
}
