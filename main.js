$(document).ready(function(){

  $('#get-quote').on('click', () => {
    jQueryFromJSON();
  });// End .on('click')

  jQueryFromJSON();

});// End $(document).ready

 /*
  * jQueryFromJSON
  *
  * */
function jQueryFromJSON() {

  //  getJSON Returns a JavaScript object
	$.getJSON("https://api.quotable.io/random", function(obj) {
	})
		.done(function(obj) {
     
      let tags = [...obj.tags];
      let tagsDisplay = tags.join(" #");
      // Loading... screen
      // Bootstrap spinner inside #overlay div
      var overlay = $( '<div/>', {
        id: 'overlay',
        'class': 'overlay-styles bg-black',
        html: $('<div/>', {
                'class': 'min-vh-100 d-flex justify-content-center align-items-center',
                html: $('<div/>', {
                      'class': 'spinner-border text-light'
                      })      
              })
      });
    
      overlay.appendTo('body')

      //------------
      // Free Random (older) images from Unsplash (no attribute necessary) - works better than the official api using search method. ***Couldn't get Unsplash api to work with /photos/random?query= as it suggests.
      // Note: Need to add random number to end of url to prevent browser caching and ensure a new image is loaded each time.

      /*
       * URL patterns for source.unsplash
       *
       * */
      //For example, to get a random featured photo that matches the terms "apple" and "desk":
      // https://source.unsplash.com/random?apple,desk
      // Optionally, to specify a size, place it at the end of the path:
      // https://source.unsplash.com/1600x900?apple,desk 
      // https://source.unsplash.com/featured/1600x900?apple,desk
      let size = '1920x1080'; //1600x900
      var url = 'https://source.unsplash.com/' + size + '?' + tags[0] + '&' + Math.random()*Math.random();
      // Original jQuery for background image
      //$('body').css('background-image', 'url("' + url + '")');

      // Create a new image in memory and use load event to detect when the src is loaded
      $('<img/>').attr('src', url).on('load', function() {
        $(this).remove(); // Prevent memory leaks
        overlay.hide(); // Hide spinner overlay
        // Add background image
        $('body').css('background-image', 'url(' + url + ')');
      });

      // Build our interface
      $('#quote').text(obj.content);
      $('#author').text(obj.author);
      $('#tags').text("#" + tagsDisplay);

      /*
       * Official Unsplash API JSON call
       *
       * */
    // Search: https://api.unsplash.com/search/photos?query=
    // const unsplashKey = 'YOUR_UNSPLASH_KEY'
    // let url="https://api.unsplash.com/search/photos?query=" + tags + "&client_id=" + unsplashKey + "&per_page=1"

    //   $.ajax({
    //     method: 'GET',
    //     cache: false,
    //     url: url,
    //     success:function(obj){
    //         console.log(obj);
         
    //         // Get image link
    //         let imgLink = obj.results[0].urls.full;
    //         let uniqueImgLink = imgLink;
    //         // Set image on body
    //         $('body').css('background-image', 'url("' + imgLink + '")');
           
    //         // Photo Attribution
    //         let attrName = obj.results[0].user.name;
    //         let attrLink = obj.results[0].links.html;
    //         let attrSource = "markrussell.dev"
    //         $('#photo-attribution').html('Photo by <a href="' + attrLink +'?utm_source=' + attrSource + '&utm_medium=referral">' + attrName + '</a> on <a href="https://unsplash.com/?utm_source=' + attrSource + '&utm_medium=referral">Unsplash</a>');

    //         overlay.hide();
    //     }
    //   })
  
		})
		.fail(function() {
			alert("JSON data from api.quotable.io failed to load.")
			overlay.hide();
      
		})
}