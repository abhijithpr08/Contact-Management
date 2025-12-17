const API_URL = "/api/contacts"

const form = document.getElementById("contactForm")
const userName = document.getElementById("username")
const countryCode = document.getElementById("countryCode")
const number = document.getElementById("number")

form.addEventListener("submit", async (e) => {

    e.preventDefault()
    const data = {
        userName: userName.value,
        countryCode: countryCode.value,
        number: number.value
    }
    console.log(data)

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
})
