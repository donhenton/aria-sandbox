

class AriaSelectBox {
  constructor(elem) {
    this.selectBox = elem;
    this.listbox = new AriaListBox(this.selectBox.querySelector('.listbox'))
    this.button = elem.querySelector('button');
    this.currentValue = '';
    this.registerEvents();
  }
  registerEvents() {
    this.button.addEventListener('click', this.showListbox.bind(this));
    this.button.addEventListener('keyup', this.checkShow.bind(this));

    this.listbox.listboxNode.addEventListener('blur', this.hideListbox.bind(this));
    this.listbox.listboxNode.addEventListener('keydown', this.checkHide.bind(this));
    this.listbox.setHandleFocusChange(this.onFocusChange.bind(this));
  }
  checkShow(evt) {
    var key = evt.which || evt.keyCode;

    switch (key) {
      case aria.KeyCode.UP:
      case aria.KeyCode.DOWN:
        evt.preventDefault();
        this.showListbox();
        this.listbox.checkKeyPress(evt);
        break;
    }
  }
  checkHide(evt) {
    var key = evt.which || evt.keyCode;

    switch (key) {
      case aria.KeyCode.RETURN:
      case aria.KeyCode.ESC:
        evt.preventDefault();
        this.hideListbox();
        this.button.focus();
        break;
    }
  }
  showListbox() {
    this.listbox.listboxNode.classList.remove('hidden');
    this.button.setAttribute('aria-expanded', 'true');
    this.listbox.listboxNode.focus();
  }
  hideListbox() {
    this.listbox.listboxNode.classList.add('hidden');
    this.button.removeAttribute('aria-expanded');
  }
  onFocusChange(focusedItem) {
    this.button.innerText = focusedItem.innerText;
    this.currentValue = this.button.innerText;
  }
}






