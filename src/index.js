import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const selectors = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  searchQueryInput: document.querySelector('input[name="searchQuery"]'),
  guardGallery: document.querySelector('.js-guard-gallery'),
  loader: document.querySelector('.loader-wrap'),
  backToTopBtn: document.querySelector('.back-to-top-btn'),
  searchWrap: document.querySelector('.search-wrap'),
};
const parametersRequest = {
  searchQuery: '',
  page: 1,
  perPage: 40,
  totalHits: 0,
};
const optionsSimpleLightbox = {
  captionsData: 'title',
  captionDelay: 250,
  overlayOpacity: 0.9,
  loop: false,
};
let gallerySimpleLightbox;

selectors.searchForm.addEventListener('submit', handlerSearch);

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

  fetchImagesByQuery(parametersRequest.searchQuery, parametersRequest.page)
    .then(data => {
      console.log(data);

      const { totalHits, hits } = data;
      const optionsObserver = {
        root: null,
        rootMargin: '800px',
        threshold: 0,
      };
      const observer = new IntersectionObserver(
        handlerPagination,
        optionsObserver
      );

      parametersRequest.totalHits = totalHits;

      if (hits.length > 0) {
        selectors.gallery.innerHTML = createMarkup(data);

        getTopPadding();

        gallerySimpleLightbox = new SimpleLightbox(
          '.gallery a',
          optionsSimpleLightbox
        );

        smoothScrollGallary();

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
    .catch(err => console.log(err))
    .finally(() => {
      selectors.loader.classList.add('visually-hidden');
      selectors.loader.classList.remove('loader-wrap-top');
    });
}

function fetchImagesByQuery(query, page) {
  const options = {
    BASE_URL: 'https://pixabay.com/api/',
    API_KEY: '38342834-eb43385299074b454791d917b',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: parametersRequest.page,
    per_page: parametersRequest.perPage,
  };

  return axios
    .get(
      `${options.BASE_URL}?key=${options.API_KEY}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${options.page}&per_page=${options.per_page}`
    )
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(resp.statusText);
      }

      return resp.data;
    });
}

function createMarkup({ hits }) {
  return hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => `<div class="photo-card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" title="Tags: ${tags}"width="640" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
  ).join('');
}

function getSuccessMessage(message) {
  const options = { cssAnimationStyle: 'from-top' };

  Notify.success(message, options);
}

function getFailureMessage(message) {
  const options = { cssAnimationStyle: 'from-top', closeButton: true };

  Notify.failure(message, options);
}

function getInfoMessage(message) {
  const options = {
    position: 'center-bottom',
    cssAnimationStyle: 'from-bottom',
  };

  closeMessageNotify('.notiflix-notify-info');

  Notify.info(message, options);
}

function closeMessageNotify(selector) {
  if (!document.querySelector(selector)) {
    return;
  }

  const errorNotify = document.querySelector(selector);
  errorNotify.remove();
}

function handlerPagination(entries) {
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
          console.log(data);

          const { totalHits, hits } = data;

          if (hits.length > 0) {
            selectors.gallery.insertAdjacentHTML(
              'beforeend',
              createMarkup(data)
            );

            gallerySimpleLightbox.refresh();
          } else {
            getFailureMessage(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          selectors.loader.classList.add('visually-hidden');
          selectors.loader.classList.remove('loader-wrap-bottom');
        });
    } else {
      if (document.querySelector('.notiflix-notify-info')) {
        const infoMessage = document.querySelector('.notiflix-notify-info');

        infoMessage.remove();
      }
    }
  });
}

function isLastPage(totalItems, page, perPage) {
  const totalPage = Math.ceil(totalItems / perPage);

  if (page >= totalPage) {
    getInfoMessage(
      "We're sorry, but you've reached the end of search results."
    );

    return true;
  }
}

function smoothScrollGallary() {
  //   const { height: cardHeight } =
  //     selectors.gallery.firstElementChild.getBoundingClientRect();
  //   window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}

window.onscroll = scrollFunction;

selectors.backToTopBtn.addEventListener('click', topFunction);

// When the user scrolls down 20px from the top of the document, show the button
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    selectors.backToTopBtn.classList.remove('visually-hidden');
  } else {
    selectors.backToTopBtn.classList.add('visually-hidden');
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function getTopPadding() {
  const { height } = selectors.searchWrap.getBoundingClientRect();

  const margin = Math.ceil(height) + 20;

  selectors.gallery.style.marginTop = `${margin}px`;
}
