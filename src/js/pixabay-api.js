import axios from 'axios';

const API_KEY = '53315678-7a3c0068dfc1cc7897b28f029';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  if (!query) throw new Error('EMPTY_QUERY');

  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 15,
    },
  });

  const { hits, totalHits } = response.data;

  if (hits.length === 0) throw new Error('NO_RESULTS');

  return { hits, totalHits };
}
