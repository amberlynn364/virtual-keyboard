const cssClasses = {
  TEXT_AREA: 'textarea',
  KEYBOARD: 'keyboard',
  KEYBOARD_WRAPPER: 'keyboard__wrapper',
  KEYBOARD_ROW: 'keyboard__row',
  KEYBOARD_KEY: 'keyboard__key',
  KEYBOARD_SPECIAL_KEY: 'keyboard__special-key',
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
      keys: [],
    };
    this.eventHandlers = {
      oninput: null,
      onclose: null,
    };
    this.properties = {
      value: '',
      capsLock: false,
      language: 'eu',
    };
  }

  createElements() {
    this.elements.textarea = document.createElement('textarea');
    this.elements.keyboard = document.createElement('div');
    this.elements.keysWrapper = document.createElement('div');

    this.elements.textarea.classList.add(cssClasses.TEXT_AREA);
    // this.elements.textarea.setAttribute('placeholder', 'Click here!');
    this.elements.keyboard.classList.add(cssClasses.KEYBOARD);
    this.elements.keysWrapper.classList.add(cssClasses.KEYBOARD_WRAPPER);

    this.elements.keysWrapper.appendChild(this.createKeys());
    this.elements.keyboard.appendChild(this.elements.keysWrapper);
    document.body.appendChild(this.elements.textarea);
    document.body.appendChild(this.elements.keyboard);

    // this.elements.textarea.addEventListener('focus', () => {
    //   this.open(this.elements.textarea.value, (currentValue) => {
    //     this.elements.textarea.value = currentValue;
    //   });
    // });

    this.elements.textarea.addEventListener('focus', () => {
      this.open(this.elements.textarea.value, (currentValue) => {
        this.elements.textarea.value = currentValue;
        // this.properties.textAreaActive = !this.properties.textAreaActive;
      });
    });
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    const keyArray = [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'Del'],
      ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'up', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'left', 'bottom', 'right', 'Ctrl'],
    ];

    function createArrowButtonIcon(iconName) {
      return `<span class="material-symbols-outlined">${iconName}</span>`;
    }

    for (let i = 0; i < keyArray.length; i += 1) {
      this.elements.keysRow = document.createElement('div');
      this.elements.keysRow.classList.add('keyboard__row');
      keyArray[i].forEach((key) => {
        const keyItem = document.createElement('button');
        // keyItem.classList.add(cssClasses.KEYBOARD_KEY);
        switch (key) {
          case 'Backspace':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY, cssClasses.KEYBOARD_KEY_LARGE);
            keyItem.textContent = key;
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === 'Backspace') {
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
            });
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
                keyItem.classList.toggle('keyboard__key_active');
                e.preventDefault();
                this.toggleCapsLock();
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
          case 'Shift':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY, cssClasses.KEYBOARD_KEY_LARGE);
            keyItem.textContent = key;
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
                const start = this.elements.textarea.selectionStart;
                this.properties.value = `${this.properties.value.substring(0, start)}\u{02192}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start;
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
          case 'Ctrl':
          case 'Win':
          case 'Alt':
            keyItem.classList.add(cssClasses.KEYBOARD_SPECIAL_KEY);
            keyItem.textContent = key;
            break;
          default: keyItem.classList.add(cssClasses.KEYBOARD_KEY);
            keyItem.textContent = key.toLowerCase();
            // Событие клавиатуры
            this.elements.textarea.addEventListener('keydown', (e) => {
              if (e.code === `Key${key.toUpperCase()}` || e.code === `Digit${key}`) {
                keyItem.classList.add('keyboard__key_active');
                e.preventDefault();
                const start = this.elements.textarea.selectionStart;
                this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()}${this.properties.value.substring(start)}`;
                this.triggerEvent('oninput');
                this.elements.textarea.focus();
                this.elements.textarea.selectionEnd = start + 1;
              }
            });
            this.elements.textarea.addEventListener('keyup', (e) => {
              if (e.code === `Key${key.toUpperCase()}` || e.code === `Digit${key}`) {
                keyItem.classList.remove('keyboard__key_active');
              }
            });
            // Событие мышки
            keyItem.addEventListener('click', () => {
              const start = this.elements.textarea.selectionStart;
              this.properties.value = `${this.properties.value.substring(0, start)}${this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()}${this.properties.value.substring(start)}`;
              this.triggerEvent('oninput');
              this.elements.textarea.focus();
              this.elements.textarea.selectionEnd = start + 1;
            });
        }
        this.elements.keysRow.appendChild(keyItem);
        fragment.appendChild(this.elements.keysRow);
        // fragment.appendChild(keyItem);
      });
      // this.elements.keysWrapper.appendChild(this.elements.keysRow);
    }
    return fragment;
  }

  ifTextAreaActive(value) {
    return `${this.properties.value.substring(0, this.elements.textarea.selectionStart)}${value}${this.properties.value.substring(this.elements.textarea.selectionStart)}`;
  }

  triggerEvent(handlerName) {
    console.log('Event Triggered! Event name: ' + handlerName);
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    console.log('Caps toggled', this.properties.capsLock);
    const childrenArr = [];
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
    this.elements.keys.forEach((i) => {
      const item = i;
      item.textContent = this.properties.capsLock ? item.textContent.toUpperCase()
        : item.textContent.toLowerCase();
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
// testKeyboard.createKeys();
// testKeyboard.createKeys();
document.onkeypress = function (event) {
  console.log(event.code)
}