let studentLoginBtn = document.getElementById("studentLoginBtn");
if (studentLoginBtn) {
  studentLoginBtn.addEventListener("click", () => {
    alert("Student button clicked");
    window.location.href = "../login/student_login.html";
  });
}

let teacherLoginBtn = document.getElementById("teacherLoginBtn");
if (teacherLoginBtn) {
  teacherLoginBtn.addEventListener("click", () => {
    alert("Teacher button clicked");
    window.location.href = "../login/login.html";
  });
}