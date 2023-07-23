import { selectors } from "../index";

/**
 * Показує backToTopBtn при скролі сторінки вниз на 20px
 */
export const showBackToTopBtn = function showBackToTopBtn() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      selectors.backToTopBtn.classList.remove('visually-hidden');
    } else {
      selectors.backToTopBtn.classList.add('visually-hidden');
    }
  }
  
  /**
   * Скролить на верх сторінки
   */
  export const scrollToTop = function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }