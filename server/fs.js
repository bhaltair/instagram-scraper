"use strict";
const fs = require("fs");
const path = require("path");
const jsonData = require("./id.json");
const { addCookies } = require("./utils/index");

console.log(addCookies);

// let student = {
//   name: "Mike",
//   age: 23,
//   gender: "Male",
//   department: "English",
//   car: "Honda",
// };

// let data = JSON.stringify(student, null, 2);

// const filePath = path.join(__dirname, "../data", "student-3.json");

// fs.writeFile(filePath, data, (err) => {
//   if (err) throw err;
//   console.log("Data written to file");
// });

// console.log("This is after the write call");
