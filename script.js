const apiKey = "dd35df0c6060bdf015dbe77c93af6ba7";
const search = document.getElementById("search")
const city = document.getElementById("city")
const locateBtn = document.getElementById("detect")
const loading = document.getElementById("loading")
const cityName = document.getElementById("cityName")
const temp = document.getElementById("temp")
const description = document.getElementById("description")
const humidity = document.getElementById("humidity")
const wind = document.getElementById("wind")


search.addEventListener("click", getWeather);
locateBtn.addEventListener("click", detectLocation);
city.addEventListener("keypress", (e)=>{
    if (e.key === "Enter") getWeather();
})
function showLoading(){
    loading.classList.add("active")
}
function hideLoading(){
    loading.classList.remove("active")
}
function displayWeather(data) {
    const placeHolder = document.getElementById("placeholder");
    placeHolder.style.display = "none"; 

    cityName.style.display = "block";
    temp.style.display = "block";
    description.style.display = "block";
    humidity.style.display = "block";
    wind.style.display = "block";
    
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temp.textContent = `Temperature: ${data.main.temp}°C`;
    description.textContent = `Condition: ${data.weather[0].description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById("updateTime").textContent = 
  `Last updated: ${new Date(data.dt * 1000).toLocaleTimeString()}`;

}

function showPlaceholder() {
    document.getElementById("placeholder").style.display = "block";
    cityName.style.display = "none";
    temp.style.display = "none";
    description.style.display = "none";
    humidity.style.display = "none";
    wind.style.display = "none";
}
async function getWeather() {
    const cityInput = city.value.trim();
    if(cityInput === ""){
        alert("Please enter a city name");
        return;
    }
    else{
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${apiKey}`
    showLoading()
    try{
        const response = await fetch (url);
        if(!response.ok) throw new Error("city not found");
        const data = await response.json();
        displayWeather(data)
    }
    catch(error){
        alert(error.message);
        showPlaceholder();
    }
    finally{
        hideLoading()
    }
    }
}
function detectLocation() {
    const placeholder = document.getElementById("placeholder");
    placeholder.style.display = "block";
    placeholder.textContent = "📍 Detecting your location...";
    
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}
async function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    const placeholder = document.getElementById("placeholder");
    placeholder.textContent = "🌦️ Detecting weather location...";

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.main) {
            throw new Error("Incomplete weather data received");
        }

        displayWeather(data);
        placeholder.style.display = "none"; // hide the loading message
    } catch (error) {
        console.error("❌ Error fetching weather:", error);
        placeholder.textContent = "❌ Unable to fetch weather data. Check your API key or internet connection.";
        showPlaceholder();
    } finally {
        hideLoading();
    }
}

function onError(error){
    hideLoading();
    alert("Location access denied or unavailable. please enter a city manually");
    showPlaceholder();
}