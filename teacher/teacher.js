console.log("✅ teacher.js loaded");

// ===== NAVIGATION HANDLER =====
const navMap = {
  studentsBtn: "students.html",
  homeBtn: "dashboard.html",
  gradebookBtn: "gradebook.html",
  reportsBtn: "reports.html",
  settingsBtn: "settings.html",
  helpBtn: "help.html",
};

// Function to highlight active button
function setActiveButton(activeId) {
  Object.keys(navMap).forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      if (id === activeId) {
        btn.style.backgroundColor = "#007bff";
        btn.style.color = "#fff";
      } else {
        // btn.style.backgroundColor = "transparent";
        // btn.style.color = "#000";
      }
    }
  });
}

// Detect which page is active (based on URL)
const currentPage = window.location.pathname.split("/").pop();
Object.keys(navMap).forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) {
    if (navMap[id] === currentPage) {
      setActiveButton(id);
    }

    btn.addEventListener("click", () => {
      setActiveButton(id);
      window.location.href = navMap[id];
    });
  }
});

// ===== STUDENT MANAGEMENT LOGIC =====
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("table tbody");
  const modal = document.getElementById("addStudentModal");
  const addForm = document.getElementById("addStudentForm");
  const addBtns = [document.getElementById("addBtn"), document.getElementById("addstud-btn")];
  const closeModal = document.getElementById("closeModal");

  let editingIndex = null;

  // ===== LocalStorage Utilities =====
  const getStudents = () => JSON.parse(localStorage.getItem("students")) || [];
  const saveStudents = (students) => localStorage.setItem("students", JSON.stringify(students));

  // ===== Render Students in Table =====
  const renderStudents = () => {
    const students = getStudents();
    tableBody.innerHTML = "";

    students.forEach((s, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="stud-name">${s.name}</td>
        <td>${s.id}</td>
        <td>${s.class}</td>
        <td>${s.courses}</td>
        <td>${s.grade}%</td>
        <td class="action-td">
          <button class="editBtn" data-index="${index}"><i class="fa-solid fa-pen"></i></button>
          <button class="deleteBtn" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  };

  if (tableBody) renderStudents();

  // ===== Show Modal =====
  addBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        editingIndex = null;
        if (addForm) addForm.reset();
        if (modal) modal.style.display = "flex";
      });
    }
  });

  // ===== Hide Modal =====
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // ===== Add or Update Student =====
  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("studentName").value;
      const id = document.getElementById("studentId").value;
      const cls = document.getElementById("studentClass").value;
      const courses = document.getElementById("studentCourses").value;
      const grade = document.getElementById("averageGrade").value;

      let students = getStudents();
      const newStudent = { name, id, class: cls, courses, grade };

      if (editingIndex !== null) {
        students[editingIndex] = newStudent;
      } else {
        students.push(newStudent);
      }

      saveStudents(students);
      renderStudents();
      addForm.reset();
      modal.style.display = "none";
    });
  }

  // ===== Edit / Delete Buttons =====
  if (tableBody) {
    tableBody.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".editBtn");
      const deleteBtn = e.target.closest(".deleteBtn");

      if (editBtn) {
        const index = parseInt(editBtn.dataset.index);
        const students = getStudents();
        const s = students[index];

        document.getElementById("studentName").value = s.name;
        document.getElementById("studentId").value = s.id;
        document.getElementById("studentClass").value = s.class;
        document.getElementById("studentCourses").value = s.courses;
        document.getElementById("averageGrade").value = s.grade;

        editingIndex = index;
        modal.style.display = "flex";
      }

      if (deleteBtn) {
        const index = parseInt(deleteBtn.dataset.index);
        const confirmDelete = confirm("Are you sure you want to delete this student?");
        if (confirmDelete) {
          let students = getStudents();
          students.splice(index, 1);
          saveStudents(students);
          renderStudents();
        }
      }
    });
  }
});
