window.tabObj;


(() => {




  class TabPanel {
    constructor(t) {
      this.tabs = t;

      this.panels = Array.from(this.tabs.querySelectorAll("  div"));
      this.panelCount = this.panels.length;
      this.currentPanel = 0;
      this.panels.forEach(panel => {

        panel.classList.add('tabPanel');
        panel.setAttribute('aria-hidden', "true");
        this.hide(panel);

      })
      this.tabsList = this.tabs.querySelector("ul");
      this.tabsListItems =  this.tabsList.querySelectorAll("li > a");
      this.tabsList.classList.add('tabsList');
      this.setup();

    }
    setup() {
      let me = this;

      Array.from(this.tabsListItems).forEach((tab, linkIdx) => {
        let tabId = "tab-" + tab.getAttribute("href").slice(1);

        tab.setAttribute('id', tabId);
        tab.setAttribute('aria-selected', false);
        tab.parentElement.setAttribute("role", "presentation");
        me.panels[linkIdx].setAttribute("aria-labelledby", tabId);
        if (linkIdx === 0) {
          me.panels[linkIdx].setAttribute("aria-hidden", "false");
          me.show(me.panels[linkIdx]);
          tab.parentElement.classList.add("current");
          tab.setAttribute("aria-selected", "true");
          tab.setAttribute("tabindex", "0");
          let h2Item = me.panels[linkIdx].querySelector("h2");
          h2Item.setAttribute("tabindex", -1);
          h2Item.focus();
        }

        let click = me.tabClick.bind(this);
        let keydown = ((i) => {
          
          return (ev)=> {
           
             me.tabKeyDown(ev,i);
          };
        })(linkIdx);
       // console.log(`link ${linkIdx}`)
        tab.addEventListener('click', click);
        tab.addEventListener('keydown', keydown);

      });


    }
    show(p) {
      p.style.display = "block";

    }
    hide(p) {
      p.style.display = "none";

    }
    
     mod(val, modulo) {
      return (val % modulo + modulo) % modulo;
    }
    modIndex(difference) {
      return this.mod(this.currentPanel + difference, this.panelCount);
    }
    //this.currentSlide = this.modIndex(-1)
    tabKeyDown (e,linkIdx) {
          //  var tab = e.target;
         // console.log(tab)
          //  console.log(this)
         //  console.log(linkIdx)
            
            switch (e.which) {
              //left arrow up arrow
                case 37: case 38:
                    this.currentPanel = this.modIndex(-1);
                    break;
              //right arrow down arrow
                case 39: case 40:
                    this.currentPanel = this.modIndex(1);
                    break;
            }
            let newSelection = this.tabsListItems[this.currentPanel];
           // console.log(newSelection) //tabList has this an index
            newSelection.focus();
          
        }
    
    
    
    tabClick(e) {

      let tab = e.target;
      let tabId = e.target.getAttribute('id');
      // Prevent default click event
      e.preventDefault();


      // Change state of previously selected tabList item
      let selectedTab = this.tabsList.querySelector('li.current');

      selectedTab.classList.remove('current');
      selectedTab.querySelector('a').setAttribute("aria-selected", "false");

      // Hide previously selected tabPanel

      let selectedPanel = this.tabs.querySelector('[aria-hidden="false"]');
      selectedPanel.setAttribute("aria-hidden", "true");
      this.hide(selectedPanel);

      // Show newly selected tabPanel
      let newSelector = `[aria-labelledby="${tabId}"]`;
      let newPanel = this.tabs.querySelector(newSelector)
      newPanel.setAttribute("aria-hidden", "false");
      this.show(newPanel)


      tab.setAttribute("aria-selected", "true");
      tab.parentElement.classList.add("current")

      // Set focus to the first heading in the newly revealed tab content
      let h2Item = newPanel.querySelector("h2");
      h2Item.setAttribute("tabindex", -1);
      h2Item.focus();

    }
  }
  window.tabObj = new TabPanel(document.querySelector("#tabs"));

})();



/*
 
 
 $(function() {
    var tabs = $("#tabs");

    // For each individual tab DIV, set class and aria-hidden attribute, and hide it
    $(tabs).find("> div").attr({
        "class": "tabPanel",
        "aria-hidden": "true"
    }).hide();

    // Get the list of tab links
    var tabsList = tabs.find("ul:first").attr({
        "class": "tabsList",
    });

    // For each item in the tabs list...
    $(tabsList).find("li > a").each(
        function(a){
            var tab = $(this);

            // Create a unique id using the tab link's href
            var tabId = "tab-" + tab.attr("href").slice(1);

            // Assign tab id and aria-selected attribute to the tab control, but do not remove the href
            tab.attr({
                "id": tabId,
                "aria-selected": "false",
            }).parent().attr("role", "presentation");

            // Assign aria attribute to the relevant tab panel
            $(tabs).find(".tabPanel").eq(a).attr("aria-labelledby", tabId);

            // Set the click event for each tab link
            tab.click(
                function(e){
                    var tabPanel;

                    // Prevent default click event
                    e.preventDefault();

                    // Change state of previously selected tabList item
                    $(tabsList).find("> li.current").removeClass("current").find("> a").attr("aria-selected", "false");

                    // Hide previously selected tabPanel
                    $(tabs).find(".tabPanel:visible").attr("aria-hidden", "true").hide();

                    // Show newly selected tabPanel
                    tabPanel = $(tabs).find(".tabPanel").eq(tab.parent().index());
                    tabPanel.attr("aria-hidden", "false").show();

                    // Set state of newly selected tab list item
                    tab.attr("aria-selected", "true").parent().addClass("current");

                    // Set focus to the first heading in the newly revealed tab content
                    tabPanel.children("h2").attr("tabindex", -1).focus();
                }
            );
        }
    );

    // Set keydown events on tabList item for navigating tabs
    $(tabsList).delegate("a", "keydown",
        function (e) {
            var tab = $(this);
            switch (e.which) {
                case 37: case 38:
                    if (tab.parent().prev().length!=0) {
                        tab.parent().prev().find("> a").click();
                    } else {
                        $(tabsList).find("li:last > a").click();
                    }
                    break;
                case 39: case 40:
                    if (tab.parent().next().length!=0) {
                        tab.parent().next().find("> a").click();
                    } else {
                        $(tabsList).find("li:first > a").click();
                    }
                    break;
            }
        }
    );

    // Show the first tabPanel
    $(tabs).find(".tabPanel:first").attr("aria-hidden", "false").show();

    // Set state for the first tabsList li
    $(tabsList).find("li:first").addClass("current").find(" > a").attr({
        "aria-selected": "true",
        "tabindex": "0"
    });
});
 
 
 
 
*/