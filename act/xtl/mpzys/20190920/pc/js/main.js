$(function () {

  'use strict';//表示强规则

  var options = {
        aspectRatio: 1 / 1, //裁剪框比例1:1
        preview: '.img-preview',
        crop: function (e) {
          /*
          $dataX.val(Math.round(e.x));
          $dataY.val(Math.round(e.y));
          $dataHeight.val(Math.round(e.height));
          $dataWidth.val(Math.round(e.width));
          $dataRotate.val(e.rotate);
          $dataScaleX.val(e.scaleX);
          $dataScaleY.val(e.scaleY);
          */
        }
      };


  // Cropper
  $('#imageCropper').on({
    ready: function (e) {
      console.log(e.type);
    },
    cropstart: function (e) {
      console.log(e.type, e.action);
    },
    cropmove: function (e) {
      console.log(e.type, e.action);
    },
    cropend: function (e) {
      console.log(e.type, e.action);
    },
    crop: function (e) {
      console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
    },
    zoom: function (e) {
      console.log(e.type, e.ratio);
    }
  }).cropper(options);

          //$image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);

});
