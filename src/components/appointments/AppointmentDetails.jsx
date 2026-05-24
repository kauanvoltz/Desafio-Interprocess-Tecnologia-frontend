
function normalizeStatusToLabel(status) {
    return status ? "Ativo" : "Inativo";
}

function brToNewline(description) {
    return String(description ?? "").replace(/<br\s*\/?>/gi, "\n");
}

function CardField({ label, value, children }) {
    return (
        <div className="min-w-0 rounded-lg border border-input/60 bg-muted/10 p-3">
            <div className="text-xs font-medium text-muted-foreground">
                {label}
            </div>
            <div className="mt-1 whitespace-pre-line break-words text-sm text-foreground">
                {children ?? value ?? "-"}
            </div>
        </div>
    );
}

export default function AppointmentDetails({ appointment, patient }) {
    const patientName = patient?.name ?? "-";
    const dateValue = appointment?.date

    const description = appointment?.description ?? "";
    const statusLabel = normalizeStatusToLabel(appointment?.status);

    const descriptionText = brToNewline(description);

    return (
        <div className="space-y-5 p-6">
            <div>
                <div className="text-sm font-semibold text-foreground">
                    Informações do atendimento
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                    Visualização apenas (somente leitura).
                </div>
            </div>

            <div className="space-y-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Detalhes
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <CardField label="Paciente" value={patientName} />
                    <CardField label="Data e hora" value={dateValue} />
                    <CardField
                        label="Descrição"
                        value={descriptionText || "-"}
                    />
                    <CardField label="Status" value={statusLabel} />
                </div>
            </div>
        </div>
    );
}
