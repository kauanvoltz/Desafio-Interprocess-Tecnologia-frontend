import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import Loading from "@/components/system/Loading";

import { createAppointment } from "@/services/appointments.service";
import { getActivePatients } from "@/services/patients.service";
import { datetimeLocalToBackend } from "@/lib/datetime";

function multilineToBr(text) {
    return String(text ?? "").replace(/\r\n|\n|\r/g, "<br>");
}

export default function AppointmentsNew() {
    const navigate = useNavigate();

    const statusOptions = useMemo(
        () => [
            { value: "true", label: "Ativo" },
            { value: "false", label: "Inativo" },
        ],
        []
    );

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");

    const { register, handleSubmit, setValue, watch, formState: { errors }, } = useForm({
        defaultValues: {
            patientId: "",
            datetime: "",
            description: "",
            status: "true",
        },
    });

    const statusValue = watch("status");

    useEffect(() => {
        let mounted = true;

        async function fetchPatients() {
            setServerError("");
            setLoading(true);

            try {
                const res = await getActivePatients();
                const data = Array.isArray(res?.data) ? res.data : [];
                if (mounted) setPatients(data);
            } catch (err) {
                if (!mounted) return;
                setServerError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Não foi possível carregar os pacientes ativos."
                );
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchPatients();

        return () => {
            mounted = false;
        };
    }, []);

    async function submitForm(values) {
        setServerError("");

        const payload = {
            patientId: values.patientId,
            date: datetimeLocalToBackend(values.datetime),
            description: multilineToBr(values.description ?? ""),
            status: values.status === "true",
        };

        try {
            await createAppointment(payload);
            navigate("/appointments");
        } catch (err) {
            setServerError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Não foi possível cadastrar o atendimento."
            );
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Novo atendimento
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Registre os detalhes do atendimento.
                    </p>
                </div>

                <Button asChild variant="outline" className="w-fit">
                    <Link to="/appointments">← Voltar</Link>
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loading text="Carregando..." />
                </div>
            ) : serverError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {serverError}
                </div>
            ) : (
                <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            Informações do atendimento
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit(submitForm)}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Paciente
                                    </div>

                                    <Select
                                        value={String(watch("patientId") ?? "")}
                                        onValueChange={(v) =>
                                            setValue("patientId", v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o paciente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.map((p) => (
                                                <SelectItem
                                                    key={p?.id}
                                                    value={String(p?.id ?? "")}
                                                >
                                                    {p?.name ?? ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {errors.patientId ? (
                                        <p className="text-sm text-destructive">
                                            {errors.patientId.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Data e hora
                                    </div>

                                    <Input
                                        type="datetime-local"
                                        {...register("datetime", {
                                            required: "Data e hora são obrigatórias.",
                                        })}
                                    />

                                    {errors.datetime ? (
                                        <p className="text-sm text-destructive">
                                            {errors.datetime.message}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Status
                                    </div>

                                    <Select
                                        value={statusValue}
                                        onValueChange={(v) =>
                                            setValue("status", v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((s) => (
                                                <SelectItem
                                                    key={s.value}
                                                    value={s.value}
                                                >
                                                    {s.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        &nbsp;
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="text-sm font-medium">
                                    Descrição
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Anotações, queixas, conduta e observações.
                                    Quebras de linha serão enviadas como{" "}
                                    <code>{"<br>"}</code>.
                                </div>

                                <textarea
                                    className="min-h-36 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Descreva o atendimento."
                                    {...register("description")}
                                />
                            </div>

                            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/appointments")}
                                >
                                    Cancelar
                                </Button>

                                <Button className="bg-primary" type="submit">
                                    Cadastrar atendimento
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
