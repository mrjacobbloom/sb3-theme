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

  var onNews = [];
  this.onNew = function(func) {
    onNews.push(func);
  };
  var onChanges = [];
  this.onChange = function(func) {
    onChange.push(func);
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
    var ns = self.NS;
    while(addFilters.length) {
      let filter = addFilters.pop();
      var doc = new DOMParser().parseFromString(`<svg xmlns="` + ns + `">` + filter + `</svg>`, 'image/svg+xml');
      defs.appendChild( defs.ownerDocument.importNode(doc.documentElement.firstElementChild, true) );
    }
  };

  var styleBlock = function(block) {
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
        }
      }
    }

    //icon class
    if(block.renderingMetrics_ && block.renderingMetrics_.imageField) {
      block.renderingMetrics_.imageField.imageElement_.classList.add("icon");
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
    block.classes = classes;
  };

  var initSVG = function() {
    self.svg = document.querySelector('svg.blocklySvg');
    self.horizontal = !!Blockly.BlockSvg.IMAGE_FIELD_WIDTH;
    if(self.horizontal) {
      self.svg.classList.add("horizontal");
    } else {
      self.svg.classList.add("vertical");
    }
    self.NS = self.svg.namespaceURI;

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
    var oldDropdownShow = Blockly.DropDownDiv.showPositionedByBlock;
    Blockly.DropDownDiv.showPositionedByBlock = function(owner, block) {
      oldDropdownShow.apply(this, arguments);
      this.DIV_.classList.add("dropdown-menu", self.colors[block.parentBlock_.colour_]);
      if(self.options.menuColors) {
        this.DIV_.style.backgroundColor = getComputedStyle(block.parentBlock_.svgPath_).fill;
        this.DIV_.style.borderColor = getComputedStyle(block.parentBlock_.svgPath_).stroke;
      }
    };

    //hijack insertion-markers
    var oldSetInsertionMarker = Blockly.BlockSvg.prototype.setInsertionMarker;
    Blockly.BlockSvg.prototype.setInsertionMarker = function() {
      this.svgGroup_.classList.add("insertion-marker");
      oldSetInsertionMarker.apply(this, arguments);
    };

    //hijack block init
    var oldInit = Blockly.BlockSvg.prototype.initSvg;
    Blockly.BlockSvg.prototype.initSvg = function() {
      oldInit.apply(this, arguments);
      if(!this.isShadow_) {
        styleBlock(this);
        console.log([this, this.classes.join()]);

        for(let i in onNews) {
          onNews[i](this.type, this.svgGroup_, this.classes, this);
        }
      }
    };

    //hijack block rendering to capture shape changes
    var oldRender = Blockly.BlockSvg.prototype.render;
    Blockly.BlockSvg.prototype.render = function() {
      oldRender.apply(this, arguments);
      if(!this.isShadow_) {
        var newShape = this.svgPath_.getAttribute("d")
        if(newShape != this.oldShape) {
          this.oldShape = newShape;

          for(let i in onChanges) {
            onChanges[i](this.type, this.svgGroup_, this.classes, this);
          }
        }
      }
    };

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
