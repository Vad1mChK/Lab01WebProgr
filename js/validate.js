function countSelectedR() {
    const rBoxes = document.getElementsByName('r')
    let c = 0
    rBoxes.forEach((element) => {
        if (element.checked) c++
    })
    return c
}

function valuesOfR() {
    const rValues = []
    const rBoxes = document.getElementsByName('r')
    rBoxes.forEach((element) => {
        if (element.checked) {
            rValues.push(element.value)
        }
    })
    return rValues
}

const MIN_Y = -5
const MAX_Y = 3

function validate(x, y, r) {
    let error_msg = ""
    if (!['-4', '-3', '-2', '-1', '0', '1', '2', '3', '4'].includes(x)) {
        console.error(x)
        error_msg = "Значение координаты X должно быть одним из целых чисел в диапазоне [-4..4]. Повторите попытку."
    } else if (isBlank(y)) {
        error_msg = "Значение Y пустое (должно входить в диапазон (" + MIN_Y + ".." + MAX_Y + "), не включая " +
            "граничные значения). Повторите попытку."
    } else if (!y.match(/^(-[0-4]|\+?[0-2])(\.\d+)?$/g)) {
        error_msg = "Значение координаты Y должно быть числом в диапазоне. (" + MIN_Y + ".." + MAX_Y + "), не включая " +
        "граничные значения). Повторите попытку."
    } else if (y.length > 15) {
        error_msg = "Значение координаты Y не должно занимать больше 15 символов. Повторите попытку."
    } else if (!['1', '2', '3', '4', '5'].includes(r)) {
        error_msg = "Значение координаты R должно быть одним из целых чисел в диапазоне [1..5]. Повторите попытку."
    } else if (+y <= MIN_Y || +y >= MAX_Y || y.startsWith(MIN_Y) || y.startsWith(MAX_Y)) {
        error_msg = "Значение координаты Y должно входить в диапазон (" + MIN_Y + ".." + MAX_Y + ") (не включая " +
            "граничные значения). Повторите попытку."
    } else if (!countSelectedR()) {
        error_msg = "Не выбрано ни одного значения R. Пожалуйста, выберите хотя бы одно одно и повторите попытку."
    }

    const msgElement = document.getElementById("error-msg")

    msgElement.innerHTML = error_msg ? error_msg : "_"
    msgElement.style.opacity = error_msg ? 1 : 0
    if (error_msg) {
        console.error(error_msg)
    }

    return error_msg
}


function isBlank(str) {
    return str.replace(/\s/g, '') === ''
}