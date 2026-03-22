function getWeather() {

  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name...");
    return;
  }
  
  const apiKey = "101f4f525974e000085e171e000d32a4";  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;


  const xhr = new XMLHttpRequest();  
  xhr.open("GET", url);


  xhr.onload = function () {
    if (xhr.status === 200) {

      const data = JSON.parse(xhr.responseText);

      // console.log("************here*************8");
      // console.log(data);

      document.getElementById("city").textContent = data.name;
      document.getElementById("country").textContent = `- ${data.sys.country}`;
      document.getElementById("temp").textContent = `Temperature: ${data.main.temp} °C`;
      document.getElementById("condition").textContent = `Condition: ${data.weather[0].main}`;
      document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;

      document.getElementById("weatherCard").classList.remove("d-none");
      document.getElementById("noResult").classList.add("d-none");
    }

    else {
      document.getElementById("weatherCard").classList.add("d-none");
      document.getElementById("noResult").classList.remove("d-none");
    }

  };

  xhr.send();
}