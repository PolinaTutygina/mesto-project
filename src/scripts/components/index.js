import '../../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, renderCard } from './card.js';
import { openModal, closeModal, handleOverlayClick } from './modal.js';
import {
  checkInputValidity,
  toggleButtonState,
  hideInputError
} from './validate.js';

// DOM-элементы
const placesList = document.querySelector('.places__list');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profilePopup = document.querySelector('.popup_type_edit');
const profileNameInput = profilePopup.querySelector('.popup__input_type_name');
const profileDescriptionInput = profilePopup.querySelector('.popup__input_type_description');
const editProfileButton = document.querySelector('.profile__edit-button');
const closeProfilePopupButton = profilePopup.querySelector('.popup__close');
const profileFormElement = profilePopup.querySelector('.popup__form');
const profileSubmitButton = profileFormElement.querySelector('.popup__button');

const cardPopup = document.querySelector('.popup_type_new-card');
const addCardButton = document.querySelector('.profile__add-button');
const closeCardPopupButton = cardPopup.querySelector('.popup__close');
const cardFormElement = document.forms['new-place'];
const placeNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const placeLinkInput = cardFormElement.querySelector('.popup__input_type_url');
const cardSubmitButton = cardFormElement.querySelector('.popup__button');

const closeImagePopupButton = document.querySelector('.popup_type_image .popup__close');

// Валидация
const profileInputList = [profileNameInput, profileDescriptionInput];
const cardInputList = [placeNameInput, placeLinkInput];

profileInputList.forEach(input => {
  input.addEventListener('input', () => {
    checkInputValidity(input);
    toggleButtonState(profileInputList, profileSubmitButton);
  });
});

cardInputList.forEach(input => {
  input.addEventListener('input', () => {
    checkInputValidity(input);
    toggleButtonState(cardInputList, cardSubmitButton);
  });
});

editProfileButton.addEventListener('click', () => {
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  toggleButtonState(profileInputList, profileSubmitButton);
  profileInputList.forEach(input => hideInputError(input));
  openModal(profilePopup);
});

profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileTitle.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(profilePopup);
});

addCardButton.addEventListener('click', () => {
  cardFormElement.reset();
  toggleButtonState(cardInputList, cardSubmitButton);
  cardInputList.forEach(input => hideInputError(input));
  openModal(cardPopup);
});

cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  renderCard({ name: placeNameInput.value, link: placeLinkInput.value }, placesList);
  closeModal(cardPopup);
});

// Закрытие попапов
closeProfilePopupButton.addEventListener('click', () => closeModal(profilePopup));
closeCardPopupButton.addEventListener('click', () => closeModal(cardPopup));
closeImagePopupButton.addEventListener('click', () => {
  closeModal(document.querySelector('.popup_type_image'));
});

// Клик по оверлею
[profilePopup, cardPopup, document.querySelector('.popup_type_image')]
  .forEach(popup => popup.addEventListener('click', handleOverlayClick));

// Анимация попапов
document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated');
});

// Инициализация карточек
initialCards.forEach(cardData => {
  const card = createCard(cardData);
  placesList.append(card);
});
