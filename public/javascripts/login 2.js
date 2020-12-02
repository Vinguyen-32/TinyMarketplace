const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const sign_in_submit_btn = document.querySelector("#signin-submit");
const sign_up_submit_btn = document.querySelector("#signup-submit");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

sign_in_submit_btn.addEventListener("click", () => {
    let signin_username = document.querySelector("#signin-username");
    let signin_password = document.querySelector("#signin-password");

    return $.ajax({
        type: "POST",
        url: ("/api/login"),
        contentType: "application/json",
        data: JSON.stringify({
            username: signin_username.value,
            password: signin_password.value
        }),
        success: function (body, res, xhr) {
            if (xhr.status == 200){
                localStorage.setItem("currentUser", JSON.stringify(body, null, 4));
                window.location.href = "/landingPage";
                return true;
            }
            else {
                alert(body.message);
                return false;
            }
        },
        error: function (body, res, xhr) {
            alert(body.responseJSON.message);
            return false;
        }
    })
});

sign_up_submit_btn.addEventListener("click", () => {
    let signup_username = document.querySelector("#signup-username");
    let signup_password = document.querySelector("#signup-password");
    let signup_email = document.querySelector("#signup-email");


    return $.ajax({
        type: "POST",
        url: ("/api/signup"),
        contentType: "application/json",
        data: JSON.stringify({
            username: signup_username.value,
            password: signup_password.value,
            email: signup_email.value
        }),
        success: function (body, res, xhr) {
            if (xhr.status == 200){
                alert(JSON.stringify(body, null, 4))
                localStorage.setItem("currentUser", JSON.stringify(body, null, 4));
                window.location.href = "/landingPage";
                return true;
            }
            else {
                return false;
            }
        }
    })
});