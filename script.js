const apiKey = "ed382637ed83e5508a8eed5925733c11";
let currentTemp;
let currentDate = new Date();
const conditionIcons = {
  day: {
    Thunderstorm: "fas fa-bolt-lightning",
    Drizzle: "fas fa-cloud-rain",
    Rain: "fas fa-cloud-showers-heavy",
    Snow: "fas fa-regular fa-snowflake",
    Mist: "fas fa-smog",
    Smoke: "fas fa-smog",
    Haze: "fas fa-smog",
    Dust: "fas fa-smog",
    Fog: "fas fa-smog",
    Sand: "fas fa-smog",
    Ash: "fas fa-smog",
    Squall: "fas fa-wind",
    Tornado: "fas fa-wind",
    Clear: "fas fa-sun",
    Clouds: "fas fa-cloud",
  },
  night: {
    Thunderstorm: "fa-solid fa-bolt-lightning",
    Drizzle: "fas fa-cloud-moon-rain",
    Rain: "fas fa-cloud-moon-rain",
    Snow: "fas fa-regular fa-snowflake",
    Mist: "fas fa-smog",
    Smoke: "fas fa-smog",
    Haze: "fas fa-smog",
    Dust: "fas fa-smog",
    Fog: "fas fa-smog",
    Sand: "fas fa-smog",
    Ash: "fas fa-smog",
    Squall: "fas fa-wind",
    Tornado: "fas fa-wind",
    Clear: "fas fa-moon",
    Clouds: "fas fa-cloud-moon",
  },
};

function setPosition(position) {
  let currentLat = position.coords.latitude;
  let currentLon = position.coords.longitude;

  let urlApi = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLon}&appid=${apiKey}&units=metric`;
  axios.get(urlApi).then(displayCurrentWeather);
}

function getForecast(latitude, longitude) {
  let urlApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&exclude=current,minutely,hourly,alerts&units=metric`;
  axios.get(urlApi).then(displayForecast);
}

function displayForecast(response) {
  response.data.daily
    .filter((_, index) => index >= 1 && index <= 5)
    .forEach((conditions, index) => {
      const date = new Date(conditions.dt * 1000);
      const weekDay = getWeekDayShort(date);
      const forecast = conditions.weather[0].main;
      const minTemp = Math.round(conditions.temp.min);
      const maxTemp = Math.round(conditions.temp.max);

      const conditionsIconElement = document.querySelector(
        `#forecast-day-${index + 1} > div > i`
      );
      const conditionsClass = conditionIcons["day"][forecast];

      conditionsIconElement.classList = conditionsClass;

      const conditionsTemperatureElement = document.querySelector(
        `#forecast-day-${index + 1} > div > p`
      );
      conditionsTemperatureElement.innerHTML = `${minTemp}° | ${maxTemp}°`;

      const weekDayElement = document.querySelector(
        `#forecast-day-${index + 1} > p`
      );
      weekDayElement.innerHTML = weekDay;
    });
}

function displayCurrentWeather(response) {
  getForecast(response.data.coord.lat, response.data.coord.lon);

  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;

  let conditionsIconElement = document.querySelector("#conditions > i");

  const dayNight = getDayNight(
    response.data.dt,
    response.data.sys.sunrise,
    response.data.sys.sunset
  );
  conditionsClass = conditionIcons[dayNight][response.data.weather[0].main];

  if (conditionsClass) {
    conditionsIconElement.classList = conditionsClass;
  }

  currentTemp = Math.round(response.data.main.temp);
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = `${currentTemp}`;

  let currentConditions = response.data.weather[0].description;
  let conditionsElement = document.querySelector("#current-conditions");
  conditionsElement.innerHTML = `${currentConditions}`;

  let currentFeelsLike = Math.round(response.data.main.feels_like);
  let feelsLikeElement = document.querySelector("#current-feels-like");
  feelsLikeElement.innerHTML = `${currentFeelsLike}`;

  let currentHumidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#current-humidity");
  humidityElement.innerHTML = `${currentHumidity}`;

  let currentWind = Math.round(response.data.wind.speed);
  let windElement = document.querySelector("#current-wind");
  windElement.innerHTML = `${currentWind}`;

  const timezoneOffset = new Date().getTimezoneOffset() * 60;
  currentDate = new Date(
    (response.data.dt + response.data.timezone + timezoneOffset) * 1000
  );

  setDateHtml(currentDate);
  greetPhrase(currentDate);
}

function greetPhrase(currentDate) {
  let hour = currentDate.getHours();
  let greeting;
  if (hour < 12) {
    greeting = "Good Morning!";
  } else if (hour < 18) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good evening!";
  }
  let greetingElement = document.querySelector("#greet-phrase");
  greetingElement.innerHTML = greeting;
}

function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");

  let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}&units=metric`;
  axios.get(urlApi).then(displayCurrentWeather);
}

//Week day

function getWeekDay(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentWeekDay = days[date.getDay()];
  return currentWeekDay;
}

function getWeekDayShort(date) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currentWeekDay = days[date.getDay()];
  return currentWeekDay;
}

function getDayNight(date, sunrise, sunset) {
  if (date < sunrise || date > sunset) {
    return "night";
  } else {
    return "day";
  }
}

//Hour and minutes
function getCurrentTime(date) {
  let hourTime = date.getHours();
  if (hourTime < 10) {
    hourTime = `0${hourTime}`;
  }
  let minuteTime = date.getMinutes();
  if (minuteTime < 10) {
    minuteTime = `0${minuteTime}`;
  }

  return `${hourTime} : ${minuteTime}`;
}

//date
function getCurrentMonth(date) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentMonth = months[date.getMonth()];
  let dayNumber = date.getDate();
  let currentYear = [date.getFullYear()];

  return `${currentMonth} ${dayNumber}, ${currentYear}`;
}

/**
 * Displays the current date in the HTML
 */
function setDateHtml(date) {
  let todayIs = document.querySelector("#current-weekday");
  todayIs.innerHTML = getWeekDay(date);

  let theTimeIs = document.querySelector("#current-time");
  theTimeIs.innerHTML = getCurrentTime(date);

  let thisMonth = document.querySelector("#current-month");
  thisMonth.innerHTML = getCurrentMonth(currentDate);
}

//degree change

function degreesFtoC() {
  const spanElement = document.querySelector("#current-temp");

  spanElement.innerHTML = currentTemp;
}

let celsiusElement = document.querySelector("#celsius");
celsiusElement.addEventListener("click", degreesFtoC);

function degreesCtoF() {
  let spanElement = document.querySelector("#current-temp");

  spanElement.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
}

function readCurrentPosition() {
  navigator.geolocation.getCurrentPosition(setPosition);
}

let fahrenheitElement = document.querySelector("#fahrenheit");
fahrenheitElement.addEventListener("click", degreesCtoF);

let searchQuery = document.querySelector("#search-button");
searchQuery.addEventListener("click", searchCity);

setDateHtml(currentDate);

let positionButton = document.querySelector("#location-button");
positionButton.addEventListener("click", readCurrentPosition);
