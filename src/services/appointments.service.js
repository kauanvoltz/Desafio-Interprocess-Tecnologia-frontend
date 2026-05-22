import api from "@/services/api";

export function getAppointments() {
    return api.get("/appointments");
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
