
/**
 * @namespace aria
 */

var aria = aria || {};

/**
 * @desc
 *  Key code constants
 */
aria.KeyCode = {
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

//aria.Utils = aria.Utils || {};



class AriaListBox {
  constructor(listboxNode) {
    this.listboxNode = listboxNode;
    this.activeDescendant = this.listboxNode.getAttribute('aria-activedescendant');
    this.multiselectable = this.listboxNode.hasAttribute('aria-multiselectable');
    this.moveUpDownEnabled = false;
    this.siblingList = null;
    this.upButton = null;
    this.downButton = null;
    this.moveButton = null;
    this.keysSoFar = '';
    this.handleFocusChange = function () {};
    this.handleItemChange = function (event, items) {};
    this.registerEvents();

  }
  registerEvents() {
    this.listboxNode.addEventListener('focus', this.setupFocus.bind(this));
    this.listboxNode.addEventListener('keydown', this.checkKeyPress.bind(this));
    this.listboxNode.addEventListener('click', this.checkClickItem.bind(this));
  }
  /**
   * @desc
   *  If there is no activeDescendant, focus on the first option
   */
  setupFocus() {
    if (this.activeDescendant) {
      return;
    }

    this.focusFirstItem();
  }
  /**
   * @desc
   *  Focus on the first option
   */
  focusFirstItem() {
    var firstItem;

    firstItem = this.listboxNode.querySelector('[role="option"]');

    if (firstItem) {
      this.focusItem(firstItem);
    }
  }
  /**
   * @desc
   *  Handle various keyboard controls; UP/DOWN will shift focus; SPACE selects
   *  an item.
   *
   * @param evt
   *  The keydown event object
   */
  checkKeyPress(evt) {
    var key = evt.which || evt.keyCode;
    var nextItem = document.getElementById(this.activeDescendant);

    if (!nextItem) {
      return;
    }

    switch (key) {
      case aria.KeyCode.PAGE_UP:
      case aria.KeyCode.PAGE_DOWN:
        if (this.moveUpDownEnabled) {
          evt.preventDefault();

          if (key === aria.KeyCode.PAGE_UP) {
            this.moveUpItems();
          } else {
            this.moveDownItems();
          }
        }

        break;
      case aria.KeyCode.UP:
      case aria.KeyCode.DOWN:
        evt.preventDefault();

        if (this.moveUpDownEnabled && evt.altKey) {
          if (key === aria.KeyCode.UP) {
            this.moveUpItems();
          } else {
            this.moveDownItems();
          }
          return;
        }

        if (key === aria.KeyCode.UP) {
          nextItem = nextItem.previousElementSibling;
        } else {
          nextItem = nextItem.nextElementSibling;
        }

        if (nextItem) {
          this.focusItem(nextItem);
        }

        break;
      case aria.KeyCode.HOME:
        evt.preventDefault();
        this.focusFirstItem();
        break;
      case aria.KeyCode.END:
        evt.preventDefault();
        this.focusLastItem();
        break;
      case aria.KeyCode.SPACE:
        evt.preventDefault();
        this.toggleSelectItem(nextItem);
        break;
      case aria.KeyCode.BACKSPACE:
      case aria.KeyCode.DELETE:
      case aria.KeyCode.RETURN:
        if (!this.moveButton) {
          return;
        }

        var keyshortcuts = this.moveButton.getAttribute('aria-keyshortcuts');
        if (key === aria.KeyCode.RETURN && keyshortcuts.indexOf('Enter') === -1) {
          return;
        }
        if (
              (key === aria.KeyCode.BACKSPACE || key === aria.KeyCode.DELETE) &&
              keyshortcuts.indexOf('Delete') === -1
              ) {
          return;
        }

        evt.preventDefault();

        var nextUnselected = nextItem.nextElementSibling;
        while (nextUnselected) {
          if (nextUnselected.getAttribute('aria-selected') != 'true') {
            break;
          }
          nextUnselected = nextUnselected.nextElementSibling;
        }
        if (!nextUnselected) {
          nextUnselected = nextItem.previousElementSibling;
          while (nextUnselected) {
            if (nextUnselected.getAttribute('aria-selected') != 'true') {
              break;
            }
            nextUnselected = nextUnselected.previousElementSibling;
          }
        }

        this.moveItems();

        if (!this.activeDescendant && nextUnselected) {
          this.focusItem(nextUnselected);
        }
        break;
      default:
        var itemToFocus = this.findItemToFocus(key);
        if (itemToFocus) {
          this.focusItem(itemToFocus);
        }
        break;
    }
  }
  /**
   * @desc
   *  Check if an item is clicked on. If so, focus on it and select it.
   *
   * @param evt
   *  The click event object
   */
  checkClickItem(evt) {
    if (evt.target.getAttribute('role') === 'option') {
      this.focusItem(evt.target);
      this.toggleSelectItem(evt.target);
    }
  }
  /**
   * @desc
   *  Focus on the last option
   */
  focusLastItem() {
    var itemList = this.listboxNode.querySelectorAll('[role="option"]');

    if (itemList.length) {
      this.focusItem(itemList[itemList.length - 1]);
    }
  }
  /**
   * @desc
   *  Defocus the specified item
   *
   * @param element
   *  The element to defocus
   */
  defocusItem(element) {
    if (!element) {
      return;
    }
    if (!this.multiselectable) {
      element.removeAttribute('aria-selected');
    }
    //aria.Utils.removeClass(element, 'focused');
    element.classList.remove('focused');
  }
  /**
   * @desc
   *  Focus on the specified item
   *
   * @param element
   *  The element to focus
   */
  focusItem(element) {
    this.defocusItem(document.getElementById(this.activeDescendant));
    if (!this.multiselectable) {
      element.setAttribute('aria-selected', 'true');
    }
    // aria.Utils.addClass(element, 'focused');
    element.classList.add('focused');

    this.listboxNode.setAttribute('aria-activedescendant', element.id);
    this.activeDescendant = element.id;

    if (this.listboxNode.scrollHeight > this.listboxNode.clientHeight) {
      var scrollBottom = this.listboxNode.clientHeight + this.listboxNode.scrollTop;
      var elementBottom = element.offsetTop + element.offsetHeight;
      if (elementBottom > scrollBottom) {
        this.listboxNode.scrollTop = elementBottom - this.listboxNode.clientHeight;
      } else if (element.offsetTop < this.listboxNode.scrollTop) {
        this.listboxNode.scrollTop = element.offsetTop;
      }
    }

    if (!this.multiselectable && this.moveButton) {
      this.moveButton.setAttribute('aria-disabled', false);
    }

    this.checkUpDownButtons();
    this.handleFocusChange(element);
  }
  /**
   * @desc
   *  Enable/disable the up/down arrows based on the activeDescendant.
   */
  checkUpDownButtons() {
    var activeElement = document.getElementById(this.activeDescendant);

    if (!this.moveUpDownEnabled) {
      return false;
    }

    if (!activeElement) {
      this.upButton.setAttribute('aria-disabled', 'true');
      this.downButton.setAttribute('aria-disabled', 'true');
      return;
    }

    if (this.upButton) {
      if (activeElement.previousElementSibling) {
        this.upButton.setAttribute('aria-disabled', false);
      } else {
        this.upButton.setAttribute('aria-disabled', 'true');
      }
    }

    if (this.downButton) {
      if (activeElement.nextElementSibling) {
        this.downButton.setAttribute('aria-disabled', false);
      } else {
        this.downButton.setAttribute('aria-disabled', 'true');
      }
    }
  }
  /**
   * @desc
   *  Toggle the aria-selected value
   *
   * @param element
   *  The element to select
   */
  toggleSelectItem(element) {
    if (this.multiselectable) {
      element.setAttribute(
            'aria-selected',
            element.getAttribute('aria-selected') === 'true' ? 'false' : 'true'
            );

      if (this.moveButton) {
        if (this.listboxNode.querySelector('[aria-selected="true"]')) {
          this.moveButton.setAttribute('aria-disabled', 'false');
        } else {
          this.moveButton.setAttribute('aria-disabled', 'true');
        }
      }
    }
  }
  setHandleItemChange(handlerFn) {
    this.handleItemChange = handlerFn;
  }
  setHandleFocusChange(focusChangeHandler) {
    this.handleFocusChange = focusChangeHandler;
  }
  findItemToFocus(key) {
    var itemList = this.listboxNode.querySelectorAll('[role="option"]');
    var character = String.fromCharCode(key);

    if (!this.keysSoFar) {
      for (var i = 0; i < itemList.length; i++) {
        if (itemList[i].getAttribute('id') == this.activeDescendant) {
          this.searchIndex = i;
        }
      }
    }
    this.keysSoFar += character;
    this.clearKeysSoFarAfterDelay();

    var nextMatch = this.findMatchInRange(
          itemList,
          this.searchIndex + 1,
          itemList.length
          );
    if (!nextMatch) {
      nextMatch = this.findMatchInRange(
            itemList,
            0,
            this.searchIndex
            );
    }
    return nextMatch;
  }
  clearKeysSoFarAfterDelay() {
    if (this.keyClear) {
      clearTimeout(this.keyClear);
      this.keyClear = null;
    }
    this.keyClear = setTimeout((function () {
      this.keysSoFar = '';
      this.keyClear = null;
    }).bind(this), 500);
  }
  findMatchInRange(list, startIndex, endIndex) {
    // Find the first item starting with the keysSoFar substring, searching in
    // the specified range of items
    for (var n = startIndex; n < endIndex; n++) {
      var label = list[n].innerText;
      if (label && label.toUpperCase().indexOf(this.keysSoFar) === 0) {
        return list[n];
      }
    }
    return null;
  }
}// end class