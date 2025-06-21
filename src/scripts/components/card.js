import { openModal } from './modal.js';
import { likeCard, unlikeCard, deleteCard } from './api.js';

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

function openImagePopup(imageSrc, imageAlt) {
  popupImage.src = imageSrc;
  popupImage.alt = imageAlt;
  popupCaption.textContent = imageAlt;
  openModal(imagePopup);
}

export function createCard(data, currentUserId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  likeCount.textContent = data.likes.length;

  if (data.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      deleteCard(data._id)
        .then(() => {
          cardElement.remove();
        })
        .catch((err) => {
          console.error('Ошибка при удалении карточки:', err);
        });
    });
  }

  if (data.likes.some(user => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const toggleLike = isLiked ? unlikeCard : likeCard;

    toggleLike(data._id)
      .then((res) => {
        likeCount.textContent = res.likes.length;
        likeButton.classList.toggle('card__like-button_is-active');
      })
      .catch((err) => console.log('Ошибка при смене лайка:', err));
  });

  cardImage.addEventListener('click', () => {
    openImagePopup(data.link, data.name);
  });

  return cardElement;
}

export const renderCard = (cardData, container, currentUserId) => {
  const cardElement = createCard(cardData, currentUserId);
  container.prepend(cardElement);
};
