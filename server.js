const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const axios = require("axios")

const app = express()
const options = {origin: 'http://127.0.0.1:3000', optionsSuccessStatus: 200}

app.use(cors())
app.use(bodyParser.json())

// const city = "https://internet.gov.pl/api/cities/?page_size=150&has_address_points=true&voivodeship=2&search="
const getStreet = (city, street, page) => `https://internet.gov.pl/api/streets/?city=${city}&search=${street}&page=${page}`
const getCity = (city) => `https://internet.gov.pl/api/cities/?page_size=5&has_address_points=true&voivodeship=2&search=${city}`
const getAddressPoint = (city, street, houseNumber) => `https://internet.gov.pl/api/address_points/?city=${city}&street=${street}&house_number=${houseNumber}&search="`

let streets = []

const fetchStreet = async (city, page) => {
    console.log(page);
    try {
        const response = await axios.get(getStreet(city, "", page));
        const data = response.data;

        // Dodaj wyniki do tablicy ulic
        streets.push(...data.results);

        // Jeśli istnieje kolejna strona, rekurencyjnie pobierz
        if (data.next != null) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Opóźnienie 2 sekundy
            await fetchStreet(city, page + 1);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

app.get("/cities", async (req, res) => {
    const { city } = req.query;
    try {
        const response = await axios.get(getCity(city));
        const data = response.data.results[0]
        res.json({
            name: data.name,
            pk: data.pk,
            county: data.municipality.county.name,
            voiv: data.municipality.county.voivodeship.name
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
})
app.get("/streets", async (req, res) => {
    streets = []; // Reset listy ulic
    const { city } = req.query;

    try {
        await fetchStreet(city, 1); // Początkowe wywołanie dla strony 1
        console.log("end");
        res.json(streets); // Wyślij dane dopiero po zakończeniu fetchowania
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
})
app.post("/genCsv", async (req, res) => {
    const streets = []
    const cities = req.body
    cities.forEach(async city => {
        try {
            const response = await axios.get(getStreet(city.pk, ""));
            const data = response.data.results
            data.forEach(street => streets.push({name: street.name, pk: street.pk, cityPk: city.pk}))
            res.json(streets)
        } catch (error) {
            console.error('Error fetching data:', error.message);
            res.status(500).json({ error: 'Failed to fetch data from external API' });
        }
    });
})

app.listen(3000, () => console.log("listening on port 3000"))