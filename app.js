if (localStorage.getItem('city') === null) {
  localStorage.setItem('city', 'Tashkent');
}

let apiKey = '6eb76680badd43d483a143528181409',
  defaultCity = localStorage.getItem('city'),
  conditionTextToday,
  conditionImgToday,
  temperatureToday,
  humidityToday,
  windToday,
  conditionCode,
  isDay,
  country,
  localTime;

function getCurrentWeather() {
  fetch(`http://api.apixu.com/v1/forecast.json?key=${apiKey}&q=${defaultCity}`)
    .then(response => response.json())
    .then(data => {
      country = data.location.country;
      conditionTextToday = data.current.condition.text;
      // conditionImgToday.setAttribute('src', data.current.condition.icon);
      conditionCode = data.current.condition.code;
      isDay = data.current.is_day;
      temperatureToday = data.current.temp_c;
      humidityToday = data.current.humidity;
      windToday = [data.current.wind_dir, data.current.wind_kph];
      lastUpdated = data.current.last_updated;
    })
    .then(() => paintToday())
    .then(() => getImage());
}

getCurrentWeather();

function paintToday() {
  let a = lastUpdated.split(' ');

  document.getElementById('todayHeader').innerHTML = `Today ${a[0]}, last updated at ${a[1]}`;
  document.getElementById('city').innerHTML = `${defaultCity}, ${country}`;
  document.getElementById('conditionTextToday').innerHTML = conditionTextToday;

  document.getElementById('temperatureToday').innerHTML = `Temperature: ${temperatureToday} C`;
  document.getElementById('humidityToday').innerHTML = `Humidity: ${humidityToday} %`;
  document.getElementById('windToday').innerHTML = `Wind Direction: ${windToday[0]}, Wind Speed: ${windToday[1]} kph`;
}

function getImage() {
  fetch("http://www.apixu.com/doc/Apixu_weather_conditions.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(item => {
        if (item.code === conditionCode) {
          if (isDay == 1) {
            document.getElementById('conditionImgToday').setAttribute('src', `images/day/${item.icon}.png`);
          } else {
            document.getElementById('conditionImgToday').setAttribute('src', `images/night/${item.icon}.png`);
          }
        }
      })
    })
    .catch(err => {
      alert(err);
    })
}

const changeButton = document.getElementById('w-change-btn');
changeButton.addEventListener('click', (e) => {
  if (document.getElementById('modalCity').value === '') {
    alert("Please fill the input field");
  } else {
    defaultCity = document.getElementById('modalCity').value;
    document.getElementById('modalCity').value = '';
    localStorage.setItem('city', defaultCity);
    $('#locModal').modal('hide');
    getCurrentWeather();
  }
});