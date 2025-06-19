import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// add your Firebase configuration

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const teachersList = document.getElementById("teachersList");
const summaryTeacher = document.getElementById("summaryTeacher");
const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");
const modalTeacher = document.getElementById("modalTeacher");
const modalDate = document.getElementById("modalDate");
const modalTime = document.getElementById("modalTime");
const calendar = document.getElementById("calendar");
const slotsGrid = document.getElementById("slotsGrid");
const appointmentForm = document.getElementById("appointmentForm");
const successModal = document.getElementById("successModal");
const closeModalBtn = document.getElementById("closeModalBtn");

let teachers = [];
let selectedTeacher = null;
let selectedDate = null;
let selectedTime = null;

function fetchTeachers() {
  onValue(ref(db, "teachers"), (snapshot) => {
    teachers = [];
    teachersList.innerHTML = "";

    snapshot.forEach((childSnap) => {
      const data = childSnap.val();
      const subjectArray = Array.isArray(data.subject)
        ? data.subject
        : typeof data.subject === "string"
        ? [data.subject]
        : [];

      const teacher = {
        id: childSnap.key,
        fullname: data.fullname || "Unknown",
        department: data.department || "",
        subject: subjectArray,
        email: data.email || ""
      };

      teachers.push(teacher);
    });

    renderTeachers();
  });
}

function renderTeachers() {
  teachersList.innerHTML = "";
  teachers.forEach((teacher) => {
    const initials = teacher.fullname
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const card = document.createElement("div");
    card.className = "teacher-card";
    card.innerHTML = `
      <div class="teacher-avatar">${initials}</div>
      <div class="teacher-name">${teacher.fullname}</div>
      <div class="teacher-department">${teacher.department}</div>
      <div class="teacher-subjects">${teacher.subject.join(", ")}</div>
    `;

    card.addEventListener("click", () => {
      selectedTeacher = teacher;
      document.querySelectorAll(".teacher-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");

      summaryTeacher.innerText = teacher.fullname;
      modalTeacher.innerText = teacher.fullname;
    });

    teachersList.appendChild(card);
  });
}

function generateCalendar() {
  const today = new Date();
  calendar.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dateStr = date.toISOString().split("T")[0];

    const button = document.createElement("button");
    button.innerText = date.toDateString().slice(0, 10);
    button.setAttribute("data-date", dateStr);
    button.className = "calendar-day";

    button.addEventListener("click", () => {
      selectedDate = dateStr;
      summaryDate.innerText = dateStr;
      modalDate.innerText = dateStr;

      document.querySelectorAll(".calendar-day").forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");

      renderTimeSlots();
    });

    calendar.appendChild(button);
  }
}

function renderTimeSlots() {
  slotsGrid.innerHTML = "";
  const timeSlots = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];

  timeSlots.forEach((slot) => {
    const btn = document.createElement("button");
    btn.innerText = slot;
    btn.className = "slot-btn";
    btn.addEventListener("click", () => {
      selectedTime = slot;
      summaryTime.innerText = slot;
      modalTime.innerText = slot;

      document.querySelectorAll(".slot-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });

    slotsGrid.appendChild(btn);
  });
}

appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const studentName = document.getElementById("studentName").value;
  const studentEmail = document.getElementById("studentEmail").value;
  const purpose = document.getElementById("meetingPurpose").value;
  const notes = document.getElementById("meetingNotes").value;
  const otherPurpose = document.getElementById("otherPurpose").value;

  if (!selectedTeacher || !selectedDate || !selectedTime) {
    alert("Please select a teacher, date, and time.");
    return;
  }

  const appointmentData = {
    teacherId: selectedTeacher.id,
    teacherName: selectedTeacher.fullname,
    studentName,
    studentEmail,
    date: selectedDate,
    time: selectedTime,
    purpose: purpose === "Other" ? otherPurpose : purpose,
    notes,
    status: "pending" // for teacher approval
  };

  const appointmentKey = push(ref(db, "appointments"));
  set(appointmentKey, appointmentData)
    .then(() => {
      const teacherScheduleRef = ref(db,` teacherSchedules/${selectedTeacher.id}/${appointmentKey.key}`);
      return set(teacherScheduleRef, appointmentData);
    })
    .then(() => {
      successModal.style.display = "block";
    })
    .catch((err) => {
      alert("Error booking appointment: " + err);
    });
});

closeModalBtn.addEventListener("click", () => {
  successModal.style.display = "none";
  appointmentForm.reset();
  summaryDate.innerText = "Not selected";
  summaryTime.innerText = "Not selected";
});

fetchTeachers();
generateCalendar();