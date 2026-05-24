import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Loading from "@/components/system/Loading";
import PatientForm from "@/components/patients/PatientForm";

import { getPatientById, updatePatient } from "@/services/patients.service";

export default function PatientsEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        let mounted = true;

        async function fetchPatient() {
            setServerError("");
            setLoading(true);

            try {
                const res = await getPatientById(id);
                const data = res?.data ?? null;
                if (mounted) setPatient(data);
            } catch (err) {
                const message =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Não foi possível carregar o paciente.";
                if (mounted) setServerError(message);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchPatient();

        return () => {
            mounted = false;
        };
    }, [id]);

    async function handleSubmit(payload) {
        setServerError("");

        try {
            await updatePatient(id, payload);
            navigate("/patients");
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "";

            if (message === "CPF already exists") {
                setServerError("Este CPF já está cadastrado.");
                return;
            }

            setServerError(
                "Não foi possível atualizar o paciente. Tente novamente."
            );
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Editar paciente
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Atualize os dados cadastrais do paciente.
                    </p>
                </div>

                <div className="w-fit">
                    <Link
                        to="/patients"
                        className="inline-flex items-center rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
                    >
                        ← Voltar
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loading text="Carregando paciente..." />
                </div>
            ) : serverError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {serverError}
                </div>
            ) : !patient ? (
                <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-12 text-center text-sm text-muted-foreground">
                    Paciente não encontrado.
                </div>
            ) : (
                <PatientForm
                    mode="edit"
                    initialPatient={patient}
                    serverError={serverError}
                    loading={false}
                    onCancel={() => navigate("/patients")}
                    submitLabel="Salvar alterações"
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}
