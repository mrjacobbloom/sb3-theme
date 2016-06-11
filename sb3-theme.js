function Sb3Theme() {
  this.onLoad = function() {}; // to be overwriten by user

  // hang out until the SVG exists, then run the init function
  var observer = new MutationObserver(function(mutations) {
    console.log("b")
    if(Blockly && Blockly.WorkspaceSVG && Blockly.WorkspaceSVG.cachedParentSvg_) {
      console.log("c")
      observer.disconnect();
      initSVG();
    }
  });

  if(Blockly && Blockly.WorkspaceSVG && Blockly.WorkspaceSVG.cachedParentSvg_) {
    initSVG();
  } else {
    console.log("a")
    observer.observe(document, {childList: true}); // <body> doesn't always exist at runtime
  }

  function initSVG() { // more init
    this.svg = Blockly.WorkspaceSVG.cachedParentSvg_;
    this.horiz = Blockly.WorkspaceSVG.horizontalLayout;
    this.css = Blockly.Css.styleSheet;
    this.NS = Blockly.SVG_NS;
    this.defs = this.svg.getElementsByTagName('defs')[0];
    this.onLoad();
  }

  this.addFilter = function(filter) {
    window.alert("namespace: " + this.NS);
    var doc = new DOMParser().parseFromString(`<svg xmlns="` + this.NS + `">` + filter + `</svg>`, 'image/svg+xml');
    defs.appendChild( this.defs.ownerDocument.importNode(doc.documentElement.firstElementChild, true) );
  }

}
