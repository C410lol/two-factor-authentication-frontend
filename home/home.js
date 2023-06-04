//Inputs
const homeTxt = document.querySelector("#home_txt");
const loginCreateOrUsernameTxt = document.querySelector("#username_txt");
const loginToSeeTxt = document.querySelector("#login_to_see_txt");
const users_container = document.querySelector("#users_container");
const logOutTxt = document.querySelector("#log_out_txt");

//Set Header
function setHomeTxt() {
    homeTxt.addEventListener("click", function() {
        window.location.reload();
        window.scrollTo(0, 0);
    });
}

setHomeTxt();

function setLoginCreateTxt() {
    loginCreateOrUsernameTxt.addEventListener("click", function() {
        window.location.assign("file:///C:/Users/caiog/VisualCodeProjects/login-page/login/login.html");
    });
}

function setUsernameTxt(uuid) {
    loginCreateOrUsernameTxt.addEventListener("click", function() {
        window.location.assign("file:///C:/Users/caiog/VisualCodeProjects/login-page/user/user.html?uuid=" + uuid);
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

//Verifying if user is loged and setting him
async function getUserLogin() {
    const token = localStorage.getItem("token");
    if(token != null) {
        try {
            const response = await fetch("http://localhost:8080/users/get-by-token?token=" + token.substring(7));
            if(response.ok) {
                const data = await response.json();
                loginCreateOrUsernameTxt.innerText = "Hello " + data.username + "!";
                setUsernameTxt(data.uuid);
                setLogOutTxt();
                loginToSeeTxt.remove();
                getAllUsers(token);
                return;
            }
        } catch(e) {
            console.error(e);
        }
    }
    logOutTxt.remove();
    setLoginCreateTxt();
}

getUserLogin();

//Call API to get all users
async function getAllUsers(token) {
    const options = {
        headers: {
            "Authorization": token
        }
    }
    const response = await fetch("http://localhost:8080/users/all", options);
    console.log(response);
    const data = await response.json();
    if(response.ok) {
        data.map((data) => {
            const userContainer = document.createElement("div");

            const img = document.createElement("img");
            const uuid = document.createElement("p");   
            const username = document.createElement("p");   
            const email = document.createElement("p");

            if(data.urlImage != null) {
                img.src = data.urlImage;
            } else {
                img.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
            }
            uuid.innerText = data.uuid;  
            username.innerText = data.username; 
            email.innerText = data.email;

            userContainer.appendChild(img);
            userContainer.appendChild(uuid);
            userContainer.appendChild(username);
            userContainer.appendChild(email);

            users_container.appendChild(userContainer);
        });
    }
}
