import { ABOUTUS_ROUTE, ADMIN_ALLAPPOINTMENTS_ROUTE, ADMIN_ANALYTICS_ROUTE, ADMIN_APPOINTMENTS_ROUTE, ADMIN_DOCSCHEDULE_ROUTE, ADMIN_DOCTORS_ROUTE, ADMIN_EDITDOCSTAFFDATA_ROUTE, ADMIN_EDITPATDATA_ROUTE, ADMIN_HOSPITAL_ROUTE, ADMIN_MEDDETAIL_ROUTE, ADMIN_PANEL_ROUTE, ADMIN_PATIENTS_ROUTE, ADMIN_PATMEDCARD_ROUTE, ADMIN_SCHEDULES_ROUTE, ADMIN_SERVICEDETAILS_ROUTE, ADMIN_SERVICES_ROUTE, ADMIN_SERVICESCHEDULE_ROUTE, ADMIN_SERVICESHOSP_ROUTE, DOCTOR_ALLAPPOINTMENTS_ROUTE, DOCTOR_APPOINTMENTS_ROUTE, DOCTOR_DETAPPOINTMENT_ROUTE, DOCTOR_FILLPATDATA_ROUTE, DOCTOR_HOSPITALDETAILS_ROUTE, DOCTOR_MEDDETAIL_ROUTE, DOCTOR_PANEL_ROUTE, DOCTOR_PATIENTS_ROUTE, DOCTOR_PATMEDCARD_ROUTE, DOCTOR_SERVICES_ROUTE, DOCTOR_SERVICESRESULT_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, PATIENT_ANALYSEDETAIL_ROUTE, PATIENT_ANALYSEORDER_ROUTE, PATIENT_ANALYSIS_ROUTE, PATIENT_APPOINTMENTS_ROUTE, PATIENT_DOCAPPOINTMENT_ROUTE, PATIENT_DOCSCHEDULE_ROUTE, PATIENT_EDITPERSONALINFO_ROUTE, PATIENT_HOSPITALDETAIL_ROUTE, PATIENT_HOSPITALSCHEDULE_ROUTE, PATIENT_MEDCARD_ROUTE, PATIENT_MEDDETAIL_ROUTE, PATIENT_MEDRECORDS_ROUTE, PATIENT_PANEL_ROUTE, PATIENT_PRESCRIPTIONS_ROUTE, PATIENT_SERVICE_ROUTE, PATIENT_SERVICEDETAILS_ROUTE, PATIENT_SERVICEORDER_ROUTE, SERVICES_ROUTE } from "./utils/consts";
import Main from "./pages/default/Main";
import AboutUs from "./pages/default/AboutUs";
import Services from "./pages/default/Services";
import LogIn from "./pages/default/LogIn";
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
import DoctorDashboard from "./pages/doctorpanel/DoctorDashboard";
import DoctorAppointments from "./pages/doctorpanel/DoctorAppointments";
import DoctorHospitalDetails from "./pages/doctorpanel/DoctorHospitalDetails";
import DoctorPatients from "./pages/doctorpanel/DoctorPatients";
import DoctorServices from "./pages/doctorpanel/DoctorServices";
import DoctorAllAppointment from "./pages/doctorpanel/DoctorAllAppointment";
import DoctorDetailsAppointment from "./pages/doctorpanel/DoctorDetailsAppointment";
import DoctorPatientMedCard from "./pages/doctorpanel/DoctorPatientMedCard";
import DoctorMedicalDetail from "./pages/doctorpanel/DoctorMedicalDetail";
import DoctorServicesResults from "./pages/doctorpanel/DoctorServicesResults";
import DoctorFillPatientsData from "./pages/doctorpanel/DoctorFillPatientsData";
import AdminDashboard from "./pages/adminpanel/AdminDashboard";
import AdminAnalytics from "./pages/adminpanel/AdminAnalytics.js";
import AdminDoctors from "./pages/adminpanel/AdminDoctors.js";
import AdminHospital from "./pages/adminpanel/AdminHospital.js";
import AdminPatients from "./pages/adminpanel/AdminPatients.js";
import AdminSchedules from "./pages/adminpanel/AdminSchedules.js";
import AdminServices from "./pages/adminpanel/AdminServices.js";
import AdminAppointments from "./pages/adminpanel/AdminAppointments.js";
import AdminEditDocStaffData from "./pages/adminpanel/AdminEditDocStaffData.js";
import AdminPatientMedCard from "./pages/adminpanel/AdminPatientMedCard.js";
import AdminMedicalDetail from "./pages/adminpanel/AdminMedicalDetail.js";
import AdminEditPatientData from "./pages/adminpanel/AdminEditPatientData.js";
import AdminDoctorSchedule from "./pages/adminpanel/AdminDoctorSchedule.js";
import AdminAllAppointments from "./pages/adminpanel/AdminAllAppointments.js";
import AdminServicesHospital from "./pages/adminpanel/AdminServicesHospital.js";
import AdminServiceSchedule from "./pages/adminpanel/AdminServiceSchedule.js";
import AdminServiceDetails from "./pages/adminpanel/AdminServiceDetails.js";

export const publicRoutes = [
    { path: MAIN_ROUTE, Component: Main },
    { path: ABOUTUS_ROUTE, Component: AboutUs },
    { path: SERVICES_ROUTE, Component: Services },
    { path: LOGIN_ROUTE, Component: LogIn },
]; 

export const adminRoutes = [
    { path: ADMIN_PANEL_ROUTE, Component: AdminDashboard },
    { path: ADMIN_PATIENTS_ROUTE, Component: AdminPatients },
    { path: ADMIN_DOCTORS_ROUTE, Component: AdminDoctors },
    { path: ADMIN_SERVICES_ROUTE, Component: AdminServices },
    { path: ADMIN_SCHEDULES_ROUTE, Component: AdminSchedules },
    { path: ADMIN_ANALYTICS_ROUTE, Component: AdminAnalytics },
    { path: ADMIN_HOSPITAL_ROUTE, Component: AdminHospital },
    { path: ADMIN_APPOINTMENTS_ROUTE, Component: AdminAppointments },
    { path: `${ADMIN_EDITDOCSTAFFDATA_ROUTE}/:id`, Component: AdminEditDocStaffData },
    { path: `${ADMIN_PATMEDCARD_ROUTE}/:id`, Component: AdminPatientMedCard },
    { path: `${ADMIN_MEDDETAIL_ROUTE}/:id`, Component: AdminMedicalDetail },
    { path: `${ADMIN_EDITPATDATA_ROUTE}/:id`, Component: AdminEditPatientData },
    { path: `${ADMIN_DOCSCHEDULE_ROUTE}/:id`, Component: AdminDoctorSchedule },
    { path: ADMIN_ALLAPPOINTMENTS_ROUTE, Component: AdminAllAppointments },
    { path: ADMIN_SERVICESHOSP_ROUTE, Component: AdminServicesHospital },
    { path: `${ADMIN_SERVICESCHEDULE_ROUTE}/:serviceType/:id`, Component: AdminServiceSchedule },
    { path: `${ADMIN_SERVICEDETAILS_ROUTE}/:serviceType/:id`, Component: AdminServiceDetails },
  ];
  
  export const patientRoutes = [
    { path: PATIENT_PANEL_ROUTE, Component: PatientDashboard },
    { path: PATIENT_MEDCARD_ROUTE, Component: PatientMedCard },
    { path: PATIENT_EDITPERSONALINFO_ROUTE, Component: PatientEditPersonalInfo },
    { path: PATIENT_MEDRECORDS_ROUTE, Component: PatientMedicalRecords },
    { path: PATIENT_PRESCRIPTIONS_ROUTE, Component: PatientPrescriptions },
    { path: `${PATIENT_ANALYSEDETAIL_ROUTE}/:id`, Component: PatientAnalyseDetail },
    { path: PATIENT_ANALYSEORDER_ROUTE, Component: PatientAnalyseOrder },
    { path: PATIENT_ANALYSIS_ROUTE, Component: PatientAnalysis },
    { path: PATIENT_APPOINTMENTS_ROUTE, Component: PatientAppointments },
    { path: PATIENT_DOCAPPOINTMENT_ROUTE, Component: PatientDoctorAppointment },
    { path: `${PATIENT_DOCSCHEDULE_ROUTE}/:id`, Component: PatientDoctorSchedule },
    { path: PATIENT_HOSPITALDETAIL_ROUTE, Component: PatientHospitalDetails },
    { path: `${PATIENT_HOSPITALSCHEDULE_ROUTE}/:id`, Component: PatientHospitalSchedule },
    { path: `${PATIENT_MEDDETAIL_ROUTE}/:id`, Component: PatientMedicalDetail },
    { path: PATIENT_SERVICEORDER_ROUTE, Component: PatientServiceOrder },
    { path: PATIENT_SERVICE_ROUTE, Component: PatientServices },
    { path: `${PATIENT_SERVICEDETAILS_ROUTE}/:id`, Component: PatientServiceDetails },
  ];
  
  export const doctorRoutes = [
    { path: DOCTOR_PANEL_ROUTE, Component: DoctorDashboard },
    { path: DOCTOR_PATIENTS_ROUTE, Component: DoctorPatients },
    { path: DOCTOR_SERVICES_ROUTE, Component: DoctorServices },
    { path: DOCTOR_APPOINTMENTS_ROUTE, Component: DoctorAppointments },
    { path: DOCTOR_HOSPITALDETAILS_ROUTE, Component: DoctorHospitalDetails },
    { path: DOCTOR_ALLAPPOINTMENTS_ROUTE, Component: DoctorAllAppointment },
    { path: `${DOCTOR_DETAPPOINTMENT_ROUTE}/:id`, Component: DoctorDetailsAppointment },
    { path: `${DOCTOR_PATMEDCARD_ROUTE}/:id`, Component: DoctorPatientMedCard },
    { path: `${DOCTOR_MEDDETAIL_ROUTE}/:id`, Component: DoctorMedicalDetail },
    { path: `${DOCTOR_SERVICESRESULT_ROUTE}/:serviceType/:id`, Component: DoctorServicesResults },
    { path: `${DOCTOR_FILLPATDATA_ROUTE}/:id`, Component: DoctorFillPatientsData },
  ];