function countSelectedR() {
    const rBoxes = document.forms[0].elements["r"]
    let c = 0
    rBoxes.forEach((element) => {
        if(element.checked) c++
    })
    console.log("R selected: " + c)
    return c
}

function valueOfR() {
    if (countSelectedR() !== 1) return ""
    const rBoxes = document.forms[0].elements["r"]
    let n = rBoxes.length
    for (let i = 0; i < n; i++) {
        if (rBoxes[i].checked)
            return rBoxes[i].value
    }
}

const MIN_Y = -5
const MAX_Y = 3

function validate(x, y, r) {
    console.log("Валидация x: "+x+" y: "+y+" r: "+r)
    let error_msg = "";

    let yNum = parseFloat(y)
    if (!['-4', '-3', '-2', '-1', '0', '1', '2', '3', '4'].includes(x)) {
        console.error(x)
        error_msg = "Значение координаты X должно быть одним из целых чисел в диапазоне [-4..4]. Повторите попытку."
    } else if (isNaN(yNum) || !isFinite(yNum)) {
        error_msg = "Значение координаты Y должно быть числом. Повторите попытку."
    } else if (!['1', '2', '3', '4', '5'].includes(r)) {
        error_msg = "Значение координаты R должно быть одним из целых чисел в диапазоне [1..5]. Повторите попытку."
    } else if (+y <= MIN_Y || +y >= MAX_Y || y.startsWith(MIN_Y) || y.startsWith(MAX_Y)) {
        error_msg = "Значение координаты Y должно входить в диапазон ("+MIN_Y+".."+MAX_Y+") (не включая " +
            "граничные значения). Повторите попытку."
    } else if(valueOfR() === "") {
        error_msg = "Выбрано 0 или несколько значений R. Пожалуйста, выберите ровно одно и повторите попытку."
    }

    const msgElement = document.getElementById("error-msg")

    msgElement.innerHTML = error_msg ? error_msg : "_"
    msgElement.style.opacity = error_msg ? 1 : 0; 
    if(error_msg) {
        console.error(error_msg)
    }

    return error_msg;
}