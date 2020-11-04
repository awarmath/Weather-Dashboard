$(document).ready(function () {
    var appID = "cbdc225bcf486c5d6a5af106323b6350";
    var weather = "";
    var city = "";
    var current_date = moment().format("L");
    var search_history = JSON.parse(localStorage.getItem("cities")) === null ? [] : JSON.parse(localStorage.getItem("cities"));
  
    displaySearchHistory();
    function getWeather() {
        if ($(this).attr("id") === "search-city") {
            city = $("#city").val();
        } else {
            city = $(this).text();
        }
        weather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + appID;
        if (search_history.indexOf(city) === -1) {
  
            search_history.push(city);
        }
  
        localStorage.setItem("cities", JSON.stringify(search_history));
  
        $.getJSON(weather, function (json) {
            var temp = (json.main.temp - 273.15) * (9 / 5) + 32;
            var windspeed = json.wind.speed * 2.237;
  
            $("#current-city").text(json.name + " " + current_date);
            $("#weather-img").attr("src", "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temp").text(temp.toFixed(0) + "°F");
            $("#humidity").text(json.main.humidity + "%");
            $("#windspeed").text(windspeed.toFixed(0) + " " + "mph");
            $("#uv-index").text(uvindex.toFixed(0));
        });
    }
  
    function Forecast() {
        var five_day_forecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&APPID=" + appID;
       
        var day_counter = 1;
  
        $.ajax({
            url: five_day_forecast,
            method: "GET"
        }).then(function (response) {
  
  
            for (var i = 0; i < response.list.length; i++) {
                //change each text area here
                var date_and_time = response.list[i].dt_txt;
                var date = date_and_time.split(" ")[0];
                var time = date_and_time.split(" ")[1];
  
                if (time === "15:00:00") {
                    var year = date.split("-")[0];
                    var month = date.split("-")[1];
                    var day = date.split("-")[2];
                    $("#day-" + day_counter).children(".card-date").text(month + "/" + day + "/" + year);
                    $("#day-" + day_counter).children(".weather-icon").attr("src", "https://api.openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    $("#day-" + day_counter).children(".weather-temp").text("Temp: " + ((response.list[i].main.temp - 273.15) * (9 / 5) + 32).toFixed(0) + "°F");
                    $("#day-" + day_counter).children(".weather-humidity").text("Humidity: " + response.list[i].main.humidity + "%");
                    day_counter++;
                }
            }
        });
    }
  
    function displaySearchHistory() {
  
        $("#search-history").empty();
        search_history.forEach(function (city) {
  
            //check to see if an entry is already part of search history, and don't add a second version of it
            var history_item = $("<li>");
  
            history_item.addClass("list-group-item btn btn-light");
            history_item.text(city);
  
            $("#search-history").prepend(history_item);
        });
        $(".btn").click(getWeather);
        $(".btn").click(Forecast);
  
    }
    //put the listener on btn class so that all buttons have listener
    $("#search-city").click(displaySearchHistory);
  
  });
