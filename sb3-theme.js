function Sb3Theme() {
  // hang out until the SVG exists, then run the init function
  var self = this;
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

    this.css = document.createElement("style");
    document.body.appendChild(this.css);

    this.NS = Blockly.SVG_NS;
    this.defs = this.svg.getElementsByTagName('defs')[0];
    for(i in onLoads) {
      onLoads[i]();
    }

    //set up an observer for future changes to the document
    var draggableCount = -1;
    var observer = new MutationObserver(function(mutations) {
      self.draggables = Array.prototype.slice.call(self.svg.querySelectorAll(".blocklyDraggable"));
      var dragdrag = self.dragsvg.querySelectorAll(".blocklyDraggable"); //cast that noelist to an array so I can merge it with this other nodelist
      for(let i = 0; i < dragdrag.length; i++) {
        self.draggables.push(dragdrag[i]);
      }
      if(draggableCount != self.draggables.length) {
        draggableCount = self.draggables.length;
        for(i in onChanges) {
          onChanges[i]();
        }
      }
    });

    observer.observe(this.svg, {childList: true, subtree: true});
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
    for(let i = 0; i < this.draggables.length; i++) {
      let text = "";
      let children = this.draggables[i].children;
      for(let j = 0; j < children.length; j++) {
        if(children[j].tagName.match(/text/i)) {
          text += " " + children[j].textContent;
        }
      }
      text = text.replace(/(&nbsp;|  +)/g, " ")
      if(text.match(query)) {
        result.push( this.draggables[i] );
      }
    }
    return result;
  }

  this.getBlocksWithFillColor = function(query) {
    var result = [];

    //convert fill color to RGB by coloring our hidden style element
    this.css.setAttribute("style", "background-color: " + query + ";");
    var rgbColor = document.defaultView.getComputedStyle(this.css, null).getPropertyValue("background-color");

    for(let i = 0; i < this.draggables.length; i++) {
      let path = this.draggables[i].getElementsByTagName('path')[0];
      if(rgbColor == document.defaultView.getComputedStyle(path, null).getPropertyValue("fill")) {
        result.push( this.draggables[i] );
      }
    }
    return result;
  }

  this.getBlocksWithIcon = function(query) {
    var result = [];
    for(let i = 0; i < this.draggables.length; i++) {
      let images = this.draggables[i].querySelectorAll(':scope > g > image');
      for(let j = 0; j < images.length; j++) {
        console.log(!!images[j].getAttribute('xlink:href').match(query) + " " + images[j].getAttribute('xlink:href'));
        if(images[j].getAttribute('xlink:href').match(query)) {
          result.push( this.draggables[i] );
        }
      }
    }
    console.log("-")
    return result;
  }

}
