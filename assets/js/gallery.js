(function () {
  var gallery = document.querySelector(".gallery");

  if (!gallery) {
    return;
  }

  var viewer = gallery.querySelector(".viewer"),
      zoom = viewer.querySelector(".zoom"),
      curr = "",
      thumbs = gallery.querySelectorAll(".thumb"),
      len = thumbs.length,
      imgs = [].map.call(thumbs, getImg),
      handlers = [].map.call(imgs, showImg);

  if (len) {
    viewer.style.backgroundImage = "url("+imgs[0]+")";
  }

  if (len > 1) {
    viewer.addEventListener("click", nextImg);
  }
      
  for (var i = 0; i < len; i++) {
    thumbs[i].addEventListener("mouseover",  handlers[i]);
    thumbs[i].addEventListener("touchstart",  handlers[i]);
  }

  function nextImg (e) {
    if (e.target.tagName !== "A" ) {
      var next = curr ? (imgs.indexOf(curr) + 1) % len : 1;
      showImg(imgs[next])();
    }
  }

  function showImg (img) {
    return function () {
      if (img !== curr) {
        viewer.style.backgroundImage = "url("+img+")";
        zoom.href = img;
        curr = img;
      }
    };
  }

  function getImg (thumb) {
    return thumb.getAttribute("data-img");
  }

}());
