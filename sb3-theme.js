if(!window.sb3theme) window.sb3theme = new (function() {
  'use strict';

  var self = this;

  this.options = {menuColors: true};

  this.css = document.createElement("style");
  document.head.appendChild(this.css);
  this.style = function(css) {
    this.css.innerHTML += css;
  };

  var onLoads = [];
  this.onLoad = function(func) {
    onLoads.push(func);
  };
  var onNews = [];
  this.onNew = function(func) {
    onNews.push(func);
  };
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
    var ns = self.NS;
    while(addFilters.length) {
      let filter = addFilters.pop();
      var doc = new DOMParser().parseFromString(`<svg xmlns="` + ns + `">` + filter + `</svg>`, 'image/svg+xml');
      defs.appendChild( defs.ownerDocument.importNode(doc.documentElement.firstElementChild, true) );
    }
  };

  var runEach = function(list, block) {
    for(let i = 0; i < list.length; i++) {
      if(block) {
        list[i](block.type, block.svgGroup_, block.classes, block);
      } else {
        list[i]();
      }

    }
  }

  var styleBlock = function(block) {
    block.svgPath_.classList.add("block-background");

    var classes = ["block"];
    var category = block.type.match(/[a-z]+/)[0];
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
      }
    }

    //icon class
    if(block.renderingMetrics_ && block.renderingMetrics_.imageField) {
      block.renderingMetrics_.imageField.imageElement_.classList.add("icon");
    }

    //figure out shape based on connectors and things
    var isHat = !block.outputConnection && !block.previousConnection;
    if(block.outputConnection) {
      classes.push("reporter");
      if(block.edgeShape_ == Blockly.OUTPUT_SHAPE_HEXAGONAL) {
        classes.push("boolean");
      } else if(block.edgeShape_ == Blockly.OUTPUT_SHAPE_ROUND) {
        classes.push("string");
      } else {
        // this shouldn't happen anymore because string-shaped reporters aren't a thing
      }
    } else {
      if(substacks) {
        classes.push("c-block");
        if(substacks > 1) {
          classes.push("else");
        }
      }
      if((self.horizontal) ? !block.previousConnection : isHat) {
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
    self.colors = Blockly.Colours;

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
      var results = oldDropdownShow.apply(this, arguments);
      this.DIV_.classList.add("dropdown-menu", self.colors[block.parentBlock_.colour_]);
      if(self.options.menuColors) {
        this.DIV_.style.backgroundColor = getComputedStyle(block.parentBlock_.svgPath_).fill;
        this.DIV_.style.borderColor = getComputedStyle(block.parentBlock_.svgPath_).stroke;
      }
      return results;
    };

    //hijack insertion-markers
    var oldSetInsertionMarker = Blockly.BlockSvg.prototype.setInsertionMarker;
    Blockly.BlockSvg.prototype.setInsertionMarker = function() {
      this.svgGroup_.classList.add("insertion-marker");
      return oldSetInsertionMarker.apply(this, arguments);
    };


    // hijack inputs to succcessfully keep track of their own types :D
    var hijackInputs = function() {
      var inputs = [
        ['FieldTextInput', 'input-text'],
        ['FieldAngle', 'input-angle'],
        ['FieldNumber', 'input-number'],
        ['FieldCheckbox', 'input-checkbox'],
        ['FieldColour', 'input-color'],
        ['FieldVariable', 'input-variable'],
        ['FieldDropdown', 'input-dropdown'],
        ['FieldIconMenu', 'input-icon-menu'],
        ['FieldDate', 'input-date']
      ]
      var oldappendInput = Blockly.Input.prototype.appendField;
      Blockly.Input.prototype.appendField = function() {
        var results = oldappendInput.apply(this, arguments);
        if(typeof arguments[0] == "object") {
          results.sourceBlock_.svgGroup_.classList.add("input", arguments[0].className);
          results.sourceBlock_.svgPath_.classList.add("input-background");
        }
        return results;
      };
      for(let i = 0; i < inputs.length; i++) {
        let funcName = inputs[i][0];
        let className = inputs[i][1];
        let func = Blockly[funcName];
        Blockly[funcName] = function() {
          var results = func.apply(this, arguments);
          this.className = className;
          return results;
        };
        for(let j in func) {
          Blockly[funcName][j] = func[j];
        }
        Blockly[funcName].prototype = func.prototype;
      }
    };
    hijackInputs();

    //hijack block init
    var oldInit = Blockly.BlockSvg.prototype.initSvg;
    Blockly.BlockSvg.prototype.initSvg = function() {
      var results = oldInit.apply(this, arguments);
      if(!this.isShadow_) {
        styleBlock(this);
        console.log([this, this.classes.join()]);

        runEach(onNews, this);
      }
      return results;
    };

    //hijack block rendering to capture shape changes
    var oldRender = Blockly.BlockSvg.prototype.render;
    Blockly.BlockSvg.prototype.render = function() {
      var results = oldRender.apply(this, arguments);
      if(!this.isShadow_) {
        var newShape = this.svgPath_.getAttribute("d")
        if(newShape != this.oldShape) {
          this.oldShape = newShape;

          runEach(onChanges, this)
        }
      }
      return results;
    };

    runAddFilters();
    runEach(onLoads, false);
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
