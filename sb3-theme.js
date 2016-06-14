'use strict';

function Sb3Theme() {
  var self = this;
  var vertexCounts = {
    "true": {
      "117": "stack",
      "81": "cap",
      "-1": "boolean",
      "-2": "number",
      "-4": "string",
      "77": "hat",
      "233": "cblock",
      "197": "cend",
      "-3": "celse"
    },
    "false": {
      "120": "stack",
      "80": "cap",
      "22": "boolean",
      "26": "number",
      "42": "string",
      "81": "hat",
      "241": "cblock",
      "201": "cend",
      "360": "celse"
    }
  };
  var inputVertexCounts = {
    "26": "number",
    "42": "string"
  };
  var categoryColors = {
    "#4CBF56": "operators",
    "#9966FF": "looks",
    "#4C97FF": "motion",
    "#FFAB19": "control",
    "#FFD500": "events"
  };

  // hang out until the SVG exists, then run the init function
  var initObserver = new MutationObserver(function(mutations) {
    if(document.querySelector('svg.blocklySvg')) {
      initObserver.disconnect();
      self._initSVG();
    }
  });

  if(document.querySelector('svg.blocklySvg')) {
    this._initSVG();
  } else {
    initObserver.observe(document.getElementsByTagName('html')[0], {childList: true, subtree: true}); // <body> doesn't always exist at runtime
  }

  this._initSVG = function() {
    this.svg = document.querySelector('svg.blocklySvg');
    this.dragsvg = document.querySelector('svg.blocklyDragSurface');

    this.NS = Blockly.SVG_NS;
    this.defs = this.svg.getElementsByTagName('defs')[0];
    for(let i = 0; i < onLoads.length; i++) {
      onLoads[i]();
    }

    //set up an observer for future changes to the document
    var observer = new MutationObserver(function(mutations) {
      self.newBlocks = [];
      self.horizontal = Blockly.mainWorkspace.horizontalLayout;

      for(let m = 0; m < mutations.length; m++) {
        for(let n = 0; n < mutations[m].addedNodes.length; n++) {
          let node = mutations[m].addedNodes[n]
          if(node.nodeType == 1 && node.classList.contains("blocklyDraggable")) {
            onChange(mutations[m].addedNodes[n]);
          }
        }
      }
      if(self.newBlocks.length) {
        for(let i in onChanges) {
          onChanges[i]();
        }
      }
    });

    observer.observe(this.svg, {childList: true, subtree: true});
  }

  var onChange = function(block) {
    self.newBlocks.push(block);

    let path = block.querySelector(":scope > path");

    let vertexCount = path.getAttribute("d").match(/,| /g).length;
    let shapeName = vertexCounts[self.horizontal.toString()][vertexCount];
    if(shapeName) {
      block.classList.add(shapeName);
    }

    let colorName = categoryColors[path.getAttribute("fill")];
    if(colorName) {
      block.classList.add(colorName);
    }

    //empty bool inputs should all have the same d attribute
    let bools = block.querySelectorAll(':scope > path[d="M 16,0  h 16 l 16,16 l -16,16 h -16 l -16,-16 l 16,-16 z"]');
    for(let j = 0; j < bools.length; j++) {
      bools[j].classList.add("input", "boolean");
    }

    let inputs = block.querySelectorAll(':scope > g > g.blocklyEditableText');
    for(let j = 0; j < inputs.length; j++) {
      let input = inputs[j].parentNode;
      input.classList.add("input");

      let inputVertexCount = input.getElementsByTagName("path")[0].getAttribute("d").match(/,| /g).length;
      let inputShapeName = inputVertexCounts[inputVertexCount];
      if(inputShapeName) {
        if(inputShapeName == "string") {
          if(inputs[j].querySelector("text tspan")) {
            input.classList.add("dropdown");
          } else {
            input.classList.add("string");
          }
        } else {
          input.classList.add(inputShapeName);
        }
      }
    }
  }

  var onLoads = [];
  this.addInit = function(func) {
    onLoads.push(func);
  }
  var onChanges = [];
  this.addOnChange = function(func) {
    onChanges.push(func);
  }

  this.addFilter = function(filter) {
    var doc = new DOMParser().parseFromString(`<svg xmlns="` + this.NS + `">` + filter + `</svg>`, 'image/svg+xml');
    this.defs.appendChild( this.defs.ownerDocument.importNode(doc.documentElement.firstElementChild, true) );
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

}

window.sb3theme = new Sb3Theme();
