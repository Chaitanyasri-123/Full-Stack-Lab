const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Temporary data stored in a JavaScript array.
// Data will reset when the server is restarted.
let applications = [];
let nextId = 1;

// Get all applications
app.get("/api/applications", (req, res) => {
    res.json(applications);
});

// Add application
app.post("/api/applications", (req, res) => {
    const newApplication = {
        id: nextId++,
        company: req.body.company,
        role: req.body.role,
        location: req.body.location,
        applicationDate: req.body.applicationDate,
        deadline: req.body.deadline,
        status: req.body.status,
        notes: req.body.notes
    };

    applications.push(newApplication);

    res.status(201).json(newApplication);
});

// Update application
app.put("/api/applications/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = applications.findIndex(
        application => application.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Application not found"
        });
    }

    applications[index] = {
        id: id,
        company: req.body.company,
        role: req.body.role,
        location: req.body.location,
        applicationDate: req.body.applicationDate,
        deadline: req.body.deadline,
        status: req.body.status,
        notes: req.body.notes
    };

    res.json(applications[index]);
});

// Delete application
app.delete("/api/applications/:id", (req, res) => {
    const id = Number(req.params.id);

    const oldLength = applications.length;

    applications = applications.filter(
        application => application.id !== id
    );

    if (applications.length === oldLength) {
        return res.status(404).json({
            message: "Application not found"
        });
    }

    res.json({
        message: "Application deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});