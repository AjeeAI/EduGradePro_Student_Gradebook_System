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

let gradebookButton = document.getElementById("gradebookButton");
if (gradebookButton) {
  gradebookButton.addEventListener("click", () => {
    window.location.href = "gradebook.html";
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
  const cancelBtn = document.getElementById("cancelBtn");

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
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      // alert("Changes you made may not be saved.");
      if (modal) modal.style.display = "none";
      if (addForm) addForm.reset();
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

let totalStud = document.getElementById("totalStud");
totalStud.innerText = getStudents().length;
function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

let activeClasses = document.getElementById("activeClasses");
activeClasses.innerText = getActiveClassesCount();

function getActiveClassesCount() {
  const students = getStudents();
  const classes = students.map(s => s.class);
  return new Set(classes).size;
}

let aveGrad = document.getElementById("aveGrad");
aveGrad.innerText = getAverageGrade();  
function getAverageGrade() {
  const students = getStudents();
  if (students.length === 0) return "N/A";
  const total = students.reduce((sum, s) => sum + (parseFloat(s.grade) || 0), 0);
  return (total / students.length).toFixed(2);
}

let assDue = document.getElementById("assDue");
assDue.innerText = getAssignmentsDueCount();

function getAssignmentsDueCount() {
  const students = getStudents();
  return students.reduce((count, s) => count + (s.assignmentsDue || 0), 0);
}

let searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const students = getStudents();
    const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm));
    renderStudentTable(filteredStudents);
  });
}

function renderStudentTable(students) {
  const tableBody = document.querySelector("table tbody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="stud-name">${student.name}</td>
      <td>${student.id}</td>
      <td>${student.class}</td>
      <td class="action-td">
        <button class="eyeBtn" data-index="${index}">
          <i class="fa-regular fa-eye"></i>
        </button>
        <button class="editBtn" id="editBtn-${index}" data-index="${index}">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="deleteBtn" id="deleteBtn-${index}" data-index="${index}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}
/* ===============================
   ✅ GRADEBOOK FUNCTIONALITY
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  const gradeTable = document.querySelector("#gradeTable tbody");
  const avgGrade = document.getElementById("avgGrade");
  const highestGrade = document.getElementById("highestGrade");
  const lowestGrade = document.getElementById("lowestGrade");
  const courseFilter = document.getElementById("courseFilter");
  const searchInput = document.getElementById("searchStudent");
  const modal = document.getElementById("gradeModal");
  const studentSelect = document.getElementById("studentSelect");
  const courseSelect = document.getElementById("courseSelect");
  const gradeInput = document.getElementById("gradeInput");
  const addBtn = document.getElementById("addGradeBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  // ===== Load Data from localStorage =====
  const data = JSON.parse(localStorage.getItem("edugradeData")) || {};
  const students = data.students || [];
  const courses = data.courses || [];
  let grades = data.grades || [];

  // ===== Populate Select Inputs and Filters =====
  courses.forEach((course) => {
    const opt = document.createElement("option");
    opt.value = course.id;
    opt.textContent = course.courseName;
    courseFilter.appendChild(opt);

    const selectOpt = opt.cloneNode(true);
    courseSelect.appendChild(selectOpt);
  });

  students.forEach((student) => {
    const opt = document.createElement("option");
    opt.value = student.id;
    opt.textContent = student.name;
    studentSelect.appendChild(opt);
  });

  // ===== Render Grade Table =====
  function renderTable(courseFilterVal = "all", searchTerm = "") {
    gradeTable.innerHTML = "";

    let filteredGrades = grades.map((g) => ({
      ...g,
      student: students.find((s) => s.id === g.studentId)?.name || "Unknown",
      course: courses.find((c) => c.id === g.courseId)?.courseName || "Unknown",
    }));

    if (courseFilterVal !== "all") {
      filteredGrades = filteredGrades.filter((g) => g.courseId == courseFilterVal);
    }

    if (searchTerm.trim()) {
      filteredGrades = filteredGrades.filter((g) =>
        g.student.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filteredGrades.length === 0) {
      gradeTable.innerHTML = `<tr><td colspan="6">No records found</td></tr>`;
      avgGrade.textContent = "Average: --";
      highestGrade.textContent = "Highest: --";
      lowestGrade.textContent = "Lowest: --";
      return;
    }

    const gradeValues = filteredGrades.map((g) => g.grade);
    avgGrade.textContent = "Average: " + (gradeValues.reduce((a, b) => a + b) / gradeValues.length).toFixed(1);
    highestGrade.textContent = "Highest: " + Math.max(...gradeValues);
    lowestGrade.textContent = "Lowest: " + Math.min(...gradeValues);

    filteredGrades.forEach((g) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${g.studentId}</td>
        <td>${g.student}</td>
        <td>${g.course}</td>
        <td>${g.grade}</td>
        <td>${getLetterGrade(g.grade)}</td>
        <td class="action-td">
          <button class="edit" data-id="${g.studentId}" data-course="${g.courseId}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="delete" data-id="${g.studentId}" data-course="${g.courseId}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      gradeTable.appendChild(tr);
    });
  }

  // ===== Convert Number to Letter Grade =====
  function getLetterGrade(score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  // ===== Event Listeners =====
  if (courseFilter) {
    courseFilter.addEventListener("change", () =>
      renderTable(courseFilter.value, searchInput.value)
    );
  }

  if (searchInput) {
    searchInput.addEventListener("input", () =>
      renderTable(courseFilter.value, searchInput.value)
    );
  }

  // ===== Modal Open/Close =====
  if (addBtn) {
    addBtn.addEventListener("click", () => (modal.style.display = "flex"));
  }

  if (cancelBtn) {
    // alert("Changes you made may not be saved.");
    cancelBtn.addEventListener("click", () => (modal.style.display = "none"));
  }

  // ===== Add or Edit Grade =====
  const gradeForm = document.getElementById("gradeForm");
  if (gradeForm) {
    gradeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const sid = parseInt(studentSelect.value);
      const cid = parseInt(courseSelect.value);
      const grade = parseFloat(gradeInput.value);

      const existing = grades.find(
        (g) => g.studentId === sid && g.courseId === cid
      );

      if (existing) {
        existing.grade = grade;
      } else {
        grades.push({ studentId: sid, courseId: cid, grade });
      }

      localStorage.setItem("edugradeData", JSON.stringify({ ...data, grades }));
      modal.style.display = "none";
      renderTable(courseFilter.value, searchInput.value);
    });
  }

  // ===== Edit / Delete Handlers =====
  document.body.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit");
    const deleteBtn = e.target.closest(".delete");

    if (editBtn) {
      const sid = parseInt(editBtn.dataset.id);
      const cid = parseInt(editBtn.dataset.course);
      const record = grades.find(
        (g) => g.studentId === sid && g.courseId === cid
      );

      if (record) {
        studentSelect.value = sid;
        courseSelect.value = cid;
        gradeInput.value = record.grade;
        modal.style.display = "flex";
      }
    }

    if (deleteBtn) {
      const sid = parseInt(deleteBtn.dataset.id);
      const cid = parseInt(deleteBtn.dataset.course);

      if (confirm("Are you sure you want to delete this grade?")) {
        grades = grades.filter(
          (g) => !(g.studentId === sid && g.courseId === cid)
        );
        localStorage.setItem("edugradeData", JSON.stringify({ ...data, grades }));
        renderTable(courseFilter.value, searchInput.value);
      }
    }
  });

  // ===== Initial Render =====
  if (gradeTable) renderTable();
});


document.addEventListener("DOMContentLoaded", () => {
    const grades = JSON.parse(localStorage.getItem("grades")) || [];

    const avgGrade = document.getElementById("avgGrade");
    const topCourse = document.getElementById("topCourse");
    const lowCourse = document.getElementById("lowCourse");
    const totalGraded = document.getElementById("totalGraded");
    const reportTableBody = document.querySelector("#reportTable tbody");

    if (grades.length === 0) {
        avgGrade.textContent = "No data";
        topCourse.textContent = "-";
        lowCourse.textContent = "-";
        totalGraded.textContent = "0";
        return;
    }

    // Group by course
    const courseGroups = {};
    grades.forEach(entry => {
        if (!courseGroups[entry.course]) courseGroups[entry.course] = [];
        courseGroups[entry.course].push(Number(entry.grade));
    });

    const courseStats = [];
    let overallSum = 0;
    let overallCount = 0;

    for (const [course, scores] of Object.entries(courseGroups)) {
        const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
        const high = Math.max(...scores);
        const low = Math.min(...scores);
        courseStats.push({ course, avg: Number(avg), high, low, count: scores.length });
        overallSum += scores.reduce((a, b) => a + b, 0);
        overallCount += scores.length;
    }

    // Calculate overall averages
    const overallAvg = (overallSum / overallCount).toFixed(1);
    const top = courseStats.reduce((a, b) => (a.avg > b.avg ? a : b));
    const low = courseStats.reduce((a, b) => (a.avg < b.avg ? a : b));

    avgGrade.textContent = `${overallAvg}%`;
    topCourse.textContent = `${top.course} (${top.avg}%)`;
    lowCourse.textContent = `${low.course} (${low.avg}%)`;
    totalGraded.textContent = overallCount;

    // Fill table
    courseStats.forEach(stat => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${stat.course}</td>
            <td>${stat.avg}%</td>
            <td>${stat.high}</td>
            <td>${stat.low}</td>
            <td>${stat.count}</td>
        `;
        reportTableBody.appendChild(row);
    });
});

let viewStuBtn = document.getElementById("viewStuBtn");
if (viewStuBtn) {
  viewStuBtn.addEventListener("click", () => {
    window.location.href = "students.html";
  });
}


// =================Teacher settings ==============

// =========================
// Navigation (Sidebar)
// =========================
document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "teacher.html";
});

document.getElementById("studentsBtn").addEventListener("click", () => {
    window.location.href = "students.html";
});

document.getElementById("gradebookBtn").addEventListener("click", () => {
    window.location.href = "gradebook.html";
});

document.getElementById("reportsBtn").addEventListener("click", () => {
    window.location.href = "reports.html";
});

document.getElementById("settingsBtn").addEventListener("click", () => {
    window.location.href = "settings.html";
});

document.getElementById("helpBtn").addEventListener("click", () => {
    window.location.href = "help.html";
});

document.getElementById("addBtn").addEventListener("click", () => {
    window.location.href = "add-student.html";
});

// =========================
// Load and Save Settings
// =========================
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");

const updateProfileBtn = document.getElementById("updateProfileBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");

// Load saved profile from localStorage
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem("teacherProfile")) || {
        fullName: "Teacher Name",
        email: "teacher@example.com",
        username: "teacher123"
    };
    fullNameInput.value = profile.fullName;
    emailInput.value = profile.email;
    usernameInput.value = profile.username;
}

// Save updated profile info
updateProfileBtn.addEventListener("click", () => {
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();

    if (!fullName || !email || !username) {
        alert("Please fill in all fields before updating.");
        return;
    }

    const updatedProfile = { fullName, email, username };
    localStorage.setItem("teacherProfile", JSON.stringify(updatedProfile));
    alert("Profile updated successfully!");
});

// =========================
// Password Change Handling
// =========================
changePasswordBtn.addEventListener("click", () => {
    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Get stored password (simulate real system)
    const storedPassword = localStorage.getItem("teacherPassword") || "admin123";

    if (currentPassword !== storedPassword) {
        alert("Current password is incorrect.");
        return;
    }

    if (!newPassword || !confirmPassword) {
        alert("Please fill in all password fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }

    localStorage.setItem("teacherPassword", newPassword);
    alert("Password changed successfully!");
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
});

// =========================
// Initialize Page
// =========================
document.addEventListener("DOMContentLoaded", loadProfile);



// let searchInputtwo = document.getElementById("searchInputtwo");
// if (searchInputtwo) {
//   searchInputtwo.addEventListener("input", () => {
//     const searchTerm = searchInputtwo.value.toLowerCase();
//     const students = getStudents();
//     const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm));
//     renderStudentTable(filteredStudents);
//   });
// }

// function renderStudentTable(students) {
//   const tableBody = document.querySelector("table tbody");
//   if (!tableBody) return;
//   tableBody.innerHTML = "";

//   students.forEach((student, index) => {
//     const row = document.createElement("tr");
//     row.innerHTML = `
//       <td class="stud-name">${student.name}</td>
//       <td>${student.id}</td>
//       <td>${student.class}</td>
//       <td class="action-td">
//         <button class="eyeBtn" data-index="${index}">
//           <i class="fa-regular fa-eye"></i>
//         </button>
//         <button class="editBtn" id="editBtn-${index}" data-index="${index}">
//           <i class="fa-solid fa-pen"></i>
//         </button>
//         <button class="deleteBtn" id="deleteBtn-${index}" data-index="${index}">
//           <i class="fa-solid fa-trash-can"></i>
//         </button>
//       </td>
//     `;
//     tableBody.appendChild(row);
//   });
// }


// let editBtn = document.getElementById("editBtn-${index}");
// if (editBtn) {
//   editBtn.addEventListener("click", () => { 
//     const index = parseInt(editBtn.dataset.index);
//     const students = getStudents();
//     const s = students[index];

//     document.getElementById("studentName").value = s.name;
//     document.getElementById("studentId").value = s.id;
//     document.getElementById("studentClass").value = s.class;
//     document.getElementById("studentCourses").value = s.courses;
//     document.getElementById("averageGrade").value = s.grade;

//     editingIndex = index;
//     modal.style.display = "flex";
//   });
// }


