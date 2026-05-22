import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, Power } from "lucide-react";

const appointments = [
    {
        patient: "Ana Beatriz Carvalho",
        patientNote: "Sessão de fisioterapia agendada.",
        dateTime: "27/05/2026, 12:14",
        status: "Agendado",
        statusVariant: "scheduled",
    },
    {
        patient: "Ana Beatriz Carvalho",
        patientNote: "Consulta de rotina. Avaliar exames recentes.",
        dateTime: "23/05/2026, 12:14",
        status: "Agendado",
        statusVariant: "scheduled",
    },
    {
        patient: "Carlos Eduardo Lima",
        patientNote: "Retorno pós-cirúrgico. Paciente apresenta boa evolução.",
        dateTime: "19/05/2026, 12:14",
        status: "Concluído",
        statusVariant: "done",
    },
    {
        patient: "João Pedro Almeida",
        patientNote: "Avaliação cardiológica inicial.",
        dateTime: "15/05/2026, 12:14",
        status: "Cancelado",
        statusVariant: "canceled",
    },
];

function StatusBadge({ statusVariant, status }) {
    const cfg =
        statusVariant === "scheduled"
            ? {
                badge:
                    "bg-sky-50 text-sky-700 border-sky-200",
                dot: "bg-sky-500",
            }
            : statusVariant === "done"
                ? {
                    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    dot: "bg-emerald-500",
                }
                : {
                    badge: "bg-rose-50 text-rose-700 border-rose-200",
                    dot: "bg-rose-500",
                };

    return (
        <Badge variant="outline" className={cfg.badge}>
            <span className={`inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
            {status}
        </Badge>
    );
}

export default function AppointmentsIndex() {
    const total = appointments.length;

    const statusCounts = useMemo(() => {
        return {
            all: total,
            scheduled: appointments.filter((a) => a.statusVariant === "scheduled")
                .length,
            done: appointments.filter((a) => a.statusVariant === "done").length,
            canceled: appointments.filter((a) => a.statusVariant === "canceled").length,
        };
    }, [total]);

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

            <Card className="rounded-xl overflow-visible">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base"> </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-4">
                        <Input placeholder="Período inicial" className="md:col-span-1" />
                        <Input placeholder="Período final" className="md:col-span-1" />
                        <Select defaultValue="all">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos os pacientes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os pacientes</SelectItem>
                                <SelectItem value="1">{appointments[0].patient}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos ({statusCounts.all})</SelectItem>
                                <SelectItem value="scheduled">
                                    Agendados ({statusCounts.scheduled})
                                </SelectItem>
                                <SelectItem value="done">
                                    Concluídos ({statusCounts.done})
                                </SelectItem>
                                <SelectItem value="canceled">
                                    Cancelados ({statusCounts.canceled})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[320px]">Paciente</TableHead>
                                <TableHead className="w-[220px]">Data / Hora</TableHead>
                                <TableHead className="w-[160px]">Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {appointments.map((a, idx) => (
                                <TableRow key={`${a.patient}-${a.dateTime}-${idx}`}>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium text-foreground">
                                                {a.patient}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {a.patientNote}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground">
                                        {a.dateTime}
                                    </TableCell>

                                    <TableCell>
                                        <StatusBadge
                                            statusVariant={a.statusVariant}
                                            status={a.status}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex justify-end gap-6 pr-1 text-sm">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <Power className="h-4 w-4" />
                                                Inativar
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                        <TableCaption>Exibindo {total} de {total} atendimentos</TableCaption>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
