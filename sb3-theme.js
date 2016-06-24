'use strict';

if(!window.sb3theme) window.sb3theme = new (function() {
  var self = this;

  this.css = document.createElement("style");
  document.head.appendChild(this.css);
  this.style = function(css) {
    this.css.innerHTML += css;
  }

  var onChanges = [];
  this.onChange = function(func) {
    onChanges.push(func);
  }
  var addFilters = [];
  this.addFilter = function(filter) {
    addFilters.push(filter);
    if(this.svg) {
      runAddFilters();
    }
  }
  var runAddFilters = function() {
    var defs = self.svg.getElementsByTagName('defs')[0];
    var ns = Blockly.SVG_NS;
    while(addFilters.length) {
      let filter = addFilters.pop();
      var doc = new DOMParser().parseFromString(`<svg xmlns="` + ns + `">` + filter + `</svg>`, 'image/svg+xml');
      defs.appendChild( defs.ownerDocument.importNode(doc.documentElement.firstElementChild, true) );
    }
  }

  var blocklyEvent = function(event, db) {
    if(event instanceof Blockly.Events.Create) {
      let block = db[event.blockId];
      let classes = ["block"];
      let category = self.colors[block.colour_];
      classes.push(category);

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
        let substacks = 0;
        for(let i = 0; i < block.inputList.length; i++) {
          if(block.inputList[i].name.match(/SUBSTACK/)) {
            substacks++;
          }
        }
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

      block.svgPath_.classList.add("block-background");

      for(let i in onChanges) {
        onChanges[i]();
      }
    }
  }

  var initSVG = function() {
    self.svg = document.querySelector('svg.blocklySvg');
    self.horizontal = !!Blockly.BlockSvg.IMAGE_FIELD_WIDTH;
    if(self.horizontal) {
      self.svg.classList.add("horizontal");
    } else {
      self.svg.classList.add("vertical");
    }

    self.colors = {}; // buil an object with the official color names for easy category detection
    for(let i in Blockly.Colours) {
      if(Blockly.Colours.hasOwnProperty(i) && typeof Blockly.Colours[i] == "object") {
        self.colors[Blockly.Colours[i]["primary"]] = i;
      }
    }

    var flyoutWorkspace = (workspace.flyout_) ? workspace.flyout_.workspace_ :
      workspace.toolbox_.flyout_.workspace_;

    flyoutWorkspace.addChangeListener(function(e) {
      blocklyEvent(e, flyoutWorkspace.blockDB_)
    });
    Blockly.mainWorkspace.addChangeListener(function(e) {
      blocklyEvent(e, Blockly.mainWorkspace.blockDB_)
    });


    runAddFilters();
  }

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

  var styleBlock = function(block) {

    //empty bool inputs should all have the same d attribute
    var bools = block.querySelectorAll(':scope > path[d="M 16,0  h 16 l 16,16 l -16,16 h -16 l -16,-16 l 16,-16 z"]');
    for(let j = 0; j < bools.length; j++) {
      bools[j].classList.add("input", "input-boolean", "input-background");
      self.newInputs.push(bools[j]);
    }

    var inputs = block.querySelectorAll(':scope > g > g.blocklyEditableText');
    for(let j = 0; j < inputs.length; j++) {
      styleInput(inputs[j]);
    }
  }

  var styleInput = function(block) {
    if(block) {
      var input = block.parentNode;
      input.classList.add("input");
      self.newInputs.push(input);

      var path = input.querySelector(":scope > path");
      path.classList.add("input-background");

      var vertexCount = path.getAttribute("d").match(/,| /g).length;
      var shapeName = inputVertexCounts[vertexCount];
      if(shapeName) {
        if(shapeName == "input-string") {
          if(block.querySelector("text tspan")) {
            input.classList.add("input-dropdown");
          } else {
            input.classList.add("input-string");
          }
        } else {
          input.classList.add(shapeName);
        }
      }
    }
  }

  this.getBlocksWithText = function(query) {
    var result = [];
    for(let i = 0; i < this.newBlocks.length; i++) {
      let text = "";
      let children = this.newBlocks[i].children;
      for(let j = 0; j < children.length; j++) {
        if(children[j].tagName.match(/text/i)) {
          text += " " + children[j].textContent;
        }
      }
      text = text.replace(/(&nbsp;|  +)/g, " ")
      if(text.match(query)) {
        result.push( this.newBlocks[i] );
      }
    }
    return result;
  }

  this.getBlocksWithIcon = function(query) {
    var result = [];
    for(let i = 0; i < this.newBlocks.length; i++) {
      let images = this.newBlocks[i].querySelectorAll(':scope > g > image');
      for(let j = 0; j < images.length; j++) {
        if(images[j].getAttribute('xlink:href').match(query)) {
          result.push( this.newBlocks[i] );
        }
      }
    }
    return result;
  }

});
