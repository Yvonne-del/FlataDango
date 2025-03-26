document.addEventListener("DOMContentLoaded", async function () {
    const baseURL = "https://raw.githubusercontent.com/Yvonne-del/FlataDango/main/db.json";
    const movieListContainer = document.getElementById("movieList-container");
    const movieDisplay = document.getElementById("movie-display");
    const movieInfo = document.getElementById("movie-information");

    //GET the movie titles and display them in browser
    async function fetchMovies() {
        const res = await fetch(baseURL);
        const textData = await res.text(); // Fetch as text first
        const movies = JSON.parse(textData); // Convert text to JSON manually

        movieListContainer.innerHTML = ""; // Clear existing list

        movies.films.forEach((movie, index) => {
            const movieItem = document.createElement("div");
            movieItem.classList.add("movie-item");
            movieItem.innerHTML = `<p id="title">${movie.title}</p>`;
            const deleteTitle = document.createElement("button")
            deleteTitle.textContent = " x "
            deleteTitle.addEventListener("click", () => deleteMovieTitle(movie.id))

            movieItem.addEventListener("click", () => getMovieDetails(movie.id));
            movieItem.appendChild(deleteTitle)
            movieListContainer.appendChild(movieItem);

            // Load first movie by default
            if (index === 0) {
                getMovieDetails(movie.id);
            }
        });
    }
    const deleteMovieTitle = async (id) =>{
        const res = await fetch(`${baseURL}/${id}`,{
            method:`DELETE`,
        })
        if(res.ok){
            fetchMovies();
        }else{
            alert("failed to delete animal")
        }
    }

    //GET movie details when movie title is clicked
   // GET movie details when movie title is clicked
    async function getMovieDetails(movie) {
    // Ensure numeric values are handled correctly
        const capacity = Number(movie.capacity) || 0;
        const ticketsSold = Number(movie.tickets_sold) || 0;
        let remainingTickets = capacity - ticketsSold;

        // Display movie poster in the first div
        movieDisplay.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" width="200" onerror="this.src='fallback-image.jpg'">
        `;
    
        // Display movie details in the third div
        movieInfo.innerHTML = `
            <h2>${movie.title}</h2>
            <p><strong>Runtime: </strong>${movie.runtime}</p>
            <p><strong>Showtime: </strong> ${movie.showtime}</p>
            <p><strong>Description: </strong> ${movie.description}</p>
            <p><strong>Tickets Remaining:</strong> <span id="ticketCount">${remainingTickets}</span></p>
            <button id="ticketButton" type="button" ${remainingTickets === 0 ? "disabled" : ""}>Buy Ticket</button>
        `;

        // Add event listener to the ticket button
        const ticketButton = document.getElementById("ticketButton");
        ticketButton.addEventListener("click", () => purchaseTicket(movie, remainingTickets));
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
