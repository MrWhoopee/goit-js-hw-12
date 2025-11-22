import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import * as pixabay from './js/pixabay-api.js';
import * as render from './js/render-functions.js';

const refs = {
  searchFormEl: document.querySelector('.form'),
  galleryContainer: document.querySelector('.gallery'),
  loaderEl: document.querySelector('.loader'),
  loadMoreBtnEl: document.querySelector('.load-more'),
  endMessageEl: document.querySelector('.end-message'),
};

let lightbox = new SimpleLightbox('.gallery-item a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
let loadedImagesCount = 0;

const searchFormFunction = async e => {
  e.preventDefault();
  const query = e.target.elements['search-text'].value.trim();
  if (!query) return;

  // If new search, update query
  if (query !== currentQuery) {
    currentQuery = query;
  }

  // Always reset pagination on form submit
  currentPage = 1;
  loadedImagesCount = 0;

  // Hide button and message on new search
  render.hideLoadMoreButton(refs.loadMoreBtnEl);
  render.hideEndMessage(refs.endMessageEl);
  render.clearGallery(refs.galleryContainer);
  render.showLoader(refs.loaderEl);

  try {
    const result = await pixabay.getImagesByQuery(currentQuery, currentPage);

    if (!result) {
      return;
    }

    const { hits, totalHits: total } = result;
    totalHits = total;
    loadedImagesCount += hits.length;

    render.createGallery(refs.galleryContainer, hits);
    lightbox.refresh();

    // Check if we've reached the end of the collection
    if (loadedImagesCount >= totalHits) {
      render.hideLoadMoreButton(refs.loadMoreBtnEl);
      render.showEndMessage(refs.endMessageEl);
    } else {
      render.showLoadMoreButton(refs.loadMoreBtnEl);
      render.hideEndMessage(refs.endMessageEl);
    }

    currentPage += 1;
  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
    render.hideLoader(refs.loaderEl);
  }
};

const loadMoreFunction = async () => {
  render.hideLoadMoreButton(refs.loadMoreBtnEl);
  render.showLoader(refs.loaderEl);

  try {
    const result = await pixabay.getImagesByQuery(currentQuery, currentPage);

    if (!result) {
      return;
    }

    const { hits, totalHits: total } = result;
    totalHits = total;
    loadedImagesCount += hits.length;

    render.createGallery(refs.galleryContainer, hits);
    lightbox.refresh();

    // Check if we've reached the end of the collection
    if (loadedImagesCount >= totalHits) {
      render.hideLoadMoreButton(refs.loadMoreBtnEl);
      render.showEndMessage(refs.endMessageEl);
    } else {
      render.showLoadMoreButton(refs.loadMoreBtnEl);
      render.hideEndMessage(refs.endMessageEl);
    }

    // Smooth scrolling
    const galleryItems =
      refs.galleryContainer.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      const lastCard = galleryItems[galleryItems.length - 1];
      const cardHeight = lastCard.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    currentPage += 1;
  } catch (error) {
    console.error('Error fetching more images:', error);
  } finally {
    render.hideLoader(refs.loaderEl);
  }
};

refs.searchFormEl.addEventListener('submit', searchFormFunction);
refs.loadMoreBtnEl.addEventListener('click', loadMoreFunction);
