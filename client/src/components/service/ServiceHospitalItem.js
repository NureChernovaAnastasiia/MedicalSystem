import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import uk from 'date-fns/locale/uk';
import { ADMIN_SERVICEDETAILS_ROUTE } from '../../utils/consts';

const base = {
  item: {
    background: '#FFF',
    borderBottom: '1px solid rgba(0,195,161,.42)',
    display: 'grid',
    gridTemplateColumns: '2.5fr 1.7fr 1.7fr 1fr 1fr 1.2fr',
    alignItems: 'center',
    padding: '10px 1rem',
    gap: '1rem',
    boxSizing: 'border-box',
    fontFamily: "'Montserrat',sans-serif",
  },
  txt: {
    fontWeight: 500,
    fontSize: '18px',
    color: '#333',
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  btn: {
    borderRadius: 10,
    fontFamily: "'Montserrat',sans-serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 16,
    padding: '8px 20px',
    cursor: 'pointer',
    border: 'none',
    background: 'rgba(0, 195, 161, 0.42)',
    color: '#fff',
  },
};

const fmtDate = (str) => {
  if (!str) return '—';
  const d = parseISO(str);
  return isValid(d) ? format(d, 'dd.MM.yyyy', { locale: uk }) : '—';
};
const fmtTime = (str) => {
  if (!str) return null;
  const t = parseISO(str);
  return isValid(t) ? format(t, 'HH:mm', { locale: uk }) : null;
};

const ServiceHospitalItem = ({ service }) => {
  const [small, setSmall] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const resize = () => setSmall(window.innerWidth <= 767);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const st = {
    item: {
      ...base.item,
      ...(small && { gridTemplateColumns: '1fr', padding: '.5rem', gap: '.5rem' }),
    },
    txt: { ...base.txt, ...(small && { fontSize: 14 }) },
  };

  const serviceType = service?.test_name ? 'lab-test' : 'medical-service';
  const serviceId = service?.id;
  const title = service.test_name || service.service_name || '—';
  const doctor = service.doctor_name || `${service.Doctor.last_name} ${service.Doctor.first_name}` || '—';
  const patient = service.patient_name || `${service.Patient.last_name} ${service.Patient.first_name}` || '—';
  const start = fmtTime(service.start_time || service.MedicalServiceSchedule.start_time);
  const end   = fmtTime(service.end_time || service.MedicalServiceSchedule.end_time);

  return (
    <div style={st.item}>
      <span style={st.txt}>{title}</span>
      <span style={st.txt}>{doctor}</span>
      <span style={st.txt}>{patient}</span>
      <span style={st.txt}>{fmtDate(service.appointment_date || service.MedicalServiceSchedule.appointment_date)}</span>
      <span style={st.txt}>
        {start && end ? `${start} – ${end}` : start ?? end ?? '—'}
      </span>
      <NavLink to={`${ADMIN_SERVICEDETAILS_ROUTE}/${serviceType}/${serviceId}`}
        style={{ ...base.btn, textDecoration: 'none', textAlign: 'center' }}
      >
        Детальніше
      </NavLink>
    </div>
  );
};

export default ServiceHospitalItem;
