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
const apiKey = '1d13da60df2b32a08a92f7abb40fe5a0';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    submitBtn.addEventListener('click', getWeatherData);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeatherData();
        }
    });
    
    // Optional: Load weather for default city on startup
    // getWeatherDataByCity('London');
});

// Function to fetch weather data
async function getWeatherData() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    // Show loading, hide other elements
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

// Function to fetch weather data by city name (can be used for default loading)
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

// API call function
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

// Function to display weather data
function displayWeatherData(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Additional weather details
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    
    // Show weather info
    weatherInfo.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Function to show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherInfo.style.display = 'none';
}

// Function to handle errors
function handleError(error) {
    console.error('Error fetching weather data:', error);
    showError(error.message || 'An unexpected error occurred. Please try again.');
}

// Loading state functions
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

// Utility function to get weather by coordinates (for future geolocation feature)
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

// Export functions for potential module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getWeatherData,
        getWeatherByCoords,
        fetchWeatherData,
        displayWeatherData
    };
}
