import mapboxgl from 'mapbox-gl';
import Clock from './components/clock';
import Weather from './components/weather';
import LocationService from './components/locationService';

const refs = {
    currentWeatherContainer: document.querySelector('.weather-current'),
    dailyWeatherContainer: document.querySelector('.weather-daily'),
    weatherHighlightsContainer: document.querySelector('.weather-highlights'),
    backdrop: document.querySelector('.backdrop'),
    form: document.querySelector('.form'),
};
refs.form.addEventListener('input', onFormInput);
refs.form.addEventListener('submit', onFormSubmit);
// ---------
let query = null;
function onFormInput(evt) {
    query = evt.target.value;
}
async function onFormSubmit(evt) {
    evt.preventDefault();

    showLoader();

    userLocationMarker.remove();
    const position = await getLatLongFromQuery(query);
    userLocationMarker = markUserLocation(position);
    handleWeatherFetchAndRender(position, refs);

    hideLoader();
}
// ---------
const mapProps = {
    accessToken:
        'pk.eyJ1IjoibmFwNHNvdiIsImEiOiJjbDNzb2cyYm0wMTEwM2pudnRkNmk4emsxIn0.oNh4Q1wL3kFLpjP6IFFWLQ',
    container: 'map',
    center: [30.5238, 50.45466],
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 12,
};

showLoader();

const locationService = new LocationService();
const clock = new Clock();
clock.run();

const weather = new Weather();

const map = new mapboxgl.Map(mapProps);
map.on('load', () => {
    map.addControl(new mapboxgl.NavigationControl());
});
let userLocationMarker = null;
runApp(refs);

async function runApp(refs) {
    try {
        const position = await locationService.getPosition().then(response => {
            return {
                latitude: response.coords.latitude,
                longitude: response.coords.longitude,
            };
        });

        userLocationMarker = markUserLocation(position);
        handleWeatherFetchAndRender(position, refs);
        hideLoader();
    } catch (error) {
        const position = { latitude: 50.45466, longitude: 30.5238 };
        handleWeatherFetchAndRender(position, refs);
        hideLoader();
    }
}

function markUserLocation({ latitude, longitude }) {
    let marker = new mapboxgl.Marker({ color: '#cecece' })
        .setLngLat([longitude, latitude])
        .addTo(map);
    map.flyTo({
        center: [longitude, latitude],
    });
    return marker;
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

function getLatLongFromQuery(query) {
    return fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=pk.eyJ1IjoibmFwNHNvdiIsImEiOiJjbDNzb2cyYm0wMTEwM2pudnRkNmk4emsxIn0.oNh4Q1wL3kFLpjP6IFFWLQ&types=place`,
    )
        .then(res => {
            if (!res.ok) {
                throw new Error();
            }
            return res.json();
        })
        .then(data => {
            console.log(data.features[0].center);
            return {
                latitude: data.features[0].center[1],
                longitude: data.features[0].center[0],
            };
        });
}

function showLoader() {
    refs.backdrop.classList.remove('is-hidden');
}
function hideLoader() {
    refs.backdrop.classList.add('is-hidden');
}