const status_box = document.querySelector('#status_box')
const username_input = document.querySelector("#username_input")
const password_input = document.querySelector('#password_input')
const login_button = document.querySelector('#login_button')

login_button.addEventListener('click', event => {
    event.preventDefault()
    const username = username_input.value.trim().replace(/\s/g, '')
    const password = password_input.value.trim().replace(/\s/g, '')
    if(verifyUsername(username) && verifyPassword(password)) {
        loginUser(username, password)
    }
})

async function loginUser(username, password) {
    const auth = {
        username: username, 
        password: password
    };
    const options = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify(auth)
    };
    const response = await fetch("http://localhost:8080/users/login", options);
    const data = await response.json();
    if(response.ok) {
        console.log(data.token);
        setSuccessfullStatus("Ok! Redirecting...")
        return
    } else {
        setErrorStatus(data.message)
    }
}

function verifyUsername(username) {
    if(username.length >= 3 && username.length <= 50) {
        return true
    }
    setErrorStatus('Something gone wrong, NAME is invalid!')
    return false
}

function verifyPassword(password) {
    if(password.length >= 6) {
        return true
    }
    return false
}

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
