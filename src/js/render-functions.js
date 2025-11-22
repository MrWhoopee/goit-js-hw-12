import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = null;

export function initLightbox() {
  lightbox = new SimpleLightbox('.gallery-item a', {
    captions: true,
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}

export function refreshLightbox() {
  if (lightbox) lightbox.refresh();
}

export function createGallery(container, images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="gallery-item">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="gallery-info">
            <p><b>Likes:</b> ${likes}</p>
            <p><b>Views:</b> ${views}</p>
            <p><b>Comments:</b> ${comments}</p>
            <p><b>Downloads:</b> ${downloads}</p>
          </div>
        </li>`
    )
    .join('');

  container.insertAdjacentHTML('beforeend', markup);
}

export function clearGallery(container) {
  container.innerHTML = '';
}

export function showLoader(loader) {
  loader.classList.remove('visually-hidden');
}
export function hideLoader(loader) {
  loader.classList.add('visually-hidden');
}

export function showLoadMoreButton(button) {
  button.classList.remove('visually-hidden');
}

export function hideLoadMoreButton(button) {
  button.classList.add('visually-hidden');
}

export function showEndMessage(messageEl) {
  messageEl.classList.remove('visually-hidden');
}

export function hideEndMessage(messageEl) {
  messageEl.classList.add('visually-hidden');
}
