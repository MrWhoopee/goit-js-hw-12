import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import errorUrl from '../img/error.svg';

const API_KEY = '53315678-7a3c0068dfc1cc7897b28f029';
const BASE_URL = 'https://pixabay.com/api/';

function getIziToastErrorOptions(message) {
  return {
    message,
    position: 'topRight',
    backgroundColor: '#ef4040',
    titleColor: '#fff',
    messageColor: '#fff',
    progressBarColor: '#b51b1b',
    iconUrl: errorUrl,
    close: true,
    class: 'my-toast',
  };
}

export async function getImagesByQuery(query, page = 1) {
  try {
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

    if (response.data.hits.length === 0) {
      iziToast.error(
        getIziToastErrorOptions(
          'Sorry, there are no images matching your search query. Please try again!'
        )
      );
      return null;
    }

    return {
      hits: response.data.hits,
      totalHits: response.data.totalHits,
    };
  } catch (error) {
    iziToast.error(
      getIziToastErrorOptions('Failed to fetch images. Please try again later.')
    );
    throw error;
  }
}
