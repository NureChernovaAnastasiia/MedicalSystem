const { Doctor, HospitalStaff, User } = require('../models/models');

async function syncDoctorsToHospitalStaff() {
  try {
    const doctors = await Doctor.findAll();

    for (const doctor of doctors) {
      const existingStaff = await HospitalStaff.findOne({
        where: { user_id: doctor.user_id },
      });

      if (!existingStaff) {
        await HospitalStaff.create({
          user_id: doctor.user_id,
          hospital_id: doctor.hospital_id,
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          middle_name: doctor.middle_name,
          email: doctor.email,
          position: 'Doctor',
        });

        console.log(`✅ Doctor ${doctor.email} added to HospitalStaff`);
      } else {
        console.log(`⚠️ Doctor ${doctor.email} already exists in HospitalStaff`);
      }
    }

    console.log('✅ Sync complete.');
  } catch (e) {
    console.error('❌ Sync error:', e.message);
  }
}

// Run manually
syncDoctorsToHospitalStaff();
