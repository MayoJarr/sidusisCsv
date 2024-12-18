const API_URL = 'http://localhost:3000';

// Klasa reprezentująca miasto
class City {
    constructor(name, voiv, county, pk) {
        this.name = name;
        this.voiv = voiv;
        this.county = county;
        this.pk = pk;
        this.streets = [];
    }

    // Pobieranie ulic dla miasta
    async fetchStreets() {
        const url = `${API_URL}/streets?city=${encodeURIComponent(this.pk)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const data = await response.json();
            this.streets = data.map(street => new Street(street.name));
        } catch (error) {
            console.error('Error fetching streets:', error.message);
        }
    }
}

// Klasa reprezentująca ulicę
class Street {
    constructor(name) {
        this.name = name;
    }
}

// Klasa odpowiedzialna za manipulację interfejsem użytkownika
class UI {
    static cityListElement = document.querySelector(".cityList");

    static createCityComponent(city) {
        const cityElement = document.createElement("div");
        // const cityName = document.createElement("p")
        cityElement.classList.add("city");
        cityElement.dataset.key = city.pk;
        // cityName.textContent = city.name
        // cityElement.appendChild(cityName)
        cityElement.innerHTML = `<span>${city.name}</span> | ${city.voiv}, ${city.county}`;
        UI.cityListElement.appendChild(cityElement);
        cityElement.addEventListener("click", (e) => {
            console.log(city.streets)
            UI.populateStreetSection(city.streets)
        });
    }

    static createStreetComponent(street) {
        const streetElement = document.createElement("div");
        streetElement.classList.add("street");
        streetElement.textContent = street.name;
        return streetElement;
    }

    static populateStreetSection(streets) {
        const streetList = document.querySelector(".streetList");
        streetList.textContent = "";
        streets.forEach(street => {
            console.log(street.name)
            streetList.appendChild(this.createStreetComponent(street));
        });
    }

    static createWaitIcon() {
        const waitElement = document.createElement("div");
        waitElement.textContent = "please wait...";
        waitElement.classList.add("wait");
        return waitElement;
    }
}

// Funkcje do pobierania danych z API
const fetchCities = async (city) => {
    const url = `${API_URL}/cities?city=${encodeURIComponent(city)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Obsługa zdarzeń
const btn = document.querySelector("#btn");
const cityName = document.querySelector("#cityName");
const sendBtn = document.querySelector("#send");

const cities = [];

btn.addEventListener("click", async () => {
    const waitIcon = UI.createWaitIcon();
    UI.cityListElement.appendChild(waitIcon);

    try {
        const cityData = await fetchCities(cityName.value);
        if (!cityData) {
            console.error("No city found");
            waitIcon.remove();
            return;
        }

        const city = new City(cityData.name, cityData.voiv, cityData.county, cityData.pk);
        await city.fetchStreets();

        cities.push(city);
        waitIcon.remove();
        UI.createCityComponent(city);

        // document.querySelectorAll(".city").forEach(cityElement => {

        
    } catch (error) {
        console.error('Error:', error.message);
        waitIcon.remove();
    }
});

sendBtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL}/genCsv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cities.map(city => ({
                name: city.name,
                voiv: city.voiv,
                county: city.county,
                streets: city.streets.map(street => street.name)
            }))),
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error.message);
    }
});

