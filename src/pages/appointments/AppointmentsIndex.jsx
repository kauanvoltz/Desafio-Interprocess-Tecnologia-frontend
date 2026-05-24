import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, Power } from "lucide-react";

import { getAppointments, updateAppointment } from "@/services/appointments.service";
import { getPatients } from "@/services/patients.service";
import Loading from "@/components/system/Loading";
import EmptyState from "@/components/system/EmptyState";
import Modal from "@/components/system/Modal";
import AppointmentDetails from "@/components/appointments/AppointmentDetails";

function StatusBadge({ status }) {
    const isActive = Boolean(status);

    const badgeClass = isActive
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-rose-50 text-rose-700 border-rose-200";

    const dotClass = isActive ? "bg-emerald-500" : "bg-rose-500";
    const label = isActive ? "Ativo" : "Inativo";

    return (
        <Badge variant="outline" className={badgeClass}>
            <span className={`inline-block h-2 w-2 rounded-full ${dotClass}`} />
            {label}
        </Badge>
    );
}

export default function AppointmentsIndex() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");

    const [patientOptions, setPatientOptions] = useState([]);
    const patientNameById = useMemo(() => {
        const map = new Map();
        for (const p of patientOptions) {
            if (p?.id) map.set(p.id, p.name ?? "");
        }
        return map;
    }, [patientOptions]);

    const [patientId, setPatientId] = useState("all");
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const statusValue = useMemo(() => {
        if (status === "all") return undefined;
        if (status === "true") return true;
        if (status === "false") return false;
        return undefined;
    }, [status]);

    const filters = useMemo(() => {
        return {
            patientId: patientId === "all" ? undefined : patientId,
            status: statusValue,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        };
    }, [patientId, statusValue, startDate, endDate]);

    const statusCounts = useMemo(() => {
        const total = appointments.length;
        const active = appointments.filter((a) => Boolean(a?.status)).length;
        const inactive = total - active;

        return {
            all: total,
            active,
            inactive,
        };
    }, [appointments]);

    const [toggleLoadingId, setToggleLoadingId] = useState(null);
    const [toggleError, setToggleError] = useState("");

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const selectedPatient = useMemo(() => {
        if (!selectedAppointment) return null;
        const patientIdRaw = selectedAppointment?.patientId;
        if (!patientIdRaw) return null;

        return patientOptions.find(
            (p) => String(p?.id) === String(patientIdRaw)
        );
    }, [patientOptions, selectedAppointment]);

    const fetchPatients = useCallback(async () => {
        const res = await getPatients();
        const data = res?.data ?? [];
        setPatientOptions(Array.isArray(data) ? data : []);
    }, []);

    const fetchAppointments = useCallback(async () => {
        setServerError("");
        setLoading(true);

        try {
            const res = await getAppointments(filters);
            const data = res?.data ?? [];
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            setServerError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Não foi possível carregar os atendimentos."
            );
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            await fetchPatients();
            if (!mounted) return;
        })();

        return () => {
            mounted = false;
        };
    }, [fetchPatients]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            await fetchAppointments();
            if (!mounted) return;
        })();

        return () => {
            mounted = false;
        };
    }, [fetchAppointments]);

    const handleToggleStatus = useCallback(
        async (appointment) => {
            const nextStatus = !appointment?.status;

            setToggleError("");
            setToggleLoadingId(appointment?.id ?? null);

            try {
                const payload = {
                    patientId: appointment?.patientId,
                    date: appointment?.date,
                    description: appointment?.description,
                    status: nextStatus,
                };

                await updateAppointment(appointment.id, payload);
                const res = await getAppointments(filters);
                const data = res?.data ?? [];
                setAppointments(Array.isArray(data) ? data : []);
            } catch (err) {
                setToggleError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Não foi possível atualizar o status."
                );
            } finally {
                setToggleLoadingId(null);
            }
        },
        [filters]
    );

    const openAppointmentDetailsByAppointment = useCallback((appointment) => {
        setSelectedAppointment(appointment);
        setDetailsOpen(true);
    }, []);

    const total = appointments.length;

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Atendimentos
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Acompanhe os atendimentos agendados e realizados.
                    </p>
                </div>

                <Button asChild className="mt-1 w-fit">
                    <Link to="/appointments/new">+ Novo atendimento</Link>
                </Button>
            </div>

            {toggleError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {toggleError}
                </div>
            ) : null}

            <Card className="rounded-xl overflow-visible">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base"> </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-4">
                        <Input
                            type="date"
                            className="md:col-span-1"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />

                        <Input
                            type="date"
                            className="md:col-span-1"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />

                        <Select value={patientId} onValueChange={setPatientId}>
                            <SelectTrigger className="w-full md:col-span-1">
                                <SelectValue placeholder="Todos os pacientes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os pacientes</SelectItem>
                                {patientOptions.map((p) => (
                                    <SelectItem key={p?.id} value={p?.id}>
                                        {p?.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full md:col-span-1">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Todos ({statusCounts.all})
                                </SelectItem>
                                <SelectItem value="true">
                                    Ativos ({statusCounts.active})
                                </SelectItem>
                                <SelectItem value="false">
                                    Inativos ({statusCounts.inactive})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loading text="Carregando atendimentos..." />
                        </div>
                    ) : serverError ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {serverError}
                        </div>
                    ) : appointments.length === 0 ? (
                        <EmptyState
                            title="Nenhum atendimento"
                            description="Nenhum atendimento encontrado para exibir."
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell className="w-[320px]">
                                        Paciente
                                    </TableCell>
                                    <TableCell className="w-[220px]">
                                        Data / Hora
                                    </TableCell>
                                    <TableCell className="w-[160px]">
                                        Status
                                    </TableCell>
                                    <TableCell className="text-right">
                                        Ações
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {appointments.map((a) => {
                                    const patientName =
                                        patientNameById.get(a?.patientId) ||
                                        "-";

                                    return (
                                        <TableRow key={a?.id} className="cursor-pointer" onClick={() => openAppointmentDetailsByAppointment(a)}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium text-foreground">
                                                        {patientName}
                                                    </div>
                                                    {a?.description ? (
                                                        <div className="text-sm text-muted-foreground">
                                                            {a.description}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-sm text-muted-foreground">
                                                {a?.date}
                                            </TableCell>

                                            <TableCell>
                                                <StatusBadge status={a?.status} />
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-6 pr-1 text-sm">
                                                    <Link
                                                        to={`/appointments/${a?.id}/edit`}
                                                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        Editar
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                                        disabled={toggleLoadingId === a?.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleStatus(a);
                                                        }}
                                                    >
                                                        <Power className="h-4 w-4" />
                                                        {toggleLoadingId === a?.id
                                                            ? "..."
                                                            : a?.status
                                                                ? "Inativar"
                                                                : "Ativar"}
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>

                            <TableCaption>
                                Exibindo {total} de {total} atendimentos
                            </TableCaption>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Modal
                open={detailsOpen}
                onOpenChange={(next) => {
                    setDetailsOpen(next);
                    if (!next) setSelectedAppointment(null);
                }}
                title="Atendimento"
                description="Visualização completa do atendimento."
            >
                {selectedPatient && selectedAppointment ? (
                    <AppointmentDetails
                        appointment={selectedAppointment}
                        patient={selectedPatient}
                    />
                ) : null}
            </Modal>
        </div>
    );
}
