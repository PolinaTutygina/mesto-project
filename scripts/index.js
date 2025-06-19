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

const cardPopup = document.querySelector('.popup_type_new-card');
const addCardButton = document.querySelector('.profile__add-button');
const closeCardPopupButton = cardPopup.querySelector('.popup__close');

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const closeImagePopupButton = imagePopup.querySelector('.popup__close');

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
}

editProfileButton.addEventListener('click', () => {
  fillProfileForm();

  openModal(profilePopup);
});

closeProfilePopupButton.addEventListener('click', () => {
  closeModal(profilePopup);
});

const profileFormElement = profilePopup.querySelector('.popup__form');

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