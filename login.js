
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
  import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
  import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

  // add your Firebase configuration
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const dbRef = ref(db);

      console.log("Logged in UID:", uid);

      const adminSnap = await get(child(dbRef, `admins/${uid}`));
      const teacherSnap = await get(child(dbRef, `teachers/${uid}`));
      const studentSnap = await get(child(dbRef, `users/${uid}`));

      if (adminSnap.exists()) {
        alert("Logged in as Admin");
        window.location.href =
         "adminpanel.html";
      } else if (teacherSnap.exists()) {
        alert("Logged in as Teacher");
        window.location.href = "teacher_panel.html";
      } else if (studentSnap.exists()) {
        alert("Logged in as Student");
        window.location.href = "student_dashboard.html";
      } else {
        alert("User role not found in database.");
        console.log("UID not found in admins, teachers, or users node.");
      }

    } catch (error) {
      alert("Login error: " + error.message);
      console.error("Login error:", error);
    }
  });
