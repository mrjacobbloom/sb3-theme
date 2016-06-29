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

  var hijackReplacementHighlighting = function(block) {
    var old = block.highlightForReplacement;
    block.highlightForReplacement = function(add) {
      if(add) {
        block.svgGroup_.classList.add("replaceable");
      } else {
        block.svgGroup_.classList.remove("replaceable");
      }
      old.apply(block, [add]);
    }
  }

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
          queue.push([j.connection.targetConnection.sourceBlock_, db])
        }
      } else if(j.connection && j.connection.check_ == "Boolean") {
        //nothing, bools should already be taken care of
      } else if(j.connection) {
        let inputBlock = j.connection.targetConnection.sourceBlock_;
        if(inputBlock.isShadow_) {
          hijackReplacementHighlighting(inputBlock);
          let inputGroup = inputBlock.svgGroup_;
          inputBlock.svgPath_.classList.add("input-background");
          inputGroup.classList.add("input");
          if(inputBlock.type.match(/number/)) {
            inputGroup.classList.add("input-number");
          } else if(inputBlock.type.match(/text/)) {
            inputGroup.classList.add("input-string");
          } else if(inputBlock.type.match(/menu/)) {
            inputGroup.classList.add("input-dropdown");
          }
        } else {
          //if there's a non-shadow-block in the input, push it to the queue
          queue.push([inputBlock, db])
        }
      }
    }

    if(block.nextConnection && block.nextConnection.targetConnection) { //if there's a block conected to me, push it to the queue
      queue.push([block.nextConnection.targetConnection.sourceBlock_, db])
    }

    //figure out shape based on connectors and things
    if(!self.horizontal && !block.previousConnection && !block.startHat_) {
      hijackReplacementHighlighting(block);
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
  }

  var queue = [];
  var blocklyEvent = function(event, db) {
    if(event instanceof Blockly.Events.Create) {
      queue = [[db[event.blockId], db]];
      while(queue.length) {
        styleBlock(queue.pop());
      }
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
