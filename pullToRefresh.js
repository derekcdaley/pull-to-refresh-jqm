var pullToRefresh = {
  onRefresh: function() {
    console.log("No defined refresh function!");
  },
  refreshPTRContent: function() {
    setTimeout(function() {
      var outsideWrapper = $("div.pull-scroll-wrapper"),
        listHeight = $("div.pull-scroll-wrapper")
          .find("ul")
          .outerHeight(),
        viewPortHeight = $("body.ui-mobile-viewport").outerHeight(),
        listRest =
          $("div.pull-scroll-wrapper")
            .find("ul")
            .offset().top -
          $(window).scrollTop() -
          43;
      if (listHeight >= viewPortHeight) outsideWrapper.outerHeight(viewPortHeight - 55);
      else outsideWrapper.outerHeight(listHeight);
      outsideWrapper.scrollTop(listRest);
    }, 0);
  },
  initiate: function() {
    var ul = $("ul"),
      w = $(window),
      outsideWrapper = $("div.pull-scroll-wrapper"),
      img = $("img.pull-image"),
      msgWrapper = $("div.pull-message-wrapper"),
      pullText = $("#pullText"),
      isRefreshing = false,
      isTouched = false,
      listRest =
        $("div.pull-scroll-wrapper")
          .find("ul")
          .offset().top -
        $(window).scrollTop() -
        43;

    pullToRefresh.refreshPTRContent();
    setTimeout(function() {
      outsideWrapper.scrollTop(listRest);

      outsideWrapper.on("touchmove", function() {
        isTouched = true;
        var pos2 = outsideWrapper.find("ul").offset().top - w.scrollTop();
        if (msgWrapper.hasClass("pull-message-wrapper-hidden") && pos2 >= 42)
          msgWrapper.removeClass("pull-message-wrapper-hidden");
        if (pos2 > 95) {
          img.addClass("pull-image-flipped");
          pullText.text("Release");
          img.removeClass("pull-image-spin");
        } else {
          img.removeClass("pull-image-flipped");
          pullText.text("Pull to Refresh");
          img.removeClass("pull-image-spin");
        }
      });
      ul.on("touchend", function() {
        isTouched = false;
        var w = $(window),
          pos = $(this).offset().top - w.scrollTop();
        if (pos > 95) {
          isRefreshing = true;
          img.attr("src", "images/common_refresh.svg");
          pullText.text("Refreshing...");
          img.addClass("pull-image-spin").removeClass("pull-image-flipped");
          pullToRefresh.onRefresh();
          setTimeout(function() {
            refreshMessage(outsideWrapper, msgWrapper);
            img.attr("src", "images/arrows_chevron_up.svg");
            isRefreshing = false;
            img.removeClass("pull-image-spin");
          }, 2000);
        } else if (pos > listRest) pullToRefresh.refreshPTRContent();
        if (pos < listRest && !msgWrapper.hasClass("pull-message-wrapper-hidden"))
          msgWrapper.addClass("pull-message-wrapper-hidden");
      });
      outsideWrapper.on("scrollstop", function() {
        setTimeout(function() {
          var pos1 = outsideWrapper.find("ul").offset().top - w.scrollTop();
          if (pos1 >= listRest && !isRefreshing && !isTouched)
            refreshMessage(outsideWrapper, msgWrapper);
        }, 0);
      });
      $(function() {
        var scrollPoint = 0;
        outsideWrapper
          .scroll(function() {
            outsideWrapper.scrollTop() < scrollPoint ? outsideWrapper.scrollTop(scrollPoint) : "";
          })
          .scroll();
      });
    }, 0);

    function refreshMessage(outsideWrapper, msgWrapper) {
      outsideWrapper.animate(
        {
          scrollTop: listRest
        },
        100
      );
      setTimeout(function() {
        if (!msgWrapper.hasClass("pull-message-wrapper-hidden"))
          msgWrapper.addClass("pull-message-wrapper-hidden");
      }, 0);
    }
  }
};
//PULL TO REFRESH
$("#pullToRefresh").one("pageshow", function() {
  pullToRefresh.initiate();
});
