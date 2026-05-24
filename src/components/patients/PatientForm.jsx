import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import Loading from "@/components/system/Loading";

function onlyDigits(value) {
    return String(value ?? "").replace(/\D+/g, "");
}

function isValidBirthDateBR(value) {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(String(value ?? "").trim());
}

export default function PatientForm({
    mode = "create",
    initialPatient,
    onSubmit,
    onCancel,
    loading = false,
    serverError = "",
    submitLabel,
}) {
    const sexOptions = useMemo(
        () => ["masculino", "feminino", "outro"],
        []
    );
    const statusOptions = useMemo(() => ["Ativo", "Inativo"], []);

    const defaultValues = useMemo(() => {
        const rawGender = String(initialPatient?.gender ?? "").trim().toLowerCase();

        return {
            name: initialPatient?.name ?? "",
            birthDate: initialPatient?.birthDate ?? "",
            cpf: initialPatient?.cpf ? String(initialPatient.cpf) : "",
            gender: sexOptions.includes(rawGender) ? rawGender : "masculino",
            cep: initialPatient?.cep ?? "",
            city: initialPatient?.city ?? "",
            district: initialPatient?.district ?? "",
            address: initialPatient?.address ?? "",
            complement: initialPatient?.complement ?? "",
            status:
                initialPatient?.status === undefined
                    ? "Ativo"
                    : initialPatient?.status
                        ? "Ativo"
                        : "Inativo",
        };
    }, [initialPatient, sexOptions]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues,
    });

    const genderValue = watch("gender");
    const statusValue = watch("status");

    async function submit(values) {
        const payload = {
            name: values.name?.trim(),
            birthDate: String(values.birthDate ?? "").trim(), // dd/mm/yyyy
            cpf: onlyDigits(values.cpf),
            gender: values.gender, // masculino|feminino|outro (lowercase)
            status:
                mode === "edit"
                    ? initialPatient?.status ?? false
                    : values.status === "Ativo",
            cep: values.cep ? onlyDigits(values.cep) : undefined,
            city: values.city?.trim() || undefined,
            district: values.district?.trim() || undefined,
            address: values.address?.trim() || undefined,
            complement: values.complement?.trim() || undefined,
        };

        await onSubmit(payload);
    }

    return (
        <Card className="rounded-xl">
            <CardHeader className="pb-3">
                <CardTitle className="text-base"> </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {serverError ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {serverError}
                    </div>
                ) : null}

                <form className="space-y-4" onSubmit={handleSubmit(submit)}>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="space-y-2">
                                <div className="text-sm font-medium">
                                    Identificação
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Dados pessoais básicos do paciente.
                                </div>

                                <div className="mt-2 space-y-3">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Nome completo
                                        </div>
                                        <Input
                                            placeholder="Ex.: Maria da Silva"
                                            {...register("name", {
                                                required:
                                                    "Nome é obrigatório.",
                                            })}
                                        />
                                        {errors.name ? (
                                            <p className="text-sm text-destructive">
                                                {errors.name.message}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">
                                                Data de nascimento
                                            </div>
                                            <Input
                                                placeholder="dd/mm/aaaa"
                                                {...register("birthDate", {
                                                    required:
                                                        "Data de nascimento é obrigatória.",
                                                    minLength: {
                                                        value: 10,
                                                        message:
                                                            "Use o formato dd/mm/aaaa.",
                                                    },
                                                    validate: (v) =>
                                                        isValidBirthDateBR(v) ||
                                                        "Use o formato dd/mm/aaaa.",
                                                })}
                                            />
                                            {errors.birthDate ? (
                                                <p className="text-sm text-destructive">
                                                    {errors.birthDate.message}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">
                                                CPF
                                            </div>
                                            <Input
                                                placeholder="00000000000"
                                                {...register("cpf", {
                                                    required: "CPF é obrigatório.",
                                                    validate: (v) => {
                                                        const digits = onlyDigits(v);
                                                        if (digits.length !== 11) {
                                                            return "CPF inválido (11 dígitos).";
                                                        }
                                                        return true;
                                                    },
                                                })}
                                            />
                                            {errors.cpf ? (
                                                <p className="text-sm text-destructive">
                                                    {errors.cpf.message}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">
                                                Sexo
                                            </div>

                                            <Select
                                                value={genderValue}
                                                onValueChange={(v) => {
                                                    setValue("gender", v);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sexo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sexOptions.map((o) => (
                                                        <SelectItem
                                                            key={o}
                                                            value={o}
                                                        >
                                                            {o}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {errors.gender ? (
                                                <p className="text-sm text-destructive">
                                                    {errors.gender.message}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">
                                                Status
                                            </div>

                                            {mode === "edit" ? (
                                                <div className="rounded-lg border bg-muted/10 px-3 py-2 text-sm text-muted-foreground">
                                                    {initialPatient?.status
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </div>
                                            ) : (
                                                <>
                                                    <Select
                                                        value={statusValue}
                                                        onValueChange={(v) =>
                                                            setValue(
                                                                "status",
                                                                v
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {statusOptions.map((o) => (
                                                                <SelectItem
                                                                    key={o}
                                                                    value={o}
                                                                >
                                                                    {o}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    {errors.status ? (
                                                        <p className="text-sm text-destructive">
                                                            {errors.status.message}
                                                        </p>
                                                    ) : null}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <input
                                type="hidden"
                                value={genderValue || ""}
                                readOnly
                                {...register("gender")}
                            />
                        </div>

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
                                        <Input
                                            placeholder="00000-000"
                                            {...register("cep")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Cidade
                                        </div>
                                        <Input placeholder="" {...register("city")} />
                                    </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Bairro
                                        </div>
                                        <Input
                                            placeholder=""
                                            {...register("district")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Endereço
                                        </div>
                                        <Input
                                            placeholder="Rua, número"
                                            {...register("address")}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Complemento
                                    </div>
                                    <Input
                                        placeholder="Apartamento 10"
                                        {...register("complement")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>

                        <Button
                            className="bg-primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loading
                                        text={
                                            mode === "edit"
                                                ? "Salvando..."
                                                : "Cadastrando..."
                                        }
                                    />
                                </span>
                            ) : (
                                submitLabel ||
                                (mode === "edit"
                                    ? "Salvar alterações"
                                    : "Cadastrar paciente")
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
