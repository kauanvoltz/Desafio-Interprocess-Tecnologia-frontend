import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PatientForm from "@/components/patients/PatientForm";
import Loading from "@/components/system/Loading";

import { createPatient } from "@/services/patients.service";

export default function PatientsNew() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(payload) {
        setServerError("");

        try {
            setLoading(true);
            await createPatient(payload);
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
                "Não foi possível cadastrar o paciente. Tente novamente."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Novo paciente
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Preencha os dados cadastrais do paciente.
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

            <PatientForm
                mode="create"
                initialPatient={null}
                serverError={serverError}
                loading={loading}
                submitLabel="Cadastrar paciente"
                onCancel={() => navigate("/patients")}
                onSubmit={handleSubmit}
            />


            {loading ? (
                <div className="sr-only">
                    <Loading text="Carregando..." />
                </div>
            ) : null}
        </div>
    );
}
