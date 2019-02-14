

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



(() => {
  window.selectBoxes = [];
//https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
  const reportButton = document.querySelector('#reportButton');
  const reportArea = document.querySelector('#reportRegion');
  
  reportButton.addEventListener('click', event => {
   let info = '';
  reportArea.innerText = info;
    window.selectBoxes.forEach(b => {
      info = info + b.currentValue;
      
    });
    reportArea.innerText = 'Greek Letter Selected '+info;
  });
  

  Array.from(document.querySelectorAll('.aria.select-box'))
        .forEach(e => {
          window.selectBoxes.push(new AriaSelectBox(e));
        });


})();




