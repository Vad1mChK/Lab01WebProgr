function submitData() {
    const x = $('select[name="x"]').val()
    const y = $('input[name="y"]').val()
    const rValues = valuesOfR()

    rValues.forEach((r) => {
        submitShot(x, y, r)
    })
}

function submitShot(x, y, r) {
    if (validate(x, y, r)) {
        return
    }

    $.ajax({
        url: 'adder.php',
        method: 'GET',
        data: {x: x, y: y, r: r, zone: getZoneOffsetMinutes()},
        dataType: 'json',
        success: function (data) {
            addRowToTable(getTable(), data.newShot)
        },
        error: function (jqXHR, exception) {
            
        }
    })
}

function cleanData() {
    $.ajax({
        url: 'cleaner.php',
        method: 'DELETE',
        dataType: 'json',
        success: function () {
            cleanTable(getTable())
        },
        error: function (jqXHR, exception) {

        }
    })
}

function fetchData() {
    $.ajax({
        url: 'fetcher.php',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            updateTable(getTable(), data.shots)
        },
        error: function (jqXHR, exception) {

        }
    })
}

// Function to handle adding the placeholder
function addPlaceholderRow(table) {
    const row = $('<tr>').appendTo(table)
    const cell = $('<td>').attr('id', 'placeholder-row').text('Не сделано ни одного выстрела.').appendTo(row)
    cell.attr('colspan', 6)
}

function addRowToTable(table, shot) {
    const row = $('<tr>').appendTo(table);
    if(shot) {
        table.find("#placeholder-row").remove();
        ['x', 'y', 'r', 'hit', 'datetime', 'timeElapsed'].forEach(key => {
            if (key == 'hit') {
                $('<td>').text(shot[key] ? "попал" : "мимо").appendTo(row)
            } else {
                $('<td>').text(shot[key]).appendTo(row)
            }
        })
    }
}

function cleanTable(table) {
    table.find('tr:not(:first)').remove()
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
    return $('#previous-shots-table')
}

// Trigger the function once the page is fully loaded
$(document).ready(fetchData)