import api from "@/services/api";

export function getAppointments({ patientId, status, startDate, endDate } = {}) {
    const params = {
        patientId: patientId || undefined,
        status:
            status === undefined || status === null || status === ""
                ? undefined
                : status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    };

    const hasAnyParam = Object.values(params).some((v) => v !== undefined);
    const config = hasAnyParam ? { params } : undefined;

    return api.get("/appointments", config);
}

export function getAppointmentById(id) {
    return api.get(`/appointments/${id}`);
}

export function createAppointment(payload) {
    return api.post("/appointments", payload);
}

export function updateAppointment(id, payload) {
    return api.put(`/appointments/${id}`, payload);
}
