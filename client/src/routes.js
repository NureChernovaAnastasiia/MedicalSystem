import { ABOUTUS_ROUTE, ADMIN_PANEL_ROUTE, DOCTOR_PANEL_ROUTE, MAIN_ROUTE, PATIENT_PANEL_ROUTE, SERVICES_ROUTE } from "./utils/consts";
import Main from "./pages/default/Main";
import AboutUs from "./pages/default/AboutUs";
import Services from "./pages/default/Services";
import AdminPanel from "./pages/adminpanel/AdminPanel";
import PatientPanel from "./pages/patientpanel/PatientPanel";
import DoctorPanel from "./pages/doctorpanel/DoctorPanel";

export const publicRoutes = [
    { path: MAIN_ROUTE, Component: Main },
    { path: ABOUTUS_ROUTE, Component: AboutUs },
    { path: SERVICES_ROUTE, Component: Services },
]; 

export const adminRoutes = [
    { path: ADMIN_PANEL_ROUTE, Component: AdminPanel },
  ];
  
  export const patientRoutes = [
    { path: PATIENT_PANEL_ROUTE, Component: PatientPanel },
  ];
  
  export const doctorRoutes = [
    { path: DOCTOR_PANEL_ROUTE, Component: DoctorPanel },
  ];