const API_URL = "/api/contacts"

const form = document.getElementById("contactForm")
const tBody = document.getElementById("tBody")
const userName = document.getElementById("username")
const countryCode = document.getElementById("countryCode")
const number = document.getElementById("number")

//create
form.addEventListener("submit", async (e) => {
    
    e.preventDefault()
    const data = {
        userName: userName.value,
        countryCode: countryCode.value,
        number: number.value
    }
    
    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    console.log("data added",data)
    loadContacts()
})

//read
async function loadContacts (){
    try{
        // console.log("heyy")
        const res = await fetch(API_URL)
        const data = await res.json() 
        console.log(res,"---res")
        console.log(data,"--data")
        tBody.innerHTML=``;
        data.forEach((contact) => {
        tBody.innerHTML += `
        <tr>
            <td>${contact.userName}</td>
            <td>${contact.countryCode}</td>
            <td>${contact.number}</td>
            <td>
                <button class="edit-btn" onclick="editContact('${contact._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteContact('${contact._id}')">Delete</button>
            </td>
        </tr>
        `;
      });
    }
    catch(error){
        console.error(error)
    }
}
loadContacts()

function deleteContact(id) {
    fetch(`${API_URL}/${id}`, {
         method: "DELETE",
    })
    loadContacts();
}