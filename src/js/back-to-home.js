import { selectors, observer } from "../index";
import { scrollToTop } from "./scroll-to-top";
import { closeMessageNotify } from "./notify-message";

/**
 * Оновлює інтерфейс сторінки до початкового стану без перезавантаження сторінки
 */
export const handlerBackToHome = function handlerBackToHome() {
    scrollToTop();
  
    selectors.searchQueryInput.value = '';
  
    closeMessageNotify('#NotiflixNotifyWrap');
  
    if (selectors.categoriesWrap.classList.contains('visually-hidden')) {
      selectors.categoriesWrap.classList.remove('visually-hidden');
    }
  
    if (!selectors.endGallery.classList.contains('visually-hidden')) {
      selectors.endGallery.classList.add('visually-hidden');
    }
  
    selectors.gallery.innerHTML = '';
    selectors.galleryWrap.classList.add('visually-hidden');
    selectors.galleryWrap.style.marginTop = 0;
  
    observer.unobserve(selectors.guardGallery);
  }
