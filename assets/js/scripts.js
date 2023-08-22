// API key for OpenWeatherMap
var key = '0459e512ce1f85ecc85173fecdd9dcb8';
// Default city
var city = "Houston"

// Grabs the current time and date using the Moment.js library
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')

// Array to store search history
var cityHist = [];

// Event handler for the search button click
$('.search').on("click", function (event) {
	event.preventDefault();
	// Get the city name from the input field
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	}
	// Add the city to the search history
	cityHist.push(city);

	// Save the search history to local storage
	localStorage.setItem('city', JSON.stringify(cityHist));

	// Clear forecast and update history and weather
	fiveForecastEl.empty();
	getHistory();
	getWeatherToday();
});

// Function to create buttons based on search history
var contHistEl = $('.cityHist');
function getHistory() {
	contHistEl.empty();

	for (let i = 0; i < cityHist.length; i++) {
		var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${cityHist[i]}`)

		rowEl.addClass('row histBtnRow');
		btnEl.addClass('btn btn-outline-secondary histBtn');
		btnEl.attr('type', 'button');

		contHistEl.prepend(rowEl);
		rowEl.append(btnEl);
	}

	// Attach event handler to search history buttons
	$('.histBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveForecastEl.empty();
		getWeatherToday();
	});
};

// Select the main 'Today' card body
var cardTodayBody = $('.cardBodyToday');

// Function to fetch and display current weather
function getWeatherToday() {
	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(cardTodayBody).empty();

	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		// Update the elements with weather data
		$('.cardTodayCityName').text(response.name);
		$('.cardTodayDate').text(date);
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		cardTodayBody.append(pEl);
		// ... (similarly update other weather data)

		// Fetch UV index data and update the element based on severity
		var cityLon = response.coord.lon;
		var cityLat = response.coord.lat;
		var getUrlUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;
		$.ajax({
			url: getUrlUvi,
			method: 'GET',
		}).then(function (response) {
			// ... (update UV index element based on severity)
		});
	});

	// Fetch and display the five-day forecast
	getFiveDayForecast();
};

// Select the element for the five-day forecast
var fiveForecastEl = $('.fiveForecast');

// Function to fetch and display five-day forecast
function getFiveDayForecast() {
	var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		// ... (process and display five-day forecast data)
	});
};

// Load initial data when the page loads
function initLoad() {
	// Load city history from local storage if available
	var cityHistStore = JSON.parse(localStorage.getItem('city'));
	if (cityHistStore !== null) {
		cityHist = cityHistStore;
	}
	// Display search history and current weather
	getHistory();
	getWeatherToday();
}

// Call the initial load function
initLoad();
