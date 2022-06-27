import moment from 'moment';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyBulz7y3vD9x1CMeSpWrof1oXEPqS0JT94',
    authDomain: 'weather-app-df5ba.firebaseapp.com',
    projectId: 'weather-app-df5ba',
    storageBucket: 'weather-app-df5ba.appspot.com',
    messagingSenderId: '959370567245',
    appId: '1:959370567245:web:38e0fa9d5504611b01c604',
    measurementId: 'G-47QHNBZ6CY',
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const refs = {
    min: document.getElementById('min'),
    max: document.getElementById('max'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    pressure: document.getElementById('pressure'),
    humidity: document.getElementById('humidity'),
    uvi: document.getElementById('uvi'),
    visibility: document.getElementById('visibility'),
};

const URL = 'https://api.openweathermap.org/data/2.5/onecall';
const API_KEY = 'c7efef58eaa1930baa9f2b67c324a631';

export function fetchData({ latitude, longitude }) {
    return fetch(`${URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`).then(
        response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        },
    );
}
export async function renderCurrent(current, element) {
    element.innerHTML = '';

    const { dt, temp, weather } = current;

    const iconUrl = await getIconUrl(weather[0].icon);
    const markup = `
            <h3 class="weather-current-title">${moment.unix(dt).format('dddd, DD MMMM')}</h3>
            <p class="weather-current-temp">${Math.round(temp)} °C</p>
            <img src="${iconUrl}" class="weather-current-icon">
            <p class="weather-current-desc">${weather[0].description}</p>
            `;

    element.insertAdjacentHTML('beforeend', markup);
}

export async function renderForecast(daily, element) {
    element.innerHTML = '';

    const week = daily.filter((el, idx) => idx !== 0);

    const markupArr = await Promise.all(
        week.map(async ({ dt, temp, weather }) => {
            const iconUrl = await getIconUrl(weather[0].icon);
            return `
                    <li class="weather-daily-item">
                        <h3 class="weather-daily-day">${moment.unix(dt).format('dddd')}</h3>
                        <p class="weather-daily-temp">${Math.round(temp.min)}° - ${Math.round(
                temp.max,
            )}°</p>
                        <div class="weather-icon-wrap">
                            <img src="${iconUrl}.svg" class="weather-daily-icon">
                        </div>
                    </li>
                `;
        }),
    );
    const markup = markupArr.join('');
    element.insertAdjacentHTML('beforeend', markup);
}

export async function renderHighlights(current, daily) {
    const { sunrise, sunset, pressure, humidity, uvi, visibility } = current;
    const {
        temp: { min, max },
    } = daily[0];

    refs.min.innerHTML = '';
    refs.max.innerHTML = '';
    refs.sunrise.innerHTML = '';
    refs.sunset.innerHTML = '';
    refs.pressure.innerHTML = '';
    refs.humidity.innerHTML = '';
    refs.uvi.innerHTML = '';
    refs.visibility.innerHTML = '';

    refs.min.insertAdjacentText('afterbegin', Math.round(min));
    refs.max.insertAdjacentText('afterbegin', Math.round(max));
    refs.sunrise.insertAdjacentText('beforeend', moment.unix(sunrise).format('HH:mm'));
    refs.sunset.insertAdjacentText('beforeend', moment.unix(sunset).format('HH:mm'));
    refs.pressure.insertAdjacentText('afterbegin', pressure);
    refs.humidity.insertAdjacentText('afterbegin', humidity);
    refs.uvi.insertAdjacentText('beforeend', uvi);
    refs.visibility.insertAdjacentText('afterbegin', visibility);
}

function getIconUrl(id) {
    const iconId = `${id}.svg`;
    return getDownloadURL(ref(storage, iconId)).then(url => {
        return url;
    });
}
