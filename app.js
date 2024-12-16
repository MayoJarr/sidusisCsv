const btn = document.querySelector("#btn")
const citylist = document.querySelector(".cityList")
const API_URL = 'http://localhost:3000';

const cityName = document.querySelector("#cityName")
const sendBtn = document.querySelector("#send")
// const cities = []
const streets = []

const cityComponent = (name, voiv, county) => {
    const d = document.createElement("div")
    d.classList.add("city")
    d.textContent = `${name} | ${voiv}, ${county} | wszystkie ulice`
    citylist.appendChild(d)
    return d
}
const streetComponent = (name) => {
    const d = document.createElement("div")
    d.textContent = name
    return d
}
const waitIcon = () => {
    const d = document.createElement("div")
    d.textContent = "please wait..."
    return d
}
const fetchCities = async (city) => {
    const url = `${API_URL}/cities?city=${encodeURIComponent(city)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        console.log(data)
        return data
    } catch (error) {
        console.error('Error:', error.message);
    }
}
const fetchStreets = async city => {
    const url = `${API_URL}/streets?city=${encodeURIComponent(city)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        data.forEach(street => streets.push(street))
        console.log(streets)
    } catch (error) {
        console.error('Error:', error.message);
    }
}
btn.addEventListener("click", async () => {
    const wait = waitIcon()
    citylist.appendChild(wait)
    const { name, voiv, county, pk} = await fetchCities(cityName.value)
    await fetchStreets(pk)
    // cities.push({name: name, pk: pk})
    wait.remove()
    const city = cityComponent(name, voiv, county)
    streets.forEach(street => {
        city.appendChild(streetComponent(street.name))
    })
})
sendBtn.addEventListener("click", async () => {
    // cities.forEach(city => {
        // setTimeout(async () => {
            try {
                const response = await fetch("http://localhost:3000/genCsv", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cities),
                });
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                const data = await response.json();
                data.forEach(street => {
                    
                });
                console.log(data);
            } catch (error) {
                console.error('Error:', error.message);
            }
        // }, 1000)
    // })
})