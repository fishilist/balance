const URL_API = "https://jsonplaceholder.typicode.com/photos/";
let randomPhoto = 1;
let balance = 0;

const deleteBalance = "deleteBalance";
const createBalance = "createBalance";
const updateBalance = "updateBalance";
const submitFormName = "submitForm"
const formName = "balance";

const balanceElement = document.getElementById('overall-balance')
const noteElement = document.querySelector('.note_title')
const form = document.forms[formName];
const createInput = form[createBalance];
const updateInput = form[updateBalance];
const deleteButton = form[deleteBalance];

// Convert string or number in human balance with 2 digit after dot
function convertBalance(num) {
    if (typeof num === 'number') return num.toFixed(2);

    const regExp = /[^0-9]\./g;
    return Number(num.replace(regExp, "")).toFixed(2)
}

// Set balance and show placeholder about it in the input
function showBalance(num) {
    const humanBalance = new Intl.NumberFormat('ru-RU').format(num)
    balanceElement.textContent = humanBalance;
    updateInput.placeholder = "Редактирование баланса " + humanBalance
}

// Collect one value from the form
function collectValue() {
    let value;

    const inputsElem = form.querySelectorAll('input');
    const inputs = Array.from(inputsElem)

    for (const input of inputs) {
        if (input.classList.contains('disabled')) continue;

        value = input.value;
        break;
    }

    return value
}

// Define method from the form
function defineMethod(event) {
    const methodFormName = event.submitter.name
    switch (methodFormName) {
        case deleteBalance:
            return 'DELETE';
        case submitFormName:
            if (!createInput.classList.contains('disabled')) {
                return "POST"
            }
            if (!updateInput.classList.contains('disabled')) {
                return "PUT"
            }
        default:
            return 'GET'
    }
}

// Main function by handle submit the form
function handleFormSubmit(event) {
    event.preventDefault();

    const method = defineMethod(event)
    const value = collectValue();

    if (method === "DELETE") {
        fetchBalance(method, balance)
        return;
    }

    if (method === 'GET' || value === '') {
        fetchBalance("GET")
        return;
    }

    fetchBalance(method, value)
    event.target.reset()
}

// Handler update input
function handleFocusUpdateInput(event) {
    disableOtherInput(event)
    if (event.target.value === '') {
        updateInput.value = balance;
    }
}

// Handler blur input
function handleBlurUpdateInput(event) {
    let number = event.target.value;
    if (number === balance || number === '') {
        event.target.value = ''
    } else {
        event.target.value = convertBalance(number);
    }
}

// Disabling all inputs except the current one
function disableOtherInput(event) {
    noteElement.textContent = ''
    if (event.target === updateInput) {
        updateInput.classList.remove('disabled')
        createInput.classList.add('disabled')
    } else {
        createInput.classList.remove('disabled')
        updateInput.classList.add('disabled')
    }
}

// Function to get current balance from the server by URL_API
const fetchBalance = (method = "GET", value = '') => {
    randomPhoto = Math.floor(Math.random() * 4001);

    let params = {
        method: "GET"
    }
    if (method !== "GET") {
        params = {
            method: method,
            body: value
        }
    }

    fetch(URL_API + randomPhoto, params).then(res => {
        return res.json()
    }).then(data => {
        let isNumber = !isNaN(Number(data.id));
        if (!isNumber) {
            showBalance(data.id)
            return;
        }

        balance = convertBalance(data.id)
        showBalance(balance)
    }).catch(ex => {
        noteElement.textContent = String(ex);
        console.log(ex)
    });
}

// Listeners
document.addEventListener("DOMContentLoaded", () => fetchBalance());
form.addEventListener('submit', handleFormSubmit)
updateInput.addEventListener('focus', handleFocusUpdateInput)
updateInput.addEventListener('blur', handleBlurUpdateInput)
createInput.addEventListener('focus', disableOtherInput)