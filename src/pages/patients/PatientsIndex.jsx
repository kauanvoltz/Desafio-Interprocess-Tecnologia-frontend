import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, Power } from "lucide-react";

import { getPatients, updatePatient } from "@/services/patients.service";
import Loading from "@/components/system/Loading";
import EmptyState from "@/components/system/EmptyState";
import Modal from "@/components/system/Modal";
import PatientDetails from "@/components/patients/PatientDetails";

function onlyDigits(value) {
    return String(value ?? "").replace(/\D+/g, "");
}

function formatLocation(patient) {
    const city = patient?.city ? String(patient.city) : "";
    const district = patient?.district ? String(patient.district) : "";
    if (city && district) return `${city} • ${district}`;
    if (city) return city;
    if (district) return district;
    return "";
}

function StatusBadge({ status }) {
    const isActive = Boolean(status);

    const badgeClass = isActive
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-slate-100 text-slate-600 border-slate-200";

    const dotClass = isActive ? "bg-emerald-500" : "bg-slate-400";
    const label = isActive ? "Ativo" : "Inativo";

    return (
        <Badge variant="outline" className={badgeClass}>
            <span className={`inline-block h-2 w-2 rounded-full ${dotClass}`} />
            {label}
        </Badge>
    );
}

function patientToUpdatePayload(patient, nextStatus) {
    // backend espera birthDate em dd/mm/yyyy (string vinda do banco)
    return {
        name: patient?.name ?? "",
        birthDate: patient?.birthDate ?? undefined,
        cpf: patient?.cpf ?? "",
        gender: patient?.gender ?? "",
        status: Boolean(nextStatus),

        cep: patient?.cep ?? undefined,
        city: patient?.city ?? undefined,
        district: patient?.district ?? undefined,
        address: patient?.address ?? undefined,
        complement: patient?.complement ?? undefined,
    };
}

export default function PatientsIndex() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");

    const [toggleLoadingId, setToggleLoadingId] = useState(null);
    const [toggleError, setToggleError] = useState("");

    // filters
    const [nameQuery, setNameQuery] = useState("");
    const [cpfQuery, setCpfQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

    // modal de detalhes (somente leitura)
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        let mounted = true;

        async function fetchPatients() {
            setServerError("");
            setLoading(true);

            try {
                const res = await getPatients();
                const data = res?.data ?? [];
                if (mounted) setPatients(Array.isArray(data) ? data : []);
            } catch (err) {
                if (!mounted) return;

                setServerError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Não foi possível carregar os pacientes."
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

    const activeCount = useMemo(() => {
        return patients.filter((p) => Boolean(p?.status)).length;
    }, [patients]);

    const total = patients.length;

    const filteredPatients = useMemo(() => {
        const nameQ = String(nameQuery ?? "").trim().toLowerCase();
        const cpfQ = onlyDigits(cpfQuery).trim();

        return patients.filter((p) => {
            const nameOk = nameQ
                ? String(p?.name ?? "").toLowerCase().includes(nameQ)
                : true;

            const cpfOk = cpfQ
                ? onlyDigits(p?.cpf ?? "").includes(cpfQ)
                : true;

            const statusOk =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                        ? p?.status
                        : !p?.status;

            return nameOk && cpfOk && statusOk;
        });
    }, [patients, nameQuery, cpfQuery, statusFilter]);

    async function handleToggleStatus(patient) {
        const nextStatus = !patient?.status;

        setToggleError("");
        setToggleLoadingId(patient?.id ?? null);

        try {
            const payload = patientToUpdatePayload(patient, nextStatus);
            await updatePatient(patient.id, payload);

            const res = await getPatients();
            const data = res?.data ?? [];
            setPatients(Array.isArray(data) ? data : []);
        } catch (err) {
            setToggleError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Não foi possível atualizar o status."
            );
        } finally {
            setToggleLoadingId(null);
        }
    }

    function openPatientDetails(patient) {
        setSelectedPatient(patient);
        setDetailsOpen(true);
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Pacientes
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerencie os pacientes cadastrados na clínica.
                    </p>
                </div>

                <Button asChild className="mt-1 w-fit">
                    <Link to="/patients/new">+ Novo paciente</Link>
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
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <Input
                            placeholder="Pesquisar por nome"
                            className="md:flex-1"
                            value={nameQuery}
                            onChange={(e) => setNameQuery(e.target.value)}
                        />

                        <Input
                            placeholder="Pesquisar por CPF"
                            className="md:w-64"
                            value={cpfQuery}
                            onChange={(e) => setCpfQuery(e.target.value)}
                        />

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="md:w-56">
                                <SelectValue placeholder="Todos os status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">
                                    Todos os status
                                </SelectItem>
                                <SelectItem value="active">
                                    Ativos ({activeCount})
                                </SelectItem>
                                <SelectItem value="inactive">
                                    Inativos
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loading text="Carregando pacientes..." />
                        </div>
                    ) : serverError ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {serverError}
                        </div>
                    ) : filteredPatients.length === 0 ? (
                        <EmptyState
                            title="Nenhum paciente encontrado"
                            description="Nenhum paciente para exibir com esses filtros."
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>CPF</TableCell>
                                    <TableCell>Sexo</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell className="text-right">
                                        Ações
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredPatients.map((p) => {
                                    const name = p?.name ?? "";
                                    const cpf = p?.cpf ?? "";
                                    const gender = p?.gender ?? "-";
                                    const location = formatLocation(p);

                                    return (
                                        <TableRow
                                            key={p?.id ?? cpf ?? name}
                                            className="cursor-pointer"
                                            onClick={() => openPatientDetails(p)}
                                        >
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium text-foreground">
                                                        {name}
                                                    </div>
                                                    {location ? (
                                                        <div className="text-sm text-muted-foreground">
                                                            {location}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-sm text-muted-foreground">
                                                {cpf}
                                            </TableCell>

                                            <TableCell className="text-sm text-foreground">
                                                {gender}
                                            </TableCell>

                                            <TableCell>
                                                <StatusBadge
                                                    status={p?.status}
                                                />
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-6 pr-1 text-sm">
                                                    <Link
                                                        to={`/patients/${p?.id}/edit`}
                                                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        Editar
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                                        disabled={toggleLoadingId === p?.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleStatus(p);
                                                        }}
                                                    >
                                                        <Power className="h-4 w-4" />
                                                        {toggleLoadingId === p?.id
                                                            ? "..."
                                                            : p?.status
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
                                Exibindo {filteredPatients.length} de{" "}
                                {total} pacientes
                            </TableCaption>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Modal
                open={detailsOpen}
                onOpenChange={(next) => {
                    setDetailsOpen(next);
                    if (!next) setSelectedPatient(null);
                }}
                title="Paciente"
                description="Visualização dos dados cadastrais."
            >
                {selectedPatient ? (
                    <PatientDetails patient={selectedPatient} />
                ) : null}
            </Modal>
        </div>
    );
}
