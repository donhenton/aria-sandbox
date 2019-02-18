
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
