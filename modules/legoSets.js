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
const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function initialize() {
  return new Promise((resolve, reject) => {
    try {
      setData.forEach(set => {
        const theme = themeData.find(theme => theme.id == set.theme_id);
        const setWithTheme = { ...set, theme: theme.name };
        sets.push(setWithTheme);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
  
function getAllSets() {
    return new Promise((resolve, reject) => {
      try {
        resolve(sets);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  function getSetByNum(setId) {
    return new Promise((resolve, reject) => {
      try {
        const set = sets.find(set => set.set_num == setId);
        if (set) {
          resolve(set);
        } else {
          reject("unable to find requested set");
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      try {
        const matchingSets = sets.filter(set =>
          set.theme.toLowerCase().includes(theme.toLowerCase())
        );
        if (matchingSets.length > 0) {
          resolve(matchingSets);
        } else {
          reject("Unable to find requested sets");
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }