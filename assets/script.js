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

  fetchFiveDayForecast(cityName);
 
}

function fetchFiveDayForecast(city) {
  const apiKey = "24e075f9c3089793ab4d9d9132e103a0";
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => displayFiveDayForecast(data))
      .catch(error => console.error("Error fetching 5-day forecast data:", error));
}

function displayFiveDayForecast(forecastData) {
  const forecastContainer = document.getElementById("forecastContainer");
  forecastContainer.innerHTML = "";

  const uniqueDays = getUniqueDays(forecastData.list);
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString();
  const nextFiveDays = uniqueDays.filter(day => day !== currentDateString).slice(0, 5);

  for (let i = 0; i < nextFiveDays.length; i++) {
      const day = nextFiveDays[i];
      const dayEntries = forecastData.list.filter(entry => isSameDay(entry.dt_txt, day));
      const firstEntry = dayEntries[0];

      const date = new Date(firstEntry.dt_txt).toLocaleDateString();
      const icon = firstEntry.weather[0].icon;
      const temperatureCelsius = firstEntry.main.temp;
      const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
      const wind = firstEntry.wind.speed;
      const humidity = firstEntry.main.humidity;

      const forecastCard = document.createElement("div");
      forecastCard.classList.add("forecast-card");
      forecastCard.innerHTML = `
          <p>${date}</p>
          <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
          <p>Temp: ${temperatureFahrenheit.toFixed(2)}°F</p>
          <p>Wind: ${wind} m/s</p>
          <p>Humidity: ${humidity}%</p>
      `;
      forecastContainer.appendChild(forecastCard);
  }
}

function isSameDay(dateTime1, dateTime2) {
  const date1 = new Date(dateTime1).toLocaleDateString();
  const date2 = new Date(dateTime2).toLocaleDateString();
  return date1 === date2;
}

function getUniqueDays(entries) {
  const uniqueDays = [];
  for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const date = new Date(entry.dt_txt).toLocaleDateString();
      if (!uniqueDays.includes(date)) {
          uniqueDays.push(date);
      }
  }
  return uniqueDays;
}