import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImagesByQuery } from './js/pixabay-api';
import { createMarkupGallery } from './js/create-markup-gallary';
import { getTopMargin } from './js/create-markup-gallary';
import { showBackToTopBtn } from './js/scroll-to-top';
import { scrollToTop } from './js/scroll-to-top';
import { getInfoMessage, getSuccessMessage } from './js/notify-message';
import { getFailureMessage } from './js/notify-message';
import { closeMessageNotify } from './js/notify-message';

export const selectors = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  searchQueryInput: document.querySelector('input[name="searchQuery"]'),
  guardGallery: document.querySelector('.js-guard-gallery'),
  loader: document.querySelector('.loader-wrap'),
  backToTopBtn: document.querySelector('.back-to-top-btn'),
  searchWrap: document.querySelector('.search-wrap'),
};
export const parametersRequest = {
  searchQuery: '',
  page: 1,
  perPage: 40,
  totalHits: 0,
};
export let gallerySimpleLightbox;
const optionsSimpleLightbox = {
  captionsData: 'title',
  captionDelay: 250,
  overlayOpacity: 0.9,
  loop: false,
};

selectors.searchForm.addEventListener('submit', handlerSearch);

window.onscroll = showBackToTopBtn;

selectors.backToTopBtn.addEventListener('click', scrollToTop);

/**
 * Пошук зображень на Pixabay API за ключовим словом, введеним в searchQueryInput, та іх перегляд
 * @param {SubmitEvent} evt
 */
function handlerSearch(evt) {
  evt.preventDefault();

  closeMessageNotify('#NotiflixNotifyWrap');

  parametersRequest.page = 1;

  if (selectors.guardGallery.hidden === false) {
    selectors.guardGallery.hidden = true;
  }

  selectors.gallery.innerHTML = '';

  selectors.loader.classList.add('loader-wrap-top');
  selectors.loader.classList.remove('visually-hidden');

  parametersRequest.searchQuery =
    selectors.searchQueryInput.value.toLowerCase();

    if (!parametersRequest.searchQuery) {
        selectors.loader.classList.add('visually-hidden');
        getInfoMessage('Input field is empty. Enter search query!', 'center-right');
        return;
      }

  fetchImagesByQuery(parametersRequest.searchQuery, parametersRequest.page)
    .then(data => {
      const { totalHits, hits } = data;
      const optionsObserver = {
        root: null,
        rootMargin: '600px',
        threshold: 0,
      };
      const observer = new IntersectionObserver(
        handlerPagination,
        optionsObserver
      );

      parametersRequest.totalHits = totalHits;

      if (hits.length > 0) {
        selectors.gallery.innerHTML = createMarkupGallery(hits);

        getTopMargin();

        gallerySimpleLightbox = new SimpleLightbox(
          '.gallery a',
          optionsSimpleLightbox
        );

        getSuccessMessage(
          `Hooray! We found ${parametersRequest.totalHits} images.`
        );

        if (selectors.guardGallery.hidden === true) {
            selectors.guardGallery.hidden = false;
          }

        observer.observe(selectors.guardGallery);
      } else {
        getFailureMessage(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(err =>
      getFailureMessage(`Oops! Something went wrong! Try reloading the page!
      (${err})`)
    )
    .finally(() => {
      selectors.loader.classList.add('visually-hidden');
      selectors.loader.classList.remove('loader-wrap-top');
    });
}

/**
 * Нескінченне завантаження зображень під час прокручування сторінки
 * @param {Array} entries
 */
export const handlerPagination = function handlerPagination(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (
          isLastPage(
            parametersRequest.totalHits,
            parametersRequest.page,
            parametersRequest.perPage
          )
        ) {
          return;
        }
  
        parametersRequest.page += 1;
        selectors.loader.classList.add('loader-wrap-bottom');
        selectors.loader.classList.remove('visually-hidden');
  
        fetchImagesByQuery(parametersRequest.searchQuery, parametersRequest.page)
          .then(data => {
            const { totalHits, hits } = data;
  
            if (hits.length > 0) {
              selectors.gallery.insertAdjacentHTML(
                'beforeend',
                createMarkupGallery(hits)
              );
  
              gallerySimpleLightbox.refresh();
            } else {
              getFailureMessage(
                'Sorry, there are no images matching your search query. Please try again.'
              );
            }
          })
          .catch(err =>
            getFailureMessage(`Oops! Something went wrong! Try reloading the page! 
            (${err})`)
          )
          .finally(() => {
            selectors.loader.classList.add('visually-hidden');
            selectors.loader.classList.remove('loader-wrap-bottom');
          });
      } else {
        closeMessageNotify('.notiflix-notify-info');
      }
    });
  };

/**
 * Розраховує загальну кількість сторінок та перевіряє, чи поточна сторінка є останнью.
 * Якщо так, то показує Notify.info повідомлення та повертає true
 * @param {Number} totalItems
 * @param {Number} page
 * @param {Number} perPage
 * @returns {Boolean} true
 */
export const isLastPage = function isLastPage(totalItems, page, perPage) {
    const totalPage = Math.ceil(totalItems / perPage);
  
    if (page >= totalPage) {
      getInfoMessage(
        "We're sorry, but you've reached the end of search results."
      );
  
      return true;
    }
  };
