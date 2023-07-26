import axios from 'axios';
import { parametersRequest, arrCategories } from '../index';

/**
 * Виконує HTTP-запит за пошуковим значенням і повертає проміс із об'єктом даних
 * @param {String} query
 * @param {Number} page
 * @returns {Promise} Проміс із об'єктом даних
 */
export const fetchImagesByQuery = async function fetchImagesByQuery(
  query,
  page = 1
) {
  const options = {
    q: query,
    imageType: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    perPage: parametersRequest.perPage,
  };

  const resp = await axios.get(
    `${parametersRequest.BASE_URL}?key=${parametersRequest.API_KEY}&q=${options.q}&image_type=${options.imageType}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${options.page}&per_page=${options.perPage}`
  );

  if (resp.status !== 200) {
    throw new Error(resp.statusText);
  }

  return await resp.data;
};

/**
 * Виконує HTTP-запити за значеннями масиву категорій та повертає проміс із масивом об'єктів
 * @returns {Promise} Проміс із масивом об'єктів
 */
export const fetchImagesByCategory = async function fetchImagesByCategory() {
  const options = {
    imageType: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    perPage: 3,
  };
  const arrOfPromises = arrCategories.map(async category => {
    const resp = await axios.get(
      `${parametersRequest.BASE_URL}?key=${parametersRequest.API_KEY}&q=${category}&image_type=${options.imageType}&orientation=${options.orientation}&safesearch=${options.safesearch}&per_page=${options.perPage}`
    );

    if (resp.status !== 200) {
      throw new Error(resp.statusText);
    }

    return await resp.data;
  });

  const data = (await Promise.allSettled(arrOfPromises)).filter(
    ({ status }) => status === 'fulfilled'
  );

  if (!data.length) {
    throw new Error(resp.statusText);
  }

  return data;
};
