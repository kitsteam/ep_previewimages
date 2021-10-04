var $ = require('ep_etherpad-lite/static/js/rjquery').$;

exports.aceGetFilterStack = function (name, context) {
    console.log("aceGetFilterStack called");
  return [
    context.linestylefilter.getRegexpFilter(
        new RegExp('\\bhttps://(\\S+wikimedia\\S+)\\.([pP][nN][gG]|[jJ][pP][eE]?[gG]|[gG][iI][fF]|[bB][mM][pP]|[sS][vV][gG])([?&;]\\S*|(?=\\s|$))', 'g'), 'image'),
  ];
};

/* Convert the classes into a tag */
exports.aceCreateDomLine = function(name, args) {
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
    var modifier = {};
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
}

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

/*exports.aceCreateDomLine = function (name, args) {
  
  if (args.cls.indexOf('image') > -1) { // If it's an image
    console.log("aceCreateDomLine called:",args);
    let src;
    cls = args.cls.replace(/(^| )image:(\S+)/g, (x0, space, image) => {
      src = image;
      console.log("SRC:", src);
      if (!imageExists(src)) {
          console.log("Wir landen richtig");
          src = "https://raw.githubusercontent.com/tjark002/ep_previewimages/master/static/html/invalid.png";
      } else {
          console.log("Von mir aus!");
      }
      return `${space}image image_${image}`;
    });


    // Note the additional span wrapper here is required to stop errors if someone types text after an image url
    return [{
      cls,
      //extraOpenTags: `<span style="display:block;"><img src="${src}" onerror="this.src='https://raw.githubusercontent.com/tjark002/ep_previewimages/master/static/html/invalid.png';" style="max-width:100%" /></span>`,
      extraOpenTags: `<span style="display:block;"><img src="${src}" style="max-width:100%" /></span>`,
      extraCloseTags: '',
    }];
  }
};*/

function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}

/* Bind the event handler to the toolbar buttons */
exports.postAceInit = function(hook, context) {
    if (!$('#editorcontainerbox').hasClass('flex-layout')) {
        $.gritter.add({
            title: "Error",
            text: "Ep_embed_hyperlink2: Please upgrade to etherpad 1.9 for this plugin to work correctly",
            sticky: true,
            class_name: "error"
        })
    }
    /* Event: User clicks editbar button */
    $('.hyperlink-icon').on('click',function() {
        $('.hyperlink-dialog').toggleClass('popup-show');
        $('.hyperlink-dialog').css('left', $('.hyperlink-icon').offset().left - 12);
    });
    /* Event: User creates new hyperlink */
    $('.hyperlink-save').on('click',function() {
        var url = $('.hyperlink-url').val();
        context.ace.callWithAce(function(ace) {
            ace.ace_doInsertLink(url);
        }, 'insertLink', true);
        $('.hyperlink-url').val('');
        $('.hyperlink-dialog').removeClass('popup-show');
    });
    /* User press Enter on url input */
    $('.hyperlink-url').on("keyup", function(e)
    {
        if(e.keyCode == 13) // ENTER key
        {
          $('.hyperlink-save').click();
        }
    });
}

exports.aceAttribsToClasses = function(hook, context) {
    if(context.key == 'url'){
        var url = context.value;
        return ['url-' + url ];
    }
}


/* I don't know what this does */
exports.aceInitialized = function(hook, context) {
    var editorInfo = context.editorInfo;
    editorInfo.ace_doInsertLink = doInsertLink.bind(context);
}

function doInsertLink(url) {
    console.log("doInsertLink called:",url);
    var rep = this.rep,
        documentAttributeManager = this.documentAttributeManager;
    if(!(rep.selStart && rep.selEnd)) {
        return;
    }
    var url = ["url",url];
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [url]);
}

exports.collectContentPre = function(hook,context) {
    var url = /(?:^| )url-(\S*)/.exec(context.cls);
    if(url) {
        context.cc.doAttrib(context.state,"url::" + url);
    }
}

exports.aceKeyEvent = function(hook_name, args, cb) {
    let line = args.editorInfo.ace_caretLine();
    let col = args.editorInfo.ace_caretColumn();
    console.log(line, col);
}
