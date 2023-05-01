const cssClasses = {
  TEXT_AREA: 'textarea',
  KEYBOARD: 'keyboard',
  KEYBOARD_DESCRIPTION: 'keyboard__description',
  KEYBOARD_WRAPPER: 'keyboard__wrapper',
  KEYBOARD_ROW: 'keyboard__row',
  KEYBOARD_KEY: 'keyboard__key',
  KEYBOARD_SPECIAL_KEY: 'keyboard__special-key',
  KEYBOARD_SHIFT_KEY: 'keyboard__shift-key',
  KEYBOARD_KEY_LARGE: 'keyboard__key_large',
  KEYBOARD_KEY_EXTRA_LARGE: 'keyboard__key_extra-large',
};

class Keyboard {
  constructor() {
    this.elements = {
      textarea: null,
      keyboard: null,
      keysWrapper: null,
      keysRow: null,
      keyboardDescription: null,
      keys: [],
    };
    this.eventHandlers = {
      oninput: null,
      onclose: null,
    };
    this.properties = {
      value: '',
      capsLock: false,
      shift: false,
      isCapsLockDown: false,
      isShiftDown: false,
      language: localStorage.getItem('language') || 'eu',
      languageLocalStorage: null,
    };
  }

  createElements() {
    this.elements.textarea = document.createElement('textarea');
    this.elements.keyboard = document.createElement('div');
    this.elements.keysWrapper = document.createElement('div');
    this.elements.keyboardDescription = document.createElement('p');

    this.elements.textarea.classList.add(cssClasses.TEXT_AREA);
    this.elements.keyboard.classList.add(cssClasses.KEYBOARD);
    this.elements.keysWrapper.classList.add(cssClasses.KEYBOARD_WRAPPER);
    this.elements.keyboardDescription.classList.add(cssClasses.KEYBOARD_DESCRIPTION);
    this.elements.keyboardDescription.textContent = 'Привет! Клавиатура создана в операционной системе Windows. Для переключения языка - комбинация: левыe "ctrl" + "alt"';
    this.elements.keysWrapper.appendChild((this.createKeys(this.keyboardKeys())));
    this.elements.keyboard.appendChild(this.elements.keysWrapper);
    document.body.appendChild(this.elements.textarea);
    document.body.appendChild(this.elements.keyboard);
    document.body.appendChild(this.elements.keyboardDescription);
    // localStorage.getItem('language');
    this.elements.textarea.addEventListener('focus', () => {
      this.open(this.elements.textarea.value, (currentValue) => {
        this.elements.textarea.value = currentValue;
      });
    });
    document.onkeydown = (event) => {
      if (event.key === 'Alt') {
        document.onkeydown = (e) => {
          if (e.key === 'Control') {
            console.log('work');
            if (this.properties.language === 'eu') {
              this.properties.language = 'ru';
              this.elements.keysWrapper.innerHTML = '';
              this.elements.keysWrapper.appendChild(this.createKeys(this.keyboardKeys()));
            } else if (this.properties.language === 'ru') {
              this.properties.language = 'eu';
              this.elements.keysWrapper.innerHTML = '';
              this.elements.keysWrapper.appendChild(this.createKeys(this.keyboardKeys()));
            }
          }
          localStorage.setItem('language', this.properties.language);
        };
      }
    };
  }

  keyboardKeys() {
    const keyArrayEU = [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'Del'],
      ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
      ['LShift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'up', 'RShift'],
      ['LCtrl', 'Win', 'LAlt', 'Space', 'RAlt', 'left', 'bottom', 'right', 'RCtrl'],
    ];

    const keyArrayRU = [
      ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\', 'Del'],
      ['Caps Lock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter'],
      ['LShift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'up', 'RShift'],
      ['LCtrl', 'Win', 'LAlt', 'Space', 'RAlt', 'left', 'bottom', 'right', 'RCtrl'],
    ];
    if (this.properties.language === 'ru') {
      return keyArrayRU;
    }
    return keyArrayEU;
  }

  createKeys(array) {
    function createArrowButtonIcon(iconName) {
      return `<span class="material-symbols-outlined">${iconName}</span>`;
    }
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < array.length; i += 1) {
      this.elements.keysRow = document.createElement('div');
      this.elements.keysRow.classList.add('keyboard__row');
      array[i].forEach((key) => {
        const keyItem = document.createElement('button');
        switch (key) {
          case 'Backspace':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY, cssClasses.KEYBOARD_KEY_LARGE);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.key === 'Backspace') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
                const start = this.elements.textarea.selectionStart;
                if (start === 0) {
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = 0;
                } else {
                  const textAreaValueSplitted = this.elements.textarea.value.split('');
                  textAreaValueSplitted.splice(start - 1, 1);
                  const textAreaValueJoined = textAreaValueSplitted.join('');
                  this.properties.value = textAreaValueJoined;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start - 1;
                }
              }
            }, false);
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'Backspace') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мыши
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (start === 0) {
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = 0;
              } else {
                const textAreaValueSplitted = this.elements.textarea.value.split('');
                textAreaValueSplitted.splice(start - 1, 1);
                const textAreaValueJoined = textAreaValueSplitted.join('');
                this.properties.value = textAreaValueJoined;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start - 1;
              }
            });
            break;
          case 'Del':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'Delete') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
                const start = this.elements.textarea.selectionStart;
                const textAreaValueSplitted = this.elements.textarea.value.split('');
                textAreaValueSplitted.splice(this.elements.textarea.selectionStart, 1);
                const textAreaValueJoined = textAreaValueSplitted.join('');
                this.properties.value = textAreaValueJoined;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start;
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'Delete') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мыши
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              const textAreaValueSplitted = this.elements.textarea.value.split('');
              textAreaValueSplitted.splice(this.elements.textarea.selectionStart, 1);
              const textAreaValueJoined = textAreaValueSplitted.join('');
              this.properties.value = textAreaValueJoined;
              this.triggerEvent('oninput');
              this.elements.textarea.focus();
              this.elements.textarea.selectionEnd = start;
            });
            break;
          case 'Caps Lock':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY, cssClasses.KEYBOARD_KEY_LARGE);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'CapsLock') {
                if (!this.properties.isCapsLockDown) {
                  this.properties.isCapsLockDown = !this.properties.isCapsLockDown;
                  keyItem.classList.toggle('keyboard__key_active');
                  e.preventDefault();
                  this.toggleCapsLock();
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'CapsLock') {
                this.properties.isCapsLockDown = !this.properties.isCapsLockDown;
              }
            });
            // Событие мыши
            keyItem.addEventListener('click', () => {
              this.toggleCapsLock();
              keyItem.classList.toggle('keyboard__key_active');
            });
            break;
          case 'Enter':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY, cssClasses.KEYBOARD_KEY_LARGE);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'Enter') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
                const start = this.elements.textarea.selectionStart;
                this.properties.value = `${this.properties.value.substring(0, start)}\n${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = -1;
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'Enter') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мыши
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              this.properties.value = `${this.properties.value.substring(0, start)}\n${this.properties.value.substring(start)}`;
              this.triggerEvent('oninput');
              this.elements.textarea.focus();
              this.elements.textarea.selectionEnd = -1;
            });
            break;
          case 'LShift':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY, cssClasses.KEYBOARD_KEY_LARGE);
            keyItem.textContent = 'Shift';
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'ShiftLeft') {
                if (!this.properties.isShiftDown) {
                  this.properties.isShiftDown = !this.properties.isShiftDown;
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.toggleShift();
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'ShiftLeft') {
                this.properties.isShiftDown = !this.properties.isShiftDown;
                keyItem.classList.remove('keyboard__key_active');
                this.toggleShift();
              }
            });
            // Событие мышки
            break;
          case 'RShift':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY, cssClasses.KEYBOARD_KEY_LARGE);
            keyItem.textContent = 'Shift';
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'ShiftRight') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'ShiftRight') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            break;
          case 'Space':
            keyItem.classList.add(
              cssClasses.KEYBOARD_SPECIAL_KEY,
              cssClasses.KEYBOARD_KEY_EXTRA_LARGE,
            );
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'Space') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
                const start = this.elements.textarea.selectionStart;
                this.properties.value = `${this.properties.value.substring(0, start)} ${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'Space') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              this.properties.value = `${this.properties.value.substring(0, start)} ${this.properties.value.substring(start)}`;
              this.triggerEvent('oninput');
              this.elements.textarea.focus();
              this.elements.textarea.selectionEnd = start + 1;
            });
            break;
          case 'Tab':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'Tab') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
                const start = this.elements.textarea.selectionStart;
                this.properties.value = `${this.properties.value.substring(0, start)}    ${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 4;
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'Tab') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              this.properties.value = `${this.properties.value.substring(0, start)}    ${this.properties.value.substring(start)}`;
              this.triggerEvent('oninput');
              this.elements.textarea.focus();
              this.elements.textarea.selectionEnd = start + 4;
            });
            break;
          case 'up':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.innerHTML = createArrowButtonIcon('arrow_upward');
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'ArrowUp') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
                const start = this.elements.textarea.selectionStart;
                this.properties.value = `${this.properties.value.substring(0, start)}\u{02191}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'ArrowUp') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              this.properties.value = `${this.properties.value.substring(0, start)}\u{02191}${this.properties.value.substring(start)}`;
              this.triggerEvent('oninput');
              this.elements.textarea.focus();
              this.elements.textarea.selectionEnd = start + 1;
            });
            break;
          case 'bottom':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.innerHTML = createArrowButtonIcon('arrow_downward');
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'ArrowDown') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
                const start = this.elements.textarea.selectionStart;
                this.properties.value = `${this.properties.value.substring(0, start)}\u{02193}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'ArrowDown') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              this.properties.value = `${this.properties.value.substring(0, start)}\u{02193}${this.properties.value.substring(start)}`;
              this.triggerEvent('oninput');
              this.elements.textarea.focus();
              this.elements.textarea.selectionEnd = start + 1;
            });
            break;
          case 'left':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.innerHTML = createArrowButtonIcon('arrow_back');
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'ArrowLeft') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
                const start = this.elements.textarea.selectionStart;
                this.properties.value = `${this.properties.value.substring(0, start)}\u{02190}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'ArrowLeft') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              this.properties.value = `${this.properties.value.substring(0, start)}\u{02190}${this.properties.value.substring(start)}`;
              this.triggerEvent('oninput');
              this.elements.textarea.focus();
              this.elements.textarea.selectionEnd = start + 1;
            });
            break;
          case 'right':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.innerHTML = createArrowButtonIcon('arrow_forward');
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'ArrowRight') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
                const start = this.elements.textarea.selectionStart;
                this.properties.value = `${this.properties.value.substring(0, start)}\u{02192}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'ArrowRight') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              this.properties.value = `${this.properties.value.substring(0, start)}\u{02192}${this.properties.value.substring(start)}`;
              this.triggerEvent('oninput');
              this.elements.textarea.focus();
              this.elements.textarea.selectionEnd = start + 1;
            });
            break;
          case 'LCtrl':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.textContent = 'Ctrl';
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'ControlLeft') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'ControlLeft') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            break;
          case 'RCtrl':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.textContent = 'Ctrl';
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'ControlRight') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'ControlRight') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            break;
          case 'Win':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'MetaLeft') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'MetaLeft') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            break;
          case 'LAlt':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.textContent = 'Alt';
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'AltLeft') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'AltLeft') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            break;
          case 'RAlt':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.textContent = 'Alt';
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'AltRight') {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === 'AltRight') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            break;
          case '`':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '~') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}~${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '~') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}~${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '1':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '!') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}!${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '!') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}!${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '2':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '@' || (e.key === '"' && this.properties.language === 'ru')) {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${e.key === '@' ? '@' : '"'}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '@' || (e.key === '"' && this.properties.language === 'ru')) {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.language === 'eu' ? '@' : '"'}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '3':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '#' || e.key === '№') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${e.key === '#' ? '#' : '№'}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '#' || e.key === '№') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.language === 'eu' ? '#' : '№'}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '4':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '$' || (e.key === ';' && this.properties.language === 'ru')) {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${e.key === '$' ? '$' : ';'}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '$' || e.key === ';') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.language === 'eu' ? '$' : ';'}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '5':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '%') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}%${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '%') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}%${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '6':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '^' || (e.key === ':' && this.properties.language === 'ru')) {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${e.key === '^' ? '^' : ':'}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '^' || e.key === ':') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.language === 'eu' ? '^' : ':'}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '7':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '&' || (e.key === '?' && this.properties.language === 'ru')) {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${e.key === '&' ? '&' : '?'}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '&' || e.key === '?') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.language === 'eu' ? '&' : '?'}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '8':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '*') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}*${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '*') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}*${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '9':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '(') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}(${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '(') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}(${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '0':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === ')') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)})${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === ')') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)})${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '-':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '_') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}_${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '_') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}_${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '=':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '+') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}+${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '+') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}+${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '[':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '{') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}{${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '{') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}{${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case ']':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '}') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '}') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '\\':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '|' || (e.key === '/' && this.properties.language === 'ru')) {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${e.key === '|' ? '|' : '/'}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '|' || e.key === '/') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.language === 'eu' ? '|' : '/'}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case ';':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === ':') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}:${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === ':') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}:${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '\'':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '"') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}"${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '"') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}"${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case ',':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '<') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}<${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '<') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}<${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '.':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '>' || (e.key === ',' && this.properties.language === 'ru')) {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${e.key === '>' ? '>' : ','}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '>' || e.key === ',') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.language === 'eu' ? '>' : ','}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          case '/':
            keyItem.classList.add(cssClasses.KEYBOARD_SHIFT_KEY);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              const start = this.elements.textarea.selectionStart;
              if (e.key === key || e.key === '?') {
                if (this.properties.shift) {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}?${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  keyItem.classList.add('keyboard__key_active');
                  e.preventDefault();
                  this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === key || e.key === '?') {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}?${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${key}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            break;
          default: keyItem.classList.add(cssClasses.KEYBOARD_KEY);
            keyItem.textContent = key.toLowerCase();
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.key === `${(!this.properties.capsLock && this.properties.shift) || (this.properties.capsLock && !this.properties.shift) ? key.toUpperCase() : key.toLowerCase()}`) {
                e.preventDefault();
                keyItem.classList.add('keyboard__key_active');
                const start = this.elements.textarea.selectionStart;
                if (this.properties.capsLock && this.properties.shift) {
                  this.properties.value = `${this.properties.value.substring(0, start)}${key.toLowerCase()}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                } else {
                  this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.capsLock || this.properties.shift
                    ? key.toUpperCase()
                    : key.toLowerCase()}${this.properties.value.substring(start)}`;
                  this.triggerEvent('oninput');
                  this.elements.textarea.focus();
                  this.elements.textarea.selectionEnd = start + 1;
                }
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.key === `${(!this.properties.capsLock && this.properties.shift) || (this.properties.capsLock && !this.properties.shift) ? key.toUpperCase() : key.toLowerCase()}`) {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              if (this.properties.capsLock && this.properties.shift) {
                this.properties.value = `${this.properties.value.substring(0, start)}${key.toLowerCase()}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              } else {
                this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.capsLock || this.properties.shift
                  ? key.toUpperCase()
                  : key.toLowerCase()}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
        }
        this.elements.keysRow.appendChild(keyItem);
        fragment.appendChild(this.elements.keysRow);
      });
    }
    return fragment;
  }

  triggerEvent(handlerName) {
    console.log('Event Triggered! Event name: ' + handlerName);
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  }

  putButtonsInArr() {
    const childrenArr = [];
    for (let i = 0; i < this.elements.keysWrapper.children.length; i += 1) {
      childrenArr.push(this.elements.keysWrapper.children[i].querySelectorAll(`.${cssClasses.KEYBOARD_SHIFT_KEY}`));
    }
    for (let i = 0; i < this.elements.keysWrapper.children.length; i += 1) {
      childrenArr.push(this.elements.keysWrapper.children[i].querySelectorAll(`.${cssClasses.KEYBOARD_KEY}`));
    }

    const keysArr = [];
    childrenArr.forEach((item) => {
      item.forEach((it) => {
        // console.log(it)
        keysArr.push(it);
      });
    });
    this.elements.keys = keysArr;
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    console.log('Caps toggled', this.properties.capsLock);
    this.putButtonsInArr();
    this.elements.keys.forEach((i) => {
      const item = i;
      item.textContent = this.properties.capsLock ? item.textContent.toUpperCase()
        : item.textContent.toLowerCase();
    });
  }

  toggleShift() {
    this.properties.shift = !this.properties.shift;
    this.putButtonsInArr();
    console.log(this.properties.shift, this.properties.capsLock);
    const withoutShiftEU = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '[',
      ']', '\\', ';', '\'', ',', '.', '/'];
    const shiftArrEU = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '{',
      '}', '|', ':', '"', '<', '>', '?'];

    const withoutShiftRU = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
      '\\', '.'];
    const shiftArrRU = ['!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+',
      '/', ','];
    this.elements.keys.forEach((i, index) => {
      const item = i;
      if (this.properties.shift && this.properties.language === 'eu' && item.classList.contains(cssClasses.KEYBOARD_SHIFT_KEY)) {
        item.textContent = shiftArrEU[index];
      } else if (!this.properties.shift && this.properties.language === 'eu' && item.classList.contains(cssClasses.KEYBOARD_SHIFT_KEY)) {
        item.textContent = withoutShiftEU[index];
      }

      if (this.properties.shift && this.properties.language === 'ru' && item.classList.contains(cssClasses.KEYBOARD_SHIFT_KEY)) {
        item.textContent = shiftArrRU[index];
      } else if (!this.properties.shift && this.properties.language === 'ru' && item.classList.contains(cssClasses.KEYBOARD_SHIFT_KEY)) {
        item.textContent = withoutShiftRU[index];
      }


      if (this.properties.shift && !this.properties.capsLock) {
        item.textContent = item.textContent.toUpperCase();
      } else {
        item.textContent = item.textContent.toLowerCase();
      }
      if (!this.properties.shift && this.properties.capsLock) {
        item.textContent = item.textContent.toUpperCase();
      }
    });
  }

  open(initialValue, oninput) {
    // this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
  }
}
const testKeyboard = new Keyboard();
console.log(testKeyboard.elements.keyboard);
testKeyboard.createElements();
testKeyboard.elements.textarea.focus();
// document.onkeypress = function (event) {
//   console.log(event.key)
// }