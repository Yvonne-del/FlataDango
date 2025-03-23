const baseURL = "http://localhost:3000/films"
const movieList = document.getElementById("movieList-container")
//start by creating the movie list
//GET movie titles and display them in the first div element
async function getMovieList(){
    const res = await fetch(baseURL)
    const data = await res.json()
    

    //loop through the titles 
    data.forEach(item => {
        const movies = document.createElement("p")
        movies.textContent = `${item.title.toUpperCase()}`
        movieList.appendChild(movies);
    });
}
getMovieList();
