let cityList = [];

document.addEventListener("DOMContentLoaded"); 

function searchCity() {
  const apiKey = "24e075f9c3089793ab4d9d9132e103a0";
  const cityInput = document.getElementById("cityInput").value;

  if (!cityInput) {
      alert("Please enter a city name.");
      return;
  }
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;

  fetchWeather(apiUrl);
}

function fetchWeather(apiUrl) {
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`City not found: ${response.statusText}`);
          }
          return response.json();
      })
      .then(data => displayCurrentWeather(data))
      .catch(error => {
          alert(`Error: ${error.message}`);
          console.error("Error fetching current weather data:", error);
      });
}

function displayCurrentWeather(weatherData) {
  const currentWeatherContainer = document.getElementById("currentWeather");
  currentWeatherContainer.innerHTML = "";

  if (weatherData.cod === "404") {
      alert(`City not found: ${weatherData.message}`);
      return;
  }

  const cityName = weatherData.name;
  const country = weatherData.sys.country;
  const date = new Date().toLocaleDateString();

  const temperatureCelsius = weatherData.main.temp;
  const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;

  const currentWeatherHtml = `
      <div class="current-weather">
          <h2>${cityName}, ${country}</h2>
          <p>${date}</p>
          <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p>
          <p>Wind: ${weatherData.wind.speed} m/s</p>
          <p>Humidity: ${weatherData.main.humidity}%</p>
      </div>
  `;

  currentWeatherContainer.innerHTML = currentWeatherHtml;

  for (let i = 0; i < cityList.length; i++) {
      if (cityList[i] === cityName) {
          break;
      }
      if (i === cityList.length - 1) {
          cityList.push(cityName);
          updateCityButtons();
          localStorage.setItem("cityList", JSON.stringify(cityList));
      }
  }

 
}