let apiKey = prompt('Please enter your API key:');
if (!apiKey) {
    alert('For security reasons, the exact API key is required. Please note that it will not be saved into local storage. It was provided with the assignment submission. Please refresh the page and try again.');
} else {
    let queryInput = $('.query-item');
    let submitButton = $('.submit-btn');
    let clearBtn = $('.clear');
    let queryBar = $('#query');
    let forecastSection = $('.forecast')
    let btnDiv = $('.btn-div')
    let searchTerm;
    // let placesArray = [];
    let arrayFromStorage = [];


    function getForecast() {
        // searchTerm = queryInput.val();
        let weatherApiCoordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`
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
                        let currentDate = dayjs().format('MM/DD/YYYY h:mm A')
                        let currentCelsius = Math.floor(data.main.temp) - 273;
                        let currentFahrenheit = Math.floor((data.main.temp - 273.15)* 1.8) + 32;
                        let currentHum = data.main.humidity;
                        let currentWind = Math.floor(data.wind.speed * 2.23694);
                        let currentIcon = data.weather[0].icon;

                        let cardContainer = $('<div>').addClass('row justify-content-center mt-5');
                        let colContainer = $('<div>').addClass('col-md-5');
                        let card = $('<div>').addClass('card');
                        let cardBody = $('<div>').addClass('card-body current');
                        let cardCity = $('<h2>').addClass('card-title').text(`${city}`);
                        let cardTitle = $('<h3>').addClass('card-title').text(`${currentDate}`);
                        let temperature = $('<p>').addClass('card-text').text(`${currentFahrenheit} F° / ${currentCelsius} C°`);
                        let humidity = $('<p>').addClass('card-text').text(`${currentHum}% humidity`);
                        let windSpeed = $('<p>').addClass('card-text').text(`${currentWind} mph`);

                        cardBody.append(cardCity, cardTitle, temperature, humidity, windSpeed);
                        card.append(cardBody);
                        colContainer.append(card);
                        cardContainer.append(colContainer);

                        forecastSection.append(cardContainer);

                        let CurrentWeatherApiIcon = `https://openweathermap.org/img/wn/${currentIcon}@2x.png` 
                        fetch(CurrentWeatherApiIcon)
                            .then(function(response) {
                                if (response.ok) {
                                    return response.blob();
                                } else {
                                    alert('Error: ' + response.statusText);
                                }
                            })
                            .then(function(blob) {
                                const imgUrl = URL.createObjectURL(blob);
                                const img = document.createElement('img');
                                img.src = imgUrl;
                                cardBody.prepend(img);
                            })
                            .catch(function(error) {
                                console.log(error);
                                alert(error.message);
                            })
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
                                let formatDate = dayjs.unix(timestamp).format('MM/DD/YYYY');
                                let kelvin = dataList[i].main.temp;
                                let celsius = Math.floor(dataList[i].main.temp) - 273;
                                let fahrenheit = Math.floor((dataList[i].main.temp - 273.15)* 1.8) + 32;
                                let hum = dataList[i].main.humidity;
                                let wind = Math.floor(dataList[i].wind.speed * 2.23694);
                                let icon = dataList[i].weather[0].icon;
                                console.log(formatDate);
                                console.log(`${celsius} C°`);
                                console.log(`${fahrenheit} F°`);
                                console.log(`${kelvin} K`);
                                console.log(`${hum}%`);
                                console.log(`${wind} mph`);
                                console.log(`${icon} Icon`);

                                let cardContainer = $('<div>').addClass('row justify-content-center mt-5');
                                let colContainer = $('<div>').addClass('col-md-5');
                                let card = $('<div>').addClass('card');
                                let cardBody = $('<div>').addClass('card-body');
                                let cardTitle = $('<h3>').addClass('card-title').text(`${formatDate}`);
                                let temperature = $('<p>').addClass('card-text').text(`${fahrenheit} F° / ${celsius} C°`);
                                let humidity = $('<p>').addClass('card-text').text(`${hum}% humidity`);
                                let windSpeed = $('<p>').addClass('card-text').text(`${wind} mph`);

                                cardBody.append(cardTitle, temperature, humidity, windSpeed);
                                card.append(cardBody);
                                colContainer.append(card);
                                cardContainer.append(colContainer);

                                forecastSection.append(cardContainer);


                                let weatherApiIcon = `https://openweathermap.org/img/wn/${icon}@2x.png` 

                                fetch(weatherApiIcon)
                                    .then(function(response) {
                                        if (response.ok) {
                                            return response.blob();
                                        } else {
                                            alert('Error: ' + response.statusText);
                                        }
                                    })
                                    .then(function(blob) {
                                        const imgUrl = URL.createObjectURL(blob);
                                        const img = document.createElement('img');
                                        img.src = imgUrl;
                                        cardBody.prepend(img);
                                    })
                                    .catch(function(error) {
                                        console.log(error);
                                        alert(error.message);
                                    })
                            }
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                        alert(error.message);
                    });
                    })
            .catch(function(error) {
                console.log(error.message);
                alert('Please submit a valid city name.');
            });
    }

    function loadButtons() {
        let stringStored = localStorage.getItem('places')
        arrayFromStorage = stringStored ? stringStored.split(',') : [];

        if (arrayFromStorage.length > 0) {
            arrayFromStorage.forEach((city) => {
                let preLoadedButton = $('<button>').addClass('saved-city btn btn-primary').attr('data-city', city).text(city);
                btnDiv.append(preLoadedButton); 
            })
        }
    }

    if (window.localStorage.length){
        loadButtons();
    }

    submitButton.on('click', function(event) {
        event.preventDefault();
        searchTerm = queryInput.val();

        if (searchTerm.length === 0) {
            return alert("Please pick a city.")
        }

        if (arrayFromStorage.includes(searchTerm)) {
            $('.forecast').empty();
            getForecast();
            console.log(arrayFromStorage);
        } else {
            $('.forecast').empty();
            getForecast();
            let cityButton = $(`<button>${queryInput.val()}</button>`);
            cityButton.attr('data-city', `${queryInput.val()}`);
            cityButton.attr('class', 'saved-city').addClass('saved-city btn btn-primary');
            let stringStored = localStorage.getItem('places')
            arrayFromStorage = stringStored ? stringStored.split(',') : [];
            arrayFromStorage.push(queryInput.val())
            localStorage.setItem('places', arrayFromStorage);
            btnDiv.append(cityButton);
        }
    });

    btnDiv.delegate('.saved-city','click', function(event) {
        event.preventDefault();
        $('.forecast').empty();
        searchTerm = $(this).data('city');
        getForecast();
    });



    clearBtn.on('click', function(event) {
        event.preventDefault();
        localStorage.clear();
    });
}

// let queryInput = $('.query-item');
// let submitButton = $('.submit-btn');
// let clearBtn = $('.clear');
// let queryBar = $('#query');
// let forecastSection = $('.forecast')
// let btnDiv = $('.btn-div')
// let searchTerm;
// // let placesArray = [];
// let arrayFromStorage = [];


// function getForecast() {
//     // searchTerm = queryInput.val();
//     let weatherApiCoordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`
//     let lat;
//     let lon;
//     let city;
// // get lat and lon
//     fetch(weatherApiCoordinates)
//         .then(function(response) {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 alert('Error: ' + response.statusText);
//             }
//         })
//         .then(function(data) {
//             lat = data[0].lat;
//             lon = data[0].lon;
//             console.log(lat, lon);
//         })
//         .then (function() {
//             let weatherApiToday = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
//             fetch(weatherApiToday)
//                 .then(function(response) {
//                     if (response.ok) {
//                         return response.json();
//                     } else {
//                         alert('Error: ' + response.statusText);
//                     }
//                 })
//                 .then(function(data) {
//                     city = data.name;
//                     let currentDate = dayjs().format('MM/DD/YYYY h:mm A')
//                     let currentCelsius = Math.floor(data.main.temp) - 273;
//                     let currentFahrenheit = Math.floor((data.main.temp - 273.15)* 1.8) + 32;
//                     let currentHum = data.main.humidity;
//                     let currentWind = Math.floor(data.wind.speed * 2.23694);
//                     let currentIcon = data.weather[0].icon;

//                     let cardContainer = $('<div>').addClass('row justify-content-center mt-5');
//                     let colContainer = $('<div>').addClass('col-md-5');
//                     let card = $('<div>').addClass('card');
//                     let cardBody = $('<div>').addClass('card-body current');
//                     let cardCity = $('<h2>').addClass('card-title').text(`${city}`);
//                     let cardTitle = $('<h3>').addClass('card-title').text(`${currentDate}`);
//                     let temperature = $('<p>').addClass('card-text').text(`${currentFahrenheit}F / ${currentCelsius}C`);
//                     let humidity = $('<p>').addClass('card-text').text(`${currentHum}%`);
//                     let windSpeed = $('<p>').addClass('card-text').text(`${currentWind} mph`);

//                     cardBody.append(cardCity, cardTitle, temperature, humidity, windSpeed);
//                     card.append(cardBody);
//                     colContainer.append(card);
//                     cardContainer.append(colContainer);

//                     forecastSection.append(cardContainer);

//                     let CurrentWeatherApiIcon = `https://openweathermap.org/img/wn/${currentIcon}@2x.png` 
//                     fetch(CurrentWeatherApiIcon)
//                         .then(function(response) {
//                             if (response.ok) {
//                                 return response.blob();
//                             } else {
//                                 alert('Error: ' + response.statusText);
//                             }
//                         })
//                         .then(function(blob) {
//                             const imgUrl = URL.createObjectURL(blob);
//                             const img = document.createElement('img');
//                             img.src = imgUrl;
//                             cardBody.prepend(img);
//                         })
//                         .catch(function(error) {
//                             console.log(error);
//                             alert(error.message);
//                         })
//                 })
//                 .catch(function(error) {
//                     console.log(error);
//                     alert(error.message);
//                 });
//         })
//         .then (function() {
//             let weatherApiForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
//             fetch(weatherApiForecast)
//                 .then(function(response) {
//                     if (response.ok) {
//                         return response.json();
//                     } else {
//                         alert('Error: ' + response.statusText);
//                     }
//                 })
//                 .then(function(data) {
//                     let dataList = data.list;
//                     for (let i=0; i < dataList.length; i++) {
                        
//                         let mayTenTwoPm = 1683752400;
//                         let timestamp = dataList[i].dt;

//                         if ((timestamp-mayTenTwoPm)%86400 === 0) {
//                             let formatDate = dayjs.unix(timestamp).format('MM/DD/YYYY');
//                             let kelvin = dataList[i].main.temp;
//                             let celsius = Math.floor(dataList[i].main.temp) - 273;
//                             let fahrenheit = Math.floor((dataList[i].main.temp - 273.15)* 1.8) + 32;
//                             let hum = dataList[i].main.humidity;
//                             let wind = Math.floor(dataList[i].wind.speed * 2.23694);
//                             let icon = dataList[i].weather[0].icon;
//                             console.log(formatDate);
//                             console.log(`${celsius} C`);
//                             console.log(`${fahrenheit} F`);
//                             console.log(`${kelvin} K`);
//                             console.log(`${hum}%`);
//                             console.log(`${wind} mph`);
//                             console.log(`${icon} Icon`);

//                             let cardContainer = $('<div>').addClass('row justify-content-center mt-5');
//                             let colContainer = $('<div>').addClass('col-md-5');
//                             let card = $('<div>').addClass('card');
//                             let cardBody = $('<div>').addClass('card-body');
//                             let cardTitle = $('<h3>').addClass('card-title').text(`${formatDate}`);
//                             let temperature = $('<p>').addClass('card-text').text(`${fahrenheit}F / ${celsius}C`);
//                             let humidity = $('<p>').addClass('card-text').text(`${hum}%`);
//                             let windSpeed = $('<p>').addClass('card-text').text(`${wind} mph`);

//                             cardBody.append(cardTitle, temperature, humidity, windSpeed);
//                             card.append(cardBody);
//                             colContainer.append(card);
//                             cardContainer.append(colContainer);

//                             forecastSection.append(cardContainer);


//                             let weatherApiIcon = `https://openweathermap.org/img/wn/${icon}@2x.png` 

//                             fetch(weatherApiIcon)
//                                 .then(function(response) {
//                                     if (response.ok) {
//                                         return response.blob();
//                                     } else {
//                                         alert('Error: ' + response.statusText);
//                                     }
//                                 })
//                                 .then(function(blob) {
//                                     const imgUrl = URL.createObjectURL(blob);
//                                     const img = document.createElement('img');
//                                     img.src = imgUrl;
//                                     cardBody.prepend(img);
//                                 })
//                                 .catch(function(error) {
//                                     console.log(error);
//                                     alert(error.message);
//                                 })
//                         }
//                     }
//                 })
//                 .catch(function(error) {
//                     console.log(error);
//                     alert(error.message);
//                 });
//                 })
//         .catch(function(error) {
//             console.log(error.message);
//             alert('Please submit a valid city name.');
//         });
// }

// function loadButtons() {
//     let stringStored = localStorage.getItem('places')
//     arrayFromStorage = stringStored ? stringStored.split(',') : [];

//     if (arrayFromStorage.length > 0) {
//         arrayFromStorage.forEach((city) => {
//             let preLoadedButton = $('<button>').addClass('saved-city btn btn-primary').attr('data-city', city).text(city);
//             btnDiv.append(preLoadedButton); 
//         })
//     }
// }

// if (window.localStorage.length){
//     loadButtons();
// }

// submitButton.on('click', function(event) {
//     event.preventDefault();
//     searchTerm = queryInput.val();

//     if (searchTerm.length === 0) {
//         return alert("Please pick a city.")
//     }

//     if (arrayFromStorage.includes(searchTerm)) {
//         $('.forecast').empty();
//         getForecast();
//         console.log(arrayFromStorage);
//     } else {
//         $('.forecast').empty();
//         getForecast();
//         let cityButton = $(`<button>${queryInput.val()}</button>`);
//         cityButton.attr('data-city', `${queryInput.val()}`);
//         cityButton.attr('class', 'saved-city').addClass('saved-city btn btn-primary');
//         let stringStored = localStorage.getItem('places')
//         arrayFromStorage = stringStored ? stringStored.split(',') : [];
//         arrayFromStorage.push(queryInput.val())
//         localStorage.setItem('places', arrayFromStorage);
//         btnDiv.append(cityButton);
//     }
// });

// btnDiv.delegate('.saved-city','click', function(event) {
//     event.preventDefault();
//     $('.forecast').empty();
//     searchTerm = $(this).data('city');
//     getForecast();
// });



// clearBtn.on('click', function(event) {
//     event.preventDefault();
//     localStorage.clear();
// });