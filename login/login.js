const status_box = document.querySelector('#status_box')
const email_input = document.querySelector("#email_input")
const password_input = document.querySelector('#password_input')
const login_button = document.querySelector('#login_button')

login_button.addEventListener('click', event => {
    event.preventDefault()
    const email = email_input.value.trim().replace(/\s/g, '')
    const password = password_input.value.trim().replace(/\s/g, '')
    if(verifyEmail(email) && verifyPassword(password)) {
        setSuccessfullStatus('Ok! Redirecting...')
        return
    }
    setErrorStatus('Something gone wrong, verify the credentials or try again later.')
})

function setErrorStatus(message) {
    status_box.style.backgroundColor = '#8B0000'
    status_box.style.width = '350px'
    status_box.style.height = '65px'
    status_box.innerHTML = '<p id="status_text">' + message + '</p>'
}

function setSuccessfullStatus(message) {
    status_box.style.backgroundColor = '#008000'
    status_box.style.width = '350px'
    status_box.style.height = '50px'
    status_box.innerHTML = '<p id="status_text">' + message + '</p>'
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
    return false
}

function verifyPassword(password) {
    if(password.length >= 6) {
        return true
    }
    return false
}
