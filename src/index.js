import './styles.css';
const log = console.log;
const inputEl = document.getElementById('location');
const submit = document.getElementById('submit');
const form = document.getElementById('form')
const forecastEl = document.getElementById('forecast');
let currentLocation = "";
const section = document.querySelector('.section');

forecastEl.addEventListener('click', getForecast);

log('-- CONSOLE --');

form.addEventListener('submit', (e) => {
  e.preventDefault();
})
submit.addEventListener('click', () => {
  if (inputEl.value) {
    currentLocation = inputEl.value;
    getCurrentWeather();
  } else return;
});

function getCurrentWeather() {

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
    // const emptyEl = document.getElementById('empty');
    // emptyEl.classList.add('hidden');
  })
  .catch((error) => {
    clear();
    const errorEl = document.getElementById('error');
    errorEl.classList.remove('hidden');
  });

}

function getForecast() {

  const path = `http://api.weatherapi.com/v1/forecast.json?key=1c22c861d3d140b58e7202945230604&q=${currentLocation}&days=5`

  fetch(path, { mode: 'cors' })
  .then((response) => {
    return(response.json())
  })
  .then((response) => {
    displayForecast();
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
function displayForecast() {
  section.innerText = "";
  const forecastSection = document.createElement('div');
  forecastSection.classList.add('forecast');
  forecastSection.innerHTML = `
  <div id="forecast">
  <section>
    <h2>Today</h2>
    <p>25°C</p>
  </section>
  <section>
    <h2>Tomorrow</h2>
    <p>27°C</p>
  </section>
  <section>
    <h2>Day after tomorrow</h2>
    <p>28°C</p>
  </section>
  <section>
    <h2>Fourth day</h2>
    <p>24°C</p>
  </section>
  <section>
    <h2>Fifth day</h2>
    <p>23°C</p>
  </section>
  </div>`
  section.appendChild(forecastSection);
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