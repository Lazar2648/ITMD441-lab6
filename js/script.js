const form = document.getElementById("locationForm");
const locationSelect = document.getElementById("locationSelect");

const placeholder = document.getElementById("placeholder");
const dashboard = document.getElementById("dashboard");
const timezoneBox = document.getElementById("timezoneBox");

const errorBox = document.getElementById("errorBox");
const errorText = document.getElementById("errorText");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const selectedValue = locationSelect.value;

  if (!selectedValue) {
    showError("Please select a location.");
    return;
  }

  const parts = selectedValue.split(",");
  const lat = parts[0];
  const lng = parts[1];

  fetchData(lat, lng);
});

async function fetchData(lat, lng) {
  try {
    hideError();

    const todayRes = await fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=today`);
    const tomorrowRes = await fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=tomorrow`);

    const todayData = await todayRes.json();
    const tomorrowData = await tomorrowRes.json();

    if (todayData.status !== "OK" || tomorrowData.status !== "OK") {
      throw new Error();
    }

    updateUI(todayData.results, tomorrowData.results);

  } catch (err) {
    showError("Failed to fetch data.");
  }
}

function updateUI(today, tomorrow) {
  placeholder.classList.add("hidden");
  dashboard.classList.remove("hidden");
  timezoneBox.classList.remove("hidden");

  document.getElementById("todaySunrise").textContent = today.sunrise;
  document.getElementById("todaySunset").textContent = today.sunset;
  document.getElementById("todayDawn").textContent = today.dawn;
  document.getElementById("todayDusk").textContent = today.dusk;
  document.getElementById("todayNoon").textContent = today.solar_noon;
  document.getElementById("todayLength").textContent = today.day_length;

  document.getElementById("tomorrowSunrise").textContent = tomorrow.sunrise;
  document.getElementById("tomorrowSunset").textContent = tomorrow.sunset;
  document.getElementById("tomorrowDawn").textContent = tomorrow.dawn;
  document.getElementById("tomorrowDusk").textContent = tomorrow.dusk;
  document.getElementById("tomorrowNoon").textContent = tomorrow.solar_noon;
  document.getElementById("tomorrowLength").textContent = tomorrow.day_length;

  document.getElementById("timezoneText").textContent = today.timezone;
}

function showError(msg) {
  errorText.textContent = msg;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
}