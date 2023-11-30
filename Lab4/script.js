document.addEventListener("DOMContentLoaded", function () {
  const currentLocationBtn = document.getElementById("currentLocationBtn");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const currentDayInfoContainer = document.getElementById("currentDayInfo");
  const nextDayInfoContainer = document.getElementById("nextDayInfo");
  const currentDayBox = document.getElementById("currentDayBox");
  const nextDayBox = document.getElementById("nextDayBox");
  const errorDisplay = document.getElementById("errorDisplay");

  currentLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchSunriseSunsetData(latitude, longitude, getCurrentDate(), false);
          fetchSunriseSunsetData(latitude, longitude, getNextDayDate(), true);
        },
        (error) => {
          displayError("Error getting the current location. Please try again.");
        }
      );
    } else {
      displayError("Geolocation is not supported by this browser.");
    }
  });

  searchBtn.addEventListener("click", () => {
    const locationQuery = searchInput.value;
    const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
      locationQuery
    )}&_=${Date.now()}`;

    fetch(geocodeApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Geocode API request failed with status ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Geocode API Data:", data);

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          fetchSunriseSunsetData(lat, lon, getCurrentDate(), false);
          fetchSunriseSunsetData(lat, lon, getNextDayDate(), true);
        } else {
          displayError(
            "Location not found or invalid response from the geocode API."
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching data from the geocode API:",
          error.message
        );
        displayError(
          "An error occurred while fetching data. Please try again."
        );
      });
  });

  function fetchSunriseSunsetData(latitude, longitude, date, isNextDay) {
    const apiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Sunrise Sunset API Response:", data); // Log the entire response
        updateDashboard(data, isNextDay);
      })
      .catch((error) => {
        displayError("Error fetching data from the Sunrise Sunset API.");
      });
  }

  function updateDashboard(data, isNextDay) {
    const dayInfo = getDayInfo(data.results);
    const additionalTimes = getAdditionalTimes(data.results);

    if (isNextDay) {
      nextDayInfoContainer.innerHTML = `
        <p><i class="fas fa-sun" style="color: #ffcc00;"></i> Sunrise: ${dayInfo.sunrise}</p>
        <p><i class="fas fa-moon" style="color: #ff6600;"></i> Sunset: ${dayInfo.sunset}</p>
        <p><i class="far fa-sun" style="color: #F0EAD6;"></i> Dawn: ${additionalTimes.dawn}</p>
        <p><i class="far fa-moon" style="color: #0d0d3e;"></i> Dusk: ${additionalTimes.dusk}</p>
        <p><i class="fas fa-sun" style="color: #ffcc00;"></i> Solar Noon: ${additionalTimes.solarNoon}</p>
        <p><i class="far fa-clock" style="color: #6666cc;"></i> Day Length: ${dayInfo.dayLength}</p>
      `;
      nextDayBox.classList.remove("hidden"); // Show the box
    } else {
      currentDayInfoContainer.innerHTML = `
        <p><i class="fas fa-sun" style="color: #ffcc00;"></i> Sunrise: ${dayInfo.sunrise}</p>
        <p><i class="fas fa-moon" style="color: #ff6600;"></i> Sunset: ${dayInfo.sunset}</p>
        <p><i class="far fa-sun" style="color: #F0EAD6;"></i> Dawn: ${additionalTimes.dawn}</p>
        <p><i class="far fa-moon" style="color: #0d0d3e;"></i> Dusk: ${additionalTimes.dusk}</p>
        <p><i class="fas fa-sun" style="color: #ffcc00;"></i> Solar Noon: ${additionalTimes.solarNoon}</p>
        <p><i class="far fa-clock" style="color: #6666cc;"></i> Day Length: ${dayInfo.dayLength}</p>
      `;
      currentDayBox.classList.remove("hidden"); // Show the box
    }
  }

  function getDayInfo(results) {
    const sunriseTime = formatTime(results.sunrise);
    const sunsetTime = formatTime(results.sunset);
    const dayLength = formatDuration(results.day_length);

    return {
      sunrise: sunriseTime,
      sunset: sunsetTime,
      dayLength: dayLength,
    };
  }

  function getAdditionalTimes(results) {
    const dawnTime = formatTime(results.dawn);
    const duskTime = formatTime(results.dusk);
    const solarNoon = formatTime(results.solar_noon);

    return {
      dawn: dawnTime,
      dusk: duskTime,
      solarNoon: solarNoon,
    };
  }

  function formatTime(timeString) {
    // You can add additional formatting if needed
    return timeString;
  }

  function formatDuration(durationString) {
    // You can add additional formatting if needed
    return durationString;
  }

  function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  function getNextDayDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }
});
