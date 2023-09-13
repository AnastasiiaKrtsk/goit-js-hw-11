import axios from 'axios';
const api_key = '39396676-c0c133f58b190a4076952b22b';
const url = 'https://pixabay.com/api';

export function fetchPic() {
  return axios
    .get(url, {
      headers: {
        'x-api-key': api_key,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
export function fetchCatByBreed(breedId) {
  const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;

  return axios.get(url, {
    headers: {
      'x-api-key': api_key,
    },
  });
}
const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;
