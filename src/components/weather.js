import moment from 'moment';

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

    renderCurrent = (current, element) => {
        const { dt, temp, weather } = current;
        const markup = `
            <p>${moment.unix(dt).format('dddd, DD MMMM')}</p>
            <p>${Math.round(temp)}°</p>

            <img src="http://openweathermap.org/img/w/${
                weather[0].icon
            }.png" class="weather-current-icon">
            <p>${weather[0].description}</p>
            `;

        element.insertAdjacentHTML('beforeend', markup);
    };

    renderForecast = (daily, element) => {
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

        element.insertAdjacentHTML('beforeend', markup);
    };

    renderHighlights = (current, daily, element) => {
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
}

export default Weather;
