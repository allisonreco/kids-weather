const apiKey = "ed382637ed83e5508a8eed5925733c11";
let currentTemp;
let currentDate = new Date();
let isPlaying = false;
const initialLocation = "Berlin";
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
const messages = {
  morning: "Good morning sunshine!",
  afternoon: "Good afternoon explorer!",
  evening: "Good evening dreamer!",
  night: "Good night astronaut!",
};
const phrases = {
  morning:
    "You're braver than you believe, stronger than you seem, and smarter than you think.",
  afternoon: "Never lose sight of your sense of wonder!",
  evening: "If you can dream it, you can do it!",
  night:
    "Reach for the stars, spread your wings and fly. You never know what you can do until you try!",
};

const backgroundImages = {
  morning: "images/1.png",
  afternoon: "images/2.png",
  evening: "images/3.png",
  night: "images/4.png",
};
const sounds = {
  morning: "sounds/morning.mp3",
  afternoon: "sounds/afternoon.mp3",
  evening: "sounds/evening.mp3",
  night: "sounds/night.mp3",
};
const panelColors = {
  morning: [
    "#96D7DD",
    "#7EB1C4",
    "#90ADC6",
    "#CCD5AE",
    "#DFCAB2",
    "#93A491",
    "#C9E4DE",
  ],
  afternoon: [
    "#aecce6",
    "#eacbbc",
    "#D6D0C6",
    "#d4ddc9",
    "#DFCAB2",
    "#aecce5",
    "#c8c2b0",
  ],
  evening: [
    "#E5989B",
    "#EAAC8B",
    "#B5838D",
    "#6D6875",
    "#B79F91",
    "#E5989B",
    "#B5838D",
  ],
  night: [
    "#556573",
    "#7B665B",
    "#C8B8A4",
    "#7D8672",
    "#BF9E75",
    "#556573",
    "#8C7D70",
  ],
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
      const weekDay = getWeekDay(date);
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
  currentCity.innerHTML = `<a href="https://www.google.com/maps/@${response.data.coord.lat},${response.data.coord.lon},15z" target="_blank" rel="noopener noreferrer">${response.data.name}</a>`;

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
  setTimeofDayData(
    currentDate,
    new Date(
      (response.data.sys.sunrise + response.data.timezone + timezoneOffset) *
        1000
    ),
    new Date(
      (response.data.sys.sunset + response.data.timezone + timezoneOffset) *
        1000
    )
  );
}

function setTimeofDayData(currentDate, sunriseDate, sunsetDate) {
  let timeOfDay = getTimeOfDay(currentDate, sunriseDate, sunsetDate);

  const greeting = messages[timeOfDay];
  const backgroundImage = backgroundImages[timeOfDay];
  const colorSet = panelColors[timeOfDay];
  const sound = sounds[timeOfDay];
  const phrase = phrases[timeOfDay];

  let phraseElement = document.querySelector(".summary-four");
  phraseElement.innerHTML = phrase;

  let greetingElement = document.querySelector("#greet-phrase");
  greetingElement.innerHTML = greeting;

  let bodyElement = document.querySelector("body");
  bodyElement.style.backgroundImage = `url(${backgroundImage})`;

  let rootElement = document.documentElement;

  colorSet.forEach((color, index) => {
    rootElement.style.setProperty(`--color-text-panel-${index + 1}`, color);
  });

  let audioSourceElement = document.querySelector("#audio");
  audioSourceElement.src = sound;
  audioSourceElement.load();
  audioPause();
}

function setInitialLocation() {
  let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${initialLocation}&appid=${apiKey}&units=metric`;
  axios
    .get(urlApi)
    .then(displayCurrentWeather)
    .catch((error) => {
      console.error(error);
      alert(`Could not find location ${initialLocation}`);
    });
}

function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  const location = searchInput.value || initialLocation;

  let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  axios
    .get(urlApi)
    .then(displayCurrentWeather)
    .catch((error) => {
      console.error(error);
      alert(`Could not find location ${searchInput.value}`);
    });
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

function getDayNight(date, sunrise, sunset) {
  if (date < sunrise || date > sunset) {
    return "night";
  } else {
    return "day";
  }
}

function getTimeOfDay(date, sunrise, sunset) {
  const noon = new Date(currentDate);
  noon.setHours(12, 0, 0);
  const eveningEnd = new Date(sunset);
  eveningEnd.setTime(eveningEnd.getTime() + 3 * 60 * 60 * 1000);

  const timesOfDay = [
    {
      from: 0,
      until: sunrise,
      time: "night",
    },
    {
      from: sunrise,
      until: noon,
      time: "morning",
    },
    {
      from: noon,
      until: sunset,
      time: "afternoon",
    },
    {
      from: sunset,
      until: eveningEnd,
      time: "evening",
    },
    {
      from: eveningEnd,
      until: Number.MAX_SAFE_INTEGER,
      time: "night",
    },
  ];

  return timesOfDay.find(
    (timeOfDay) => date >= timeOfDay.from && date < timeOfDay.until
  ).time;
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

function audioPlay() {
  const audioElement = document.querySelector("#audio");
  const iconElement = document.querySelector("#play-pause-button > i");

  audioElement.play();
  isPlaying = true;
  iconElement.classList.replace("fa-play", "fa-pause");
}

function audioPause() {
  const audioElement = document.querySelector("#audio");
  const iconElement = document.querySelector("#play-pause-button > i");

  audioElement.pause();
  isPlaying = false;
  iconElement.classList.replace("fa-pause", "fa-play");
}

function handleAudioPlayPause() {
  if (isPlaying) {
    audioPause();
  } else {
    audioPlay();
  }
}

function readCurrentPosition() {
  navigator.geolocation.getCurrentPosition(setPosition);
}

window.addEventListener("load", () => {
  const searchQuery = document.querySelector("#search-button");
  searchQuery.addEventListener("click", searchCity);

  setDateHtml(currentDate);

  const positionButton = document.querySelector("#location-button");
  positionButton.addEventListener("click", readCurrentPosition);

  setInitialLocation();
});
