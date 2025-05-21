import { ABOUTUS_ROUTE, ADMIN_PANEL_ROUTE, DOCTOR_PANEL_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, PATIENT_ANALYSEDETAIL_ROUTE, PATIENT_ANALYSEORDER_ROUTE, PATIENT_ANALYSIS_ROUTE, PATIENT_APPOINTMENTS_ROUTE, PATIENT_DOCAPPOINTMENT_ROUTE, PATIENT_DOCSCHEDULE_ROUTE, PATIENT_EDITPERSONALINFO_ROUTE, PATIENT_HOSPITALDETAIL_ROUTE, PATIENT_HOSPITALSCHEDULE_ROUTE, PATIENT_MEDCARD_ROUTE, PATIENT_MEDDETAIL_ROUTE, PATIENT_MEDRECORDS_ROUTE, PATIENT_PANEL_ROUTE, PATIENT_PRESCRIPTIONS_ROUTE, PATIENT_SERVICE_ROUTE, PATIENT_SERVICEDETAILS_ROUTE, PATIENT_SERVICEORDER_ROUTE, SERVICES_ROUTE } from "./utils/consts";
import Main from "./pages/default/Main";
import AboutUs from "./pages/default/AboutUs";
import Services from "./pages/default/Services";
import LogIn from "./pages/default/LogIn";
import AdminPanel from "./pages/adminpanel/AdminPanel";
import PatientDashboard from "./pages/patientpanel/PatientDashboard";
import PatientMedCard from "./pages/patientpanel/PatientMedCard";
import PatientEditPersonalInfo from "./pages/patientpanel/PatientEditPersonalInfo";
import PatientMedicalRecords from "./pages/patientpanel/PatientMedicalRecords";
import PatientPrescriptions from "./pages/patientpanel/PatientPrescriptions";
import PatientAnalyseDetail from "./pages/patientpanel/PatientAnalyseDetail";
import PatientAnalyseOrder from "./pages/patientpanel/PatientAnalyseOrder";
import PatientAnalysis from "./pages/patientpanel/PatientAnalysis";
import PatientAppointments from "./pages/patientpanel/PatientAppointments";
import PatientDoctorAppointment from "./pages/patientpanel/PatientDoctorAppointment";
import PatientDoctorSchedule from "./pages/patientpanel/PatientDoctorSchedule";
import PatientHospitalDetails from "./pages/patientpanel/PatientHospitalDetails";
import PatientHospitalSchedule from "./pages/patientpanel/PatientHospitalSchedule";
import PatientMedicalDetail from "./pages/patientpanel/PatientMedicalDetail";
import PatientServiceOrder from "./pages/patientpanel/PatientServiceOrder";
import PatientServices from "./pages/patientpanel/PatientServices";
import PatientServiceDetails from "./pages/patientpanel/PatientServiceDetails";
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
    { path: PATIENT_EDITPERSONALINFO_ROUTE, Component: PatientEditPersonalInfo },
    { path: PATIENT_MEDRECORDS_ROUTE, Component: PatientMedicalRecords },
    { path: PATIENT_PRESCRIPTIONS_ROUTE, Component: PatientPrescriptions },
    { path: PATIENT_ANALYSEDETAIL_ROUTE, Component: PatientAnalyseDetail },
    { path: PATIENT_ANALYSEORDER_ROUTE, Component: PatientAnalyseOrder },
    { path: PATIENT_ANALYSIS_ROUTE, Component: PatientAnalysis },
    { path: PATIENT_APPOINTMENTS_ROUTE, Component: PatientAppointments },
    { path: PATIENT_DOCAPPOINTMENT_ROUTE, Component: PatientDoctorAppointment },
    { path: PATIENT_DOCSCHEDULE_ROUTE + '/:id', Component: PatientDoctorSchedule },
    { path: PATIENT_HOSPITALDETAIL_ROUTE, Component: PatientHospitalDetails },
    { path: PATIENT_HOSPITALSCHEDULE_ROUTE + '/:id', Component: PatientHospitalSchedule },
    { path: PATIENT_MEDDETAIL_ROUTE + '/:id', Component: PatientMedicalDetail },
    { path: PATIENT_SERVICEORDER_ROUTE, Component: PatientServiceOrder },
    { path: PATIENT_SERVICE_ROUTE, Component: PatientServices },
    { path: PATIENT_SERVICEDETAILS_ROUTE, Component: PatientServiceDetails },
  ];
  
  export const doctorRoutes = [
    { path: DOCTOR_PANEL_ROUTE, Component: DoctorPanel },
  ];