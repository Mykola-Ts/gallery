import { selectors, arrCategories } from '../index';

/**
 * Розраховує margin-top для вказаного елемента на підставі розміру фіксованого на сторінці searchWrap
 * @param {HTMLUListElement} element
 */
export const getTopMargin = function getTopMargin(element) {
  const { height } = selectors.searchWrap.getBoundingClientRect();

  const margin = Math.ceil(height);

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

/**
 * Створює розмітку елементів списку категорій на підставі отриманого масиву даних
 * @param {Array} arr
 * @returns {String} Розмітка елементів списку категорій
 */
export const createMarkupCategories = function createMarkupCategories(arr) {
  let idCategory = 0;

  return arr
    .map(({value:{ hits }} = category) => {
      const markup = `<li class="photo-card"><img src="${
        hits[Math.round(Math.random() * (0 - 2) + 2)].webformatURL
      }" alt="" width="640" height="400" loading="lazy" class="img" data-name="${
        arrCategories[idCategory]
      }"/><h3 class="category-name" data-name="${arrCategories[idCategory]}">${
        arrCategories[idCategory]
      }</h3></li>`;

      idCategory += 1;

      return markup;
    })
    .join('');
};
