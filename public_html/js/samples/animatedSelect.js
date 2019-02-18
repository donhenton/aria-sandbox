(() => {

  window.animatedSelect = [];
  class AnimatedSelect {
    constructor(elem) {
      this.selectBox = elem;
      this.animatedList = new AnimatedList(this.selectBox.querySelector('ul.source-selector'))
      this.button = elem.querySelector('button');
      this.stage = elem.querySelector('.select-stage');
      this.button.addEventListener('click', this.showListbox.bind(this));
      this.stage.addEventListener('transitionend', this.stageListener.bind(this));
      this.done = false;
      this.endCounter = 0;
      this.animating = false;

    }
    stageListener(ev) {
      
      
      let isStage = Array.from(ev.srcElement.classList).includes('select-stage');
      if (isStage === true) {
        this.endCounter++;
      }
      
     // console.log(`isStage ${isStage} done ${this.done} counter ${this.endCounter} prop ${ev.propertyName}`)
      let me = this;
      if (isStage && this.endCounter === 5 && this.done === true) {
        this.animatedList.listBox.classList.add('completed');
        window.setTimeout(() => {
          this.animatedList.listBox.classList.add('vis');
          me.animating = false;
        }, 15);
        this.endCounter = 0;
      }
      if (isStage && this.endCounter === 5 && this.done === false) {
         this.animatedList.listBox.classList.remove('vis');
         this.animatedList.listBox.classList.remove('completed');
        this.endCounter = 0;
      }
      
      //console.log(ev)
    }
    showListbox(ev) {

      ev.preventDefault();
      this.animating = true;

      if (this.done) {
      
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
