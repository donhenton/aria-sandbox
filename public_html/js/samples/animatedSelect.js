(() => {

  window.animatedSelect = [];
  class AnimatedSelect {
    constructor(elem) {
      this.selectBox = elem;
      this.animatedList = new AnimatedList(this.selectBox.querySelector('ul.source-selector'))
      this.button = elem.querySelector('button');
      this.stage = elem.querySelector('.select-stage');
      let bndShow = this.showListbox.bind(this);
      this.button.addEventListener('click', this.showListbox.bind(this));
      this.button.addEventListener('keyup', this.checkShow.bind(this));
      this.animatedList.listBox.addEventListener('blur', this.hideListbox.bind(this));
      this.animatedList.listBox.addEventListener('keydown', this.checkHide.bind(this));
      this.animatedList.setHandleFocusChange(this.onFocusChange.bind(this));
      this.stage.addEventListener('transitionend', this.stageListener.bind(this));
      this.done = false;
      this.endCounter = 0;
      this.animating = false;
      this.currentValue = '';

    }
    checkShow(evt) {
      var key = evt.which || evt.keyCode;

      switch (key) {
        case this.animatedList.KeyCode.UP:
        case this.animatedList.KeyCode.DOWN:
          evt.preventDefault();
          this.showListbox(evt);
          this.animatedList.checkKeyPress(evt);
          break;
      }
    }
    checkHide(evt) {
      var key = evt.which || evt.keyCode;

      switch (key) {
        case this.animatedList.KeyCode.RETURN:
        case this.animatedList.KeyCode.ESC:
          evt.preventDefault();
          this.hideListbox(evt);

          break;
      }
    }
    stageListener(ev) {


      let isStage = Array.from(ev.srcElement.classList).includes('select-stage');
      if (isStage === true) {
        this.endCounter++;
      }

     //  console.log(`isStage ${isStage} done ${this.done} counter ${this.endCounter} prop ${ev.propertyName}`)
      let me = this;
      //done == true means drop list is open
      if (isStage && this.endCounter === 5 && this.done === true) {
        this.animatedList.listBox.classList.add('completed');
        window.setTimeout(() => {
          this.animatedList.listBox.classList.add('vis');
          me.animating = false;
        }, 15);
        this.endCounter = 0;
        this.animatedList.listBox.focus();
      }
      if (isStage && this.endCounter === 5 && this.done === false) {
        this.animatedList.listBox.classList.remove('vis');
        this.animatedList.listBox.classList.remove('completed');
        this.endCounter = 0;
        this.button.focus();
      }

      //console.log(ev)
    }
    showListbox(ev) {

      ev.preventDefault();
      this.animating = true;
      this.stage.classList.add("completed")
      this.button.setAttribute('aria-expanded', 'true');
      this.done = true;

      // }

    }
    hideListbox(ev) {

      ev.preventDefault();
      this.animating = true;
      this.stage.classList.remove('completed');
      this.button.removeAttribute('aria-expanded');
      this.done = false;

    }
    onFocusChange(focusedItem) {
      this.button.innerText = focusedItem.innerText;
      this.currentValue = this.button.innerText;
    }
  }

 






  Array.from(document.querySelectorAll('.animated-select')).forEach(s => {
    window.animatedSelect.push(new AnimatedSelect(s));
  })


}

)();
