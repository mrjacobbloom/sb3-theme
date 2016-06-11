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
    this.svg = document.querySelector('svg.blocklySvg'); // Blockly.WorkspaceSVG.cachedParentSvg_;

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
      self.draggables = self.svg.querySelectorAll(".blocklyDraggable")
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
      for(let j = 0; j < this.draggables[i].getElementsByTagName('text').length; j++) {
        text += " " + this.draggables[i].getElementsByTagName('text')[j].textContent;
      }
      text = text.replace(/(&nbsp;|  +)/g, " ")
      if(text.match(query)) {
        result.push( this.draggables[i].getElementsByClassName('blocklyPath')[0] );
      }
    }
    return result;
  }

}
