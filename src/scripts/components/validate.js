export function showInputError(inputElement, errorMessage) {
  const errorElement = inputElement.nextElementSibling;
  inputElement.classList.add('popup__input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__error_visible');
}

export function hideInputError(inputElement) {
  const errorElement = inputElement.nextElementSibling;
  inputElement.classList.remove('popup__input_type_error');
  errorElement.classList.remove('popup__error_visible');
  errorElement.textContent = '';
}

export function checkInputValidity(inputElement) {
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

export function hasInvalidInput(inputList) {
  return inputList.some(inputElement => !inputElement.validity.valid);
}

export function toggleButtonState(inputList, buttonElement) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add('popup__button_disabled');
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove('popup__button_disabled');
    buttonElement.disabled = false;
  }
}
