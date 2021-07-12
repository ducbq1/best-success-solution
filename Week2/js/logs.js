
var tableData = JSON.parse(sessionStorage.getItem('tableData'));
window.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM IN");
    console.log(tableData);
    if (tableData) {
        tableData.forEach(item => {
            let dataRow = document.createElement("tr");
            console.log(item)
            dataRow.innerHTML = item;
            pageRecord.appendChild(dataRow);
        })
    }
    if (sessionStorage.getItem("value")) {
        dataTotal.textContent = sessionStorage.getItem("value");
    }
    changePage(1);

})

const one = document.querySelector("#one");
const two = document.querySelector("#two");
const three = document.querySelector("#three");
const all = document.querySelector("#all");
const btnNext = document.querySelector("#btnNext");
const btnPrev = document.querySelector("#btnPrev");
const pageRecord = document.querySelector("#dataBody");
const dataTotal = document.querySelector("#dataTotal");

if (tableData) {
    var tableRow = tableData.map(item => {
        let dataRow = document.createElement("tr");
        dataRow.innerHTML = item;
        console.log(dataRow)
        return dataRow;
    })
} else {
    var tableRow = [];
}



const pageArray = Array.from(pageRecord.querySelectorAll("tr")).concat(tableRow);

document.querySelector("#search").addEventListener("keyup", (event) => {
    console.log(event);
    const search = document.querySelector("#search");
    let input = search.value.toUpperCase();
    let tr = pageRecord.querySelectorAll("tr");
    console.log(tr);
    tr.forEach(item => {
        let name = item.querySelectorAll("td")[1];
        if (name) {
            let nameValue = name.textContent || name.innerText;
            if (nameValue.toUpperCase().indexOf(input) > -1) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        }
    })

})

const numRecords = () => {
    return pageArray.length;
}

console.log(pageArray)

let current = 1;
const records_per_page = Math.ceil(numRecords() / 3);

const prevPage = () => {
    if (current > 1) {
        current--;
        changePage(current);
    } else {
        current = 3;
        changePage(3);
    }
}

const nextPage = () => {
    if (current < 3) {
        current++;
        changePage(current);
    } else {
        current = 1;
        changePage(1);
    }
}

// const myMap = {
//     1: 'one',
//     2: 'two',
//     3: 'three'
// }


one.addEventListener("click", () => {
    current = 1;
    one.classList.add("doactive");
    two.classList.remove("doactive");
    three.classList.remove("doactive");
    all.classList.remove("doactive");
    changePage(1);
})

two.addEventListener("click", () => {
    current = 2;
    two.classList.add("doactive");
    one.classList.remove("doactive");
    three.classList.remove("doactive");
    all.classList.remove("doactive");
    changePage(2);
})

three.addEventListener("click", () => {
    current = 3;
    three.classList.add("doactive");
    one.classList.remove("doactive");
    two.classList.remove("doactive");
    all.classList.remove("doactive");
    changePage(3);
})

all.addEventListener("click", () => {
    three.classList.remove("doactive");
    one.classList.remove("doactive");
    two.classList.remove("doactive");
    all.classList.add("doactive");
    pageRecord.innerHTML = '';
    pageArray.forEach(item => {
        pageRecord.appendChild(item);
    })
})

btnPrev.addEventListener("click", () => {
    prevPage();
})

btnNext.addEventListener("click", () => {
    nextPage();
})




const changePage = (page) => {
    // const pagination = document.querySelector(".pagination");

    if (page < 1) page = 1;
    if (page > 3) page = 3;

    // console.log(myMap[page])
    // console.log(pageRecord.querySelectorAll("tr"))
    const array_per_page = pageArray.slice(records_per_page * (page - 1), records_per_page * page);
    console.log(pageArray.slice(records_per_page * (page - 1), records_per_page * page));
    console.log(array_per_page)
    // pageRecord.innerHTML = array_per_page[0];
    pageRecord.innerHTML = '';
    array_per_page.forEach(item => {
        pageRecord.appendChild(item);
    })
    console.log("TEST")
    console.log(records_per_page);

}



