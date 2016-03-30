const cssNumber = {
  'column-count': 1,
  'columns': 1,
  'font-weight': 1,
  'line-height': 1,
  'opacity': 1,
  'z-index': 1,
  'zoom': 1
};
const rootNodeRE = /^(?:body|html)$/i;

function isWindow(obj) {
  return obj != null && obj == obj.window;
}

function isDocument(obj) {
  return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
}

function camelize(str) {
  return str.replace(/-+(.)?/g, function(match, chr) {
    return chr ? chr.toUpperCase() : '';
  });
}

function dasherize(str) {
  return str.replace(/::/g, '/')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function maybeAddPx(name, value) {
  return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value;
}

let z = {
  trim: function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  },
  offset: function(el, coordinates) {
    if (coordinates) {
      // TODO:
      // set offset
      // {
      //    left:
      //    top:
      //    width:
      //    height:
      // }
      return;
    }

    if (!el) {
      return null;
    }

    let obj = el.getBoundingClientRect();

    return {
      left: obj.left + window.pageXOffset,
      top: obj.top + window.pageYOffset,
      width: Math.round(obj.width),
      height: Math.round(obj.height)
    };
  },
  scrollTop: function(el, value) {
    if (!el) {
      return;
    }

    var hasScrollTop = 'scrollTop' in el;
    if (value === undefined) {
      return hasScrollTop ? el.scrollTop : el.pageYOffset
    }

    if (hasScrollTop) {
      el.scrollTop = value;
    } else {
      el.scrollTo(el.scrollX, value);
    }
  },
  css: function(el, property, value) {
    if (arguments.length < 3) {
      var computedStyle, element = el
      if (!element) return
      computedStyle = getComputedStyle(element, '')
      if (typeof property == 'string')
        return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
    }

    var css = ''
    if (type(property) == 'string') {
      if (!value && value !== 0)
        element.style.removeProperty(dasherize(property))
      else
        css = dasherize(property) + ":" + maybeAddPx(property, value)
    } else {
      for (key in property)
        if (!property[key] && property[key] !== 0)
          element.style.removeProperty(dasherize(key))
        else
          css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
    }

    return element.style.cssText += ';' + css
  },
  position: function(el) {
    var elem = el,
      // Get *real* offsetParent
      offsetParent = z.offsetParent(elem),
      // Get correct offsets
      offset = z.offset(elem),
      parentOffset = rootNodeRE.test(offsetParent.nodeName) ? {
        top: 0,
        left: 0
      } : z.offset(offsetParent);

    // Subtract element margins
    // note: when an element has margin: auto the offsetLeft and marginLeft
    // are the same in Safari causing offset.left to incorrectly be 0
    offset.top -= parseFloat(z.css(elem, 'margin-top')) || 0;
    offset.left -= parseFloat(z.css(elem, 'margin-left')) || 0;

    // Add offsetParent borders
    parentOffset.top += parseFloat(z.css(offsetParent, 'border-top-width')) || 0;
    parentOffset.left += parseFloat(z.css(offsetParent, 'border-left-width')) || 0;

    // Subtract the two offsets
    return {
      top: offset.top - parentOffset.top,
      left: offset.left - parentOffset.left
    };
  },
  offsetParent: function(el) {
    var parent = el.offsetParent || document.body;

    while (parent && !rootNodeRE.test(parent.nodeName) && z.css(parent, "position") == "static") {
      parent = parent.offsetParent;
    }

    return parent;
  }
};

;
['width', 'height'].forEach(function(dimension) {
  let dimensionProperty =
    dimension.replace(/./, function(m) {
      return m[0].toUpperCase()
    });

  z[dimension] = function(el, value) {
    let offset;

    if (value === undefined) {
      return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = z.offset(el)) && offset[dimension];
    }

    // TODO:
    // set width, height
    return;
  }
});

export default z;
