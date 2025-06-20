// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profilePopup = document.querySelector('.popup_type_edit');
const profileNameInput = profilePopup.querySelector('.popup__input.popup__input_type_name');
const profileDescriptionInput = profilePopup.querySelector('.popup__input.popup__input_type_description');
const editProfileButton = document.querySelector('.profile__edit-button');
const closeProfilePopupButton = profilePopup.querySelector('.popup__close');
const profileFormElement = profilePopup.querySelector('.popup__form');
const profileSubmitButton = profileFormElement.querySelector('.popup__button');

const cardPopup = document.querySelector('.popup_type_new-card');
const addCardButton = document.querySelector('.profile__add-button');
const closeCardPopupButton = cardPopup.querySelector('.popup__close');

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const closeImagePopupButton = imagePopup.querySelector('.popup__close');

// Установка атрибутов валидации
profileNameInput.setAttribute('minlength', '2');
profileNameInput.setAttribute('maxlength', '40');
profileDescriptionInput.setAttribute('minlength', '2');
profileDescriptionInput.setAttribute('maxlength', '200');

// Функции валидации
const showInputError = (inputElement, errorMessage) => {
  const errorElement = inputElement.nextElementSibling;
  inputElement.classList.add('popup__input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__error_visible');
};

const hideInputError = (inputElement) => {
  const errorElement = inputElement.nextElementSibling;
  inputElement.classList.remove('popup__input_type_error');
  errorElement.classList.remove('popup__error_visible');
  errorElement.textContent = '';
};

const checkInputValidity = (inputElement) => {
  if (!inputElement.validity.valid) {
    let errorMessage = '';
    
    if (inputElement.validity.valueMissing) {
      errorMessage = 'Вы пропустили это поле.';
    } else if (inputElement.validity.tooShort) {
      errorMessage = `Минимальное количество символов: ${inputElement.minLength}. Длина текста сейчас: ${inputElement.value.length} символ${inputElement.value.length === 1 ? '' : 'а'}.`;
    } else if (inputElement.validity.tooLong) {
      errorMessage = `Максимальное количество символов: ${inputElement.maxLength}.`;
    }
    
    showInputError(inputElement, errorMessage);
  } else {
    hideInputError(inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add('popup__button_disabled');
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove('popup__button_disabled');
  }
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

// Инициализация валидации формы профиля
setEventListeners(profileFormElement);

// @todo: Функция создания карточки
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
    deleteCard(cardElement);
  });

  cardImage.addEventListener('click', () => {
    openImagePopup(data.link, data.name);
  });

  return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(card) {
  card.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(cardData => {
  const card = createCard(cardData);
  placesList.appendChild(card);
});

function openModal(popup) {
  popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
}

function fillProfileForm() {
  const currentName = profileTitle.textContent;
  const currentDescription = profileDescription.textContent;

  profileNameInput.value = currentName;
  profileDescriptionInput.value = currentDescription;

  // Сброс ошибок при открытии формы
  hideInputError(profileNameInput);
  hideInputError(profileDescriptionInput);
  
  // Проверка состояния кнопки
  const inputList = Array.from(profileFormElement.querySelectorAll('.popup__input'));
  toggleButtonState(inputList, profileSubmitButton);
}

editProfileButton.addEventListener('click', () => {
  fillProfileForm();
  openModal(profilePopup);
});

closeProfilePopupButton.addEventListener('click', () => {
  closeModal(profilePopup);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const newName = profileNameInput.value;
  const newDescription = profileDescriptionInput.value;

  profileTitle.textContent = newName;
  profileDescription.textContent = newDescription;

  closeModal(profilePopup);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

function clearForm(form) {
  form.reset();
}

addCardButton.addEventListener('click', () => {
  clearForm(cardFormElement);
  openModal(cardPopup);
});

closeCardPopupButton.addEventListener('click', () => {
  closeModal(cardPopup);
});

const cardFormElement = cardPopup.querySelector('.popup__form');
const placeNameInput = cardPopup.querySelector('.popup__input.popup__input_type_card-name');
const placeLinkInput = cardPopup.querySelector('.popup__input.popup__input_type_url'); 

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const newPlaceName = placeNameInput.value;
  const newPlaceLink = placeLinkInput.value;

  const newCardData = {
    name: newPlaceName,
    link: newPlaceLink,
  };

  const newCard = createCard(newCardData);
  placesList.prepend(newCard);

  closeModal(cardPopup);
}

cardFormElement.addEventListener('submit', handleCardFormSubmit);

function openImagePopup(imageSrc, imageAlt) {
  popupImage.src = imageSrc;
  popupImage.alt = imageAlt;
  popupCaption.textContent = imageAlt;

  openModal(imagePopup);
}

closeImagePopupButton.addEventListener('click', () => {
  closeModal(imagePopup);
});

document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated');
});