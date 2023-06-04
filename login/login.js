//Inputs
const usernameInput = document.querySelector("#username_input");
const passwordInput = document.querySelector('#password_input');

//Others
const statusBox = document.querySelector('#status_box');
const loginBtn = document.querySelector('#login_btn');

//Adding avent listener to login button
loginBtn.addEventListener('click', event => {
    event.preventDefault();
    const username = usernameInput.value.trim().replace(/\s/g, '');
    const password = passwordInput.value.trim().replace(/\s/g, '');
    if(verifyUsername(username) && verifyPassword(password)) {
        loginUser(username, password);
    }
})

//Call API to login user
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
    try {
        setWarningStatus("Trying to login...");
        const response = await fetch("http://localhost:8080/users/login", options);
        const data = await response.json();
        if(response.ok) {
            localStorage.setItem("token", data.token);
            setSuccessfullStatus("Ok! Redirecting...");
            setTimeout(function() {
                window.location.replace("file:///C:/Users/caiog/VisualCodeProjects/login-page/home/home.html");
            }, 1000);
            return;
        } else {
            setErrorStatus(data.message);
        }
    } catch(e) {
        setErrorStatus('Something gone wrong, try again later.')
        console.error(e);
    }
}

//Verifying fields
function verifyUsername(username) {
    if(username.length >= 3 && username.length <= 50) {
        return true;
    }
    setErrorStatus('Something gone wrong, NAME is invalid!');
    return false;
}

function verifyPassword(password) {
    if(password.length >= 6) {
        return true;
    }
    setErrorStatus('Something gone wrong, PASSWORD has to be longer!');
    return false;
}

//Setting status box
function setErrorStatus(message) {
    statusBox.style.backgroundColor = '#8B0000';
    statusBox.style.width = '350px';
    statusBox.style.height = '65px';
    statusBox.innerHTML = '<p id="status_text">' + message + '</p>';
}

function setWarningStatus(message) {
    statusBox.style.backgroundColor = "#FFAA33";
    statusBox.style.width = "350px";
    statusBox.style.height = '65px';
    statusBox.innerHTML = '<p id="status_text">' + message + '</p>';
}

function setSuccessfullStatus(message) {
    statusBox.style.backgroundColor = '#008000';
    statusBox.style.width = '350px';
    statusBox.style.height = '50px';
    statusBox.innerHTML = '<p id="status_text">' + message + '</p>';
}
