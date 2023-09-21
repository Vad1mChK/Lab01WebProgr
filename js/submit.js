function submitData() {
    const x = document.querySelector('select[name="x"]').value
    const y = document.querySelector('input[name="y"]').value
    const rValues = valuesOfR()

    rValues.forEach((r) => {
        submitShot(x, y, r)
    })
}

function submitShot(x, y, r) {
    if (validate(x, y, r)) {
        return
    }

    const xhr = new XMLHttpRequest()
    xhr.open("GET", `adder.php?x=${x}&y=${y}&r=${r}&zone=${getZoneOffsetMinutes()}`, true)
    xhr.responseType = 'json'
    xhr.onload = function () {
        if (xhr.status === 201) {
            addRowToTable(getTable(), xhr.response.newShot)
        }
    }
    xhr.send()
}

function cleanData() {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", 'cleaner.php', true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'json'
    xhr.onload = function () {
        if (xhr.status === 200) {
            cleanTable(getTable())
        }
    }
    xhr.send('action=delete')
}

function fetchData() {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", 'fetcher.php', true)
    xhr.responseType = 'json'
    xhr.onload = function () {
        if (xhr.status === 200) {
            updateTable(getTable(), xhr.response.shots)
        }
    }
    xhr.send()
}

// Function to handle adding the placeholder
function addPlaceholderRow(table) {
    const row = table.insertRow()
    const cell = row.insertCell(0)
    cell.setAttribute('id', 'placeholder-row')
    cell.setAttribute('colspan', '6')
    cell.textContent = 'Не сделано ни одного выстрела.'
}

function addRowToTable(table, shot) {
    const row = table.insertRow()
    if (shot) {
        table.querySelector("#placeholder-row")?.remove();
        ['x', 'y', 'r', 'hit', 'datetime', 'timeElapsed'].forEach(key => {
            const cell = row.insertCell()
            cell.textContent = key === 'hit' ? (shot[key] ? "попал" : "мимо") : shot[key]
        });
    }
}

function cleanTable(table) {
    while (table.rows.length > 1) {
        table.deleteRow(1)
    }
    addPlaceholderRow(table)
}

function updateTable(table, shots) {
    cleanTable(table)

    shots.forEach(shot => {
        addRowToTable(table, shot)
    })
}

function getZoneOffsetMinutes() {
    return -(new Date().getTimezoneOffset())
}

function getTable() {
    return document.getElementById('previous-shots-table')
}

// Trigger the function once the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});