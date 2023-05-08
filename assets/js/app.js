require('dotenv').config();
const $ = require('jquery');
const apiKey = process.env.API_KEY;
console.log(apiKey);

// url will be modified depending on the query made
let queryInput = $('.query-item');
let submitButton = $('.submit-btn');
let cardContainer = $('#results');

submitButton.on('click', function(event) {
    event.preventDefault();
    let searchTerm = queryInput.val();
    let weatherApi = `https://www.loc.gov/books/?fo=json&q=${searchTerm}&sp=1&c=5`
    
    fetch(weatherApi)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .then(function(data) {
            let books = data.results;
            console.log(books);

            cardContainer.empty(); // Clear any previous cards from the container

            for (let i = 0; i < books.length; i++) {
                let book = books[i];
                let title = book.title;
                let description = book.description;
                let url = book.url;

                let card = $('<div>').addClass('card w-100');
                let innerCard = $('<div>').addClass('card-body');
                let cardTitle = $('<h5>').addClass('card-title').text(title);
                let cardText = $('<p>').addClass('card-text').text(description);
                let cardLink = $('<a>').addClass('btn btn-primary').attr('href', url).text('Visit');

                innerCard.append(cardTitle, cardText, cardLink);
                card.append(innerCard);
                cardContainer.append(card); // Append each card to the container
            }

        })
        .catch(function(error) {
            console.log(error);
            alert(error.message);
        });
});