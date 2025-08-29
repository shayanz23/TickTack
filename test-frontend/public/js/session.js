const dbManagerUrl = "http://localhost:8080/db_manager"

async function signUp() {
    const fullName = document.getElementById("signup-fullname").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const firstName = fullName.split(' ').slice(0, -1).join(' ');
    const lastName = fullName.split(' ').slice(-1).join(' ');

    await fetch(`${dbManagerUrl}/v1/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ firstName, lastName, email, password })
    }).then(async function (response) {
        console.log(response.status);
        const json = await response.json();
        console.log(json);
        if (!response.ok) {
            alert(json.errors[0].message);
        } else {
            window.location.replace("/login");
        }
    })
}

async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(`http://localhost:3000/api/v1/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify({ username: email, password })
    }).then(async function (response) {
        console.log(response.status);
        const json = await response.json();
        console.log(json);
        if (!response.ok) {
            alert(json.errors[0].message);
        } else {
            localStorage.setItem("userId", JSON.stringify(json.id));
            // window.location.replace("/home");
        }
    })
}


