const TOKEN = '89976ca121dc0559a6b8fd7caa97c37d';
const popularMoviesDiv = document.querySelector('#popular-movies');

const globalState = {
    currentPage: window.location.pathname
};

const fetchDataFromAPI = async (endpoint) => {
    const url = 'https://api.themoviedb.org/3/';
    try {
        const response = await fetch(`${url}${endpoint}?api_key=${TOKEN}&language=en-US`);
        if (!response.ok) {
            throw new Error(`Fetch from API failed with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

const displayPopularMovies = async () => {
    const movies = (await fetchDataFromAPI('movie/popular')).results;
    movies.forEach(movie => {
        card = document.createElement('div');
        card.classList.add('card');
        const poster_path = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : 'images/no-image.jpg';
        card.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            <img
              src=${poster_path}
              class="card-img-top"
              alt=${movie.title}
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        `;
        popularMoviesDiv.appendChild(card);
    })
}

const highlightActiveLink = () => {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === globalState.currentPage)
            link.classList.add('active');
    });        
}

const init = () => {
    displayPopularMovies();
    highlightActiveLink();
    switch (globalState.currentPage) {
        case '/':
        case '/index.html':
            console.log('Home');
            break;
        case '/shows.html':
            console.log('Shows');
            break;
        case '/movie-details.html':
            console.log('Movie details');
            break;
        case '/tv-details.html':
            console.log('TV details');
            break;
        case '/search.html':
            console.log('Search');
            break;
    }
}

document.addEventListener('DOMContentLoaded', init);