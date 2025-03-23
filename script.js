const baseURL = "http://localhost:3000/films"
const movieList = document.getElementById("movieList-container")
const movieDisplay = document.getElementById("movie-display")
const movieInfo = document.getElementById("movie-information")
//start by creating the movie list
//GET movie titles and display them in the first div element
async function getMovieList(){
    const res = await fetch(baseURL)
    const data = await res.json()
    

    //loop through the titles 
    data.forEach(item => {
        const movies = document.createElement("p")
        movies.textContent = `${item.title.toUpperCase()}`
        movies.dataset.movieId = parseInt(item.id, 10); // Store movie ID for fetching details later
        movieList.appendChild(movies);
        //to fetch use movie details for display 
        movies.addEventListener("click", () => getMoviePoster(parseInt(item.id, 10)));
    });
}
getMovieList();

//GET method to fetch movie details after clicking the title in title list
async function getMoviePoster(movieId){
    const res = await fetch(`${baseURL}/${movieId}`)
    const data = await res.json()
    // Convert capacity and tickets_sold to numbers
    const capacity = Number(data.capacity) || 0;
    const ticketsSold = Number(data.tickets_sold) || 0;
    const remainingTickets = capacity - ticketsSold;
    movieDisplay.innerHTML = `<img src="${data.poster}" alt="${data.title}" width="200">`;
    movieInfo.innerHTML = `
         <h2>${data.title}</h2>
         <p><strong>Runtime: </strong>${data.runtime}</p>
         <p><strong>Showtime: </strong> ${data.showtime}</p>
         <p><strong>Description: </strong> ${data.description}</p>
        <p><strong>Tickets:</strong> ${remainingTickets}</p>
        <button id="ticketButton">Buy Ticket</button>
    `
}


