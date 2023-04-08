import './styles.css';
const log = console.log;
const inputEl = document.getElementById('location');
const submit = document.getElementById('submit');
const form = document.getElementById('form')
const forecastEl = document.getElementById('forecast');

forecastEl.addEventListener('click', getForecast('tiflet'));

log('-- CONSOLE --');

form.addEventListener('submit', (e) => {
  e.preventDefault();
})
submit.addEventListener('click', () => {
  if (inputEl.value) {
    const location = inputEl.value;
    getCurrentWeather(location);
  } else return;
});

function getCurrentWeather(location) {

  const path = `http://api.weatherapi.com/v1/current.json?key=1c22c861d3d140b58e7202945230604&q=${location}`

  fetch(path, { mode: 'cors' })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((response) => {
    displayCurrentWeather(response);
    const errorEl = document.getElementById('error')
    const emptyEl = document.getElementById('empty')
    errorEl.classList.add('hidden');
    emptyEl.classList.add('hidden');
  })
  .catch((error) => {
    log(error)
    clear();
    errorEl.classList.remove('hidden');
    emptyEl.classList.remove('hidden');
  });

}

function getForecast(location) {

  const path = `http://api.weatherapi.com/v1/forecast.json?key=1c22c861d3d140b58e7202945230604&q=${location}`

  fetch(path, { mode: 'cors' })
  .then((response) => {
    log(response.json())
  })
}

function displayCurrentWeather(response) {
  const section = document.querySelector('.section');
  section.innerText = "";
  const currentSection = document.createElement('div');
  currentSection.classList.add('current');
  currentSection.innerHTML = `
  <p id="title"> The weather today:</p>
  <p id="error" class="hidden">Oops, something went wrong! Please try again.</p>
  <p id="empty">Insert your city name</p>
  <p id="description">${description(response)}</p>
  <p id="temperature">${response.current.temp_c} °C</p>
  <p id="humidity">${response.current.humidity} %</p>
  <p id="wind-speed">${response.current.wind_kph} km/h</p>`
  section.appendChild(currentSection);
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
    const coords = `${pos.coords.latitude},${pos.coords.longitude}`
    getCurrentWeather(coords);
  }, (err) => {
    throw(new Error(err.message));
  });
}