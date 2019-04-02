window.sample_menus = [];

class SampleMenu {
  constructor(elem) {
    this.sampleMenu = elem;
    console.log(elem)
  }
}


document.addEventListener('DOMContentLoaded', () => {
  
  
  Array.from(document.querySelectorAll('nav.sample-menu'))
        .forEach(n => {
          window.sample_menus.push(new SampleMenu(n))
  })
  
  
  
});

