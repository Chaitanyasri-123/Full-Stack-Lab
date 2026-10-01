let applications = [];

const form = document.getElementById("applicationForm");

loadApplications();

async function loadApplications() {
    try {
        const response = await fetch("/api/applications");
        applications = await response.json();

        displayApplications(applications);
        updateDashboard();
    } catch (error) {
        console.log("Error loading applications:", error);
    }
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const id = document.getElementById("applicationId").value;

    const applicationData = {
        company: document.getElementById("company").value,
        role: document.getElementById("role").value,
        location: document.getElementById("location").value,
        applicationDate: document.getElementById("applicationDate").value,
        deadline: document.getElementById("deadline").value,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value
    };

    try {
        if (id === "") {
            await fetch("/api/applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(applicationData)
            });

            alert("Application added successfully!");
        } else {
            await fetch("/api/applications/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(applicationData)
            });

            alert("Application updated successfully!");
        }

        cancelEdit();
        loadApplications();

    } catch (error) {
        console.log("Error:", error);
        alert("Something went wrong.");
    }
});

function displayApplications(list) {
    const applicationList = document.getElementById("applicationList");

    applicationList.innerHTML = "";

    if (list.length === 0) {
        applicationList.innerHTML =
            '<p class="no-data">No internship applications found.</p>';
        return;
    }

    list.forEach(function(application) {
        const div = document.createElement("div");

        div.className = "application";

        div.innerHTML = `
            <div class="application-header">
                <h3>${application.company}</h3>
                <span class="status">${application.status}</span>
            </div>

            <p><strong>Role:</strong> ${application.role}</p>
            <p><strong>Location:</strong> ${application.location}</p>
            <p><strong>Application Date:</strong> ${application.applicationDate}</p>
            <p><strong>Deadline:</strong> ${application.deadline}</p>
            <p><strong>Notes:</strong> ${application.notes || "No notes"}</p>

            <div class="application-buttons">
                <button class="edit-btn"
                    onclick="editApplication(${application.id})">
                    Edit
                </button>

                <button class="delete-btn"
                    onclick="deleteApplication(${application.id})">
                    Delete
                </button>
            </div>
        `;

        applicationList.appendChild(div);
    });
}

function editApplication(id) {
    const application = applications.find(
        item => item.id === id
    );

    if (!application) {
        return;
    }

    document.getElementById("applicationId").value = application.id;
    document.getElementById("company").value = application.company;
    document.getElementById("role").value = application.role;
    document.getElementById("location").value = application.location;
    document.getElementById("applicationDate").value =
        application.applicationDate;
    document.getElementById("deadline").value =
        application.deadline;
    document.getElementById("status").value = application.status;
    document.getElementById("notes").value = application.notes;

    document.getElementById("formTitle").textContent =
        "Edit Internship Application";

    document.getElementById("submitButton").textContent =
        "Update Application";

    document.getElementById("cancelButton").style.display =
        "inline-block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function cancelEdit() {
    form.reset();

    document.getElementById("applicationId").value = "";

    document.getElementById("formTitle").textContent =
        "Add Internship Application";

    document.getElementById("submitButton").textContent =
        "Add Application";

    document.getElementById("cancelButton").style.display =
        "none";
}

async function deleteApplication(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        await fetch("/api/applications/" + id, {
            method: "DELETE"
        });

        alert("Application deleted successfully!");

        loadApplications();

    } catch (error) {
        console.log("Error:", error);
    }
}

document.getElementById("search").addEventListener(
    "input",
    filterApplications
);

document.getElementById("filterStatus").addEventListener(
    "change",
    filterApplications
);

function filterApplications() {
    const search = document
        .getElementById("search")
        .value
        .toLowerCase();

    const status = document.getElementById("filterStatus").value;

    const filtered = applications.filter(function(application) {
        const company = application.company.toLowerCase();
        const role = application.role.toLowerCase();

        const matchesSearch =
            company.includes(search) ||
            role.includes(search);

        const matchesStatus =
            status === "All" ||
            application.status === status;

        return matchesSearch && matchesStatus;
    });

    displayApplications(filtered);
}

function updateDashboard() {
    document.getElementById("totalCount").textContent =
        applications.length;

    document.getElementById("appliedCount").textContent =
        applications.filter(app => app.status === "Applied").length;

    document.getElementById("shortlistedCount").textContent =
        applications.filter(app => app.status === "Shortlisted").length;

    document.getElementById("interviewCount").textContent =
        applications.filter(app => app.status === "Interview").length;

    document.getElementById("selectedCount").textContent =
        applications.filter(app => app.status === "Selected").length;

    document.getElementById("rejectedCount").textContent =
        applications.filter(app => app.status === "Rejected").length;
}