import mapboxgl from 'mapbox-gl';
import moment from 'moment';
import axios from 'axios';
import Clock from './components/clock';

const refs = {
    currentWeatherContainer: document.querySelector('.weather-current'),
    dailyWeatherContainer: document.querySelector('.weather-daily'),
    weatherHighlightsContainer: document.querySelector('.weather-highlights'),
};

const clock = new Clock();
clock.run();

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
async function fetchWeatherData({ latitude, longitude }) {
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
    renderWeatherHighlights(current, daily);
}
function renderCurrentWeather({ dt, temp, weather }) {
    const markup = `
    <p>${moment.unix(dt).format('dddd, DD MMMM')}</p>
    <p>${Math.round(temp)}°</p>

    <img src="http://openweathermap.org/img/w/${weather[0].icon}.png" class="weather-current-icon">
    <p>${weather[0].description}</p>
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
            </div>
        </li>
    `,
        )
        .join('');

    refs.dailyWeatherContainer.insertAdjacentHTML('beforeend', markup);
}

function renderWeatherHighlights(current, daily) {
    const { sunrise, sunset, pressure, humidity, uvi, visibility } = current;
    const {
        temp: { min, max },
    } = daily[0];

    const markup = `
    <li class="weather-highlights-item">
        <p>Min & max temp</p>
        <p>Min ${Math.round(min)}</p>
        <p>Max ${Math.round(max)}</p>
    </li>
    <li class="weather-highlights-item">
        <p>Sunrise & sunset</p>
        <p>Sunrise ${moment.unix(sunrise).format('HH:mm')}</p>
        <p>Sunset ${moment.unix(sunset).format('HH:mm')}</p>
    </li>
    <li class="weather-highlights-item">
        <p>Pressure</p>
        <p>${pressure} hPa</p>
    </li>
    <li class="weather-highlights-item">
        <p>Humidity</p>
        <p>${humidity} %</p>
    </li>
    <li class="weather-highlights-item">
        <p>UV Index</p>
        <p>${uvi}</p>
    </li>
    <li class="weather-highlights-item">
        <p>Visibility</p>
        <p>${visibility} m</p>
    </li>
    `;

    refs.weatherHighlightsContainer.insertAdjacentHTML('beforeend', markup);
}
