import '../../pages/index.css';
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, updateAvatar } from './api';
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

const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar-url');
const avatarButton = avatarForm.querySelector('.popup__button');
const avatarCloseButton = avatarPopup.querySelector('.popup__close');

const imagePopup = document.querySelector('.popup_type_image');
const closeImagePopupButton = imagePopup.querySelector('.popup__close');

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationSettings);

let currentUserId = null;

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.reverse().forEach(cardData => {
      renderCard(cardData, placesList, currentUserId);
    });
  })
  .catch((err) => {
    console.error('Ошибка при загрузке данных с сервера:', err);
  });

const closeAllPopups = () => {
  const closeButtons = document.querySelectorAll('.popup__close');
  
  closeButtons.forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
      const popup = closeButton.closest('.popup');
      closeModal(popup);
    });
  });
};

closeAllPopups();

editProfileButton.addEventListener('click', () => {
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModal(profilePopup);
});

addCardButton.addEventListener('click', () => {
  cardFormElement.reset();
  openModal(cardPopup);
});

profileAvatar.addEventListener('click', () => {
  openModal(avatarPopup);
});

profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newName = profileNameInput.value;
  const newAbout = profileDescriptionInput.value;

  const originalText = editProfileButton.textContent;
  editProfileButton.textContent = 'Сохранение...';

  updateUserInfo(newName, newAbout)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(profilePopup);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении профиля:', err);
    })
    .finally(() => {
      editProfileButton.textContent = originalText;
    });
});

cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const name = placeNameInput.value;
  const link = placeLinkInput.value;

  const originalText = addCardButton.textContent;
  addCardButton.textContent = 'Сохранение...';

  addNewCard(name, link)
    .then((newCard) => {
      renderCard(newCard, placesList, currentUserId);
      closeModal(cardPopup);
      cardFormElement.reset();
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      addCardButton.textContent = originalText;
    });
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const originalText = avatarButton.textContent;
  avatarButton.textContent = 'Сохранение...';

  updateAvatar(avatarInput.value)
    .then((res) => {
      profileAvatar.style.backgroundImage = `url(${res.avatar})`;
      closeModal(avatarPopup);
      avatarForm.reset();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      avatarButton.textContent = originalText;
    });
});

closeImagePopupButton.addEventListener('click', () => {
  closeModal(imagePopup);
});

[profilePopup, cardPopup, avatarPopup, imagePopup].forEach(popup => {
  popup.addEventListener('click', handleOverlayClick);
});

document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated');
});
