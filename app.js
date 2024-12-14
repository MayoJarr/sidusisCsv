const btn = document.querySelector("#btn")
const citylist = document.querySelector(".cityList")
const API_URL = 'http://localhost:3000/cities';

const cityName = document.querySelector("#cityName")
const sendBtn = document.querySelector("#send")
const cities = []

const cityComponent = (name, voiv, county) => {
    const d = document.createElement("li")
    const b = document.createElement("button")
    d.classList.add("city")
    d.textContent = `${name} | ${voiv}, ${county} | wszystkie ulice`
    b.textContent = ":"
    d.appendChild(b)
    citylist.appendChild(d)
}
const streetComponent = (name, voiv, county) => {
}
const fetchData = async (city) => {
    const url = `${API_URL}?city=${encodeURIComponent(city)}`;
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
btn.addEventListener("click", async () => {
    const { name, voiv, county, pk} = await fetchData(cityName.value)
    console.log(name)
    cities.push({name: name, pk: pk})
    cityComponent(name, voiv, county)
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