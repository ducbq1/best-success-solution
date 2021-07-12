
// var button = document.querySelector("#button");
// var username = document.querySelector('input[name="username"]'); // test selector
// var password = document.querySelector('#password');
// button.addEventListener("click", (event) => {
//     console.log("Hello");
//     console.log(username);
//     console.log(password.value);
//     if (username.value === "john" && password.value === "1234") {
//         window.location.href = "./dashboard.html";
//     }
//     event.preventDefault();
// })

var create = document.querySelector("#create");
var button = document.querySelector("#button");
var username = document.querySelector("#username");
var password = document.querySelector("#password");
var form = document.querySelector("#form");

window.addEventListener("DOMContentLoaded", () => {
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if (!setupTime) {
        localStorage.setItem('setupTime', now);
    } else {
        if (now - setupTime > 24 * 60 * 60 * 1000) {
            localStorage.clear();
            localStorage.setItem('setupTime', now);
            alert("All info is cleared!");
        }
    }
})

form.addEventListener("submit", (event) => {
    console.log("Hello")
    let name = localStorage.getItem("name");
    let passwd = localStorage.getItem("passwd");
    if (username.value == name && password.value == passwd) {
        sessionStorage.setItem('account', username.value);
        return true;
    } else {
        alert("Wrong!");
        event.preventDefault();
    }
})
create.addEventListener("click", (event) => {
    if (username.value == '' || password.value == '') {
        alert("Lack of info!");
    } else {
        localStorage.setItem("name", username.value);
        localStorage.setItem("passwd", password.value);
        alert("Register Successful!")
    }
})
