/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Patel vrundaben vijaykumar Student ID: 158605220_ Date: 17/03/2024
*
* Published URL:https://vivacious-eel-fatigues.cyclic.app/
*
********************************************************************************/
const legoData = require("./modules/legoSets");
const express = require('express');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
const HTTP_PORT = process.env.PORT || 3000;

legoData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
    })
    .catch(error => {
        console.error('Failed to initialize data:', error);
    });

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/about', (req, res) => {
    res.render("about");
});

app.get("/lego/sets", (req, res) => {
    const theme = req.query.theme;
    if (theme) {
        legoData.getSetsByTheme(theme)
            .then(sets => {
                if (sets.length > 0) {
                    res.render("sets", { sets: sets });
                } else {
                    res.status(404).render("404", { message: "No sets found for the specified theme." });
                }
            })
            .catch(error => res.status(404).render("404", { message: "Error fetching sets by theme." }));
    } else {
        legoData.getAllSets()
            .then(sets => res.render("sets", { sets: sets }))
            .catch(error => res.status(404).render("404", { message: "Error retrieving Lego sets." }));
    }
});

app.get("/lego/sets/:setId", (req, res) => {
    const setId = req.params.setId;
    legoData.getSetByNum(setId)
        .then(set => {
            if (set) {
                res.render("set", { set: set });
            } else {
                res.status(404).render("404", { message: `No set found with number ${setId}.` });
            }
        })
        .catch(error => {
            res.status(404).render("404", { message: `Set with number ${setId} not found.` });
        });
});

app.use((req, res) => {
    res.status(404).render("404", { message: "The page you are looking for does not exist." });
});

