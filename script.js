document.addEventListener("DOMContentLoaded", async function () {
    const baseURL = "http://localhost:3000/films";
    const movieListContainer = document.getElementById("movieList-container");
    const movieDisplay = document.getElementById("movie-display");
    const movieInfo = document.getElementById("movie-information");

    async function fetchMovies() {
        const res = await fetch(baseURL);
        const movies = await res.json();
        movieListContainer.innerHTML = ""; // Clear existing list

        movies.forEach((movie, index) => {
            const movieItem = document.createElement("div");
            movieItem.classList.add("movie-item");
            movieItem.innerHTML = `<p>${movie.title}</p>`;
            movieItem.addEventListener("click", () => getMovieDetails(movie.id));
            movieListContainer.appendChild(movieItem);

            // Load first movie by default
            if (index === 0) {
                getMovieDetails(movie.id);
            }
        });
    }

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
            <button id="ticketButton" type="button" ${remainingTickets === 0 ? "disabled" : ""}>Buy Ticket</button>
        `;

        const ticketButton = document.getElementById("ticketButton");
        ticketButton.addEventListener("click", (event) => {
            event.preventDefault();
            purchaseTicket(movie, remainingTickets);
        });
    }

    function purchaseTicket(movie, remainingTickets) {
        if (remainingTickets > 0) {
            remainingTickets--;
            document.getElementById("ticketCount").textContent = remainingTickets;
        }
    }

    fetchMovies();
});
