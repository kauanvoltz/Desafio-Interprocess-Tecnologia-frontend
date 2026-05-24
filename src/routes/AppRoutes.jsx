import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";

import PatientsIndex from "@/pages/patients/PatientsIndex";
import PatientsNew from "@/pages/patients/PatientsNew";
import PatientsEdit from "@/pages/patients/PatientsEdit";

import AppointmentsIndex from "@/pages/appointments/AppointmentsIndex";
import AppointmentsNew from "@/pages/appointments/AppointmentsNew";
import AppointmentsEdit from "@/pages/appointments/AppointmentsEdit";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<Navigate to="/patients" replace />} />
                <Route path="/patients" element={<PatientsIndex />} />
                <Route path="/patients/new" element={<PatientsNew />} />
                <Route path="/patients/:id/edit" element={<PatientsEdit />} />

                <Route path="/appointments" element={<AppointmentsIndex />} />
                <Route
                    path="/appointments/:id/edit"
                    element={<AppointmentsEdit />}
                />
                <Route path="/appointments/new" element={<AppointmentsNew />} />
            </Route>
        </Routes>
    );
}
