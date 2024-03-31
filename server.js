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
const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

legoData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
    })
    .catch(error => {
        console.error('Failed to initialize data:', error);
    });

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

app.get("/lego/addSet", async (req,res)=>{
    try{
        let themes = await legoData.getAllThemes()
        res.render("addSet", { themes: themes })
    }catch(err){
        res.status(500).render("500", {message: `Error: ${err}`});
    }
});

app.post("/lego/addSet", async (req, res)=>{
    try{
        await legoData.addSet(req.body);
        res.redirect("/lego/sets");
    }
    catch(err)
    {
        res.status(500).render("500", {message: `Error: ${err}`});
    }
});

app.get("/lego/editSet/:num", async (req,res)=>{
    try{
        let set = await legoData.getSetByNum(req.params.num);
        let themes = await legoData.getAllThemes();
        res.render("editSet", {set, themes});
    }catch(err){
        res.status(404).render("404", {message: err});
    }
});

app.post("/lego/editSet", async (req, res)=>{
    try{
        await legoData.editSet(req.body.set_num, req.body);
        res.redirect("/lego/sets");
    }catch(err){
        res.status(500).render("500",{message: `Error 500 ${err}`});
    }
});

app.get("/lego/deleteSet/:num", async (req, res)=>{
    try{
        await legoData.deleteSet(req.params.num);
        res.redirect("/lego/sets");
    }catch(err){
        res.status(500).render("500", {message: `Error ${err}`});
    }
});

app.use((req, res) => {
    res.status(404).render("404", { message: "The page you are looking for does not exist." });
});
