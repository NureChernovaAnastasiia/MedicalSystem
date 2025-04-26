import { ABOUTUS_ROUTE, ADMIN_PANEL_ROUTE, DOCTOR_PANEL_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, PATIENT_MEDCARD_ROUTE, PATIENT_PANEL_ROUTE, SERVICES_ROUTE } from "./utils/consts";
import Main from "./pages/default/Main";
import AboutUs from "./pages/default/AboutUs";
import Services from "./pages/default/Services";
import LogIn from "./pages/default/LogIn";
import AdminPanel from "./pages/adminpanel/AdminPanel";
import PatientDashboard from "./pages/patientpanel/PatientDashboard";
import PatientMedCard from "./pages/patientpanel/PatientMedCard";
import DoctorPanel from "./pages/doctorpanel/DoctorPanel";

export const publicRoutes = [
    { path: MAIN_ROUTE, Component: Main },
    { path: ABOUTUS_ROUTE, Component: AboutUs },
    { path: SERVICES_ROUTE, Component: Services },
    { path: LOGIN_ROUTE, Component: LogIn },
]; 

export const adminRoutes = [
    { path: ADMIN_PANEL_ROUTE, Component: AdminPanel },
  ];
  
  export const patientRoutes = [
    { path: PATIENT_PANEL_ROUTE, Component: PatientDashboard },
    { path: PATIENT_MEDCARD_ROUTE, Component: PatientMedCard },
  ];
  
  export const doctorRoutes = [
    { path: DOCTOR_PANEL_ROUTE, Component: DoctorPanel },
  ];