let data = {
  "courses": [
    { "id": 1, "courseName": "Mathematics", "teacher": "Mr. Smith", "credits": 3 },
    { "id": 2, "courseName": "English", "teacher": "Mrs. Brown", "credits": 3 },
    { "id": 3, "courseName": "Science", "teacher": "Dr. Lee", "credits": 4 },
    { "id": 4, "courseName": "History", "teacher": "Ms. Davis", "credits": 3 },
    { "id": 5, "courseName": "Physical Education", "teacher": "Coach Williams", "credits": 2 }
  ],
  "students": [
    { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "password": "student123", "enrolledCourses": [1, 2, 3] },
    { "id": 2, "name": "Brian Okafor", "email": "brian@example.com", "password": "student123", "enrolledCourses": [1, 2, 3] },
    { "id": 3, "name": "Chinwe Adeyemi", "email": "chinwe@example.com", "password": "student123", "enrolledCourses": [1, 2, 3, 4] },
    { "id": 4, "name": "David Okonkwo", "email": "david@example.com", "password": "student123", "enrolledCourses": [1, 2, 3] },
    { "id": 5, "name": "Esther Nwankwo", "email": "esther@example.com", "password": "student123", "enrolledCourses": [1, 2, 3, 5] }
  ],
  "grades": [
    { "studentId": 1, "courseId": 1, "grade": 85 },
    { "studentId": 1, "courseId": 2, "grade": 92 },
    { "studentId": 1, "courseId": 3, "grade": 78 },
    { "studentId": 2, "courseId": 1, "grade": 74 },
    { "studentId": 2, "courseId": 2, "grade": 88 },
    { "studentId": 2, "courseId": 3, "grade": 90 },
    { "studentId": 3, "courseId": 1, "grade": 95 },
    { "studentId": 3, "courseId": 2, "grade": 87 },
    { "studentId": 3, "courseId": 3, "grade": 91 },
    { "studentId": 3, "courseId": 4, "grade": 89 },
    { "studentId": 4, "courseId": 1, "grade": 68 },
    { "studentId": 4, "courseId": 2, "grade": 75 },
    { "studentId": 4, "courseId": 3, "grade": 82 },
    { "studentId": 5, "courseId": 1, "grade": 91 },
    { "studentId": 5, "courseId": 2, "grade": 89 },
    { "studentId": 5, "courseId": 3, "grade": 94 },
    { "studentId": 5, "courseId": 5, "grade": 88 }
  ],
  "admins": [
    { "username": "admin", "password": "admin123", "name": "Admin User", "email": "admin@edugrade.com" }
  ]
}

let id = 6;
let names = "Ajijolaoluwa Adesoji";
let email = "ajeeai@gmail.com";
let password = "student123";
let courses = [1, 2, 4];

function addStudent(id, name, email, password, courses=[]){
    if (id !== "" && name !=="" && email !=="" && password !== ""){
        studentDetails = {
            "id": id,
            "name": name,
            "email": email,
            "password": password,
            "enrolledCourses": courses
        }
        data.students.push(studentDetails);
        localStorage.setItem("studentInfo", JSON.stringify(data.students));
    }
}

function deleteStudent(index){
    let got = JSON.parse(localStorage.getItem("studentInfo"));
    delete got[index];
    got.splice(index, 1);
    localStorage.setItem("studentInfo", JSON.stringify(got));
    // localStorage.remove("studentInfo"[index]);
}


addStudent(id, names, email, password, courses);
addStudent(7, "Akinpelumi Precious", "precious159@gmail.com", "student159", [1,3,6])
// console.log(JSON.stringify(data.students));
deleteStudent(5);
// Create a fictional div element
// let input = document.getElementById("input").value.trim();
// let messageDiv = document.getElementById("message-div");
// function addStudent(){
//     if (input !== ""){
//         grades.push(input);
//     } else {
//         messageDiv.textContent = "This field cannot be empty!!!"
//     }
// }