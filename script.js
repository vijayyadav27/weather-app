// DOM Elements
const cityInput = document.getElementById('city-input');
const submitBtn = document.getElementById('submit-btn');
const weatherInfo = document.getElementById('weather-info');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');

// API Configuration
const apiKey = 'd48443484e1f44f4e7a55de846261099';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    submitBtn.addEventListener('click', getWeatherData);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeatherData();
        }
    });
    
});

async function getWeatherData() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    showLoading();
    hideElements();
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData);
        
    } catch (error) {
        handleError(error);
    } finally {
        hideLoading();
    }
}

async function getWeatherDataByCity(city) {
    showLoading();
    hideElements();
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData);
        cityInput.value = city; // Update input field
        
    } catch (error) {
        handleError(error);
    } finally {
        hideLoading();
    }
}

async function fetchWeatherData(city) {
    const response = await fetch(
        `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`
    );
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 401) {
            throw new Error('Invalid API key. Please check your configuration.');
        } else {
            throw new Error('Failed to fetch weather data. Please try again later.');
        }
    }
    
    return await response.json();
}

function displayWeatherData(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    
    weatherInfo.style.display = 'block';
    errorMessage.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherInfo.style.display = 'none';
}

function handleError(error) {
    console.error('Error fetching weather data:', error);
    showError(error.message || 'An unexpected error occurred. Please try again.');
}

function showLoading() {
    loading.style.display = 'flex';
}

function hideLoading() {
    loading.style.display = 'none';
}

function hideElements() {
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'none';
}

async function getWeatherByCoords(lat, lon) {
    showLoading();
    hideElements();
    
    try {
        const response = await fetch(
            `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data for your location.');
        }
        
        const data = await response.json();
        displayWeatherData(data);
        cityInput.value = data.name; // Update input field with detected city
        
    } catch (error) {
        handleError(error);
    } finally {
        hideLoading();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getWeatherData,
        getWeatherByCoords,
        fetchWeatherData,
        displayWeatherData
    };
}
