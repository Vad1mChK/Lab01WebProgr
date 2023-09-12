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
        url: 'handler.php',
        method: 'GET',
        data: {x: x, y: y, r: r, zone: getZoneOffsetMinutes()},
        dataType: 'json',
        success: function (data) {
            updateTable(data)
        },
        error: function () {
            alert("При обработке запроса на сервере произошла ошибка.")
        }
    })
}

function cleanData() {
    $.ajax({
        url: 'cleaner.php',
        method: 'HEAD',
        dataType: 'json',
        success: function () {
            const table = $('#previous-shots-table')

            // Clear previous rows to replace with updated data.
            // Assuming the table has a header, so we don't remove the first row.
            table.find('tr:not(:first)').remove()
            addPlaceholderRow(table)
        },
        error: function () {
            alert("При обработке запроса на сервере произошла ошибка.")
        }
    })
}

function fetchData() {
    $.ajax({
        url: 'fetcher.php',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            updateTable(data)
        },
        error: function () {
            alert("При обработке запроса на сервере произошла ошибка.")
        }
    })
}

// Function to handle adding the placeholder
function addPlaceholderRow(table) {
    const row = $('<tr>').appendTo(table)
    const cell = $('<td>').attr('id', 'placeholder-row').text('Не сделано ни одного выстрела.').appendTo(row)
    cell.attr('colspan', 6)
}

function updateTable(data) {
    const table = $('#previous-shots-table')

    // Clear previous rows to replace with updated data.
    // Assuming the table has a header, so we don't remove the first row.
    table.find('tr:not(:first)').remove()

    // If there are no shots, insert the placeholder row.
    if (data.shots.length === 0) {
        addPlaceholderRow(table)
        return
    }

    // Append all shots to the table
    data.shots.forEach(shot => {
        const row = $('<tr>').appendTo(table);
        ['x', 'y', 'r', 'hit', 'datetime', 'timeElapsed'].forEach(key => {
            if (key == 'hit') {
                $('<td>').text(shot[key] ? "попал" : "мимо").appendTo(row)
            } else {
                $('<td>').text(shot[key]).appendTo(row)
            }
        })
    })
}

function getZoneOffsetMinutes() {
    return -(new Date().getTimezoneOffset())
}

// Trigger the function once the page is fully loaded
$(document).ready(fetchData)