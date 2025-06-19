import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

//  add your Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Handle form submission
const form = document.getElementById("teacherForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const department = document.getElementById("department").value;
  const subject = document.getElementById("subject").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // ✅ Save teacher data using UID as the key
      return set(ref(db, "teachers/" + user.uid), {
        fullname: name,
        department: department,
        subject: subject,
        role: "teacher", // Keep this lowercase
        email: email
      });
    })
    .then(() => {
      alert("Teacher registered and added successfully!");
      form.reset();
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});