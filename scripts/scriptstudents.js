// url for json
const students = "https://petlatkea.dk/2019/hogwartsdata/students.json";
const families = "https://petlatkea.dk/2019/hogwartsdata/families.json";

//html query selectors
const template = document.querySelector("#myTemp").content;
const parent = document.querySelector("main");
const modal = document.querySelector(".modal-bg");

//define variables and constants
const allStudents = [];
let studentsFilter = [];
let currentList = [];
let houseG = 0;
let houseH = 0;
let houseR = 0;
let houseS = 0;
let expelledlist = [];

window.addEventListener("DOMContentLoaded", start);

// start function
function start() {
  console.log("ready");
  document.querySelector("#sorting").addEventListener("change", selectSorting);
  document.querySelector("#filter").addEventListener("change", selectFilter);
  document.querySelector("#student").addEventListener("click", clickSomething);

  // load student json data
  loadJSON();
}

// click on article element
function clickSomething(event) {
  const element = event.target;
  if (element.dataset.action === "remove") {
    console.log("Remove button clicked!");

    // check if element contains the Hacking object inserted in Json
    if (!element.parentElement.parentElement.innerHTML.includes("Andreea")) {
      // remove element
      element.parentElement.parentElement.remove();

      // push the student to expelled list
      currentList.push(student);

      // display expelled and current numbers
      let expellednr = document.querySelector("#expellednr");
      let currentnr = document.querySelector("#curentnr");
      expellednr.textContent = currentList.length;
      currentnr.textContent = allStudents.length - currentList.length;
    } else {
      // alert if the element contains the Hacking object inserted in Json
      alert("You cannot expell this!");
    }
  }

  // check if modal and show details of student.
  if (element.dataset.action === "modal") {
    let id = element.parentElement.parentElement.firstElementChild.textContent;
    let stud = allStudents.filter(x => x.id === id);
    return showDetails(stud[0]);
  }
}

//This is a function for sorting
function selectSorting() {
  sort = this.value;
  allStudents.sort((a, b) => {
    return a[sort].localeCompare(b[sort]);
  });

  // display the list of students
  displayList(allStudents);
}

//This is a function for filter
function selectFilter() {
  filter = this.value.toUpperCase();
  studentsFilter = [];
  allStudents.filter(function(student) {
    if (filter === "ALL") {
      studentsFilter.push(student);
    }
    if (student.house === filter) {
      studentsFilter.push(student);
    }
  });
  // display the list of students
  displayList(studentsFilter);
}

//Here we fetch the data - students
function loadJSON() {
  fetch(students)
    .then(response => response.json())
    .then(jsonData => {
      // when loaded, prepare objects
      JSON.stringify(jsonData);
      prepareObjects(jsonData);
    });
}
//Here we fetch the data for const families - bloo status , pure, half
function loadJSONfamilies(student) {
  fetch(families)
    .then(response => response.json())
    .then(jsonDatafamilies => {
      // when loaded, prepare objects
      JSON.stringify(jsonDatafamilies);
      prepareObjectsFamily(jsonDatafamilies, student);
    });
}

//Here we prepare our ObjectsFamily
function prepareObjectsFamily(jsonDatafamilies, student) {
  checkFamilyBloodS(jsonDatafamilies, student);
}

//Here we prepare our Objects
function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    jsonObject.fullname = jsonObject.fullname.toString().trim();
    jsonObject.house = jsonObject.house.toString().trim();
    // calculate the number of students per each house
    if (jsonObject.house.toUpperCase() === "GRYFFINDOR") {
      houseG++;
    } else if (jsonObject.house.toUpperCase() === "HUFFLEPUFF") {
      houseH++;
    } else if (jsonObject.house.toUpperCase() === "RAVENCLAW") {
      houseR++;
    } else if (jsonObject.house.toUpperCase() === "SLYTHERIN") {
      houseS++;
    }
  });

  // cleanup the student json data
  jsonData.forEach(jsonObject => {
    const student = Object.create(Students);
    const texts = jsonObject.fullname.split(" ");

    student.firstname = texts[0].toUpperCase();
    student.middlename = jsonObject.fullname.match(/\w+|"[^"]+"/g)[1];
    if (student.middlename) {
      student.middlename = student.middlename.replace(/['"]+/g, "");
    }

    //cleanup lastname from student json data
    if (texts.length == 3) {
      student.lastname = texts[2].toUpperCase();
    } else if (texts.length == 2) {
      student.lastname = texts[1].toUpperCase();
    } else {
      student.lastname = "";
    }

    student.house = jsonObject.house.toUpperCase();
    student.gender = jsonObject.gender;
    student.id = uuid();

    // push the student to allstudents array
    allStudents.push(student);

    // display the number of students per each house in html
    document.querySelector("#houseG").textContent = houseG;
    document.querySelector("#houseH").textContent = houseH;
    document.querySelector("#houseR").textContent = houseR;
    document.querySelector("#houseS").textContent = houseS;
    let expellednr = document.querySelector("#expellednr");
    let currentnr = document.querySelector("#curentnr");
    expellednr.textContent = currentList.length;
    currentnr.textContent = allStudents.length + 1 - currentList.length;
  });

  //rebuildList();

  //Create new student  - Hacking our name with all the information- Ioana Andreea Mihai
  const myname = Object.create(Students);

  myname.firstname = "PAULA IASMINA";
  myname.lastname = "FILIPCIUC";
  myname.house = "HUFFLEPUFF";
  myname.gender = "girl";
  myname.id = "050499";
  allStudents.push(myname);
  displayList(allStudents);
}

// https://www.endyourif.com/create-guid-uuid-in-javascript/ - this function is for a unique id
// this function is for a unique id
function uuid() {
  let bytes = window.crypto.getRandomValues(new Uint8Array(32));
  const randomBytes = () => (bytes = bytes.slice(1)) && bytes[0];

  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (randomBytes() & (15 >> (c / 4)))).toString(16)
  );
}
// end of function unique id

//display List function
function displayList(student) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  student.forEach(displayStudent);
}

//display student
function displayStudent(student, index) {
  // create clone
  const clone = document
    .querySelector("template#myTemp")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstname;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=uuid]").textContent = student.id;
  //clone.querySelector(".imageT").src = "images/" + student.lastname.toLowerCase() + "_" + student.firstname.substring(0, 1).toLowerCase() + ".png";

  //store the index on the button
  clone.querySelector("[data-action=remove]").dataset.index = index;
  clone.querySelector("[data-action=modal]").dataset.index = index;
  modal.addEventListener("click", () => modal.classList.add("hide"));

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

//Check family blood status function
function checkFamilyBloodS(familyBloodS, student) {
  const bloodInfo = modal.querySelector(".modal-bloodstatus");
  console.log(familyBloodS.half);
  if (
    familyBloodS.half.includes(
      capitalizeFirstLetter(student.lastname.toLowerCase())
    )
  ) {
    bloodInfo.textContent = "halfblood";
  } else if (
    familyBloodS.pure.includes(
      capitalizeFirstLetter(student.lastname.toLowerCase())
    )
  ) {
    bloodInfo.textContent = "pureblood";
  } else {
    bloodInfo.textContent = "non-magical parents";
  }
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//modal function
function showDetails(student) {
  modal.querySelector(".modal-firstname").textContent = student.firstname;
  //modal.querySelector(".modal-middlename").textContent = student.middlename;
  modal.querySelector(".modal-lastname").textContent = student.lastname;
  modal.querySelector(".modal-house").textContent = student.house;
  modal.querySelector(".modal-gender").textContent = student.gender;
  modal.querySelector(".modal-image").src =
    "images/" +
    student.lastname.toLowerCase() +
    "_" +
    student.firstname.charAt(0).toLowerCase() +
    ".png";
  modal.classList.remove("hide");
  loadJSONfamilies(student);
  // try to do it more dynamic --- We need to add bh color for each modal depending on color of the house
  if (student.house === "GRYFFINDOR") {
    modal.querySelector(".modal-crest").src = "images/gryf.jpg";
  }

  if (student.house === "HUFFLEPUFF") {
    modal.querySelector(".modal-crest").src = "images/huffle.jpg";
  }

  if (student.house === "RAVENCLAW") {
    modal.querySelector(".modal-crest").src = "images/raven.jpg";
  }

  if (student.house === "SLYTHERIN") {
    modal.querySelector(".modal-crest").src = "images/slyt.jpg";
  }
}

function showStudents(data) {
  data.forEach(loadDataStudents => {
    //clone the template
    const clone = template.cloneNode(true);
    clone.querySelector("buttonDetails").addEventListener("click", () => {
      showDetails(loadDataStudents);
    });

    modal.addEventListener("click", () => modal.classList.add("hide"));

    //append to DOM
    parent.appendChild(clone);
  });
}

//Get prototype Student
const Students = {
  firstname: "-firstName-",
  middlename: "-middleName-",
  lastname: "-lastname-",
  house: "-house-",
  gender: "-gender-",
  nickname: "-nickname-",
  id: "-id-"
};

function trim(string) {
  return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
