const baseURL = "http://localhost:3000/films";
const movieList = document.getElementById("movieList-container");
const movieDisplay = document.getElementById("movie-display");
const movieInfo = document.getElementById("movie-information");
const purchasedTicketsContainer = document.getElementById("purchased-tickets");

// Start by creating the movie list
async function getMovieList() {
    const res = await fetch(baseURL);
    const data = await res.json();

    // Loop through the titles 
    data.forEach(item => {
        const movies = document.createElement("p");
        movies.textContent = `${item.title.toUpperCase()}`;
        movies.dataset.movieId = parseInt(item.id, 10); // Store movie ID for fetching details later
        movieList.appendChild(movies);
        
        // Fetch movie details for display 
        movies.addEventListener("click", () => getMoviePoster(parseInt(item.id, 10)));
    });
}
getMovieList();

// GET method to fetch movie details after clicking the title in the title list
async function getMoviePoster(movieId) {
    const res = await fetch(`${baseURL}/${movieId}`);
    const data = await res.json();

    // Convert capacity and tickets_sold to numbers
    const capacity = Number(data.capacity) || 0;
    const ticketsSold = Number(data.tickets_sold) || 0;
    let remainingTickets = capacity - ticketsSold;

    movieDisplay.innerHTML = `<img src="${data.poster}" alt="${data.title}" width="200">`;
    movieInfo.innerHTML = `
         <h2>${data.title}</h2>
         <p><strong>Runtime: </strong>${data.runtime}</p>
         <p><strong>Showtime: </strong> ${data.showtime}</p>
         <p><strong>Description: </strong> ${data.description}</p>
         <p><strong>Tickets Remaining:</strong> <span id="ticketCount">${remainingTickets}</span></p>
         <button id="ticketButton" ${remainingTickets === 0 ? "disabled" : ""}>Buy Ticket</button>
    `;

    // Add event listener for the Buy Ticket button
    document.getElementById("ticketButton").addEventListener("click", async function() {
        if (remainingTickets > 0) {
            remainingTickets--; // Reduce tickets count
            
            // Update the ticket count in the UI
            document.getElementById("ticketCount").textContent = remainingTickets;

            // Disable button if tickets are sold out
            if (remainingTickets === 0) {
                this.disabled = true;
            }

            // PATCH request to update tickets_sold
            await fetch(`${baseURL}/${movieId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tickets_sold: ticketsSold + 1  // Increment by 1
                })
            });

            // Update purchased tickets section
            updatePurchasedTickets(data.title);
        }
    });
}

// Function to update the purchased tickets list
function updatePurchasedTickets(movieTitle) {
    let ticketEntry = document.querySelector(`#purchased-tickets li[data-title="${movieTitle}"]`);
    
    if (ticketEntry) {
        // If the movie is already in the list, increase the ticket count
        let countSpan = ticketEntry.querySelector(".ticket-count");
        countSpan.textContent = parseInt(countSpan.textContent, 10) + 1;
    } else {
        // Otherwise, add a new entry for the movie
        let listItem = document.createElement("li");
        listItem.dataset.title = movieTitle;
        listItem.innerHTML = `<strong>${movieTitle}:</strong> <span class="ticket-count">1</span> tickets bought`;
        purchasedTicketsContainer.appendChild(listItem);
    }
}
