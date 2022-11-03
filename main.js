$(document).ready(function(){

  // Main button
  $('#new-quote').on('click', (e) => {
    e.preventDefault();
    jQueryFromJSON();
  });

  jQueryFromJSON();

});// End $(document).ready

 /*
  * jQueryFromJSON (and Fetch, for now)
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
    
      overlay.appendTo('body');

      // Populate the interface with jQuery
      $('#text').text(obj.content);
      $('#author').text(obj.author);
      $('#tags').text("#" + tagsDisplay);


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
      let requestUrl = 'https://source.unsplash.com/' + size + '?' + tags[0] + '&' + Math.random()*Math.random();
      

      // Fetch image location for each image
      // Hide overlay
      // Note: Can't replicate this with ajax (find out why)
      fetch(requestUrl).then( response => {
        // Get url minus query string  for twitter link
        let shortUrl = response.url.split('?')[0];

        $('body').css('background-image', 'url(' + response.url + ')'); 
        //$('meta[name="twitter:image"]').attr("content", shortUrl);
        overlay.hide();
        
        // Add tweeLink to tweet button
        $("#tweet-quote").attr('href', buildTweetLink(obj.author, obj.content, tags)); 

        // Copy image url on('click')
        $('#copy-img-url').on('click', () => {
          
          // Copy text into clipboard ( todo: use .then after writeText)
          navigator.clipboard.writeText(response.url);

          var clipboardIcon = $('#copy-img-url').children( '.bi' );
          clipboardIcon.removeClass( 'bi-clipboard-fill' ).addClass('bi-clipboard-check-fill');

          // Timeout on checkmark
          setTimeout(function() {
              clipboardIcon.removeClass('bi-clipboard-check-fill').addClass('bi-clipboard-fill');
          }, 4000);

        });

      }).catch(error => {
        //overlay.hide();
        alert("Error: Unsplash.com background failed to load.");
        console.warn(error);
      });

      // Overlay Hack (When not using fetch or ajax to load random image): **Create a new image in memory and use load event to detect when the src is loaded
      // $('<img/>').attr('src', url).on('load', function() {
      //   $(this).remove(); // Prevent memory leaks
      //   overlay.hide(); // Hide spinner overlay
    
        // Add background image
        // $('body').css('background-image', 'url(' + url + ')');

      // });      
		})
		.fail(error => {
      alert("Error: Quotable.io quote failed to load.");
      console.warn(error);  
		})
}// End $(document).ready()


/*
 * Build Twitter tweetLink
 */
function buildTweetLink (author, content, tags, url = '') {

      // Encode
      const encoded = encodeURIComponent('\"' + content + '\" ' + author);
     
      // Capitalize first letter of each tag
      let capitalizedTags = tags.map(element => {
        return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
      });
     
      // Hashtags cannot contain hypens & each word should be capitalized
      // stringify the object, replace, then parse it
      // Capitalize first letter after '-' hypens, then remove hypens
      // e.g. famous-quotes is now FamousQuotes
      let tweetTags = JSON.parse(
        JSON.stringify(capitalizedTags).replace(/(?:^|-)\S/g, a => a.toUpperCase()).replace('-', '')
      );

      // If url not set, make it the home page
      if (url === '') {
        url = window.location.href;
      }

      return `https://twitter.com/intent/tweet?url=${url}&text=${encoded}&hashtags=${tweetTags}&via=markRussellDev`;
      
}


function useUnsplashApi( url ) {
        /*
       * Official Unsplash API JSON call
       * Need to find out how to keep my api key private before using this. **Not working as a function yet. Just pasted here for safe keeping for now
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

}
