
export const formatAppointmentDate = (appointment) => {
  const schedule = appointment.DoctorSchedule || appointment.LabTestSchedule || appointment.MedicalServiceSchedule;
  let formattedDateTime = "Дата і час не вказані";

  if (appointment.DoctorSchedule) {
    const appointmentDate = appointment.appointment_date || schedule?.appointment_date;
    const startTime = schedule?.start_time;

    if (appointmentDate && startTime) {
      const dateObj = new Date(`${appointmentDate}T${startTime}`);
      if (!isNaN(dateObj)) {
        formattedDateTime = dateObj.toLocaleString("uk-UA", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    }
  } else if (appointment.LabTestSchedule || appointment.MedicalServiceSchedule) {
    const startDate = new Date(schedule?.start_time);
    if (!isNaN(startDate)) {
      formattedDateTime = startDate.toLocaleString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }

  return formattedDateTime;
};
