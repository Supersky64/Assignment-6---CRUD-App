"use strict";
const model = require('../models/jokebookModel');

async function fetchCategories(req, res) {
    try {
        const categories = await model.getAllCategories();
        res.json(categories);
    } catch (err){
        console.error(err);
        res.status(500).send("Server error");
    }
}

async function fetchJokesByCategories(req, res) {
    const category = req.params.categories;

    if(categories){
        try {
            const jokes = await model.getJokesByCategory(category);
            
            if(joke.length == 0){
                return res.status(404).send("Invalid Category");
            }

            res.json(jokes);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    }else{
        res.status(400).send("Missing required category param!");
    }
}

async function fetchRandomJoke(req, res) {
    try {
        const joke = await model.getRandomJoke();
        res.json(joke);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

async function createJoke(req, res) {
    const {category, setup, delivery} = req.body;

    if(category && setup && delivery){
        try {
            const newJoke = await model.addJoke(category, setup, delivery);
            res.status(201).json(newJoke);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    }else{
        res.status(400).send("Missing required fields!")
    }
}

module.exports = {
    fetchCategories,
    fetchJokesByCategory,
    fetchRandomJoke,
    createJoke
};