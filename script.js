document.addEventListener("DOMContentLoaded", async function () {
    const baseURL = "http://localhost:3000/films";
    const movieListContainer = document.getElementById("movieList-container");
    const movieDisplay = document.getElementById("movie-display");
    const movieInfo = document.getElementById("movie-information");

    //GET the movie titles and display them in browser
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

    //GET movie details when movie title is clicked
    async function getMovieDetails(movieId) {
        const res = await fetch(`${baseURL}/${movieId}`);
        const movie = await res.json();

        //ensure to load the capacity and ticket_sold values correctly as numbers
        const capacity = Number(movie.capacity) || 0;
        const ticketsSold = Number(movie.tickets_sold) || 0;
        let remainingTickets = capacity - ticketsSold;
        //display movie poster in the first div element
        movieDisplay.innerHTML = `<img src="${movie.poster}" alt="${movie.title}" width="200">`;
        //display movie details in the third div element
        movieInfo.innerHTML = `
            <h2>${movie.title}</h2>
            <p><strong>Runtime: </strong>${movie.runtime}</p>
            <p><strong>Showtime: </strong> ${movie.showtime}</p>
            <p><strong>Description: </strong> ${movie.description}</p>
            <p><strong>Tickets Remaining:</strong> <span id="ticketCount">${remainingTickets}</span></p>
            <button id="ticketButton" type="button" ${remainingTickets === 0 ? "disabled" : ""}>Buy Ticket</button>
        `;
        //add event listener to the ticket button to make changes after buying a ticket
        const ticketButton = document.getElementById("ticketButton");
        ticketButton.addEventListener("click", event => purchaseTicket(movie, remainingTickets));
    }

    //prevent buying of tickets when tickets end
    function purchaseTicket(movie, remainingTickets) {
        if (remainingTickets > 0) {
            remainingTickets--;
            document.getElementById("ticketCount").textContent = remainingTickets;
        }
    }
    
    fetchMovies();
});
