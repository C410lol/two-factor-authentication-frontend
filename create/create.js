const status_box = document.querySelector('#status_box')
const name_input = document.querySelector('#name_input')
const email_input = document.querySelector('#email_input')
const phone_input = document.querySelector('#phone_input')
const password_input = document.querySelector('#password_input')
const confirm_password_input = document.querySelector('#confirm_password_input')
const create_button = document.querySelector('#create_button')

create_button.addEventListener('click', event => {
    event.preventDefault()
    const name = name_input.value.trim()
    const email = email_input.value.trim().replace(/\s/g, '')
    const phone = phone_input.value.trim().replace(/\s/g, '')
    const password = password_input.value.trim().replace(/\s/g, '')
    const confirm_password = confirm_password_input.value.trim().replace(/\s/g, '')
    if(verifyName(name) && 
    verifyEmail(email) && 
    verifyPhone(phone) && 
    verifyPassword(password) && 
    confirmPassword(password, confirm_password)) {
        setSuccessfullStatus('Account successfully created! Redirecting...')
        setTimeout(function() { 
            window.location.replace('file:///C:/Users/caiog/VisualCodeProjects/login-page/login.html')
        }, 2000)
    }
})

function setErrorStatus(message) {
    status_box.style.backgroundColor = '#8B0000'
    status_box.style.width = '350px'
    status_box.style.height = '50px'
    status_box.innerHTML = '<p id="status_text">' + message + '</p>'
}

function setSuccessfullStatus(message) {
    status_box.style.backgroundColor = '#008000'
    status_box.style.width = '350px'
    status_box.style.height = '50px'
    status_box.innerHTML = '<p id="status_text">' + message + '</p>'
}

function verifyName(name) {
    if(name.length >= 3 && name.length <= 50) {
        return true
    }
    console.log('HEY')
    setErrorStatus('Something gone wrong, NAME is invalid!')
    return false
}

function verifyEmail(email) {
    if(email.length >= 5 && email.includes('@') && email.includes('.')) {
        const indexAt = email.indexOf('@')
        const indexPeriod = email.indexOf('.')
        const lengthBetweenAtAndPeriod = email.substring(indexAt + 1, indexPeriod).length
        if(indexAt > 0 && indexPeriod + 1 < email.length && lengthBetweenAtAndPeriod > 0) {
            return true
        }
    }
    setErrorStatus('Something gone wrong, EMAIL is invalid!')
    return false
}

function verifyPhone(phone) {
    if(phone.length >= 11 && !isNaN(parseFloat(phone)) && isFinite(phone)) {
        return true
    }
    setErrorStatus('Something gone wrong, PHONE is invalid!')
    return false
}

function verifyPassword(password) {
    if(password.length >= 6) {
        return true
    }
    setErrorStatus('Something gone wrong, PASSWORD has to be longer!')
    return false
}

function confirmPassword(password, confirm_password) {
    if(password === confirm_password) {
        return true
    }
    setErrorStatus('Something gone wrong, PASSWORD must be the same!')
    return false
}
