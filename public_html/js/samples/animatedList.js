


class AnimatedList {
  constructor(elem) {

    this.listBox = elem;
    this.KeyCode = {
      BACKSPACE: 8,
      TAB: 9,
      RETURN: 13,
      ESC: 27,
      SPACE: 32,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      DELETE: 46
    };

    this.listBox.addEventListener('focus', this.setupFocus.bind(this));
    this.listBox.addEventListener('keydown', this.checkKeyPress.bind(this));
    this.listBox.addEventListener('click', this.checkClickItem.bind(this));
    this.listItems = Array.from(this.listBox.querySelectorAll('[role="option"]'));
    this.selectIndex = 0;
    let me = this;
    this.listItems.forEach((e, idx) => {
      e.setAttribute('id', me.idxToid(idx));
    })




  }
  idxToId(idx) {
    return `animated-select-${idx}`;
  }
  idToIdx(id) {
    let foundId;
    let activeDescendent = this.listBox.getAttribute('aria-activedescendant');
    if (activeDescendent) {

      this.listItems.forEach((e, idx) => {
        if (e.getAttribute('id') === activeDescendent) {
          foundId = idx;
        }
      })

    }


  }
  setupFocus(ev) {
    ev.preventDefault();
    let activeDescendent = this.listBox.getAttribute('aria-activedescendant');
    if (!activeDescendent) {
      this.listItems[this.selectIndex].classList.add('selected')
      this.listBox.setAttribute('aria-activedescendant', this.idxToId(this.selectIndex));
    }

  }
  checkClickItem(evt) {
    evt.preventDefault();
    console.log(evt.target.parentElement)
  }
  checkKeyPress(evt) {
    console.log(evt);
  }
  setHandleFocusChange(f) {

  }
  focusOnItem(element) {

  }
}