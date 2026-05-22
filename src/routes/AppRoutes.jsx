import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import PatientsIndex from "@/pages/patients/PatientsIndex";
import AppointmentsIndex from "@/pages/appointments/AppointmentsIndex";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<Navigate to="/patients" replace />} />
                <Route path="/patients" element={<PatientsIndex />} />
                <Route
                    path="/appointments"
                    element={<AppointmentsIndex />}
                />
            </Route>
        </Routes>
    );
}
