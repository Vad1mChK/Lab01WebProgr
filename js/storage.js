document.addEventListener('DOMContentLoaded', function () {
    // On page load, populate form with data from local storage (if exists)
    const storedX = localStorage.getItem('x') ?? -4
    const storedY = localStorage.getItem('y')
    const storedRValues = localStorage.getItem('r') ? JSON.parse(localStorage.getItem('r')) : []

    if (storedX) {
        document.getElementById('x').value = storedX
    }

    if (storedY) {
        document.getElementById('y').value = storedY
    }

    document.getElementsByName('r').forEach((elem) => {
        if (storedRValues.includes(elem.value)) {
            elem.checked = true
        }
    })

    const rValues = [...storedRValues]

    // Listen for input events to store data
    document.getElementById('x').addEventListener('input', function () {
        localStorage.setItem('x', this.value)
    })

    document.getElementById('y').addEventListener('input', function () {
        localStorage.setItem('y', this.value)
    })

    document.getElementsByName('r').forEach((box) => {
        box.addEventListener('change', function () {
            console.warn('Changed element: ' + box.value)
            const value = this.value
            if (box.checked) {
                addElementIfNotPresent(rValues, value)
            } else {
                removeElement(rValues, value)
            }
            localStorage.setItem('r', JSON.stringify(rValues))
        })
    })
})

function removeElement(arr, elem) {
    const index = arr.indexOf(elem)
    if (index !== -1) {
        arr.splice(index, 1)
    }
}

function addElementIfNotPresent(arr, elem) {
    if (!arr.includes(elem)) {
        arr.push(elem)
    }
}