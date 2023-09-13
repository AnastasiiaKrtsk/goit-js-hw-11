const form = document.querySelector('.search-form');
const searchResults = document.querySelector('.search-results');
const loadMoreButton = document.querySelector('.load-more');
// import Notiflix from 'notiflix';
let page = 1; // Початкова сторінка
const perPage = 40; // Кількість елементів на сторінці
// Add an event listener for the form submission
// Function to fetch and display images
function fetchImages() {
  // Get the user-inputted search query
  const searchQuery = form.querySelector('input[name="searchQuery"]').value;

  // Build the Pixabay API URL
  const apiKey = '39396676-c0c133f58b190a4076952b22b'; // Replace with your API key
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Oops, something went wrong...');
      }
      return response.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        if (page === 1) {
          // Display a message for no results
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search. Please try again.'
          );
        } else {
          // Hide the "Load more" button and show end of results message
          loadMoreButton.style.display = 'none';
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else {
        if (page === 1) {
          // Clear previous search results
          searchResults.innerHTML = '';
        }

        // Display the search results
        data.hits.forEach(image => {
          // Create a card for each image
          const card = document.createElement('div');
          card.classList.add('image-card');

          // Add the image
          const img = document.createElement('img');
          img.src = image.webformatURL;
          img.alt = image.tags;
          card.appendChild(img);

          // Add other information like likes and views
          const info = document.createElement('div');
          info.classList.add('image-info');
          info.innerHTML = `<p>Likes: ${image.likes}</p><p>Views: ${image.views}</p><p>Comments: ${image.comments}</p><p>Downloads: ${image.downloads}</p>`;
          card.appendChild(info);

          // Add the card to the search results
          searchResults.appendChild(card);
        });

        // If there are more results, show the "Load more" button
        if (data.totalHits > page * perPage) {
          loadMoreButton.style.display = 'block';
        } else {
          loadMoreButton.style.display = 'none';
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors from the fetch or JSON parsing
    });
}

// Add an event listener for the form submission
form.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the default form submission behavior
  page = 1; // Reset the page to 1 for a new search
  fetchImages(); // Fetch and display images
});

// Add an event listener for the "Load more" button
loadMoreButton.addEventListener('click', function () {
  page++; // Increment the page for the next set of results
  fetchImages(); // Fetch and display more images
});
