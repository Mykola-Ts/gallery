import axios from 'axios';
import { parametersRequest } from '../index';

/**
 * Виконує HTTP-запит за пошуковим значенням і повертає проміс із об'єктом даних
 * @param {String} query
 * @param {Number} page
 * @returns {Promise} Проміс із об'єктом даних
 */
export const fetchImagesByQuery = async function fetchImagesByQuery(
  query,
  page
) {
  const options = {
    BASE_URL: 'https://pixabay.com/api/',
    API_KEY: '38342834-eb43385299074b454791d917b',
    q: query,
    imageType: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    perPage: parametersRequest.perPage,
  };

  const resp = await axios.get(
    `${options.BASE_URL}?key=${options.API_KEY}&q=${options.q}&image_type=${options.imageType}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${options.page}&per_page=${options.perPage}`
  );

  if (resp.status !== 200) {
    throw new Error(resp.statusText);
  }

  const data = await resp.data;

  return data;
};
