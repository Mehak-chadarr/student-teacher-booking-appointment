// Firebase configurati
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// add your firebase configuration
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Check login
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;
    fetchAppointments(userId);
  } else {
    alert("Please login first.");
    window.location.href = "login.html"; // redirect if not logged in
  }
});

// Fetch appointments for logged-in teacher
function fetchAppointments(userId) {
  const appointmentListContainer = document.getElementById('appointmentList');
  appointmentListContainer.innerHTML = '<p>Loading appointments...</p>';

  const appointmentsRef = query(ref(db, 'appointments'), orderByChild('teacherId'), equalTo(userId));
  onValue(appointmentsRef, (snapshot) => {
    const data = snapshot.val();
    appointmentListContainer.innerHTML = '';

    if (data) {
      Object.entries(data).forEach(([key, appointment]) => {
        const card = document.createElement('div');
        card.classList.add('appointment-card');
        card.innerHTML = `
          <div class="appointment-details">
            <h3>${appointment.studentName || 'Student'}</h3>
           
            <p><strong>Date:</strong> ${appointment.date || ''}</p>
            <p><strong>Time:</strong> ${appointment.time || ''}</p>
            <p><strong>Status:</strong> ${appointment.status || 'Pending'}</p>
          </div>
          <div class="button-container">
            <button onclick="acceptAppointment('${key}')">Accept</button>
            <button onclick="cancelAppointment('${key}')">Cancel</button>
          </div>
        `;
        appointmentListContainer.appendChild(card);
      });
    } else {
      appointmentListContainer.innerHTML = '<p>No appointment requests found.</p>';
    }
  });
}

// Make Accept/Cancel available globally
window.acceptAppointment = function (appointmentId) {
  update(ref(db, 'appointments/' + appointmentId), {
    status: 'Accepted'
  }).then(() => {
    alert('Appointment Accepted!');
  });
};

window.cancelAppointment = function (appointmentId) {
  update(ref(db, 'appointments/' + appointmentId), {
    status: 'Cancelled'
  }).then(() => {
    alert('Appointment Cancelled!');
  });
};