// Firebase config and initialization (modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// add your Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const teacherList = document.getElementById('teacher-list');

// Function to create a card for each teacher
function createTeacherCard(teacher, teacherId) {
  const card = document.createElement('div');
  card.className = 'teacher-card';

  card.innerHTML = `
    <p><strong>Full Name:</strong> ${teacher.fullname || 'N/A'}</p>
    <p><strong>Department:</strong> ${teacher.department || 'N/A'}</p>
    <p><strong>Email:</strong> ${teacher.email || 'N/A'}</p>
    <p><strong>Subject:</strong> ${teacher.subject || 'N/A'}</p>
  `;

  const btn = document.createElement('button');
  btn.className = 'btn-appointment';
  btn.textContent = 'Take Appointment';

  btn.onclick = async () => {
    try {
      await addDoc(collection(db, "appointments"), {
        teacherId: teacherId,
        teacherName: teacher.fullname,
        timestamp: serverTimestamp()
      });
      alert(`Appointment requested with ${teacher.fullname}`);
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to request appointment.");
    }
  };

  card.appendChild(btn);
  return card;
}

// Fetch teacher data from Firestore and render it
async function loadTeachers() {
  try {
    const querySnapshot = await getDocs(collection(db, "teachers"));
    querySnapshot.forEach((doc) => {
      const teacher = doc.data();
      const card = createTeacherCard(teacher, doc.id);
      teacherList.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
  }
}

// Load teachers on page load
loadTeachers();
