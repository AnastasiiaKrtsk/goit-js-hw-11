import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const searchResults = document.querySelector('.search-results');
const loadMoreButton = document.querySelector('.load-more');
let page = 1;
const perPage = 40;
let totalHits = 0;

function fetchImages(searchQuery, page) {
  const apiKey = '39396676-c0c133f58b190a4076952b22b';
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Oops, something went wrong...');
      }
      return response.json();
    })
    .then(data => {
      totalHits = data.totalHits;

      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search.'
        );
        loadMoreButton.style.display = 'none';
      } else {
        data.hits.forEach(image => {
          const card = document.createElement('div');
          card.classList.add('image-card');

          const imgLink = document.createElement('a');
          imgLink.href = image.largeImageURL;
          imgLink.dataset.lightbox = 'gallery';
          imgLink.setAttribute('data-title', image.tags);

          const img = document.createElement('img');
          img.src = image.webformatURL;
          img.alt = image.tags;

          imgLink.appendChild(img);
          card.appendChild(imgLink);
          searchResults.appendChild(card);

          const info = document.createElement('div');
          info.classList.add('image-info');
          info.innerHTML = `
    <p class="info-item">Likes: ${image.likes}</p>
    <p class="info-item">Views: ${image.views}</p>
    <p class="info-item">Comments: ${image.comments}</p>
    <p class="info-item">Downloads: ${image.downloads}</p>
  `;
          card.appendChild(info);
        });
        showLoadMoreBtn();
      }
      if (page * perPage >= totalHits && data.hits.length > 0) {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info("You've reached the end of search results.");
      } else if (page === 1) {
        Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      }
      const lightbox = new SimpleLightbox('.image-card a', {});
      lightbox.refresh();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
function showLoadMoreBtn() {
  loadMoreButton.style.display = 'block';
}
form.addEventListener('submit', function (e) {
  e.preventDefault();
  page = 1;
  const searchQuery = form.querySelector('input[name="searchQuery"]').value;
  searchResults.innerHTML = '';
  fetchImages(searchQuery, page);
});

loadMoreButton.addEventListener('click', function () {
  page++;
  const searchQuery = form.querySelector('input[name="searchQuery"]').value;
  fetchImages(searchQuery, page);
});
