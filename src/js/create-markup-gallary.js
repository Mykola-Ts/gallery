import { selectors } from '../index';

/**
 * Розраховує margin-top для вказаного елемента на підставі розміру фіксованого на сторінці searchWrap
 * @param {HTMLUListElement} element
 */
export const getTopMargin = function getTopMargin(element) {
  const { height } = selectors.searchWrap.getBoundingClientRect();

  const margin = Math.ceil(height) + 20;

  element.style.marginTop = `${margin}px`;
};

/**
 * Створює розмітку елементів галереї на підставі отриманого масиву даних
 * @param {Array} arr
 * @returns {String} Розмітка елементів галереї
 */
export const createMarkupGallery = function createMarkupGallery(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<li class="photo-card">
      <a href="${largeImageURL}" class="img-card"><img src="${webformatURL}" alt="${tags}" title="Tags: ${tags}" width="640" height="400" loading="lazy" class="img"/><div class="info">
      <p class="info-item">
        <span>Likes: </span>${likes}
      </p>
      <p class="info-item">
        <span>Views: </span>${views}
      </p>
      <p class="info-item">
        <span>Comments: </span>${comments}
      </p>
      <p class="info-item">
        <span>Downloads: </span>${downloads}
      </p>
    </div></a>
  </li>`
    )
    .join('');
};
