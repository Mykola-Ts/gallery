import { Notify } from 'notiflix/build/notiflix-notify-aio';

/**
 * Показує Notify.success повідомлення із зазначеним текстом
 * @param {String} message
 */
export const getSuccessMessage = function getSuccessMessage(message) {
  const options = { cssAnimationStyle: 'from-top' };

  Notify.success(message, options);
};

/**
 * Показує Notify.failure повідомлення із зазначеним текстом
 * @param {String} message
 */
export const getFailureMessage = function getFailureMessage(message) {
  const options = {
    cssAnimationStyle: 'from-top',
    closeButton: true,
    messageMaxLength: 150,
  };

  Notify.failure(message, options);
};

/**
 * Показує Notify.info повідомлення із зазначеним текстом
 * @param {String} message
 */
export const getInfoMessage = function getInfoMessage(
  message,
  position = 'center-bottom'
) {
  const options = {
    position: position,
    cssAnimationStyle: 'from-bottom',
  };

  closeMessageNotify('.notiflix-notify-info');

  Notify.info(message, options);
};

/**
 * Закриває Notify повідомлення із зазначеним селектором
 * @param {String} selector
 */
export const closeMessageNotify = function closeMessageNotify(selector) {
  if (!document.querySelector(selector)) {
    return;
  }

  const messageNotify = document.querySelector(selector);
  messageNotify.remove();
};
