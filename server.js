const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const axios = require("axios")

const app = express()
const options = {origin: 'http://127.0.0.1:3000', optionsSuccessStatus: 200}

app.use(cors())
app.use(bodyParser.json())

// const city = "https://internet.gov.pl/api/cities/?page_size=150&has_address_points=true&voivodeship=2&search="
const getStreet = (city, street) => `https://internet.gov.pl/api/streets/?city=${city}&search=${street}`
const getCity = (city) => `https://internet.gov.pl/api/cities/?page_size=5&has_address_points=true&voivodeship=2&search=${city}`
const getAddressPoint = (city, street, houseNumber) => `https://internet.gov.pl/api/address_points/?city=${city}&street=${street}&house_number=${houseNumber}&search="`


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