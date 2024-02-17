/********************************************************************************

* WEB322 – Assignment 02

*

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

*

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

*

* Name: Patel vrundaben vijaykumar Student ID: 158605220_ Date: 01/02/2024

*

********************************************************************************/
const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();
app.use(express.static('public'));
const HTTP_PORT = process.env.PORT || 8080;
const path = require('path');

legoData.initialize()
  .then(()=> {
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
  })
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme;
    if (theme) {
        legoData.getSetsByTheme(theme)
            .then(sets => res.json(sets))
            .catch(error => res.status(404).send(`Error retrieving Lego sets by theme: ${error}`));
    } else {
        legoData.getAllSets()
            .then(sets => res.json(sets))
            .catch(error => res.status(404).send(`Error retrieving Lego sets: ${error}`));
    }
});

app.get("/lego/sets/:setId", (req, res) => {
  const setId = req.params.setId;
  legoData.getSetByNum(setId)
      .then(set => res.json(set))
      .catch(error => res.status(404).send(`Error retrieving Lego set by number: ${error}`));

});  

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


