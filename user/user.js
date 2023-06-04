//UrlParam and Token
const token = localStorage.getItem("token");
const urlSearchParams = new URLSearchParams(window.location.search);
const UUID = urlSearchParams.get("uuid");

//Pop-Out Edit Elements
const pOutEdit = document.querySelector("#p_out_edit");
const pOutUsernameInput = document.querySelector("#p_out_username_input");
const pOutEmailInput = document.querySelector("#p_out_email_input");
const pOutPasswordInput = document.querySelector("#p_out_password_input");
const pOutConfPasswordInput = document.querySelector("#p_out_conf_password_input");
const pOutEditBackBtn = document.querySelector("#p_out_edit_back_btn");
const pOutConfirmBtn = document.querySelector("#p_out_confirm_btn");


//Pop-Out Delete Elements
const pOutDelete = document.querySelector("#p_out_delete");
const pOutDeleteBackBtn = document.querySelector("#p_out_delete_back_btn");
const pOutDeleteBtn = document.querySelector("#p_out_delete_btn");

//Header
const homeTxt = document.querySelector("#home_txt");
const loginCreateOrUsernameTxt = document.querySelector("#username_txt");
const logOutTxt = document.querySelector("#log_out_txt");

//User Fields
const userImg = document.querySelector("#user_img");
const userUUID = document.querySelector("#user_uuid");
const userUsername = document.querySelector("#user_username");
const userEmail = document.querySelector("#user_email");

//Edit and Delete User
const editText = document.querySelector("#edit_txt");
const deleteTxt = document.querySelector("#delete_txt");

//Status Box
const statusBox = document.querySelector("#status_box");

//Setting Header
function setHomeTextButton() {
    homeTxt.addEventListener("click", function() {
        window.location.assign("file:///C:/Users/caiog/VisualCodeProjects/login-page/home/home.html");
    });
}

setHomeTextButton();

function setLoginCreateTextButton() {
    loginCreateOrUsernameTxt.addEventListener("click", function() {
        window.location.replace("file:///C:/Users/caiog/VisualCodeProjects/login-page/login/login.html");
    });
}

function setUsernameTextButton() {
    loginCreateOrUsernameTxt.addEventListener("click", function() {
        window.location.reload();
        window.scrollTo(0, 0);
    });
}

function setLogOutTxt() {
    logOutTxt.addEventListener("click", function() {
        localStorage.removeItem("token");
        setTimeout(function() {
            window.location.replace("file:///C:/Users/caiog/VisualCodeProjects/login-page/login/login.html");
        }, 500);
    });
}

//Call API to ger user informations
async function loadUser() {
    if(UUID != null && token != null) {
        const options = {
            headers: {
                "Authorization": token
            }
        };
        try {
            const response = await fetch("http://localhost:8080/users/" + UUID, options);
            if(response.ok) {
                const data = await response.json();
                const urlImg = data.urlImage;
                const username = data.username;
                const email = data.email;
                setUUID(UUID);
                setUsername(username);
                setEmail(email);
                setUrlImage(urlImg);
                loginCreateOrUsernameTxt.innerText = "Hello " + username + "!";
                setUsernameTextButton();
                setLogOutTxt();
                setEditTextButton(UUID, token, urlImg, username, email);
                setDeleteTextButton(UUID, token);
                return;
            }
        } catch(e) {
            console.error(e);
        }
    }
    setLoginCreateTextButton();
}

loadUser();

//Setting edit and delete texts
function setEditTextButton(uuid, token, urlImg, username, email) {
    editText.addEventListener("click", function(e) {
        e.preventDefault();
        pOutEdit.showModal();
        setPOutFields(username, email);
        pOutEditBackBtn.addEventListener("click", function() {
            pOutEdit.close();
        });
        pOutConfirmBtn.addEventListener("click", function(e) {
            e.preventDefault();
            verifyPOutFields(uuid, token, urlImg);
        });
    });
}

function setDeleteTextButton(uuid, token) {
    deleteTxt.addEventListener("click", function(e) {
        e.preventDefault();
        pOutDelete.showModal();
        pOutDeleteBackBtn.addEventListener("click", function() {
            pOutDelete.close();
        });
        pOutDeleteBtn.addEventListener("click", function(e) {
            e.preventDefault();
            deleteUser(uuid, token);
        });
    });
}

//Call API to edit and delete user
async function editUser(uuid, token, urlImage, username, email, password) {
    const userDto = {
        urlImage: urlImage,
        username: username,
        email: email, 
        password: password
    }
    const options = {
        method: "PUT", 
        headers: {
            "Content-Type": "application/json", 
            "Authorization": token
        },
        body: JSON.stringify(userDto)
    }
    try {
        setWarningStatus("Editing user...");
        const response = await fetch("http://localhost:8080/users/edit/" + uuid, options);
        if(response.ok) {
            setSuccessfullStatus("User successfully edited! Redirecting...");
            localStorage.removeItem("token");
            setTimeout(function() {
                window.location.replace("file:///C:/Users/caiog/VisualCodeProjects/login-page/login/login.html");
            }, 1000);
            return;
        }
        setErrorStatus("Couldn't edit user, try again later.");
    } catch(e) {
        console.error(e);
        setErrorStatus("Couldn't edit user, try again later.");
    }
}

async function deleteUser(uuid, token) {
    const options = {
        method: "DELETE", 
        headers: {
            "Authorization": token
        }
    };
    try {
        setWarningStatus("Deleting user...");
        const response = await fetch("http://localhost:8080/users/delete/" + uuid, options);
        if(response.ok) {
            setSuccessfullStatus("User successfully deleted! Redirecting...");
            localStorage.removeItem("token");
            setTimeout(function() {
                window.location.replace("file:///C:/Users/caiog/VisualCodeProjects/login-page/home/home.html");
            }, 1000);
            return;
        }
        setErrorStatus("Couldn't delete user, try again later.");
    } catch(e) {
        console.error(e);
        setErrorStatus("Couldn't delete user, try again later.");
    }
}

//Setting user informations
function setUrlImage(urlImage) {
    if(urlImage != null) {
        userImg.src = urlImage;
    }
}

function setUUID(uuid) {
    userUUID.innerText = uuid;
}

function setUsername(username) {
    userUsername.innerText = username;
}

function setEmail(email) {
    userEmail.innerText = email;
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

function confirmPassword(password, confirm_password) {
    if(password === confirm_password) {
        return true;
    }
    setErrorStatus('Something gone wrong, PASSWORD must be the same!');
    return false;
}

//Setting pop-out elements
function setPOutFields(username, email) {
    pOutUsernameInput.value = username;
    pOutEmailInput.value = email;
}

function verifyPOutFields(uuid, token, urlImg) {
    const pOutUsername = pOutUsernameInput.value;
    const pOutEmail = pOutEmailInput.value;
    const pOutPassword = pOutPasswordInput.value;
    const pOutConfPassword = pOutConfPasswordInput.value;
    if(verifyUserame(pOutUsername) &&
    verifyEmail(pOutEmail) &&
    verifyPassword(pOutPassword) &&
    confirmPassword(pOutPassword, pOutConfPassword)) {
        editUser(uuid, token, urlImg, pOutUsername, pOutEmail, pOutPassword);
    }
}

//Setting status box
function setErrorStatus(message) {
    statusBox.style.backgroundColor = '#ff726f';
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
    statusBox.style.backgroundColor = '#4ee44e';
    statusBox.style.width = '350px';
    statusBox.style.height = '50px';
    statusBox.innerHTML = '<p id="status_text">' + message + '</p>';
}
