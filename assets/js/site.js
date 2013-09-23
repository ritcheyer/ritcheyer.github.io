$(document).ready(function(){
   
   // Open new window w/o using target="_blank"
   $('[data-action="external"]').click(function(e){
       e.preventDefault();
       var launchNewPage = $(e.target).parent()[0].href;
       window.open(launchNewPage);
   });
   
	 // don't have this on the site anymore.
   // $('.social-icons a').hover(function(e){
   //     e.stopPropagation();
   //     var $this = $(this),
   //         myTitle = $this.attr('title');
   //     
   //     $this.parent().append('<div class="hide hover-over" />');
   //     
   //     $this.next().text(myTitle).fadeIn(400, function(){
   //         $(this).removeClass('hide').removeAttr('style');
   //     });
   // },
   // function(){
   //     var $this = $(this);
   //     $this.next('div').fadeOut('fast', function(){
   //         $(this).remove();
   //     });
   // });
});