"use strict";
const pool = require('./dbConnection');

async function getCategories() {
    const queryText = "SELECT name FROM categories";
    const result = await pool.query(queryText);
    return result.rows;
}

async function getJokesByCategory(category) {
    const queryText = `
        SELECT setup, delivery
        FROM jokes j
        JOIN categories c ON j.category_id = c.id
        WHERE c.name = $1
    `;

    const values = [category];
    const result = await pool.query(queryText, values);
}

async function getRandomJoke() {
    const queryText = `
        SELECT setup, delivery
        FROM jokes
        ORDER BY RANDOM()
        LIMIT 1
    `;
}

async function addJoke(category, setup, delivery) {
    //getting the category id
    const catQuery = `
        SELECT id
        FROM categories
        WHERE name = $1
        `;
    const catResult = await pool.query(catQuery, [category]);

    if(catResult.rows.length == 0){
        throw new Error("Category not found!");
    }

    const categoryId = catResult.rows[0].id;

    //add joke
    let queryText = "INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3) RETURNING *";
    let values = [categoryId, setup, delivery];
    const result = await pool.query(queryText, values);
    return getJokesByCategory(category);
}

module.exports = {
    getAllCategories,
    getJokesByCategory,
    getRandomJoke,
    addJoke
};

