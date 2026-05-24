import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import Loading from "@/components/system/Loading";

import { getAppointmentById, updateAppointment } from "@/services/appointments.service";
import { getPatients } from "@/services/patients.service";
import { backendToDatetimeLocal, datetimeLocalToBackend } from "@/lib/datetime";


export default function AppointmentsEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");

    const [patients, setPatients] = useState([]);

    const { register, handleSubmit, setValue, watch, formState: { errors }, } =
        useForm({
            defaultValues: {
                patientId: "",
                date: "",
                description: "",
                status: "true",
            },
        });

    const statusValue = watch("status");

    const patientOptions = useMemo(() => {
        return (patients || []).map((p) => ({
            id: String(p?.id ?? ""),
            name: p?.name ?? "",
        }));
    }, [patients]);

    useEffect(() => {
        let mounted = true;

        async function fetchAll() {
            setServerError("");
            setLoading(true);

            try {
                const [apptRes, patientsRes] = await Promise.all([
                    getAppointmentById(id),
                    getPatients(),
                ]);

                if (!mounted) return;

                setPatients(Array.isArray(patientsRes?.data) ? patientsRes.data : []);

                const appt = apptRes?.data;

                setValue("patientId", appt?.patientId ? String(appt.patientId) : "");
                setValue("date", backendToDatetimeLocal(appt?.date));
                setValue("description", appt?.description ?? "");
                setValue("status", appt?.status === false ? "false" : "true");
            } catch (err) {
                if (!mounted) return;
                setServerError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Não foi possível carregar o atendimento."
                );
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchAll();

        return () => {
            mounted = false;
        };
    }, [id, setValue]);

    async function submitForm(values) {
        setServerError("");

        const payload = {
            patientId: values.patientId,
            date: datetimeLocalToBackend(values.date),
            description: values.description ?? "",
            status: values.status === "true",
        };

        try {
            await updateAppointment(id, payload);
            navigate("/appointments");
        } catch (err) {
            setServerError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Não foi possível salvar o atendimento."
            );
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Editar atendimento
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Atualize as informações do atendimento.
                    </p>
                </div>

                <div className="w-fit">
                    <Link
                        to="/appointments"
                        className="inline-flex items-center rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
                    >
                        ← Voltar
                    </Link>
                </div>
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
                        <CardTitle className="text-base">Informações</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form className="space-y-4" onSubmit={handleSubmit(submitForm)}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Paciente</div>
                                    <Select
                                        value={String(watch("patientId") ?? "")}
                                        onValueChange={(v) => setValue("patientId", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patientOptions.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.patientId ? (
                                        <p className="text-sm text-destructive">{errors.patientId.message}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Data e hora</div>
                                    <Input
                                        type="datetime-local"
                                        {...register("date", { required: "Data é obrigatória." })}
                                    />
                                    {errors.date ? (
                                        <p className="text-sm text-destructive">{errors.date.message}</p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-medium">Descrição</div>
                                <textarea
                                    className="min-h-28 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Descreva o atendimento."
                                    {...register("description")}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-medium">Status</div>
                                <Select
                                    value={statusValue}
                                    onValueChange={(v) => setValue("status", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Ativo</SelectItem>
                                        <SelectItem value="false">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/appointments")}
                                >
                                    Cancelar
                                </Button>

                                <Button className="bg-primary" type="submit">
                                    Salvar alterações
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
