if(!window.sb3theme) window.sb3theme = new (function() {
  'use strict';

  var self = this;

  this.options = {menuColors: true};

  this.css = document.createElement("style");
  document.head.appendChild(this.css);
  this.style = function(css) {
    this.css.innerHTML += css;
  };
  this.style(`.blocklyDropDownArrow {
        background: inherit !important;
        border-color: inherit !important;
      }`);

  var onChanges = [];
  this.onChange = function(func) {
    onChanges.push(func);
  };
  var addFilters = [];
  this.addFilter = function(filter) {
    addFilters.push(filter);
    if(this.svg) {
      runAddFilters();
    }
  };
  var runAddFilters = function() {
    var defs = self.svg.getElementsByTagName('defs')[0];
    var ns = Blockly.SVG_NS;
    while(addFilters.length) {
      let filter = addFilters.pop();
      var doc = new DOMParser().parseFromString(`<svg xmlns="` + ns + `">` + filter + `</svg>`, 'image/svg+xml');
      defs.appendChild( defs.ownerDocument.importNode(doc.documentElement.firstElementChild, true) );
    }
  };

  var styleBlock = function(queueitem) {
    var block = queueitem[0];
    var db = queueitem[1];
    block.svgPath_.classList.add("block-background");

    var classes = ["block"];
    var category = self.colors[block.colour_];
    classes.push(category);

    //do things wth the inputs
    var substacks = 0;
    var inputBools = block.svgGroup_.querySelectorAll(":scope > path:not(.block-background)");
    for(let i = 0; i < inputBools.length; i++) {
      inputBools[i].classList.add("input", "input-background", "input-boolean");
    }
    for(let i = 0; i < block.inputList.length; i++) {
      let j = block.inputList[i];
      if(j.name.match(/SUBSTACK/)) {
        substacks++;
        if(j.connection && j.connection.targetConnection) { //if there's a block in the substack, push it to the queue
          queue.push([j.connection.targetConnection.sourceBlock_, db]);
        }
      } else if(j.connection && j.connection.check_ == "Boolean") {
        //nothing, bools should already be taken care of
      } else if(j.connection) {
        let inputBlock = j.connection.targetConnection.sourceBlock_;
        if(inputBlock.isShadow_) {
          let inputGroup = inputBlock.svgGroup_;
          inputBlock.svgPath_.classList.add("input-background");
          inputGroup.classList.add("input");
          if(inputBlock.type.match(/number/)) {
            inputGroup.classList.add("input-number");
          } else if(inputBlock.type.match(/text/)) {
            inputGroup.classList.add("input-string");
          } else if(inputBlock.type.match(/menu|dropdown/)) {
            inputGroup.classList.add("input-dropdown");
          }
        } else {
          //if there's a non-shadow-block in the input, push it to the queue
          queue.push([inputBlock, db]);
        }
      }
    }

    //icon class
    if(block.renderingMetrics_ && block.renderingMetrics_.imageField) {
      block.renderingMetrics_.imageField.imageElement_.classList.add("icon");
    }

    if(block.nextConnection && block.nextConnection.targetConnection) { //if there's a block conected to me, push it to the queue
      queue.push([block.nextConnection.targetConnection.sourceBlock_, db]);
    }

    //figure out shape based on connectors and things
    if(!self.horizontal && !block.previousConnection && !block.startHat_) {
      classes.push("reporter");
      if(block.edgeShape_ == 1) {
        classes.push("boolean");
      } else if(block.edgeShape_ == 3) {
        classes.push("number");
      } else {
        classes.push("string");
      }
    } else {
      if(substacks) {
        classes.push("c-block");
        if(substacks > 1) {
          classes.push("else");
        }
      }
      if((self.horizontal) ? !block.previousConnection : block.startHat_) {
        classes.push("hat"); // because c-block/hats are very possible by just tweaking block definitions
      } else if(!substacks) {
        classes.push("stack"); //stack if it's not a c-block
      }
      if(!block.nextConnection) {
        classes.push("end");
      }
    }
    block.svgGroup_.classList.add.apply(block.svgGroup_.classList, classes);
    console.log([block, classes.join()]);

    for(let i in onChanges) {
      onChanges[i](block.type, block.svgGroup_, classes, block);
    }
  };

  var queue = [];
  var blocklyEvent = function(event, db) {
    if(event instanceof Blockly.Events.Create) {
      queue = [[db[event.blockId], db]];
      while(queue.length) {
        styleBlock(queue.pop());
      }
    }
  };

  var initSVG = function() {
    self.svg = document.querySelector('svg.blocklySvg');
    self.horizontal = !!Blockly.BlockSvg.IMAGE_FIELD_WIDTH;
    if(self.horizontal) {
      self.svg.classList.add("horizontal");
    } else {
      self.svg.classList.add("vertical");
    }

    self.colors = {}; // build an object with the official color names for easy category detection
    for(let i in Blockly.Colours) {
      if(Blockly.Colours.hasOwnProperty(i) && typeof Blockly.Colours[i] == "object") {
        self.colors[Blockly.Colours[i].primary] = i;
      }
    }

    //hijack replacement-rings
    var oldHighlightForReplacement = Blockly.BlockSvg.prototype.highlightForReplacement;
    Blockly.BlockSvg.prototype.highlightForReplacement = function(add) {
      if(add) {
        this.svgGroup_.classList.add("replaceable");
      } else {
        this.svgGroup_.classList.remove("replaceable");
      }
      oldHighlightForReplacement.apply(this, arguments);
    };

    //hijack dropown menus
    var oldDropdownShowEditor = Blockly.FieldDropdown.prototype.showEditor_;
    Blockly.FieldDropdown.prototype.showEditor_ = function() {
      oldDropdownShowEditor.apply(this, arguments);
      var menu = document.querySelector(".blocklyDropDownDiv");
      menu.classList.add("dropdown-menu", self.colors[this.sourceBlock_.parentBlock_.colour_]);
      if(self.options.menuColors) {
        menu.style.backgroundColor = getComputedStyle(this.sourceBlock_.parentBlock_.svgPath_).fill;
        menu.style.borderColor = getComputedStyle(this.sourceBlock_.parentBlock_.svgPath_).stroke;
      }
    };

    //hijack icon menus
    var oldIconMenuShowEditor = Blockly.FieldIconMenu.prototype.showEditor_;
    Blockly.FieldIconMenu.prototype.showEditor_ = function() {
      oldIconMenuShowEditor.apply(this, arguments);
      var menu = document.querySelector(".blocklyDropDownDiv");
      menu.classList.add("dropdown-menu", self.colors[this.sourceBlock_.parentBlock_.colour_]);
      if(self.options.menuColors) {
        menu.style.backgroundColor = getComputedStyle(this.sourceBlock_.parentBlock_.svgPath_).fill;
        menu.style.borderColor = getComputedStyle(this.sourceBlock_.parentBlock_.svgPath_).stroke;
      }
    };

    //hijack insertion-markers
    var oldSetInsertionMarker = Blockly.BlockSvg.prototype.setInsertionMarker;
    Blockly.BlockSvg.prototype.setInsertionMarker = function() {
      this.svgGroup_.classList.add("insertion-marker");
      oldSetInsertionMarker.apply(this, arguments);
    };

    var flyoutWorkspace = (workspace.flyout_) ? workspace.flyout_.workspace_ :
      workspace.toolbox_.flyout_.workspace_;

    flyoutWorkspace.addChangeListener(function(e) {
      blocklyEvent(e, flyoutWorkspace.blockDB_);
    });
    Blockly.mainWorkspace.addChangeListener(function(e) {
      blocklyEvent(e, Blockly.mainWorkspace.blockDB_);
    });


    runAddFilters();
  };

  // hang out until the SVG exists, then run the init function
  if(document.querySelector('svg.blocklySvg')) {
    initSVG();
  } else {
    var initObserver = new MutationObserver(function(mutations) {
      if(document.querySelector('svg.blocklySvg')) {
        initObserver.disconnect();
        initSVG();
      }
    });
    initObserver.observe(document.getElementsByTagName('html')[0], {childList: true, subtree: true}); // <body> doesn't always exist at runtime
  }
});
