// Константы и DOM-элементы
const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

// Элементы профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Попап редактирования профиля
const profilePopup = document.querySelector('.popup_type_edit');
const profileNameInput = profilePopup.querySelector('.popup__input_type_name');
const profileDescriptionInput = profilePopup.querySelector('.popup__input_type_description');
const editProfileButton = document.querySelector('.profile__edit-button');
const closeProfilePopupButton = profilePopup.querySelector('.popup__close');
const profileFormElement = profilePopup.querySelector('.popup__form');
const profileSubmitButton = profileFormElement.querySelector('.popup__button');

// Попап добавления карточки
const cardPopup = document.querySelector('.popup_type_new-card');
const addCardButton = document.querySelector('.profile__add-button');
const closeCardPopupButton = cardPopup.querySelector('.popup__close');
const cardFormElement = document.forms['new-place'];
const placeNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const placeLinkInput = cardFormElement.querySelector('.popup__input_type_url');
const cardSubmitButton = cardFormElement.querySelector('.popup__button');

// Попап изображения
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const closeImagePopupButton = imagePopup.querySelector('.popup__close');

// Установка атрибутов валидации
profileNameInput.setAttribute('minlength', '2');
profileNameInput.setAttribute('maxlength', '40');
profileDescriptionInput.setAttribute('minlength', '2');
profileDescriptionInput.setAttribute('maxlength', '200');
placeNameInput.setAttribute('minlength', '2');
placeNameInput.setAttribute('maxlength', '30');

// Общие функции валидации
function showInputError(inputElement, errorMessage) {
  const errorElement = inputElement.nextElementSibling;
  inputElement.classList.add('popup__input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__error_visible');
}

function hideInputError(inputElement) {
  const errorElement = inputElement.nextElementSibling;
  inputElement.classList.remove('popup__input_type_error');
  errorElement.classList.remove('popup__error_visible');
  errorElement.textContent = '';
}

function checkInputValidity(inputElement) {
  if (!inputElement.validity.valid) {
    let errorMessage = '';
    
    if (inputElement.validity.valueMissing) {
      errorMessage = 'Вы пропустили это поле.';
    } else if (inputElement.validity.tooShort) {
      errorMessage = `Минимальное количество символов: ${inputElement.minLength}. Длина текста сейчас: ${inputElement.value.length}.`;
    } else if (inputElement.validity.tooLong) {
      errorMessage = `Максимальное количество символов: ${inputElement.maxLength}.`;
    } else if (inputElement.validity.typeMismatch && inputElement.type === 'url') {
      errorMessage = 'Введите адрес сайта.';
    }
    
    showInputError(inputElement, errorMessage);
  } else {
    hideInputError(inputElement);
  }
}

function hasInvalidInput(inputList) {
  return inputList.some(inputElement => !inputElement.validity.valid);
}

function toggleButtonState(inputList, buttonElement) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add('popup__button_disabled');
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove('popup__button_disabled');
    buttonElement.disabled = false;
  }
}

// Валидация формы профиля
const profileInputList = [profileNameInput, profileDescriptionInput];

profileInputList.forEach(inputElement => {
  inputElement.addEventListener('input', () => {
    checkInputValidity(inputElement);
    toggleButtonState(profileInputList, profileSubmitButton);
  });
});

// Валидация формы карточки
const cardInputList = [placeNameInput, placeLinkInput];

cardInputList.forEach(inputElement => {
  inputElement.addEventListener('input', () => {
    checkInputValidity(inputElement);
    toggleButtonState(cardInputList, cardSubmitButton);
  });
});

// Функции работы с карточками
function createCard(data) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('card__like-button_is-active');
  });

  deleteButton.addEventListener('click', () => {
    cardElement.remove();
  });

  cardImage.addEventListener('click', () => {
    openImagePopup(data.link, data.name);
  });

  return cardElement;
}

function renderCard(cardData) {
  const card = createCard(cardData);
  placesList.prepend(card);
}

// Функция закрытия по Esc
function handleEscapeKey(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Функции попапов
function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscapeKey);
}

function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscapeKey);
}

function openImagePopup(imageSrc, imageAlt) {
  popupImage.src = imageSrc;
  popupImage.alt = imageAlt;
  popupCaption.textContent = imageAlt;
  openModal(imagePopup);
}

// Обработчики профиля
function fillProfileForm() {
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  toggleButtonState(profileInputList, profileSubmitButton);
  profileInputList.forEach(input => hideInputError(input));
}

editProfileButton.addEventListener('click', () => {
  fillProfileForm();
  openModal(profilePopup);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(profilePopup);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

// Обработчики карточек
function clearCardForm() {
  cardFormElement.reset();
  toggleButtonState(cardInputList, cardSubmitButton);
  cardInputList.forEach(input => hideInputError(input));
}

addCardButton.addEventListener('click', () => {
  clearCardForm();
  openModal(cardPopup);
});

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderCard({
    name: placeNameInput.value,
    link: placeLinkInput.value
  });
  closeModal(cardPopup);
}

cardFormElement.addEventListener('submit', handleCardFormSubmit);

// Закрытие попапов
closeProfilePopupButton.addEventListener('click', () => closeModal(profilePopup));
closeCardPopupButton.addEventListener('click', () => closeModal(cardPopup));
closeImagePopupButton.addEventListener('click', () => closeModal(imagePopup));

// Закрытие попапов кликом на оверлей
function handleOverlayClick(event) {
  if (event.target === event.currentTarget) {
    closeModal(event.currentTarget);
  }
}

profilePopup.addEventListener('click', handleOverlayClick);
cardPopup.addEventListener('click', handleOverlayClick);
imagePopup.addEventListener('click', handleOverlayClick);

// Анимация попапов
document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated');
});

// Инициализация карточек
initialCards.forEach(cardData => {
  const card = createCard(cardData);
  placesList.append(card);
});
