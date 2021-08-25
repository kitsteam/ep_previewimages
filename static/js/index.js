exports.aceGetFilterStack = function (name, context) {
  return [
    context.linestylefilter.getRegexpFilter(
        new RegExp('\\bhttps://(\\S+wikimedia\\S+)|(\\S+unsplash\\S+)\\.([pP][nN][gG]|[jJ][pP][eE]?[gG]|[gG][iI][fF]|[bB][mM][pP]|[sS][vV][gG])([?&;]\\S*|(?=\\s|$))', 'g'), 'image'),
  ];
};

exports.aceCreateDomLine = function (name, args) {
  
  if (args.cls.indexOf('image') > -1) { // If it's an image
    console.log("aceCreateDomLine called");
    let src;
    cls = args.cls.replace(/(^| )image:(\S+)/g, (x0, space, image) => {
      src = image;
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
};

function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}