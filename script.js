const balanceElement = document.getElementById('overall-balance')
const form = document.forms.balance;
const createInput = form.createBalance;
const updateInput = form.updateBalance;
const deleteButton = form.deleteBalance;
const randomPhoto = Math.floor(Math.random() * 4001);


const URL_API = "https://jsonplaceholder.typicode.com/photos/" + randomPhoto
let balance = 0;


function convertBalance (num) {
    const regExp = /[^0-9]\./g;
    return Number(num.replace(regExp,"")).toFixed(2)
}

document.addEventListener("DOMContentLoaded", () => {
    fetch(URL_API).then(res => {
        return res.json()
    }).then(data => {
        data = {
            id: "125432.43532"
        }
        let isNumber = !isNaN(Number(data.id));
        if (!isNumber) {
            showBalance(data.id)
            return;
        }



        balance = convertBalance(data.id)
        console.log(balance)
        showBalance(balance)
    });
});

function showBalance(num) {
    const humanBalance =  new Intl.NumberFormat('ru-RU').format(num)
    console.log(humanBalance)
    balanceElement.textContent = humanBalance;
    updateInput.placeholder = "Редактирование баланса " + humanBalance
}

function handleFormSubmit(event) {
    event.preventDefault()

    event.target.reset()
}

function handleFocusUpdateInput(event) {
    updateInput.value = balance;
}

function handleBlurUpdateInput(event) {
    let number = event.target.value;
    if (number === balance) {
        event.target.value = ''
    } else {
        event.target.value = convertBalance(number);
    }
}

form.addEventListener('submit', handleFormSubmit)
updateInput.addEventListener('focus', handleFocusUpdateInput)
updateInput.addEventListener('blur', handleBlurUpdateInput)