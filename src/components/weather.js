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

class Weather {
    URL = 'https://api.openweathermap.org/data/2.5/onecall';
    API_KEY = 'c7efef58eaa1930baa9f2b67c324a631';

    fetchData = ({ latitude, longitude }) => {
        return fetch(
            `${this.URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.API_KEY}`,
        ).then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        });
    };

    async renderCurrent(current, element) {
        element.innerHTML = '';

        const { dt, temp, weather } = current;

        const iconUrl = await this.getIconUrl(weather[0].icon);
        const markup = `
            <p>${moment.unix(dt).format('dddd, DD MMMM')}</p>
            <p>${Math.round(temp)}°</p>
            <img src="${iconUrl}" class="weather-current-icon">
            <p>${weather[0].description}</p>
            `;

        element.insertAdjacentHTML('beforeend', markup);
    }

    async renderForecast(daily, element) {
        element.innerHTML = '';

        const week = daily.filter((el, idx) => idx !== 0);

        const markupArr = await Promise.all(
            week.map(async ({ dt, temp, weather }) => {
                const iconUrl = await this.getIconUrl(weather[0].icon);
                return `
                    <li class="weather-daily-item">
                        <p>${moment.unix(dt).format('dddd')}</p>
                        <p>${Math.round(temp.min)}° - ${Math.round(temp.max)}°</p>
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

    renderHighlights = (current, daily, element) => {
        element.innerHTML = '';

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

        element.insertAdjacentHTML('beforeend', markup);
    };

    getIconUrl = id => {
        const iconId = `${id}.svg`;
        return getDownloadURL(ref(storage, iconId)).then(url => {
            return url;
        });
    };
}

export default Weather;
