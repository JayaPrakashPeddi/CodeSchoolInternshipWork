function getWeather() {

  const spin = document.getElementsByClassName("searchBtn");
  const city = document.getElementById("cityInput").value;


  if (!city) {
    alert("Please enter a city name...");
    return;
  }
  
  const apiKey = "101f4f525974e000085e171e000d32a4";  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;


  const xhr = new XMLHttpRequest();

    xhr.open("GET", url);


    xhr.onerror= function(){
      console.error("request failed");
    };

    xhr.onprogress=function(){
        spin.classList.toggle("d-none");
    }

    xhr.onload = function () {
    if (xhr.status === 200) {

      const data = JSON.parse(xhr.responseText);

      // console.log("************here*************8");
      console.log(data);
      // console.log(localStorage);
      let tempIcon;
      let currentTemp = Number(data.main.temp);
      // console.log(currentTemp, currentTemp<13)
      if (currentTemp<11){
        tempIcon = `<i class="bi bi-thermometer-snow" style="color:blue"></i>`
      }
      else if (currentTemp<40){
        tempIcon = `<i class="bi bi-thermometer-sun" style="color: orange"></i>`
      }
      else{
        tempIcon = `<i class="bi bi-thermometer-high" style="color:red"></i>`
      }
      
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      document.getElementById("city").textContent = data.name;
      document.getElementById("country").textContent = `- ${data.sys.country}`;
      document.getElementById("weatherImageIcons").setAttribute("src",iconUrl);
      document.getElementById("temp").innerHTML = `Temperature: ${tempIcon}${data.main.temp} °C`;
      document.getElementById("condition").innerHTML = `Condition: ${data.weather[0].main}`;
      document.getElementById("humidity").innerHTML = `Humidity: <i class="bi bi-moisture"></i> ${data.main.humidity}%`;


      const mapCoords=`https://www.google.com/maps?q=${data.coord.lat},${data.coord.lon}&z=15&output=embed`;
      document.getElementById("map").setAttribute("src",mapCoords);

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