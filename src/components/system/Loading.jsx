export default function Loading({ text = "Carregando..." }) {
    return (
        <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span>{text}</span>
        </div>
    );
}
