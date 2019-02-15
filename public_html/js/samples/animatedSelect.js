(() => {

  window.animatedSelect = [];
  class AnimatedSelect {
    constructor(elem) {
      this.selectBox = elem;
      this.animatedList = new AnimatedList(this.selectBox.querySelector('ul.source-selector'))
      this.button = elem.querySelector('button');
      this.stage = elem.querySelector('.select-stage');
      console.log(this.animatedList.listBox.classList)
      this.button.addEventListener('click', this.showListbox.bind(this));
      this.stage.addEventListener('transitionend', this.stageListener.bind(this));
      this.done = false;
      this.endCounter = 0;
      this.animating = false;

    }
    stageListener(ev) {
      this.endCounter++;
      let me = this;
      if (this.endCounter === 4) {
        this.animatedList.listBox.classList.add('completed');
        window.setTimeout(() => {
          this.animatedList.listBox.classList.add('vis');
          me.animating = false;
        }, 15);
        this.endCounter = 0;
      }
      console.log(ev)
    }
    showListbox(ev) {

      ev.preventDefault();
      this.animating = true;

      if (this.done) {
        this.animatedList.listBox.classList.remove('vis');
        this.animatedList.listBox.classList.remove('completed');
         window.setTimeout(() => {
           this.stage.classList.remove('completed')
         }, 15)
       
        this.done = false;
      } else {
        this.stage.classList.add("completed")
        this.done = true;
      }

    }
  }


  /*
   * 
   * 
   * ANIMATED LIST CLASS
   * 
   * 
   */





  class AnimatedList {
    constructor(elem) {
      this.listBox = elem;
    }
  }




  Array.from(document.querySelectorAll('.animated-select')).forEach(s => {
    window.animatedSelect.push(new AnimatedSelect(s));
  })


}

)();
