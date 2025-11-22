import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import errorUrl from './img/error.svg';

import * as pixabay from './js/pixabay-api.js';
import * as render from './js/render-functions.js';

render.initLightbox();

const refs = {
  searchFormEl: document.querySelector('.form'),
  galleryContainer: document.querySelector('.gallery'),
  loaderEl: document.querySelector('.loader'),
  loadMoreBtnEl: document.querySelector('.load-more'),
  endMessageEl: document.querySelector('.end-message'),
};

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
let loadedImagesCount = 0;

function toastError(message) {
  iziToast.error({
    message,
    position: 'topRight',
    backgroundColor: '#ef4040',
    titleColor: '#fff',
    messageColor: '#fff',
    progressBarColor: '#b51b1b',
    iconUrl: errorUrl,
    close: true,
    class: 'my-toast',
  });
}

const searchFormFunction = async e => {
  e.preventDefault();
  const query = e.target.elements['search-text'].value.trim();

  if (!query) {
    toastError('Fill the form please');
    return;
  }

  currentQuery = query;
  currentPage = 1;
  loadedImagesCount = 0;

  render.hideLoadMoreButton(refs.loadMoreBtnEl);
  render.hideEndMessage(refs.endMessageEl);
  render.clearGallery(refs.galleryContainer);
  render.showLoader(refs.loaderEl);

  try {
    const { hits, totalHits: total } = await pixabay.getImagesByQuery(
      currentQuery,
      currentPage
    );

    totalHits = total;
    loadedImagesCount += hits.length;

    render.createGallery(refs.galleryContainer, hits);
    render.refreshLightbox();

    if (loadedImagesCount >= totalHits) {
      render.showEndMessage(refs.endMessageEl);
    } else {
      render.showLoadMoreButton(refs.loadMoreBtnEl);
    }

    currentPage += 1;
  } catch (error) {
    if (error.message === 'EMPTY_QUERY') toastError('Fill the form please');
    if (error.message === 'NO_RESULTS')
      toastError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
    else toastError('Failed to fetch images. Please try again later.');
  } finally {
    render.hideLoader(refs.loaderEl);
  }
};

const loadMoreFunction = async () => {
  render.hideLoadMoreButton(refs.loadMoreBtnEl);
  render.showLoader(refs.loaderEl);

  try {
    const { hits, totalHits: total } = await pixabay.getImagesByQuery(
      currentQuery,
      currentPage
    );

    totalHits = total;
    loadedImagesCount += hits.length;

    render.createGallery(refs.galleryContainer, hits);
    render.refreshLightbox();

    if (loadedImagesCount >= totalHits) {
      render.showEndMessage(refs.endMessageEl);
    } else {
      render.showLoadMoreButton(refs.loadMoreBtnEl);
    }

    // Smooth scroll
    const lastCard = refs.galleryContainer.querySelector(
      '.gallery-item:last-child'
    );
    if (lastCard) {
      const cardHeight = lastCard.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    currentPage += 1;
  } catch (error) {
    toastError('Failed to fetch more images. Please try again later.');
  } finally {
    render.hideLoader(refs.loaderEl);
  }
};

refs.searchFormEl.addEventListener('submit', searchFormFunction);
refs.loadMoreBtnEl.addEventListener('click', loadMoreFunction);
