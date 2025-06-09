import React from 'react';

const styles = {
  item: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 3fr 1fr',  
    padding: '10px 20px',
    borderBottom: '1px solid rgba(0, 195, 161, 0.42)',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '20px',
    alignItems: 'center',
    background: '#fff',
  },
  id:        { fontWeight: 600, color: '#333333' },
  date:      { fontStyle: 'italic' },
  hospital:  { fontWeight: 500, color: '#333' },
  amount:    { color: '#28a745', fontWeight: 600 },
};

const FinanceReportItem = ({ report }) => {
  const formattedDate = new Date(report.report_date).toLocaleDateString('uk-UA');
  const amount        = parseFloat(report.total_income).toFixed(2);
  const hospitalName  = report?.Hospital?.name || '—';

  return (
    <div style={styles.item}>
      <div style={styles.id}>№ {report.id}</div>
      <div style={styles.date}>{formattedDate}</div>
      <div style={styles.hospital}>{hospitalName}</div>
      <div style={styles.amount}>{amount} ₴</div>
    </div>
  );
};

export default FinanceReportItem;
