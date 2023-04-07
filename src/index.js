import './styles.css';
const log = console.log;
const temperatureEl = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const descriptionEl = document.getElementById('description');
const inputEl = document.getElementById('location');
const submit = document.getElementById('submit');
const form = document.getElementById('form')
const errorEl = document.getElementById('error')

log('-- CONSOLE --');

form.addEventListener('submit', (e) => {
  e.preventDefault();
})
submit.addEventListener('click', search);

function search() {
  const city = inputEl.value;
  if (inputEl.value === "") {
    return
  }

  const path = `http://api.weatherapi.com/v1/current.json?key=1c22c861d3d140b58e7202945230604&q=${city}`
  log(path)
  fetch(path, { mode: 'cors' })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((response) => {
    displayInfo(response);
    errorEl.classList.add('hidden')
  })
  .catch((error) => {
    log(error)
    clear();
    errorEl.classList.remove('hidden')
  });

}

function displayInfo(response) {
  log(response);
  temperatureEl.innerText = response.current.temp_c + " °C";
  humidityEl.innerText = response.current.humidity + " %";
  windSpeedEl.innerText = response.current.wind_kph + " km/h"
  descriptionEl.innerText = description(response);
}
function description(r) {
  return `It's currently ${r.current.condition.text} in ${r.location.name}, the temperature is ${r.current.temp_c} °C, and ${r.current.wind_kph} km/h winds.`;
}
function clear() {
  temperatureEl.innerText = "";
  humidityEl.innerText = "";
  windSpeedEl.innerText = "";
  descriptionEl.innerText = "";
}