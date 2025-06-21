import '../../pages/index.css';
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard } from './api';
import { createCard, renderCard } from './card.js';
import { openModal, closeModal, handleOverlayClick } from './modal.js';
import { enableValidation } from './validate.js';

const placesList = document.querySelector('.places__list');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

const profilePopup = document.querySelector('.popup_type_edit');
const profileNameInput = profilePopup.querySelector('.popup__input_type_name');
const profileDescriptionInput = profilePopup.querySelector('.popup__input_type_description');
const editProfileButton = document.querySelector('.profile__edit-button');
const closeProfilePopupButton = profilePopup.querySelector('.popup__close');
const profileFormElement = profilePopup.querySelector('.popup__form');

const cardPopup = document.querySelector('.popup_type_new-card');
const addCardButton = document.querySelector('.profile__add-button');
const closeCardPopupButton = cardPopup.querySelector('.popup__close');
const cardFormElement = document.forms['new-place'];
const placeNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const placeLinkInput = cardFormElement.querySelector('.popup__input_type_url');

const closeImagePopupButton = document.querySelector('.popup_type_image .popup__close');

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationSettings);

// Глобальная переменная для хранения текущего ID пользователя
let currentUserId = null;

// Загружаем данные пользователя и карточки с сервера
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    // Обновляем DOM: имя, описание, аватар
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    // Отрисовываем карточки в правильном порядке
    cards.forEach(cardData => {
      renderCard(cardData, placesList, currentUserId);
    });
  })
  .catch((err) => {
    console.error('Ошибка при загрузке данных с сервера:', err);
  });

editProfileButton.addEventListener('click', () => {
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModal(profilePopup);
});

addCardButton.addEventListener('click', () => {
  cardFormElement.reset();
  openModal(cardPopup);
});

profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newName = profileNameInput.value;
  const newAbout = profileDescriptionInput.value;

  updateUserInfo(newName, newAbout)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(profilePopup);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении профиля:', err);
    });
});

cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const name = placeNameInput.value;
  const link = placeLinkInput.value;

  addNewCard(name, link)
    .then((newCard) => {
      renderCard(newCard, placesList, currentUserId);
      closeModal(cardPopup);
      cardFormElement.reset();
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err);
    });
});

closeProfilePopupButton.addEventListener('click', () => closeModal(profilePopup));
closeCardPopupButton.addEventListener('click', () => closeModal(cardPopup));
closeImagePopupButton.addEventListener('click', () => {
  closeModal(document.querySelector('.popup_type_image'));
});

[profilePopup, cardPopup, document.querySelector('.popup_type_image')]
  .forEach(popup => popup.addEventListener('click', handleOverlayClick));

document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated');
});
