function Sb3Theme() {
  this.onLoad = function() {}; // to be overwriten by user

  // hang out until the SVG exists, then run the init function
  var observer = new MutationObserver(function(mutations) {
      if(document.querySelector('#blocklyDiv .blocklySvg')) {
          observer.disconnect();
          initSVG()
      }
  });
  observer.observe(document.getElementById('blocklyDiv'), {childList: true});

  function initSVG() { // more init
    this.svg = Blockly.WorkspaceSVG.cachedParentSvg_;
    this.horiz = Blockly.WorkspaceSVG.horizontalLayout;
    this.css = Blockly.Css.styleSheet;
    this.NS = Blockly.SVG_NS;
    this.defs = this.svg.getElementsByTagName('defs')[0];
    this.onLoad();
  }

  this.addFilter = function(filter) {
    var doc = new DOMParser().parseFromString(`<svg xmlns="` + this.NS; + `">` + filter + `</svg>`, 'image/svg+xml');
    defs.appendChild( this.defs.ownerDocument.importNode(doc.documentElement.firstElementChild, true) );
  }

}
