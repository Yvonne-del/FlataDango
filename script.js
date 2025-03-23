const baseURL = "http://localhost:3000/films";
const movieList = document.getElementById("movieList-container");
const movieDisplay = document.getElementById("movie-display");
const movieInfo = document.getElementById("movie-details");
const purchasedList = document.getElementById("purchased-list");

let purchasedTickets = {};

// Fetch and display movie list
async function getMovieList() {
    const res = await fetch(baseURL);
    const movies = await res.json();

    movies.forEach((movie, index) => {
        const movieItem = document.createElement("p");
        movieItem.textContent = movie.title.toUpperCase();
        movieItem.dataset.movieId = movie.id;
        movieList.appendChild(movieItem);
        
        movieItem.addEventListener("click", () => getMovieDetails(movie.id));

        // Display the first movie by default
        if (index === 0) {
            getMovieDetails(movie.id);
        }
    });
}
getMovieList();

// Fetch and display movie details
async function getMovieDetails(movieId) {
    const res = await fetch(`${baseURL}/${movieId}`);
    const movie = await res.json();

    const capacity = Number(movie.capacity) || 0;
    const ticketsSold = Number(movie.tickets_sold) || 0;
    let remainingTickets = capacity - ticketsSold;

    movieDisplay.innerHTML = `<img src="${movie.poster}" alt="${movie.title}" width="200">`;
    movieInfo.innerHTML = `
        <h2>${movie.title}</h2>
        <p><strong>Runtime: </strong>${movie.runtime}</p>
        <p><strong>Showtime: </strong> ${movie.showtime}</p>
        <p><strong>Description: </strong> ${movie.description}</p>
        <p><strong>Tickets Remaining:</strong> <span id="ticketCount">${remainingTickets}</span></p>
        <button id="ticketButton" ${remainingTickets === 0 ? "disabled" : ""}>Buy Ticket</button>
    `;

    document.getElementById("ticketButton").addEventListener("click", () => purchaseTicket(movie, remainingTickets));
}

// Handle ticket purchase
async function purchaseTicket(movie, remainingTickets) {
    if (remainingTickets > 0) {
        remainingTickets--;
        document.getElementById("ticketCount").textContent = remainingTickets;

        if (remainingTickets === 0) {
            document.getElementById("ticketButton").disabled = true;
        }

        await fetch(`${baseURL}/${movie.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tickets_sold: movie.tickets_sold + 1 })
        });

        updatePurchasedTickets(movie.title);
    }
}

// Update purchased tickets list
function updatePurchasedTickets(movieTitle) {
    if (!purchasedTickets[movieTitle]) {
        purchasedTickets[movieTitle] = 0;
    }
    purchasedTickets[movieTitle]++;

    renderPurchasedTickets();
}

// Remove purchased ticket
function removePurchasedTicket(movieTitle) {
    if (purchasedTickets[movieTitle] > 0) {
        purchasedTickets[movieTitle]--;

        fetch(`${baseURL}?title=${movieTitle}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    const movie = data[0];

                    fetch(`${baseURL}/${movie.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tickets_sold: movie.tickets_sold - 1 })
                    });

                    document.getElementById("ticketCount").textContent = Number(document.getElementById("ticketCount").textContent) + 1;
                }
            });

        renderPurchasedTickets();
    }
}

// Render purchased tickets list
function renderPurchasedTickets() {
    purchasedList.innerHTML = "";
    for (let title in purchasedTickets) {
        if (purchasedTickets[title] > 0) {
            let listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${title}:</strong> <span class="ticket-count">${purchasedTickets[title]}</span> tickets bought
                <button class="delete-button" onclick="removePurchasedTicket('${title}')">Remove</button>`;
            purchasedList.appendChild(listItem);
        }
    }
}
