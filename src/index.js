import mapboxgl from 'mapbox-gl';
import Handlebars from 'handlebars';
import Clock from './components/clock';
import Weather from './components/weather';
import LocationService from './components/locationService';

const refs = {
    currentWeatherContainer: document.querySelector('.weather-current'),
    dailyWeatherContainer: document.querySelector('.weather-daily'),
    weatherHighlightsContainer: document.querySelector('.weather-highlights'),
};
const mapProps = {
    accessToken:
        'pk.eyJ1IjoibmFwNHNvdiIsImEiOiJjbDNzb2cyYm0wMTEwM2pudnRkNmk4emsxIn0.oNh4Q1wL3kFLpjP6IFFWLQ',
    container: 'map',
    center: [30.5238, 50.45466],
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 12,
};
const locationService = new LocationService();

const clock = new Clock();
clock.run();

const weather = new Weather();

const map = new mapboxgl.Map(mapProps);
map.on('load', () => {
    map.addControl(new mapboxgl.NavigationControl());
});

runApp(refs);

async function runApp(refs) {
    try {
        const position = await locationService.getPosition().then(response => {
            return {
                latitude: response.coords.latitude,
                longitude: response.coords.longitude,
            };
        });

        markUserLocation(position);
        handleWeatherFetchAndRender(position, refs);
    } catch (error) {
        console.log(error);
    }
}
function markUserLocation({ latitude, longitude }) {
    let marker = new mapboxgl.Marker({ color: '#cecece' })
        .setLngLat([longitude, latitude])
        .addTo(map);
    map.flyTo({
        center: [longitude, latitude],
    });
}

async function handleWeatherFetchAndRender(
    position,
    { currentWeatherContainer, dailyWeatherContainer, weatherHighlightsContainer },
) {
    const { current, daily } = await weather.fetchData(position);

    weather.renderCurrent(current, currentWeatherContainer);
    weather.renderForecast(daily, dailyWeatherContainer);
    weather.renderHighlights(current, daily, weatherHighlightsContainer);
}
