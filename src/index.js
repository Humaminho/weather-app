import './styles.css';
import { format } from 'date-fns'
const log = console.log;

const inputEl = document.getElementById('location');
const submit = document.getElementById('submit');
const form = document.getElementById('form')
const forecastEl = document.getElementById('forecast');
const currentEl = document.getElementById('today');
const mapEl = document.getElementById('map');

let currentLocation = "";
let currentSection = 'current';

const section = document.querySelector('.section');

currentEl.addEventListener('click', getCurrentWeather);
forecastEl.addEventListener('click', getForecast);
mapEl.addEventListener('click', getMap);

form.addEventListener('submit', (e) => {
  e.preventDefault();
})

submit.addEventListener('click', () => {
  if (inputEl.value) {
    currentLocation = inputEl.value;
    switch(currentSection) {
      case 'current':
        getCurrentWeather();
        break;
      case 'forecast':
        getForecast();
        break;
      case 'map':
        getMap();
        break;
      default:
        log('something is wrong');
    }
  } else return;
});

function getCurrentWeather() {

  currentSection = 'current';
  const path = `http://api.weatherapi.com/v1/current.json?key=1c22c861d3d140b58e7202945230604&q=${currentLocation}`

  fetch(path, { mode: 'cors' })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((response) => {
    displayCurrentWeather(response);
  })
  .catch((error) => {
    handleError();
    log(error);
  });

}

function getForecast() {

  currentSection = 'forecast';
  const path = `http://api.weatherapi.com/v1/forecast.json?key=1c22c861d3d140b58e7202945230604&q=${currentLocation}&days=5`;

  fetch(path, { mode: 'cors' })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return(response.json())
  })
  .then((response) => {
    displayForecast(response);
  })
  .catch((error) => {
    handleError();
    log(error);
  })
}

function getMap() {

  currentSection = 'map';
  const path = `http://api.weatherapi.com/v1/forecast.json?key=1c22c861d3d140b58e7202945230604&q=${currentLocation}&days=5`;

  fetch(path, { mode: 'cors'})
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((response) => {
    displayMap([response.location.lat, response.location.lon]);
  })
  .catch((error) => {
    handleError();
    log(error);
  })

}

function displayCurrentWeather(response) {
  section.innerText = "";
  const todayWeatherSection = document.createElement('div');
  todayWeatherSection.classList.add('current');
  todayWeatherSection.innerHTML = `
  <p id="title"> The weather today:</p>
  <p id="error" class="hidden">Oops, something went wrong! Please try again.</p>
  <p id="empty">Insert your city name</p>
  <p id="description">${description(response)}</p>
  <p id="temperature">${response.current.temp_c} °C</p>
  <p id="humidity">${response.current.humidity} %</p>
  <p id="wind-speed">${response.current.wind_kph} km/h</p>`
  section.appendChild(todayWeatherSection);
}

function displayForecast(response) {
  section.innerText = "";
  const forecastSection = document.createElement('div');
  forecastSection.classList.add('forecast');
  
  forecastSection.innerHTML = `
  <section class="forecast-section">
  <h2 class="forecast-title">Today</h2>
  <p class="forecast-temp">${response.forecast.forecastday[0].day.avgtemp_c}°C</p>
  </section>
  <section class="forecast-section">
  <h2 class="forecast-title">${getDay().day+1} ${getDay().formatedMonth}</h2>
  <p class="forecast-temp">${response.forecast.forecastday[1].day.avgtemp_c}°C</p>
  </section>
  <section class="forecast-section">
  <h2 class="forecast-title">${getDay().day+2} ${getDay().formatedMonth}</h2>
  <p class="forecast-temp">${response.forecast.forecastday[2].day.avgtemp_c}°C</p>
  </section>
  <section class="forecast-section">
  <h2 class="forecast-title">${getDay().day+3} ${getDay().formatedMonth}</h2>
  <p class="forecast-temp">${response.forecast.forecastday[3].day.avgtemp_c}°C</p>
  </section>
  <section class="forecast-section">
  <h2 class="forecast-title">${getDay().day+4} ${getDay().formatedMonth}</h2>
  <p class="forecast-temp">${response.forecast.forecastday[4].day.avgtemp_c}°C</p>
  </section>`
  section.appendChild(forecastSection);
}

function displayMap(array) {
  section.innerText = "";
  const mapEl = document.createElement('div');
  mapEl.setAttribute('id', 'leaf-map');
  section.appendChild(mapEl);

  const map = L.map('leaf-map').setView(array, 10);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
  }).addTo(map);

  var marker = L.marker(array).addTo(map);

}

function description(r) {
  return `It's currently ${r.current.condition.text} in ${r.location.name}, the temperature is ${r.current.temp_c} °C, and ${r.current.wind_kph} km/h winds.`;
}

function clear() {
  const temperatureEl = document.getElementById('temperature');
  const windSpeedEl = document.getElementById('wind-speed');
  const descriptionEl = document.getElementById('description');
  const humidityEl = document.getElementById('humidity');
  temperatureEl.innerText = "";
  humidityEl.innerText = "";
  windSpeedEl.innerText = "";
  descriptionEl.innerText = "";
}

function activeNav(e) {
  navElements.forEach((el) => {
    el.classList.remove('selected');
  })
  e.currentTarget.classList.add('selected');
}

const navElements = document.querySelectorAll('.nav-element');
navElements.forEach((element) => {
  element.addEventListener('click', activeNav);
})

if ('geolocation' in navigator) {
  getLocation();
} else {
  log('No geolocation');
}

function getLocation() {
  navigator.geolocation.getCurrentPosition((pos) => {
    currentLocation = `${pos.coords.latitude},${pos.coords.longitude}`
    getCurrentWeather();
  }, (err) => {
    throw(new Error(err.message));
  });
}

function getDay() {
  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  const formatedMonth = format(new Date(year, month, day), 'MMM');
  return { day, formatedMonth };
}

function handleError() {
  section.innerText = "";
  const errorEl = document.createElement('div')
  errorEl.classList.add('error');
  errorEl.innerText = 'Something went wrong! Please try again.'
  section.appendChild(errorEl);
}