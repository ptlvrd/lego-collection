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

app.get("/lego/addSet", async (req, res) => {
    let themes = await legoData.getAllThemes()
    res.render("addSet", { themes: themes })
});

app.post("/lego/addSet", async (req, res) => {
    try {
      await legoData.addSet(req.body);
      res.redirect("/lego/sets");
    } catch (err) {
      res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
  
});

app.get("/lego/editSet/:num", async (req, res) => {
    try {
      let set = await legoData.getSetByNum(req.params.num);
      let themes = await legoData.getAllThemes();
  
      res.render("editSet", { set, themes });
    } catch (err) {
      res.status(404).render("404", { message: err });
    }
  
});

app.post("/lego/editSet", async (req, res) => {
    try {
      await legoData.editSet(req.body.set_num, req.body);
      res.redirect("/lego/sets");
    } catch (err) {
      res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
  });

app.get("/lego/deleteSet/:num", async (req, res) => {
    try {
      await legoData.deleteSet(req.params.num);
      res.redirect("/lego/sets");
    } catch (err) {
      res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
})
app.get("/lego/sets", async (req, res) => {
    let sets = [];
    try {
      if (req.query.theme) {
        sets = await legoData.getSetsByTheme(req.query.theme);
      } else {
        sets = await legoData.getAllSets();
      }
  
      res.render("sets", { sets })
    } catch (err) {
      res.status(404).render("404", { message: err });
    }
  
  });

app.get("/lego/sets/:num", async (req, res) => {
    try {
      let set = await legoData.getSetByNum(req.params.num);
      res.render("set", { set })
    } catch (err) {
      res.status(404).render("404", { message: err });
    }
});

app.use((req, res) => {
    res.status(404).render("404", { message: "The page you are looking for does not exist." });
});
