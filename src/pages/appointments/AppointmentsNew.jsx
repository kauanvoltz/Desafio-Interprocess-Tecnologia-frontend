import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

export default function AppointmentsNew() {
    const statusOptions = useMemo(
        () => [
            "Agendado",
            "Concluído",
            "Cancelado",
        ],
        []
    );

    const patientOptions = useMemo(
        () => [
            "Ana Beatriz Carvalho",
            "Carlos Eduardo Lima",
            "João Pedro Almeida",
        ],
        []
    );

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

            <Card className="rounded-xl">
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-foreground">
                            Informações do atendimento
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Selecione o paciente e quando ocorrerá.
                        </p>
                    </div>

                    <Separator />

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Paciente</div>
                            <Select defaultValue={patientOptions[0]}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o paciente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patientOptions.map((p) => (
                                        <SelectItem key={p} value={p}>
                                            {p}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Data e hora</div>
                            <Input placeholder="22/05/2026 12:20" />
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Status</div>
                            <Select defaultValue={statusOptions[0]}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium"> </div>

                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3 md:grid-cols-[1fr_2fr] md:items-start">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Descrição</div>
                            <div className="text-sm text-muted-foreground">
                                Anotações, queixas, conduta e observações do atendimento.
                            </div>
                        </div>

                        <div className="space-y-2">
                            <textarea
                                className="min-h-36 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Descreva o atendimento. Quebras de linha são preservadas."
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                        <Button asChild variant="outline">
                            <Link to="/appointments">Cancelar</Link>
                        </Button>

                        <Button className="bg-primary">Cadastrar atendimento</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
