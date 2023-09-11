function submitData() {
    const x = $('select[name="x"]').val();
    const y = $('input[name="y"]').val();
    const r = valueOfR();
    
    if (validate(x, y, r)) {
        return;
    }

    $.ajax({
        url: 'handler.php',
        method: 'GET',
        data: { x: x, y: y, r: r },
        dataType: 'json',
        success: function(data) {
            updateTable(data)
        },
        error: function() {
            alert("При обработке запроса на сервере произошла ошибка.");
        }
    });
}

function cleanData() {
    $.ajax({
        url: 'cleaner.php',
        method: 'HEAD',
        dataType: 'json',
        success: function() {
            const table = $('#previous-shots-table');

            // Clear previous rows to replace with updated data.
            // Assuming the table has a header, so we don't remove the first row.
            table.find('tr:not(:first)').remove();
            alert("Данные о выстрелах очищены.");
        },
        error: function() {
            alert("При обработке запроса на сервере произошла ошибка.");
        }
    });
}

// Function to handle adding the placeholder
function addPlaceholderRow(table) {
    const row = $('<tr>').appendTo(table);
    const cell = $('<td>').text('Не сделано ни одного выстрела').appendTo(row);
    cell.attr('colspan', 6);
}

function updateTable(data) {
    // Display errors, if any
    if (data.errors && data.errors.length > 0) {
        alert(data.errors.join("\n"));
        return;
    }

    const table = $('#previous-shots-table');
    $("#previous-shots-box").show();

    // Clear previous rows to replace with updated data.
    // Assuming the table has a header, so we don't remove the first row.
    table.find('tr:not(:first)').remove();

    if (data.errors && data.errors.length > 0) {
        alert(data.errors.join("\n"));
        addPlaceholderRow(table); // Add the placeholder if there are errors.
        return;
    }

    // If there are no shots, insert the placeholder row.
    if (data.shots.length === 0) {
        addPlaceholderRow(table);
        return;
    }

    // Append all shots to the table
    data.shots.forEach(shot => {
        const row = $('<tr>').appendTo(table);
        ['x', 'y', 'r', 'hit', 'datetime', 'timeElapsed'].forEach(key => {
            $('<td>').text(shot[key]).appendTo(row);
        });
    });
}

// Trigger the function once the page is fully loaded
$(document).ready(fetchData);
fetchData();