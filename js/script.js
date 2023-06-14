const TOKEN = '89976ca121dc0559a6b8fd7caa97c37d';
const url = 'https://api.themoviedb.org/3/';
const popularMoviesDiv = document.querySelector('#popular-movies');
const popularShowsDiv = document.querySelector('#popular-shows');
const movieDetailsDiv = document.querySelector('#movie-details');
const showDetailsDiv = document.querySelector('#show-details');
const spinner = document.querySelector('.spinner');

const globalState = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0
    }
};

const showSpinner = () => {
    spinner.classList.add('show');
}

const hideSpinner = () => {
    spinner.classList.remove('show');
}

const fetchDataFromAPI = async (endpoint) => {
    showSpinner();
    try {
        const response = await fetch(`${url}${endpoint}?api_key=${TOKEN}&language=en-US`);
        if (!response.ok) {
            throw new Error(`Fetch from API failed with status ${response.status}`);
        }
        const data = await response.json();
        hideSpinner();
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

const searchApiData = async () => {
    showSpinner();
    try {
        const response = await fetch(`${url}search/${globalState.search.type}?api_key=${TOKEN}&language=en-US&query=${globalState.search.term}&page=${globalState.search.page}`);
        if (!response.ok) {
            throw new Error(`Fetch from API failed with status ${response.status}`);
        }
        const data = await response.json();
        hideSpinner();
        globalState.search.page = data.page;
        globalState.search.totalPages = data.total_pages;
        globalState.search.totalResults = data.total_results;
        displayPagination();
        return { results: data.results, total_results: data.total_results };
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

const displayPopularTvShows = async () => {
    const shows = (await fetchDataFromAPI('tv/popular')).results;
    shows.forEach(show => {
        card = document.createElement('div');
        card.classList.add('card');
        const poster_path = show.poster_path
            ? `https://image.tmdb.org/t/p/w500/${show.poster_path}`
            : 'images/no-image.jpg';
        card.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            <img
              src=${poster_path}
              class="card-img-top"
              alt=${show.name}
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air date: ${show.first_air_date}</small>
            </p>
          </div>
        `;
        popularShowsDiv.appendChild(card);
    })
}

displayMovieDetails = async () => {
    const movieId = window.location.search.split('=')[1];
    const movie = await fetchDataFromAPI(`movie/${movieId}`);
    displayBackdrop('movie', movie.backdrop_path);
    const div = document.createElement('div');
    const poster_path = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : 'images/no-image.jpg';
    div.innerHTML = `
    <div class="details-top">
          <div>
            <img
              src=${poster_path}
              class="card-img-top"
              alt=${movie.title}
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
            ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href=${movie.homepage} target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${movie.budget}</li>
            <li><span class="text-secondary">Revenue:</span> $${movie.revenue}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} </li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map(company => ` ${company.name}`)}</div>
        </div>`
    movieDetailsDiv.appendChild(div);
}

displayTvDetails = async () => {
    const showId = window.location.search.split('=')[1];
    const show = await fetchDataFromAPI(`tv/${showId}`);
    displayBackdrop('show', show.backdrop_path);
    console.log(show);
    const div = document.createElement('div');
    const poster_path = show.poster_path ?
        `https://image.tmdb.org/t/p/w500/${show.poster_path}`
        : 'images/no-image.jpg';
    const overview = show.overview ? show.overview : 'There is no description available for this show.'
        
    div.innerHTML = `
    <div class="details-top">
          <div>
            <img
              src=${poster_path}
              class="card-img-top"
              alt=${show.name}
            />
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average} / 10
            </p>
            <p class="text-muted">First Air Date: ${show.first_air_date}</p>
            <p> 
            ${overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${show.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href=${show.homepage} target="_blank" class="btn">Visit show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <span class="text-secondary">Status:</span> ${show.status}
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map(company => ` ${company.name}`)}</div>
        </div>`
    showDetailsDiv.appendChild(div);
}

const displayBackdrop = (type, backgroundPath) => {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    }
    else {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }

}

const highlightActiveLink = () => {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === globalState.currentPage)
            link.classList.add('active');
    });        
}

const initSwiper = () => {
    const obj = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: true
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            },
        }
    });
}

const displaySlider = async () => {
    const movies = (await fetchDataFromAPI('movie/now_playing')).results;
    console.log(movies);
    movies.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              <img src=https://image.tmdb.org/t/p/w500/${movie.poster_path} alt=${movie.title} />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>
        `;
        document.querySelector('.swiper-wrapper').appendChild(div);
        initSwiper();
    })
}

const displaySearchedElement = (element) => {
    const div = document.createElement('div');
    div.classList.add('card');
    if (globalState.search.type === 'movie') {
        const poster_path = element.poster_path
            ? `https://image.tmdb.org/t/p/w500/${element.poster_path}`
            : 'images/no-image.jpg';
        div.innerHTML = `
            <a href="/movie-details.html?id=${element.id}">
                <img src=${poster_path} class="card-img-top" alt=${element.title} />
            </a>
            <div class="card-body">
                <h5 class="card-title">${element.title}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${element.release_date}</small>
                </p>
            </div>`
    }
    else if (globalState.search.type === 'tv') {
        const poster_path = element.poster_path
            ? `https://image.tmdb.org/t/p/w500/${element.poster_path}`
            : 'images/no-image.jpg';
        div.innerHTML = `
            <a href="/tv-details.html?id=${element.id}">
                <img src=${poster_path} class="card-img-top" alt=${element.name} />
            </a>
            <div class="card-body">
                <h5 class="card-title">${element.name}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${element.first_air_date}</small>
                </p>
            </div>`
    }
    document.querySelector('#search-results').appendChild(div);
}

const displayPagination = () => {
    document.querySelector('#pagination').innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('pagination');
    div.innerHTML = `
        <div class="pagination">
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${globalState.search.page} of ${globalState.search.totalPages}</div>
        </div>`;
    document.querySelector('#pagination').appendChild(div);
    if (globalState.search.page === 1)
        document.querySelector('#prev').disabled = true;
    if (globalState.search.page === globalState.search.totalPages)
        document.querySelector('#next').disabled = true;
    
    document.querySelector('#next').addEventListener('click', async () => { 
        globalState.search.page++;
        const { results } = await searchApiData();
        document.querySelector('#search-results').innerHTML = ``;
        results.forEach(element => displaySearchedElement(element));
    })
    document.querySelector('#prev').addEventListener('click', async () => { 
        globalState.search.page--;
        const { results } = await searchApiData();
        document.querySelector('#search-results').innerHTML = ``;
        results.forEach(element => displaySearchedElement(element));
    })
}

const search = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    globalState.search.type = urlParams.get('type');
    globalState.search.term = urlParams.get('search-term');

    if (globalState.search.term !== '' && globalState.search.term !== null) {
        const { results, total_results } = await searchApiData();
        document.querySelector('#search-results-heading').innerHTML = `<h2>
        Displaying ${results.length} out of ${total_results} results for '${globalState.search.term}'
        </h2>
        `
        results.forEach(element => displaySearchedElement(element));
    }
    else {
        alert('Please enter a query before searching.');
    }
}

const init = () => {
    highlightActiveLink();
    switch (globalState.currentPage) {
        case '/':
        case '/index.html':
            displaySlider();
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularTvShows();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayTvDetails();
            break;
        case '/search.html':
            search();
            break;
    }
}

document.addEventListener('DOMContentLoaded', init);