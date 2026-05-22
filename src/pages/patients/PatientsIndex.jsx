import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, Power } from "lucide-react";

const patients = [
    {
        name: "Ana Beatriz Carvalho",
        location: "São Paulo • Bela Vista",
        cpf: "123.456.789-00",
        sex: "Feminino",
        status: "Ativo",
        statusVariant: "active",
    },
    {
        name: "Carlos Eduardo Lima",
        location: "Rio de Janeiro • Botafogo",
        cpf: "987.654.321-00",
        sex: "Masculino",
        status: "Ativo",
        statusVariant: "active",
    },
    {
        name: "Mariana Souza",
        location: "Belo Horizonte • Centro",
        cpf: "456.789.123-00",
        sex: "Feminino",
        status: "Inativo",
        statusVariant: "inactive",
    },
    {
        name: "João Pedro Almeida",
        location: "Curitiba • Centro",
        cpf: "321.654.987-00",
        sex: "Masculino",
        status: "Inativo",
        statusVariant: "inactive",
    },
];

function StatusBadge({ status, variant }) {
    const badgeClass =
        variant === "active"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-slate-100 text-slate-600 border-slate-200";

    const dotClass =
        variant === "active" ? "bg-emerald-500" : "bg-slate-400";

    return (
        <Badge variant="outline" className={badgeClass}>
            <span className={`inline-block h-2 w-2 rounded-full ${dotClass}`} />
            {status}
        </Badge>
    );
}

export default function PatientsIndex() {
    const total = patients.length;
    const activeCount = useMemo(
        () => patients.filter((p) => p.status === "Ativo").length,
        []
    );

    return (
        <div className="space-y-4">
            {/* Page header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
                    <p className="text-sm text-muted-foreground">
                        Gerencie os pacientes cadastrados na clínica.
                    </p>
                </div>

                <Button asChild className="mt-1 w-fit">
                    <Link to="/patients/new">+ Novo paciente</Link>
                </Button>
            </div>

            <Card className="rounded-xl overflow-visible">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base"> </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <Input placeholder="Pesquisar por nome" className="md:flex-1" />
                        <Input placeholder="Pesquisar por CPF" className="md:w-64" />
                        <Select defaultValue="all">
                            <SelectTrigger className="md:w-56">
                                <SelectValue placeholder="Todos os status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="active">Ativos ({activeCount})</SelectItem>
                                <SelectItem value="inactive">Inativos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[240px]">Nome</TableHead>
                                <TableHead className="w-[180px]">CPF</TableHead>
                                <TableHead className="w-[140px]">Sexo</TableHead>
                                <TableHead className="w-[140px]">Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {patients.map((p) => (
                                <TableRow key={p.cpf}>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium text-foreground">
                                                {p.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {p.location}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground">
                                        {p.cpf}
                                    </TableCell>

                                    <TableCell className="text-sm text-foreground">
                                        {p.sex}
                                    </TableCell>

                                    <TableCell>
                                        <StatusBadge status={p.status} variant={p.statusVariant} />
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

                                            {p.statusVariant === "active" ? (
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                                >
                                                    <Power className="h-4 w-4" />
                                                    Inativar
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                                >
                                                    <Power className="h-4 w-4" />
                                                    Ativar
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                        <TableCaption>Exibindo 4 de {total} pacientes</TableCaption>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
