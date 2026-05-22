import api from "@/services/api";

export function getPatients() {
    return api.get("/patients");
}

export function getPatientById(id) {
    return api.get(`/patients/${id}`);
}

export function createPatient(payload) {
    return api.post("/patients", payload);
}

export function updatePatient(id, payload) {
    return api.put(`/patients/${id}`, payload);
}
