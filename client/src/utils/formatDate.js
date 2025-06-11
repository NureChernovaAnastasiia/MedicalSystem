
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

export const formatAppointmentDateOnly = (appointment) => {
  const schedule = appointment.DoctorSchedule || appointment.LabTestSchedule || appointment.MedicalServiceSchedule;

  let dateObj = null;

  if (appointment.DoctorSchedule) {
    const appointmentDate = appointment.appointment_date || schedule?.appointment_date;
    const startTime = schedule?.start_time;
    if (appointmentDate && startTime) {
      dateObj = new Date(`${appointmentDate}T${startTime}`);
    }
  } else if (appointment.LabTestSchedule || appointment.MedicalServiceSchedule) {
    dateObj = new Date(schedule?.start_time);
  }

  if (dateObj && !isNaN(dateObj)) {
    return dateObj.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  }

  return "Дата не вказана";
};

export const formatAppointmentTimeOnly = (appointment) => {
  const schedule = appointment.DoctorSchedule || appointment.LabTestSchedule || appointment.MedicalServiceSchedule;

  let startDateObj = null;
  let endDateObj = null;

  if (appointment.DoctorSchedule) {
    const appointmentDate = appointment.appointment_date || schedule?.appointment_date;
    const startTime = schedule?.start_time;
    const endTime = schedule?.end_time;

    if (appointmentDate && startTime) {
      startDateObj = new Date(`${appointmentDate}T${startTime}`);
    }
    if (appointmentDate && endTime) {
      endDateObj = new Date(`${appointmentDate}T${endTime}`);
    }

  } else if (appointment.LabTestSchedule || appointment.MedicalServiceSchedule) {
    if (schedule?.start_time) {
      startDateObj = new Date(schedule.start_time);
    }
    if (schedule?.end_time) {
      endDateObj = new Date(schedule.end_time);
    }
  }

  if (startDateObj && !isNaN(startDateObj)) {
    const startTimeStr = startDateObj.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (endDateObj && !isNaN(endDateObj)) {
      const endTimeStr = endDateObj.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      return `${startTimeStr} – ${endTimeStr}`;
    }

    return startTimeStr;
  }

  return "Час не вказаний";
};

export const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toLocaleDateString('uk-UA') : 'Немає даних';
};
