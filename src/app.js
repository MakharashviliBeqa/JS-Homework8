const API_BASE = "https://borjomi.loremipsum.ge/api";

const createUserUrl = `${API_BASE}/register`;
const getAllUsersUrl = `${API_BASE}/all-users`;
const getSingleUserUrl = `${API_BASE}/get-user/`;
const updateUserUrl = `${API_BASE}/update-user/`;
const deleteUserUrl = `${API_BASE}/delete-user/`;

const dialogEl = document.querySelector("dialog");
const regForm = document.querySelector("#registration-form");
const userId = document.querySelector("#user-id");

const addNewUserBtn = document.querySelector("#add-new-user");
const closeDialog = document.querySelector("#close");
const generateRandomUserBtn = document.querySelector("#generate-random-user");

const userName = document.querySelector("#user-name");
const userSurname = document.querySelector("#user-surname");
const userEmail = document.querySelector("#user-email");
const userPhone = document.querySelector("#user-phone");
const userPersonalID = document.querySelector("#user-personal-id");
const userZip = document.querySelector("#user-zip-code");

const deleteAllUsersBtn = document.querySelector("#delete-all-users");

deleteAllUsersBtn.addEventListener("click", () => {
    deleteAllUsersOneByOne();
});

async function deleteAllUsersOneByOne() {
    try {
        const response = await fetch(getAllUsersUrl);
        const data = await response.json();
        const users = data.users;

        for (const user of users) {
            await fetch(`${deleteUserUrl}${user.id}`, { method: "DELETE" });
            console.log(`Deleted user ${user.id}`);
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        getUsers();
    } catch (e) {
        console.log("Error deleting all users:", e);
    }
}

addNewUserBtn.addEventListener("click", () => {
    dialogEl.showModal();
});

closeDialog.addEventListener("click", () => {
    dialogEl.close();
});

regForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userData = {
        first_name: userName.value,
        last_name: userSurname.value,
        phone: userPhone.value,
        id_number: userPersonalID.value,
        email: userEmail.value,
        gender: regForm.querySelector("[name='gender']:checked").value,
        zip_code: userZip.value,
    };

    if (!userId.value) {
        sendUserData(userData);
    } else {
        userData.id = userId.value;
        updateUser(userData);
    }

    regForm.reset();
    userId.value = "";
    dialogEl.close();
});

generateRandomUserBtn.addEventListener("click", () => {
    const randomId = Math.floor(100000000 + Math.random() * 900000000);
    const userData = {
        first_name: "Test" + Math.floor(Math.random() * 1000),
        last_name: "User",
        phone: "555" + Math.floor(100000 + Math.random() * 900000),
        id_number: String(randomId),
        email: `testuser${randomId}@example.com`,
        gender: "male",
        zip_code: "0100",
    };

    sendUserData(userData);
});

function sendUserData(userDataObject) {
    fetch("https://borjomi.loremipsum.ge/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataObject),
    })
        .then((res) => res.json())
        .then(() => {
            getUsers();
        });
}

function getUsers() {
    fetch("https://borjomi.loremipsum.ge/api/all-users")
        .then((res) => res.json())
        .then((data) => {
            const tbody = document.querySelector("#users-tbody");
            tbody.innerHTML = "";

            data.users.forEach((user) => {
                const row = document.createElement("tr");
                row.innerHTML = `
          <td>${user.first_name}</td>
          <td>${user.last_name}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.id_number}</td>
          <td>${user.gender}</td>
          <td>${user.zip_code}</td>
        `;
                tbody.appendChild(row);
            });
        });
}

function updateUser(userObj) {
    fetch(`https://borjomi.loremipsum.ge/api/update-user/${userObj.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
    })
        .then((res) => res.json())
        .then(() => {
            getUsers();
        });
}



getUsers();