var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var editorInfo;
var start;
var src;

/*exports.aceGetFilterStack = function (name, context) {
    console.log("aceGetFilterStack called");
  return [
    context.linestylefilter.getRegexpFilter(
        new RegExp('https://(\\S+wikimedia\\S+)\\.([pP][nN][gG]|[jJ][pP][eE]?[gG]|[gG][iI][fF]|[bB][mM][pP]|[sS][vV][gG])imagesrc([?&;]\\S*|(?=\\s|$))', 'g'), 'image'),
  ];
};*/

/* Convert the classes into a tag */
/*exports.aceCreateDomLine = function(name, args) {
    console.log("aceCreateDomLine called:", args);
    var cls = args.cls;
    var domline = args.domline;
    var src = /(?:^| )url-(\S*)/.exec(cls);
    /*cls = args.cls.replace(/(^| )image:(\S+)/g, (x0, space, image) => {
      src = image;
      console.log("SRC:", src);
      if (!imageExists(src)) {
          console.log("Wir landen richtig");
          src = "https://raw.githubusercontent.com/tjark002/ep_previewimages/master/static/html/invalid.png";
      } else {
          console.log("Von mir aus!");
      }
      return `${space}image image_${image}`;
    });*/
    /*var modifier = {};
    if(src != null) {
        src = src[1];

        if(!(/^http:\/\//.test(src)) && !(/^https:\/\//.test(src))) {
            src = "http://" + src;
        }

        modifier = {
          extraOpenTags: `<span style="display:block;"><img src="${src}" style="max-width:100%" /></span>`,
          extraCloseTags: '',
                cls: cls
        }
        return modifier;
    }
    return [];
}*/

/* Convert the classes into a tag */
/*exports.aceCreateDomLine = function(name, context) {
    var cls = context.cls;
    var domline = context.domline;
    var url = /(?:^| )url-(\S*)/.exec(cls);
    console.log("aceCreateDomLine called:",url);
    var modifier = {};
    if(url != null) {
        url = url[1];

        if(!(/^http:\/\//.test(url)) && !(/^https:\/\//.test(url))) {
            url = "http://" + url;
        }

        modifier = {
            extraOpenTags: '<a href="' + url + '">',
            extraCloseTags: '</a>',
            cls: cls
        }
        return modifier;
    }
    return [];
}*/

exports.aceCreateDomLine = function (name, args) {
  
  if (args.cls.indexOf('image') > -1) { // If it's an image
    console.log("aceCreateDomLine called:",args);
    cls = args.cls.replace(/(^| )image:(\S+)/g, (x0, space, image) => {
      src = image.replace('imagesrc','');
      console.log("SRC:", src);
      if (!imageExists(src)) {
          console.log("Wir landen richtig");
          src = "https://raw.githubusercontent.com/tjark002/ep_previewimages/master/static/html/invalid.png";
      } else {
          console.log("Von mir aus!");
      }
      return `${space}image image_${image}`;
    });
      
    //let line = editorInfo.ace_caretLine();
    //let col = editorInfo.ace_caretColumn();

    /*console.log("Start:", start);
    var end = start;
    end[1] = start[1] + src.length;
    console.log("End:", end);
    editorInfo.ace_performDocumentReplaceRange(start, end, "");*/
    // Note the additional span wrapper here is required to stop errors if someone types text after an image url
      
    console.log("CLS", cls);
    return [{
      cls,
      //extraOpenTags: `<span style="display:block;"><img src="${src}" onerror="this.src='https://raw.githubusercontent.com/tjark002/ep_previewimages/master/static/html/invalid.png';" style="max-width:100%" /></span>`,
      extraOpenTags: `<span style="display:block;"><img src="${src}" style="max-width:100%" /></span>`,
      extraCloseTags: '',
    }];
  }
};

exports.acePostWriteDomLineHTML = function (name, context) {
    if (!src) {
        return
    } else {
        //context.node.remove();
        console.log("acePostWriteDomLineHTML");
        console.log(context.parenElement);
        console.log(context.node.parenElement);
        console.log(context.node);
        var link = context.node.firstChild.getElementsByTagName('a')[0];
        var span = context.node.childNodes[1];
        console.log("Initial link: ", link);
        console.log("Initial span: ", span);
        if (!link) {
            for (var i = 0; i < context.node.childNodes.length; i++) {
                var node = context.node.childNodes[i];
                link = node.getElementsByTagName('a')[0];
                if (link) {
                    span = context.node.childNodes[i+1];
                    i = 10000;
                } 
            }
        }
        if (!link) return;
        console.log("Perfect link", link);
        console.log("Perfect span: ", span);
        //link.remove();
        if (!span) return;
        //span.remove();
        //innerDocBody.append("<div></div>");
        /*var picline = $("#"+context.node.id).find("a");
        picline.css("display", "none");
        console.log("picline", picline);*/
        //picline.remove();
    }
    src = null;
}

function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}

const image = {
  removeImage(lineNumber) {
    const documentAttributeManager = this.documentAttributeManager;
    documentAttributeManager.removeAttributeOnLine(lineNumber, 'src');
  },
  addImage(lineNumber, src) {
    const documentAttributeManager = this.documentAttributeManager;
      console.log("addImage src:", src);
    documentAttributeManager.setAttributeOnLine(lineNumber, 'src', src);
  },
};

/* Bind the event handler to the toolbar buttons */
exports.postAceInit = function(hook, context) {
    if (!$('#editorcontainerbox').hasClass('flex-layout')) {
        $.gritter.add({
            title: "Error",
            text: "Ep_previewimages: Please upgrade to etherpad 1.9 for this plugin to work correctly",
            sticky: true,
            class_name: "error"
        })
    }
    /* Event: User clicks editbar button */
    $('.imagelink-icon').on('click',function() {
        console.log("wird aufgerufen");
        $('.imagelink-dialog').toggleClass('popup-show');
        $('.imagelink-dialog').css('left', $('.imagelink-icon').offset().left - 12);
    });
    /* Event: User creates new imagelink */
    $('.imagelink-save').on('click',function() {
        console.log("Test");
        var url = $('.imagelink-url').val();
        console.log("Läuft das hier?" + url);
        //doInsertImage(url+"imagesrc ", context);
        //caretInfo(context);
        context.ace.callWithAce((ace) => {
            const imageLineNr = _handleNewLines(ace);
            ace.ace_addImage(imageLineNr, url);
            ace.ace_doReturnKey();
          }, 'url', true);
        /*context.ace.callWithAce(function(ace) {
            ace.ace_doInsertImage(url+"imagesrc ", context);
        }, 'insertLink', true);*/
        $('.imagelink-url').val('');
        $('.imagelink-dialog').removeClass('popup-show');
    });
    /* User press Enter on url input */
    $('.imagelink-url').on("keyup", function(e)
    {
        if(e.keyCode == 13) // ENTER key
        {
          $('.imagelink-save').click();
        }
    });
}

exports.aceAttribsToClasses = function(hook, context) {
    console.log("aceAttribsToClasses");
    if (context.key === 'src') {
        console.log("aceAttribsToClasses");
        return [`src:${context.value}`];
    }
    /*if(context.key == 'url'){
        var url = context.value;
        return ['url-' + url ];
    }*/
}

exports.aceRegisterBlockElements = () => ['src'];


/* I don't know what this does */
exports.aceInitialized = function(hook, context) {
    editorInfo = context.editorInfo;
    editorInfo.ace_addImage = image.addImage.bind(context);
    editorInfo.ace_removeImage = image.removeImage.bind(context);
    editorInfo.ace_doInsertImage = doInsertImage.bind(context);
}

// Rewrite the DOM contents when an IMG attribute is discovered
exports.aceDomLineProcessLineAttributes = (name, context) => {
    console.log("ep_previewimages aceDomLineProcessLineAttributes", context.cls);
  const imgType = (/(?:^| )src:([^> ]*)/).exec(context.cls);
    console.log("imgType", imgType);
  if (!imgType) return [];
  // const randomId = Math.floor((Math.random() * 100000) + 1);
  if (imgType[1]) {
    const preHtml = `<img src="${imgType[1]}" style="max-width:100%" />`;
    const postHtml = '';
    const modifier = {
      preHtml,
      postHtml,
      processedMarker: true,
    };

    return [modifier];
  }

  return [];
};

function doInsertImage(url, context) {
    console.log("doInsertImage called:",url);
    var rex = new RegExp('https://(\\S+wikimedia\\S+)\\.([pP][nN][gG]|[jJ][pP][eE]?[gG]|[gG][iI][fF]|[bB][mM][pP]|[sS][vV][gG])imagesrc([?&;]\\S*|(?=\\s|$))');
    if (rex.test(url)) {
        let line = editorInfo.ace_caretLine();
        let col = editorInfo.ace_caretColumn();

        console.log(line, col);
        /*var rep = this.rep,
            documentAttributeManager = this.documentAttributeManager;
        if(!(rep.selStart)) {
            return;
        }
        start = rep.selStart;
        console.log("Passiert hier der Fehler?")
        console.log([line, col]);
        console.log([line, col+1]);
        console.log(start);
        console.log(start +1);*/
        documentAttributeManager = this.documentAttributeManager;
        console.log(documentAttributeManager);
        documentAttributeManager.setAttributeOnLine(line, 'src', url);
        //editorInfo.ace_replaceRange([line, col], [line, col], url);
        console.log("Nein"); 
    } else {
        return;
    }

    /*console.log("doInsertLink rep.start:",rep.selStart, rep.selStart[1]+1);
    var url = ["url",url];
    var selEnd = rep.selStart;
    selEnd[1] = rep.selStart[1] + 1;
    console.log(selEnd);
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selStart+1, [url]);*/
}

/*function doInsertLink(url) {
    console.log("doInsertLink called:",url);
    var rep = this.rep,
        documentAttributeManager = this.documentAttributeManager;
    if(!(rep.selStart && rep.selEnd)) {
        return;
    }
    var url = ["url",url];
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [url]);
}*/

/*function caretInfo(args) {
    let line = args.editorInfo.ace_caretLine();
    let col = args.editorInfo.ace_caretColumn();
    console.log(line, col);
}*/

/*exports.collectContentPre = function(hook,context) {
    var url = /(?:^| )url-(\S*)/.exec(context.cls);
    if(url) {
        context.cc.doAttrib(context.state,"url::" + url);
    }
}*/

const _handleNewLines = (ace) => {
  const rep = ace.ace_getRep();
  const lineNumber = rep.selStart[0];
  const curLine = rep.lines.atIndex(lineNumber);
  if (curLine.text) {
    ace.ace_doReturnKey();

    return lineNumber + 1;
  }

  return lineNumber;
};

exports.collectContentPre = function(hook,context) {
    var url = /(?:^| )src:(\S*)/.exec(context.cls);
    if(url) {
        context.cc.doAttrib(context.state,"url::" + url);
    }
}

