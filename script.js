// Utility functions for local storage
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Validate phone number
function isValidPhoneNumber(phone) {
    const phonePattern = /^\d{10}$/; // Adjust the pattern as per your requirement
    return phonePattern.test(phone);
}

// Register Patient
function registerPatient() {
    const patientId = document.getElementById('patient-id').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const gender = document.getElementById('gender').value;
    const phone = document.getElementById('phone').value.trim();

    // Form validation
    if (!patientId || !firstName || !lastName || !dob || !phone) {
        alert('Please fill in all the fields!');
        return;
    }

    if (!isValidPhoneNumber(phone)) {
        alert('Please enter a valid phone number (10 digits)!');
        return;
    }

    const patients = getData('patients');

    // Check if patient ID already exists
    const existingPatient = patients.find(patient => patient.id === patientId);
    if (existingPatient) {
        alert('Patient ID already exists!');
        return;
    }

    // Create new patient object
    const newPatient = {
        id: patientId,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        gender: gender,
        phone: phone
    };

    // Add patient to local storage
    patients.push(newPatient);
    saveData('patients', patients);

    alert('Patient Registered Successfully!');
    document.getElementById('patientForm').reset();
}

// Register Doctor
// Register Doctor
function registerDoctor() {
    const doctorId = document.getElementById('docId').value;
    const firstName = document.getElementById('docFirstName').value;
    const lastName = document.getElementById('docLastName').value;
    const gender = document.getElementById('gender').value;
    const specialty = document.getElementById('specialty').value;
    const experience = document.getElementById('experience').value;
    const age = document.getElementById('age').value;
    const dob = document.getElementById('dob').value;

    // Form Validation
    if (!doctorId || !firstName || !lastName || !specialty || !experience || !age || !dob || gender === "") {
        alert('Please fill in all the fields!');
        return;
    }

    // Check for valid age and experience
    if (age < 25 || age > 100) {
        alert('Age must be between 25 and 100!');
        return;
    }
    if (experience < 0) {
        alert('Experience cannot be negative!');
        return;
    }

    const doctors = getData('doctors');

    // Check if doctor ID already exists
    const existingDoctor = doctors.find(doctor => doctor.id === doctorId);
    if (existingDoctor) {
        alert('Doctor ID already exists!');
        return;
    }

    // Create new doctor object
    const newDoctor = {
        id: doctorId,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        specialty: specialty,
        experience: experience,
        age: age,
        dob: dob
    };

    // Add doctor to local storage
    doctors.push(newDoctor);
    saveData('doctors', doctors);

    alert('Doctor Registered Successfully!');
    document.getElementById('doctorForm').reset();
}

// Schedule Doctor Appointment
// Book Appointment
function bookAppointment() {
    const patientId = document.getElementById('bookPatientId').value;
    const doctorId = document.getElementById('bookDoctorId').value;
    const appointmentDate = document.getElementById('bookAppointmentDate').value;
    const bookingErrorDiv = document.getElementById('bookingError');

    // Reset error messages
    bookingErrorDiv.textContent = '';

    // Validation
    if (!patientId || !doctorId || !appointmentDate) {
        alert('Please fill in all the fields!');
        return;
    }

    const appointments = getData('appointments');

    // Create appointment object
    const appointment = {
        patientId: patientId,
        doctorId: doctorId,
        date: appointmentDate
    };

    // Save appointment to local storage
    appointments.push(appointment);
    saveData('appointments', appointments);

    alert('Appointment Booked Successfully!');
    document.getElementById('bookAppointmentForm').reset();
}

// View Appointments
function viewAppointments() {
    const patientId = document.getElementById('viewAppPatientId').value;
    const appointments = getData('appointments');
    const appointmentsDiv = document.getElementById('appointments');

    if (!patientId) {
       alert('Please enter a valid Patient ID');
        return;
    }

    const patientAppointments = appointments.filter(a => a.patientId === patientId);

    if (patientAppointments.length > 0) {
        let tableHTML = '<h4>Your Appointments:</h4>';
        tableHTML += '<table><tr><th>Doctor ID</th><th>Date</th></tr>';
        patientAppointments.forEach(app => {
            tableHTML += `<tr><td>${app.doctorId}</td><td>${app.date}</td></tr>`;
        });
        tableHTML += '</table>';
        appointmentsDiv.innerHTML = tableHTML;
    } else {
        alert("No Appointments found for this ID");
    }
}

// Billing Functions
function generateBill() {
    const patientId = document.getElementById('billPatientId').value;
    const medicineCost = document.getElementById('medicine-cost').value;
    const consultingCost = document.getElementById('consulting-cost').value;
    const hospitalizationCharge = document.getElementById('hospitalization-charge').value;
    const totalAmount = document.getElementById('totalAmount').value;

    // Clear previous error messages
    clearErrors();

    let isValid = true;

    // Validate Patient ID
    if (!patientId) {
        document.getElementById('patientIdError').innerText = 'Patient ID is required.';
        isValid = false;
    }

    // Validate Costs
    if (!isNumeric(medicineCost) || medicineCost < 0) {
        document.getElementById('medicineCostError').innerText = 'Please enter a valid medicine cost.';
        isValid = false;
    }
    if (!isNumeric(consultingCost) || consultingCost < 0) {
        document.getElementById('consultingCostError').innerText = 'Please enter a valid consulting cost.';
        isValid = false;
    }
    if (!isNumeric(hospitalizationCharge) || hospitalizationCharge < 0) {
        document.getElementById('hospitalizationChargeError').innerText = 'Please enter a valid hospitalization charge.';
        isValid = false;
    }
    if (!isNumeric(totalAmount) || totalAmount < 0) {
        document.getElementById('totalAmountError').innerText = 'Please enter a valid total amount.';
        isValid = false;
    }

    if (isValid) {
        const patients = getData('patients');
        const bills = getData('bills');

        // Check if patient exists
        const patientExists = patients.find(p => p.id === patientId);
        if (!patientExists) {
            alert('Patient not found!');
            return;
        }

        // Create new bill object
        const bill = {
            patientId: patientId,
            medicineCost: medicineCost,
            consultingCost: consultingCost,
            hospitalizationCharge: hospitalizationCharge,
            totalAmount: totalAmount,
            date: new Date().toLocaleDateString()
        };

        // Save bill
        bills.push(bill);
        saveData('bills', bills);

        alert('Bill Generated Successfully!');
        document.getElementById('billingForm').reset();
    }
}

/// View Bills
function viewBills() {
    const patientId = document.getElementById('viewBillPatientId').value;

    // Clear previous error messages
    clearErrors();

    if (!patientId) {
        document.getElementById('viewPatientIdError').innerText = 'Please enter a valid Patient ID';
        return;
    }

    const bills = getData('bills');
    const patientBills = bills.filter(b => b.patientId === patientId);
    
    const billsDiv = document.getElementById('bills');
    billsDiv.innerHTML = ''; // Clear previous bills display

    if (patientBills.length > 0) {
        // Create a div for the bills
        let tableHTML = `
            <div class="bills-container">
                <h4>Your Bills:</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Medicine Cost</th>
                            <th>Consulting Cost</th>
                            <th>Hospitalization Charge</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        patientBills.forEach(bill => {
            tableHTML += `
                <tr>
                    <td>${bill.date}</td>
                    <td>${bill.medicineCost}</td>
                    <td>${bill.consultingCost}</td>
                    <td>${bill.hospitalizationCharge}</td>
                    <td>${bill.totalAmount}</td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        billsDiv.innerHTML = tableHTML;
    } else {
        alert('No Bills Found!');
    }
}

// Helper Functions
function isNumeric(value) {
    return !isNaN(value) && value.trim() !== '';
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.innerText = '');
}

// View Patient Details
function viewPatientDetails() {
    const patientId = document.getElementById('managePatientId').value;

    if (!patientId) {
        alert('Please enter a valid Patient ID');
        return;
    }

    const patients = getData('patients');
    const patient = patients.find(p => p.id === patientId);

    if (patient) {
        // Show patient details on the webpage
        document.getElementById('patientId').innerText = patient.id;
        document.getElementById('patientName').innerText = `${patient.firstName} ${patient.lastName}`;
        document.getElementById('patientDOB').innerText = patient.dob;
        document.getElementById('patientGender').innerText = patient.gender;
        document.getElementById('patientPhone').innerText = patient.phone;

        // Display the patient details section
        document.getElementById('patientDetails').style.display = 'block';
    } else {
        // Hide the patient details section if no patient is found
        document.getElementById('patientDetails').style.display = 'none';
        alert('Patient Not Found!');
    }
}

// View Doctor Details by ID
function viewDoctorDetails() {
    const doctorId = document.getElementById('manageDoctorId').value;
    const doctors = getData('doctors');
    const doctor = doctors.find(d => d.id === doctorId);

    if (doctor) {
        document.getElementById('doctorId').innerText = doctor.id;
        document.getElementById('doctorName').innerText = `${doctor.firstName} ${doctor.lastName}`;
        document.getElementById('doctorGender').innerText = doctor.gender;
        document.getElementById('doctorSpecialty').innerText = doctor.specialty;
        document.getElementById('doctorExperience').innerText = doctor.experience;
        document.getElementById('doctorAge').innerText = doctor.age;
        document.getElementById('doctorDetails').style.display = 'block';
        document.getElementById('errorMessageDoctor').style.display = 'none'; // Hide error message
    } else {
        document.getElementById('doctorDetails').style.display = 'none'; // Hide details
        alert("Doctor ID not found");
        
    }
}

// Delete Patient by ID
function deletePatientById() {
    const patientId = document.getElementById('deletePatientId').value;
    let patients = getData('patients');
    const initialLength = patients.length;

    //
    patients = patients.filter(p => p.id !== patientId);
    saveData('patients', patients);

    if (patients.length < initialLength) {
        alert(`Patient with ID ${patientId} has been deleted successfully.`);
        document.getElementById('successMessage').style.display = 'block'; // Show success message
        document.getElementById('errorMessage').style.display = 'none'; // Hide error message
    } else {
        alert(`Patient ID ${patientId} not found.`);
        document.getElementById('errorMessage').style.display = 'block'; // Show error message
        document.getElementById('successMessage').style.display = 'none'; // Hide success message
    }

    // Clear the input field
    document.getElementById('deletePatientId').value = '';
}

// Delete Doctor by ID
function deleteDoctorById() {
    const doctorId = document.getElementById('deleteDoctorId').value;
    let doctors = getData('doctors');
    const initialLength = doctors.length;

    // Filter out the doctor
    doctors = doctors.filter(d => d.id !== doctorId);
    saveData('doctors', doctors);

    if (doctors.length < initialLength) {
        alert(`Doctor with ID ${doctorId} has been deleted successfully.`);
        document.getElementById('successMessageDoctor').style.display = 'block'; // Show success message
        document.getElementById('errorMessageDoctor').style.display = 'none'; // Hide error message
    } else {
        alert(`Doctor ID ${doctorId} not found.`);
        document.getElementById('errorMessageDoctor').style.display = 'block'; // Show error message
        document.getElementById('successMessageDoctor').style.display = 'none'; // Hide success message
    }

    // Clear the input field
    document.getElementById('deleteDoctorId').value = '';
}
