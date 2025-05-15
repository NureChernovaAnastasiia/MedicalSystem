function updatePatientFields(patient, data) {
  const updatableFields = [
  "first_name", "last_name", "middle_name", "birth_date", "gender",
  "phone", "address", "blood_type", "chronic_conditions", "allergies", "email"
];

  for (const field of updatableFields) {
    if (data[field] !== undefined) {
      patient[field] = data[field];
    }
  }

  return patient;
}

module.exports = { updatePatientFields };