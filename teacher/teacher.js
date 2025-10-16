console.log("✅ teacher.js loaded");

// Define navigation mapping
const navMap = {
  homeBtn: "dashboard.html",
  studentsBtn: "students.html",
  gradebookBtn: "gradebook.html",
  reportsBtn: "reports.html",
  settingsBtn: "settings.html",
  helpBtn: "help.html"
};

// Highlight the active button based on current page
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop(); // e.g., 'settings.html'
  const buttons = document.querySelectorAll("aside button");

  buttons.forEach(btn => {
    btn.classList.remove("active"); // clear all first
  });

  // Find matching nav button
  Object.keys(navMap).forEach(id => {
    const btn = document.getElementById(id);
    if (btn && navMap[id] === currentPage) {
      btn.classList.add("active");
    }
  });

  // Attach navigation event listeners
  Object.keys(navMap).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href = navMap[id];
      });
    }
  });

  // Optional: "Add New Student" button
  const addBtn = document.getElementById("addBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      alert("Add button clicked");
      console.log("Add New Student clicked");
    });
  }
});


// Add Student Modal Logic
document.addEventListener("DOMContentLoaded", () => {
  const addStudentBtn = document.getElementById("addstud-btn");
  const modal = document.getElementById("addStudentModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const addForm = document.getElementById("addStudentForm");

  if (addStudentBtn && modal && cancelBtn) {
    addStudentBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Optional: add student dynamically to table
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("studentName").value;
      const id = document.getElementById("studentId").value;
      const cls = document.getElementById("studentClass").value;
      const courses = document.getElementById("studentCourses").value.split(",").length;
      const grade = document.getElementById("averageGrade").value;

      const tableBody = document.querySelector("table tbody");
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td class="stud-name">${name}</td>
        <td>${id}</td>
        <td>${cls}</td>
        <td>${courses}</td>
        <td>${grade}%</td>
        <td class="action-td">
          <button class="eyeBtn"><i class="fa-solid fa-pen"></i></button>
          <button class="deleteBtn"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      `;
      tableBody.appendChild(newRow);

      modal.style.display = "none";
      addForm.reset();
    });
  }
});
