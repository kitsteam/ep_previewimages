exports.aceGetFilterStack = function (name, context) {
  return [
    context.linestylefilter.getRegexpFilter(
        new RegExp('\\bhttps://(\\S+wikimedia\\S+)|(\\S+unsplash\\S+)\\.([pP][nN][gG]|[jJ][pP][eE]?[gG]|[gG][iI][fF]|[bB][mM][pP]|[sS][vV][gG])([?&;]\\S*|(?=\\s|$))', 'g'), 'image'),
  ];
};


exports.aceCreateDomLine = function (name, args) {
  if (args.cls.indexOf('image') > -1) { // If it's an image
    let src;
    cls = args.cls.replace(/(^| )image:(\S+)/g, (x0, space, image) => {
      //src = "../html/invalid.png";
      src = "../ep_previewimages/static/html/invalid.png";
      return `${space}image image_${image}`;
    });


    // Note the additional span wrapper here is required to stop errors if someone types text after an image url
    return [{
      cls,
      //extraOpenTags: `<span style="display:block;"><img src="${src}" onerror="this.src='https://visionz.de/wp-content/uploads/2021/03/01_Visionz_web-scaled-e1616685650690.jpg';" style="max-width:100%" /></span>`,
      extraOpenTags: `<span style="display:block;"><img src="${src}" style="max-width:100%" /></span>`,
      extraCloseTags: '',
    }];
  }
};