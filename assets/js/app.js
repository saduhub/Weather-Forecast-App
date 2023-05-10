const apiKey = '';

let stringStored = localStorage.getItem('places')
let arrayFromStorage = stringStored ? stringStored.split(',') : [];
console.log(arrayFromStorage);

// url will be modified depending on the query made
let queryInput = $('.query-item');
let submitButton = $('.submit-btn');
let cardContainer = $('#results');
let queryBar = $('#query');
let searchTerm;
let placesArray = [];


function getForecast() {
    // searchTerm = queryInput.val();
    let weatherApiCoordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`
    let lat;
    let lon;
    let city;
// get lat and lon
    fetch(weatherApiCoordinates)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .then(function(data) {
            lat = data[0].lat;
            lon = data[0].lon;
            console.log(lat, lon);
        })
        .then (function() {
            let weatherApiToday = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
            fetch(weatherApiToday)
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        alert('Error: ' + response.statusText);
                    }
                })
                .then(function(data) {
                    city = data.name;

                    console.log(city);
                })
                .catch(function(error) {
                    console.log(error);
                    alert(error.message);
                });
                })
        .then (function() {
            let weatherApiForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
            fetch(weatherApiForecast)
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        alert('Error: ' + response.statusText);
                    }
                })
                .then(function(data) {
                    let dataList = data.list;
                    for (let i=0; i < dataList.length; i++) {
                        
                        let mayTenTwoPm = 1683752400;
                        let timestamp = dataList[i].dt;

                        if ((timestamp-mayTenTwoPm)%86400 === 0) {
                            let formatDate = dayjs.unix(timestamp).format('MM/DD/YYYY h:mm A');
                            let kelvin = dataList[i].main.temp;
                            let celsius = Math.floor(dataList[i].main.temp) - 273;
                            let fahrenheit = Math.floor((dataList[i].main.temp - 273.15)* 1.8) + 32;
                            let humidity = dataList[i].main.humidity;
                            let wind = Math.floor(dataList[i].wind.speed * 2.23694);
                            let icon = dataList[i].weather[0].icon;
                            console.log(formatDate);
                            console.log(`${celsius} C`);
                            console.log(`${fahrenheit} F`);
                            console.log(`${kelvin} K`);
                            console.log(`${humidity}%`);
                            console.log(`${wind} mph`);
                            console.log(`${icon} Icon`);

                            // let weatherApiIcon = `https://openweathermap.org/img/wn/${icon}@2x.png` 

                            // fetch(weatherApiIcon)
                            //     .then(function(response) {
                            //         if (response.ok) {
                            //             return response.blob();
                            //         } else {
                            //             alert('Error: ' + response.statusText);
                            //         }
                            //     })
                            //     .then(function(blob) {
                            //         const imgUrl = URL.createObjectURL(blob);
                            //         const img = document.createElement('img');
                            //         img.src = imgUrl;
                            //         document.body.appendChild(img);
                            //     })
                            //     .catch(function(error) {
                            //         console.log(error);
                            //         alert(error.message);
                            //     })
                        }
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    alert(error.message);
                });
                })
        .catch(function(error) {
            console.log(error);
            alert(error.message);
        });
}

if (arrayFromStorage.length > 0) {
    arrayFromStorage.forEach((city) => {
        let preLoadedButton = $('<button>').addClass('saved-city').attr('data-city', city).text(city);
        queryBar.append(preLoadedButton); 

        // preLoadedButton.on('click', function(event) {
        //     event.preventDefault();
        //     searchTerm = $(this).data('city');
        //     getForecast();
        // });
    })
}


submitButton.on('click', function(event) {
    event.preventDefault();
    searchTerm = queryInput.val();
    getForecast();
    let cityButton = $(`<button>${queryInput.val()}</button>`);
    cityButton.attr('data-city', `${queryInput.val()}`);
    cityButton.attr('class', 'saved-city');
    placesArray.push(queryInput.val())
    console.log(placesArray);
    localStorage.setItem('places', placesArray);
    queryBar.append(cityButton);
});

queryBar.delegate('.saved-city','click', function(event) {
    event.preventDefault();
    searchTerm = $(this).data('city');
    getForecast();
});

