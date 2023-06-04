//Inputs
const imgInput = document.querySelector("#img_input");
const usernameInput = document.querySelector('#username_input');
const emailInput = document.querySelector('#email_input');
const passwordInput = document.querySelector('#password_input');
const confPasswordInput = document.querySelector('#conf_password_input');

//Buttons
const createBtn = document.querySelector('#create_btn');

//Others
const statusBox = document.querySelector('#status_box');
const imgLabel = document.querySelector("#img_label");
let imgFormData = null;

//ImageInput Event
imgInput.addEventListener("change", async function() {
    const file = imgInput.files[0];
    if(file != null) {
        const formData = new FormData();
        formData.append("image", file);
        imgFormData = formData;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", function() {
            const image = document.createElement("img");
            image.src = reader.result;
            image.width = 200;
            image.height = 200;
            imgLabel.innerHTML = ""
            imgLabel.appendChild(image);
        });
    }
});

//CreateButton Event
createBtn.addEventListener('click', async function(event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim().replace(/\s/g, '');
    const password = passwordInput.value.trim().replace(/\s/g, '');
    const confPassword = confPasswordInput.value.trim().replace(/\s/g, '');
    if(verifyUserame(username) && 
    verifyEmail(email) && 
    verifyPassword(password) && 
    confirmPassword(password, confPassword)) {
        setWarningStatus("Trying to create...");
        let urlImage = null;
        if(imgFormData != null) {
            const imgurApiResponse = await callImgurApi(imgFormData);
            if(imgurApiResponse != false) {
                urlImage = imgurApiResponse;
            } else {
                setErrorStatus("Something gone wrong, error at saving image.");
                return;
            }
        }
        createUser(email, urlImage, password, username);
    }
});

//Calling Imgur Api
async function callImgurApi(imageFormData) {
    const options = {
        method: "POST", 
        headers: {
            "Authorization": "Client-ID 4bf719aed1f7fbb"
        }, 
        body: imageFormData
    };
    try {
        const response = await fetch("https://api.imgur.com/3/image", options);
        if(response.ok) {
            const data = await response.json();
            const imageURL = data.data.link;
            return imageURL;
        }
        return false;
    } catch(e) {
        console.error(e);
        return false;
    }
}

//Calling Two-Factor-Authentication Api
async function createUser(email, urlImage, password, username) {
    const user = {
        email: email, 
        urlImage: urlImage,
        password: password, 
        username: username
    };
    const options = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify(user)
    };
    try {
        const response = await fetch("http://localhost:8080/users/create", options);
        if(response.ok) {
            setSuccessfullStatus("User successfully created! Redirecting...");
            setTimeout(function() {
                window.location.replace('file:///C:/Users/caiog/VisualCodeProjects/login-page/login/login.html');
            }, 1000);
        } else {  
            const data = await response.json();
            setErrorStatus(data.message);
        }
    } catch(e) {
        console.error(e);
        setErrorStatus("Something gone wrong, try again later.");
    }
}

//Verifying Fields
function verifyUserame(username) {
    if(username.length >= 3 && username.length <= 50) {
        return true;
    }
    setErrorStatus('Something gone wrong, NAME is invalid!');
    return false;
}

function verifyEmail(email) {
    if(email.length >= 5 && email.includes('@') && email.includes('.')) {
        const indexAt = email.indexOf('@');
        const indexPeriod = email.indexOf('.');
        const lengthBetweenAtAndPeriod = email.substring(indexAt + 1, indexPeriod).length;
        if(indexAt > 0 && indexPeriod + 1 < email.length && lengthBetweenAtAndPeriod > 0) {
            return true;
        }
    }
    setErrorStatus('Something gone wrong, EMAIL is invalid!');
    return false;
}

function verifyPassword(password) {
    if(password.length >= 6) {
        return true;
    }
    setErrorStatus('Something gone wrong, PASSWORD has to be longer!');
    return false;
}

function confirmPassword(password, confPassword) {
    if(password === confPassword) {
        return true;
    }
    setErrorStatus('Something gone wrong, PASSWORD must be the same!');
    return false;
}

//Setting StatusBox
function setErrorStatus(message) {
    statusBox.style.backgroundColor = '#8B0000';
    statusBox.style.width = '350px';
    statusBox.style.height = '50px';
    statusBox.innerHTML = '<p id="status_text">' + message + '</p>';
}

function setWarningStatus(message) {
    status_box.style.backgroundColor = "#FFAA33";
    status_box.style.width = "350px";
    status_box.style.height = '65px';
    status_box.innerHTML = '<p id="status_text">' + message + '</p>';
}

function setSuccessfullStatus(message) {
    statusBox.style.backgroundColor = '#008000';
    statusBox.style.width = '350px';
    statusBox.style.height = '50px';
    statusBox.innerHTML = '<p id="status_text">' + message + '</p>';
}
