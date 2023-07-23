import { selectors } from "../index";

/**
 * Розраховує margin-top для gallery на підставі розміру фіксованого на сторінці searchWrap
 */
export const getTopMargin = function getTopMargin() {
  const { height } = selectors.searchWrap.getBoundingClientRect();

  const margin = Math.ceil(height) + 20;

  selectors.gallery.style.marginTop = `${margin}px`;
}

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
      <a href="${largeImageURL}" class="img-card"><img src="${webformatURL}" alt="${tags}" title="Tags: ${tags}" width="640" height="400" loading="lazy"/><div class="info">
      <p class="info-item">
        <b>Likes: </b>${likes}
      </p>
      <p class="info-item">
        <b>Views: </b>${views}
      </p>
      <p class="info-item">
        <b>Comments: </b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads: </b>${downloads}
      </p>
    </div></a>
  </li>`
      )
      .join('');
  }