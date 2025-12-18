const API_URL = "/api/contacts";

// edit
let editngId = null;

// search, filter, pagination
let allContacts = [];
let filteredContacts = [];
let currentPage = 1;
const limit = 5;

// form elements
const form = document.getElementById("contactForm");
const tBody = document.getElementById("tBody");
const userName = document.getElementById("username");
const countryCode = document.getElementById("countryCode");
const number = document.getElementById("number");
const submitBtn = document.getElementById("addButton");

// search, filter elements
const searchInput = document.getElementById("searchInput");
const countryFilter = document.getElementById("countryFilter");
const sortSelect = document.getElementById("sortSelect");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

const formMessage = document.getElementById("formMessage");

function validateAndFormatContact() {
    let name = userName.value.trim();
    let code = countryCode.value.trim();
    let phone = number.value.trim();

    // USERNAME validation (4–10 letters only)
    if (!/^[A-Za-z]{4,10}$/.test(name)) {
        return {
            error: "Username must be 4-10 letters only"
        };
    }

    // remove + if user pastes it
    if (code.startsWith("+")) {
        code = code.slice(1);
    }

    // country code validation (2 or 3 digits)
    if (!/^\d{1,3}$/.test(code)) {
        return {
            error: "Please enter valid Country code"
        };
    }

    // phone number validation (exactly 10 digits)
    // phone number validation (10 digits, starts with 6–9)
    if (!/^[6-9]\d{9}$/.test(phone)) {
        return {
            error: "Please enter valid Number"
        };
    }

    return {
        userName: name,
        countryCode: `+${code}`,
        number: phone
    };
}

// create or edit
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // reset message
    formMessage.textContent = "";
    formMessage.className = "form-message";

    const validated = validateAndFormatContact();

    if (validated.error) {
        formMessage.textContent = validated.error;
        formMessage.classList.add("error");
        return;
    }

    const data = {
        userName: validated.userName,
        countryCode: validated.countryCode,
        number: validated.number
    };

    // edit
    // edit
if (editngId) {
    const res = await fetch(`${API_URL}/${editngId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        formMessage.textContent = result.message;
        formMessage.classList.add("error");
        return;
    }

    formMessage.textContent = "Contact updated successfully";
    formMessage.classList.add("success");

    // reset edit state
    editngId = null;
    form.reset();

    submitBtn.textContent = "Add";

    loadContacts();
}

    // create
    else {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
            formMessage.textContent = result.message;
            formMessage.classList.add("error");
            return;
        }

        formMessage.textContent = "Contact added successfully";
        formMessage.classList.add("success");

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

// sort
function applySort() {
    const sortValue = sortSelect.value;

    filteredContacts.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        console.log("SORT:", sortSelect.value);
        console.log("DATES:", filteredContacts.map(c => c.createdAt));

        return sortValue === "newest"
            ? dateB - dateA
            : dateA - dateB;
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

        return (
            (name.includes(searchValue) || phone.includes(searchValue)) &&
            (selectedCountry === "" || code === selectedCountry)
        );
    });

    applySort();
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

    prevBtn.style.display = currentPage === 1 ? "none" : "inline-block";
    nextBtn.style.display = currentPage === totalPages ? "none" : "inline-block";

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
            countryCode.value = contact.countryCode.replace("+", "");
            number.value = contact.number;

            editngId = id;
            submitBtn.textContent = "Update";
        })
        .catch(error => console.error(error));
}

// delete
async function deleteContact(id) {
    // Show confirmation dialog
    const confirmDelete = confirm("Are you sure you want to delete this contact? This action cannot be undone.");

    if (confirmDelete) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadContacts();
    }
}
sortSelect.addEventListener("change", applyFilters);

loadContacts();
