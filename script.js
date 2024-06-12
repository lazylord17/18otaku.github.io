document.getElementById('search-button').addEventListener('click', function() {
    initiateSearch();
});

document.getElementById('search-box').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        initiateSearch();
    }
});

async function initiateSearch() {
    let query = document.getElementById('search-box').value.trim();
    if (query === '') return;

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
        const data = await response.json();
        
        const filteredResults = data.data.filter(anime => {
            return anime.genres.some(genre => ['Hentai', 'Erotica'].includes(genre.name));
        });

        displayResults(filteredResults);
    } catch (error) {
        console.error('Error fetching anime data:', error);
    }
}

function displayResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');

        const poster = document.createElement('div');
        poster.classList.add('anime-poster');

        const posterImage = document.createElement('img');
        posterImage.src = anime.images.jpg.image_url;
        posterImage.alt = anime.title;
        poster.appendChild(posterImage);

                // Add score to poster
        const score = document.createElement('div');
        score.classList.add('anime-score');
        score.textContent = `Score: ${anime.score}`;
        poster.appendChild(score);

        animeCard.appendChild(poster);

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('anime-details');

        const title = document.createElement('div');
        title.textContent = anime.title;
        title.classList.add('anime-title');
        detailsContainer.appendChild(title);

        const alternativeTitles = document.createElement('div');
        alternativeTitles.textContent = `Alternative Titles: ${anime.title_synonyms.join(', ')}`;
        detailsContainer.appendChild(alternativeTitles);

        const type = document.createElement('div');
        type.textContent = `Type: ${anime.type}`;
        detailsContainer.appendChild(type);

        const episodes = document.createElement('div');
        episodes.textContent = `Episodes: ${anime.episodes}`;
        detailsContainer.appendChild(episodes);

        const status = document.createElement('div');
        status.textContent = `Status: ${anime.status}`;
        detailsContainer.appendChild(status);

        const aired = document.createElement('div');
        aired.textContent = `Aired: ${anime.aired.string}`;
        detailsContainer.appendChild(aired);

        const synopsis = document.createElement('div');
        synopsis.textContent = `Synopsis: ${anime.synopsis}`;
        synopsis.classList.add('anime-synopsis');
        detailsContainer.appendChild(synopsis);

        // Add Watch Here heading
        const watchHeading = document.createElement('div');
        watchHeading.textContent = 'Watch Here';
        watchHeading.classList.add('watch-heading');
        detailsContainer.appendChild(watchHeading);

        // Add episode buttons
        const animeDataContainer = document.getElementById('anime-data');
        const animeData = animeDataContainer.querySelector(`.anime[data-mal-id="${anime.mal_id}"]`);
        if (animeData) {
            const episodes = animeData.querySelectorAll('.episode');
            episodes.forEach(ep => {
                const episodeButton = document.createElement('button');
                episodeButton.classList.add('episode-button');
                episodeButton.textContent = `EP ${ep.dataset.epNum} (${ep.dataset.epLan})`;
                episodeButton.dataset.videoId = ep.dataset.videoId;
                episodeButton.addEventListener('click', function() {
                    openModal(ep.dataset.videoId);
                });
                detailsContainer.appendChild(episodeButton);
            });
        }

        animeCard.appendChild(detailsContainer);
        searchResultsContainer.appendChild(animeCard);
    });

    // Show the search results
    searchResultsContainer.classList.remove('hidden');
}

function openModal(videoId) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-frame');
    iframe.src = `https://nhplayer.com/v/${videoId}`;
    modal.style.display = 'block';
}

document.querySelector('.close-button').addEventListener('click', function() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-frame');
    iframe.src = '';
    modal.style.display = 'none';
});

// Remove event listener for closing modal on outside click
window.removeEventListener('click', function(event) {
    const modal = document.getElementById('video-modal');
    if (event.target == modal) {
        const iframe = document.getElementById('video-frame');
        iframe.src = '';
        modal.style.display = 'none';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    let searchContainer = document.querySelector('.search-container');

    // Add scroll event listener
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            searchContainer.classList.add('fade-out'); // Add fade-out class when scrolled down
        } else {
            searchContainer.classList.remove('fade-out'); // Remove fade-out class when scrolled up
        }
    });
});
