function normalizeStatusToLabel(status) {
    return status ? "Ativo" : "Inativo";
}

function CardField({ label, value }) {
    return (
        <div className="min-w-0 rounded-lg border border-input/60 bg-muted/10 p-3">
            <div className="text-xs font-medium text-muted-foreground">
                {label}
            </div>
            <div className="mt-1 break-words text-sm text-foreground">
                {value || "-"}
            </div>
        </div>
    );
}

export default function PatientDetails({ patient }) {
    const name = patient?.name ?? "-";
    const cpf = patient?.cpf ?? "-";

    const genderRaw = patient?.gender ?? "-";
    const statusLabel = normalizeStatusToLabel(patient?.status);

    const birthDateRaw = patient?.birthDate ?? "-";

    const cep = patient?.cep ?? "";
    const city = patient?.city ?? "";
    const district = patient?.district ?? "";
    const address = patient?.address ?? "";
    const complement = patient?.complement ?? "";

    const location = [city, district].filter(Boolean).join(" • ");

    return (
        <div className="space-y-5 p-6">
            <div>
                <div className="text-sm font-semibold text-foreground">
                    Dados cadastrais
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                    Visualização apenas (somente leitura).
                </div>
            </div>

            <div className="space-y-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Identificação
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <CardField label="Nome completo" value={name} />

                    <CardField label="Data de nascimento" value={birthDateRaw} />

                    <CardField label="CPF" value={cpf} />

                    <CardField label="Sexo" value={genderRaw} />

                    <CardField label="Status" value={statusLabel} />
                </div>
            </div>

            <div className="space-y-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Endereço
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <CardField label="CEP" value={cep} />
                    <CardField label="Cidade/Bairro" value={location} />

                    <div className="md:col-span-2">
                        <CardField label="Endereço" value={address} />
                    </div>

                    <div className="md:col-span-2">
                        <CardField label="Complemento" value={complement} />
                    </div>
                </div>
            </div>
        </div>
    );
}
