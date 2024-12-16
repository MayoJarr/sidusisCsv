const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const { getStreet, getCity } = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const fetchStreet = async (city, page = 1, streets = []) => {
    try {
        const response = await axios.get(getStreet(city, "", page));
        const data = response.data;

        // Dodanie wyników do listy ulic
        streets.push(...data.results);

        // Jeśli istnieje kolejna strona, rekurencyjnie pobierz
        if (data.next != null) {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Opóźnienie 2 sekundy
            return fetchStreet(city, page + 1, streets);
        }

        return streets;
    } catch (error) {
        console.error("Error fetching streets:", error.message);
        throw new Error("Failed to fetch streets.");
    }
};

app.get("/cities", async (req, res, next) => {
    const { city } = req.query;
    try {
        console.log(getCity(city))
        const response = await axios.get(getCity(city));
        const data = response.data.results[0];
        res.json({
            name: data.name,
            pk: data.pk,
            county: data.municipality.county.name,
            voiv: data.municipality.county.voivodeship.name,
        });
    } catch (error) {
        next(error);
    }
});

app.get("/streets", async (req, res, next) => {
    const { city } = req.query;
    try {
        const streets = await fetchStreet(city);
        res.json(streets);
    } catch (error) {
        next(error);
    }
});

app.post("/genCsv", async (req, res, next) => {
    const cities = req.body;
    try {
        const allStreets = await Promise.all(
            cities.map(async city => {
                const response = await axios.get(getStreet(city.pk, ""));
                return response.data.results.map(street => ({
                    name: street.name,
                    pk: street.pk,
                    cityPk: city.pk,
                }));
            })
        );
        const streets = allStreets.flat();
        res.json(streets);
    } catch (error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
