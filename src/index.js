import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImagesByQuery, fetchImagesByCategory } from './js/pixabay-api';
import {
  createMarkupGallery,
  getTopMargin,
  createMarkupCategories,
} from './js/create-markup';
import { showBackToTopBtn, scrollToTop } from './js/scroll-to-top';
import {
  getInfoMessage,
  getSuccessMessage,
  getFailureMessage,
  closeMessageNotify,
} from './js/notify-message';
import { handlerBackToHome } from './js/back-to-home';

export const selectors = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  searchQueryInput: document.querySelector('input[name="searchQuery"]'),
  guardGallery: document.querySelector('.js-guard-gallery'),
  loader: document.querySelector('.loader-wrap'),
  backToTopBtn: document.querySelector('.back-to-top-btn'),
  searchWrap: document.querySelector('.search-wrap'),
  endGallery: document.querySelector('.end-gallery'),
  homeBtn: document.querySelector('.home-btn'),
  categories: document.querySelector('.categories'),
  categoriesWrap: document.querySelector('.categories-wrap'),
  galleryWrap: document.querySelector('.gallery-wrap'),
  galleryTitle: document.querySelector('.gallery-title'),
};
export const parametersRequest = {
  BASE_URL: 'https://pixabay.com/api/',
  API_KEY: '38342834-eb43385299074b454791d917b',
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
const optionsObserver = {
  root: null,
  rootMargin: '600px',
  threshold: 0,
};
export const observer = new IntersectionObserver(
  handlerPagination,
  optionsObserver
);

selectors.searchForm.addEventListener('submit', handlerSearch);

window.onscroll = showBackToTopBtn;

selectors.backToTopBtn.addEventListener('click', scrollToTop);

/**
 * Пошук зображень на Pixabay API за ключовим словом, введеним в searchQueryInput, та іх перегляд
 * @param {SubmitEvent} evt
 */
function handlerSearch(evt) {
  evt.preventDefault();

  if (selectors.guardGallery.hidden === false) {
    selectors.guardGallery.hidden = true;
  }

  if (!selectors.endGallery.classList.contains('visually-hidden')) {
    selectors.endGallery.classList.add('visually-hidden');
  }

  selectors.categoriesWrap.classList.add('visually-hidden');
  selectors.galleryTitle.classList.add('visually-hidden');
  selectors.loader.classList.add('loader-wrap-top');
  selectors.loader.classList.remove('visually-hidden');

  selectors.gallery.innerHTML = '';
  selectors.galleryTitle.textContent = '';
  selectors.galleryWrap.style.marginTop = 0;

  closeMessageNotify('#NotiflixNotifyWrap');

  parametersRequest.page = 1;

  parametersRequest.searchQuery = selectors.searchQueryInput.value
    .toLowerCase()
    .trim();

  if (!parametersRequest.searchQuery) {
    selectors.loader.classList.add('visually-hidden');
    selectors.categoriesWrap.classList.remove('visually-hidden');

    getInfoMessage('Input field is empty. Enter search query!');

    return;
  }

  fetchImagesByQuery(parametersRequest.searchQuery, parametersRequest.page)
    .then(data => {
      const { totalHits, hits } = data;

      parametersRequest.totalHits = totalHits;

      if (hits.length > 0) {
        selectors.gallery.innerHTML = createMarkupGallery(hits);

        if (selectors.galleryWrap.classList.contains('visually-hidden')) {
          selectors.galleryWrap.classList.remove('visually-hidden');
        }

        getTopMargin(selectors.gallery);

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
        selectors.categoriesWrap.classList.remove('visually-hidden');

        getFailureMessage(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(err =>
      getFailureMessage(`Oops! Something went wrong! Try reloading the page!<br/>
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
function handlerPagination(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    }

    if (
      isLastPage(
        parametersRequest.totalHits,
        parametersRequest.page,
        parametersRequest.perPage
      )
    ) {
      return;
    }

    selectors.loader.classList.add('loader-wrap-bottom');
    selectors.loader.classList.remove('visually-hidden');

    parametersRequest.page += 1;

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
  });
}

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
    selectors.endGallery.classList.remove('visually-hidden');

    return true;
  }
};

// ------------------- Categories -------------------

export const arrCategories = [
  'fashion',
  'nature',
  'animals',
  'sports',
  'education',
  'travel',
  'transportation',
  'health',
  'people',
  'places',
  'food',
  'computer',
  'science',
  'music',
  'buildings',
  'business',
];

selectors.homeBtn.addEventListener('click', handlerBackToHome);

fetchImagesByCategory()
  .then(data => {
    selectors.categories.innerHTML = createMarkupCategories(data);

    if (selectors.galleryWrap.classList.contains('visually-hidden')) {
      selectors.galleryWrap.classList.remove('visually-hidden');
    }

    selectors.categoriesWrap.classList.remove('visually-hidden');

    getTopMargin(selectors.categoriesWrap);
  })
  .catch(err => {
    selectors.categoriesWrap.classList.add('visually-hidden');

    getFailureMessage(`Oops! Something went wrong! Try reloading the page!
      (${err})`);
  })
  .finally(() => {
    selectors.loader.classList.add('visually-hidden');
    selectors.loader.classList.remove('loader-wrap-top');
  });

selectors.categories.addEventListener('click', handlerSearchImagesByCategory);

/**
 * Пошук зображень на Pixabay API за обраною зі списку категорією та іх перегляд
 * @param {PointerEvent} evt
 */
function handlerSearchImagesByCategory(evt) {
  if (evt.target.classList.contains('categories')) {
    return;
  }

  parametersRequest.searchQuery = evt.target.dataset.name;

  fetchImagesByQuery(evt.target.dataset.name, parametersRequest.page)
    .then(data => {
      const { totalHits, hits } = data;

      parametersRequest.totalHits = totalHits;

      if (hits.length > 0) {
        selectors.galleryTitle.textContent = evt.target.dataset.name;
        selectors.gallery.innerHTML = createMarkupGallery(hits);
        selectors.gallery.style.marginTop = 0;

        if (selectors.galleryWrap.classList.contains('visually-hidden')) {
          selectors.galleryWrap.classList.remove('visually-hidden');
        }

        getTopMargin(selectors.galleryWrap);

        gallerySimpleLightbox = new SimpleLightbox(
          '.gallery a',
          optionsSimpleLightbox
        );

        selectors.galleryTitle.classList.remove('visually-hidden');

        selectors.galleryWrap.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

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
