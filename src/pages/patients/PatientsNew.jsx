import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function PatientsNew() {
    const sexOptions = useMemo(() => ["Masculino", "Feminino"], []);
    const statusOptions = useMemo(() => ["Ativo", "Inativo"], []);

    return (
        <div className="space-y-4">
            {/* Top title */}
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Novo paciente
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Preencha os dados cadastrais do paciente.
                    </p>
                </div>

                <Button asChild variant="outline" className="w-fit">
                    <Link to="/patients">← Voltar</Link>
                </Button>
            </div>

            {/* Form card */}
            <Card className="rounded-xl">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base"> </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Identificação (2 cols) */}
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Identificação</div>
                            <div className="text-sm text-muted-foreground">
                                Dados pessoais básicos do paciente.
                            </div>

                            <div className="mt-2 space-y-3">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Nome completo
                                    </div>
                                    <Input
                                        defaultValue=""
                                        placeholder="Ex.: Maria da Silva"
                                    />
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Data de nascimento
                                        </div>
                                        <Input placeholder="dd/mm/aaaa" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            CPF
                                        </div>
                                        <Input placeholder="000.000.000-00" />
                                    </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Sexo
                                        </div>
                                        <Select defaultValue={sexOptions[0]}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sexo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sexOptions.map((o) => (
                                                    <SelectItem key={o} value={o}>
                                                        {o}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Status
                                        </div>
                                        <Select defaultValue={statusOptions[0]}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((o) => (
                                                    <SelectItem key={o} value={o}>
                                                        {o}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Endereço */}
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Endereço</div>
                            <div className="text-sm text-muted-foreground">
                                Localização e contato do paciente.
                            </div>

                            <div className="mt-2 space-y-4">
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            CEP
                                        </div>
                                        <Input placeholder="00000-000" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Cidade
                                        </div>
                                        <Input placeholder="" />
                                    </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Bairro
                                        </div>
                                        <Input placeholder="" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Endereço
                                        </div>
                                        <Input placeholder="Rua, número" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Complemento
                                    </div>
                                    <Input placeholder="Apto, bloco, referência" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                        <Button asChild variant="outline">
                            <Link to="/patients">Cancelar</Link>
                        </Button>

                        <Button className="bg-primary">Cadastrar paciente</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
