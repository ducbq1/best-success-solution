

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

document.querySelector("#exit").addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.clear();
    window.location.href = "./index.html";
})
document.addEventListener("DOMContentLoaded", () => {
    let account = document.querySelector("#account");
    console.log(account.textContent);
    let nameAccount = sessionStorage.getItem('account') || "guest";
    nameAccount = nameAccount[0].toUpperCase() + nameAccount.slice(1);
    account.textContent = "Welcome " + nameAccount;
    console.log(nameAccount)
})


let data =
    [
        {
            "label": "TV",
            "value": 50,
            "color": "#7d9058"
        },
        {
            "label": "Washer",
            "value": 60,
            "color": "#44b9b0"
        },
        {
            "label": "Refrigerator",
            "value": 80,
            "color": "#7c37c0"
        },
        {
            "label": "Visual Basic",
            "value": 100,
            "color": "#cc9fb1"
        },
        {
            "label": "Scheme",
            "value": 70,
            "color": "#e65414"
        },
        {
            "label": "Rust",
            "value": 40,
            "color": "#8b6834"
        },
        {
            "label": "Selling Fan",
            "value": 30,
            "color": "#248838"
        }
    ]

var pie = new d3pie("pieChart", {
    "header": {
        "title": {
            "text": "Power Consumption",
            "fontSize": 24,
            "font": "open sans"
        },
        "subtitle": {
            "color": "#999999",
            "fontSize": 12,
            "font": "open sans"
        },
        "titleSubtitlePadding": 9
    },
    "footer": {
        "color": "#999999",
        "fontSize": 10,
        "font": "open sans",
        "location": "bottom-left"
    },
    "size": {
        "canvasWidth": 330,
        "pieInnerRadius": "46%",
        "pieOuterRadius": "91%"
    },
    "data": {
        "sortOrder": "value-desc",
        "content": data
    },
    "labels": {
        "outer": {
            "pieDistance": 32
        },
        "inner": {
            "hideWhenLessThanPercentage": 3
        },
        "mainLabel": {
            "fontSize": 11
        },
        "percentage": {
            "color": "#ffffff",
            "decimalPlaces": 0
        },
        "value": {
            "color": "#adadad",
            "fontSize": 11
        },
        "lines": {
            "enabled": true
        },
        "truncation": {
            "enabled": true
        }
    },
    "effects": {
        "pullOutSegmentOnClick": {
            "effect": "linear",
            "speed": 400,
            "size": 8
        }
    },
    "misc": {
        "gradient": {
            "enabled": true,
            "percentage": 100
        }
    }
});





const button = document.querySelector("#button");
const username = document.querySelector("#name");
const ip = document.querySelector("#ip");
const power = document.querySelector("#power");
const dataTest = document.querySelector("#dataTest")
const total = document.querySelector("#dataTotal");
const dataBody = document.querySelector("#dataBody");

let sessionData = [];

button.addEventListener("click", () => {
    if (!username.value || !ip.value || !power.value) {
        alert("Lack of info!");
    } else {
        // const monthNames = ["January", "February", "March", "April", "May", "June",
        //     "July", "August", "September", "October", "November", "December"];
        let tableRow = document.createElement("tr");
        const dateNow = new Date();
        // const month = monthNames[dateNow.getMonth()];
        const month = dateNow.getMonth() + 1;
        const day = dateNow.getDate();
        const year = dateNow.getFullYear();
        // const random = Math.floor(Math.random() * 100) + 10;
        let tableData = `<td>${username.value}</td>
                         <td>00:1B:44:11:3A:B7</td>
                         <td>${ip.value}</td>
                         <td>${day} / ${month} / ${year}</td>
                         <td>${power.value}</td>`
        let sessionFake = `<td>${Math.round(Math.random() * 100)}</td><td>${username.value}</td><td>Selling All</td><td>${Math.round(dateNow.getTime() / 1000000)}</td>`
        sessionData.push(sessionFake);
        sessionStorage.setItem('tableData', JSON.stringify(sessionData));
        console.log(tableData)
        tableRow.innerHTML = tableData;
        dataBody.appendChild(tableRow);
        total.textContent = Number(total.textContent) + Number(power.value);
        sessionStorage.setItem("value", total.textContent);
        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        data.push({
            label: `${username.value}`,
            value: Number(power.value),
            color: randomColor
        });
        console.log(data);
        setTimeout(() => {
            pie.updateProp("data.content", data)
        }, 500)
    }
})

