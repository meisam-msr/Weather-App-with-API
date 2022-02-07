import { apiKey } from "./getLocation";

const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.querySelector("#locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

let cityInput = "London";

cities.forEach((city) => {
    city.addEventListener("click", (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
    });
});

form.addEventListener("submit", (e) => {
    if (search.value.length == 0) {
        alert("Please type a city name");
    } else {
        cityInput = search.value;
        fetchWeatherData();
        search.value = "";
    }
    e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
    const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekDay[new Date(`${day}/${month}/${year}`).getDay()];
}

function nameOfMonth(day, month, year) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    return monthNames[new Date(`${day}/${month}/${year}`).getMonth()];
}

function fetchWeatherData() {
    app.style.opacity = "0";
    axios
    .get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}=${cityInput}`)
    .then(res => res.data)
    .then(data => {
        console.log(data);

        temp.innerHTML = data.current.temp_c + "&#176";
        conditionOutput.innerHTML = data.current.condition.text;
        // date formatting
        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);
        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)}, ${d}  ${nameOfMonth(d, m, y)} ${y}`;
        timeOutput.innerHTML = time;
        
        nameOutput.innerHTML = data.location.name;
        // API icon id
        //  download API icons from "https://cdn.weatherapi.com/weather.zip"
        const iconId = data.current.condition.icon.substr(
            "//cdn.weatherapi.com/weather/64x64/".length);
        icon.src = "./assets/icons/" + iconId;
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        let timeOfDay = "day";
        const code = data.current.condition.code;

        if (!data.current.is_day) {
            timeOfDay = "night";
        }
        // clear condition codes 
        // Condition list URL (JSON) => "https://www.weatherapi.com/docs/weather_conditions.json"
        if (code == 1000) {
            app.style.backgroundImage = `
            url(/assets/images/${timeOfDay}/clear.jpg)`;
            btn.style.background = "#e5ba92";
            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        }//cloudy condition codes 
        else if (
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282
            ) {
                app.style.backgroundImage = `url(/assets/images/${timeOfDay}/cloudy.jpg)`;
                btn.style.background = "#fa6d1b";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
            }//rainy condition codes 
            else if (
                code == 1063 ||
                code == 1069 ||
                code == 1072 ||
                code == 1150 ||
                code == 1153 ||
                code == 1180 ||
                code == 1183 ||
                code == 1186 ||
                code == 1189 ||
                code == 1192 ||
                code == 1195 ||
                code == 1204 ||
                code == 1207 ||
                code == 1240 ||
                code == 1243 ||
                code == 1246 ||
                code == 1249 ||
                code == 1252
            ) {
                app.style.backgroundImage = `url(/assets/images/${timeOfDay}/rainy.jpg)`;
                btn.style.background = "#647d75";
                if (timeOfDay == "night") {
                    btn.style.background = "#325c80";
                }
            } //snowy condition codes 
            else {
                app.style.backgroundImage = `url(/assets/images/${timeOfDay}/snowy.jpg)`;
                btn.style.background = "#4d72aa";
                if (timeOfDay == "night") {
                    btn.style.background = "#1b1b1b";
                }
            }
            app.style.opacity = "1";
    })
    .catch(() => {
        alert("City not found, please try again");
        app.style.opacity = "1";
    });
}
// call fetchWeatherData function to first loading page (The City of London is the default city)
fetchWeatherData();