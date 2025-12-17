const API_URL = "/api/contacts";

// edit
let editngId = null;

// search, filter, pagination
let allContacts = [];
let filteredContacts = [];
let currentPage = 1;
const limit = 20;

// form elements
const form = document.getElementById("contactForm");
const tBody = document.getElementById("tBody");
const userName = document.getElementById("username");
const countryCode = document.getElementById("countryCode");
const number = document.getElementById("number");

// search, filter elements
const searchInput = document.getElementById("searchInput");
const countryFilter = document.getElementById("countryFilter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");


// create or edit
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        userName: userName.value,
        countryCode: countryCode.value,
        number: number.value,
    };

    // edit
    if (editngId) {
        await fetch(`${API_URL}/${editngId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        editngId = null;
        form.reset();
        loadContacts();
    }
    // create
    else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        form.reset();
        loadContacts();
    }
});


// read
async function loadContacts() {
    try {
        const res = await fetch(API_URL);
        allContacts = await res.json();

        populateCountryFilter();
        applyFilters();
    } catch (error) {
        console.error(error);
    }
}


// filter by countryCode
function populateCountryFilter() {
    const codes = [...new Set(allContacts.map(c => c.countryCode))];

    countryFilter.innerHTML = `<option value="">All Country Codes</option>`;

    codes.forEach(code => {
        countryFilter.innerHTML += `<option value="${code}">${code}</option>`;
    });
}


// search, filter
function applyFilters() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedCountry = countryFilter.value;

    filteredContacts = allContacts.filter(contact => {
        const name = contact.userName?.toLowerCase() || "";
        const phone = contact.number?.toString() || "";
        const code = contact.countryCode || "";

        const matchesSearch =
            name.includes(searchValue) ||
            phone.includes(searchValue);

        const matchesCountry =
            selectedCountry === "" || code === selectedCountry;

        return matchesSearch && matchesCountry;
    });

    currentPage = 1;
    renderPage();
}


// pagination
function renderPage() {
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const pageData = filteredContacts.slice(start, end);

    tBody.innerHTML = "";

    pageData.forEach(contact => {
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

    const totalPages = Math.ceil(filteredContacts.length / limit) || 1;
    pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}


// pagination buttons
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(filteredContacts.length / limit)) {
        currentPage++;
        renderPage();
    }
});


// search , filter events
searchInput.addEventListener("input", applyFilters);
countryFilter.addEventListener("change", applyFilters);


// edit
function editContact(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(contact => {
            userName.value = contact.userName;
            countryCode.value = contact.countryCode;
            number.value = contact.number;

            editngId = id;
        })
        .catch(error => console.error(error));
}


// delete
async function deleteContact(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadContacts();
}

loadContacts();
