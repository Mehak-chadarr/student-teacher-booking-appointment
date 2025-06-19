// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// add your Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Handle form submission
document.getElementById('container-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const studentId = document.getElementById('studentId').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // ✅ Set displayName in Firebase Auth profile
      return updateProfile(user, {
        displayName: name
      }).then(() => {
        // ✅ Save additional info in Realtime Database
        return set(ref(database, 'users/' + user.uid), {
          fullName: name,
          email: email,
          studentId: studentId,
          role: "student",
          uid: user.uid
        });
      });
    })
    .then(() => {
      alert("Student registered successfully!");
      document.getElementById('container-form').reset();
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});