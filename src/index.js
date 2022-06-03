import mapboxgl from 'mapbox-gl';
import moment from 'moment';

const refs = {
    currentWeatherContainer: document.querySelector('.weather-current'),
    dailyWeatherContainer: document.querySelector('.weather-daily'),
};

const map = new mapboxgl.Map({
    accessToken:
        'pk.eyJ1IjoibmFwNHNvdiIsImEiOiJjbDNzb2cyYm0wMTEwM2pudnRkNmk4emsxIn0.oNh4Q1wL3kFLpjP6IFFWLQ',
    container: 'map',
    center: [30.5238, 50.45466],
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 12,
});
map.on('load', () => {
    map.addControl(new mapboxgl.NavigationControl());
});

getPosition()
    .then(response => {
        return {
            latitude: response.coords.latitude,
            longitude: response.coords.longitude,
        };
    })
    .then(position => {
        createMarker(position);
        recenterMap(position);
        return position;
    })
    .then(fetchWeatherData)
    .then(renderWeatherData)
    .catch(error => {
        console.log(error);
        fetchWeatherData({ latitude: 50.45466, longitude: 30.5238 }).then(renderWeatherData);
    });

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function createMarker({ latitude, longitude }) {
    let marker = new mapboxgl.Marker({ color: '#cecece' })
        .setLngLat([longitude, latitude])
        .addTo(map);
}
function recenterMap({ latitude, longitude }) {
    map.flyTo({
        center: [longitude, latitude],
    });
}
function fetchWeatherData({ latitude, longitude }) {
    const URL = 'https://api.openweathermap.org/data/2.5/onecall';
    const API_KEY = 'c7efef58eaa1930baa9f2b67c324a631';
    return fetch(`${URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`).then(
        response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        },
    );
}

function renderWeatherData({ current, daily }) {
    renderCurrentWeather(current);
    renderForecast(daily);
}
function renderCurrentWeather({ dt, temp, pressure, weather }) {
    const markup = `
    <p>${moment.unix(dt).format('dddd, DD MMMM')}</p>
    <p>${Math.round(temp)}°</p>
    <img src="http://openweathermap.org/img/w/${weather[0].icon}.png" class="weather-current-icon">
    <p>${weather[0].description}</p>
    <p>${pressure} hPa</p>
    `;

    refs.currentWeatherContainer.insertAdjacentHTML('beforeend', markup);
}
function renderForecast(daily) {
    const markup = daily
        .filter((el, idx) => idx !== 0)
        .map(
            ({ dt, temp, weather }) => `
        <li class="weather-daily-item">
            <p>${moment.unix(dt).format('dddd')}</p>
            <p>${Math.round(temp.min)}° - ${Math.round(temp.max)}°</p>
            <div class="weather-icon-wrap">
                <img src="http://openweathermap.org/img/w/${
                    weather[0].icon
                }.png" class="weather-daily-icon">
                <p>${weather[0].description}</p>
            </div>
        </li>
    `,
        )
        .join('');

    refs.dailyWeatherContainer.insertAdjacentHTML('beforeend', markup);
}

const deg = 6;
// 360 / (12 * 5);

const hr = document.querySelector('#hr');
const mn = document.querySelector('#mn');
const sc = document.querySelector('#sc');

setInterval(() => {
    let day = new Date();
    let hh = day.getHours() * 30;
    let mm = day.getMinutes() * deg;
    let ss = day.getSeconds() * deg;
    let msec = day.getMilliseconds();

    // VERY IMPORTANT STEP:

    hr.style.transform = `rotateZ(${hh + mm / 12}deg)`;
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;

    // gives the smooth transitioning effect, but there's a bug here!
    // sc.style.transition = `1s`;
});
