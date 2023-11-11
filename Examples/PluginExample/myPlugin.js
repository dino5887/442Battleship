
//Simple start to builing a plugin

//function approach - can call with jQuery.sumContents(arg) or $.sumContents(arg)
//NOT chainable...  Couldn't do someting like $("#id").addClass('blah').sumContents(arg)
//do NOT have access to current html elements...
//BAD IDEA - namespace collisions...
jQuery.sumContents=function(arrayOfNodes){
	var tot=0;
	jQuery.each(arrayOfNodes,function(i,node){
		tot+=parseInt($(node).html());
	});
	return tot;
}


//Method Approach - gives you access to current set of HTML elements
//chainable!  can do something like $("#id").addClass('blah').slideFadeOut(arg,arg2)
//this inside is actually a reference to the jQuery object!  jQuery.fn - general plugin space of jQuery
$.fn.slideFadeOut = function( speed, callback ) {
  return this.animate( { height:"hide", opacity:"hide" }, speed, callback );
};






//IIFE (Immediately Invoked Function Expression) closure -- prevents collisions of $ in other libraries
(function($) { 
    // jQuery plugin definition  
  $.fn.reverseText = function() {
    // traverse all the nodes
    this.each( function() {
      // get the text
      var origText = $( this ).text(),
          newText = "";
          
      // reverse the text!
      for ( var i = origText.length -1; i >= 0; i-- ) {
        newText += origText.substr( i, 1 );
      }
      
      $( this ).html( newText );
    });
    
    // return the jQuery collection of elements
    return this;
  };
    
})(jQuery); //end closure



$( document).ready(function(){
  // make some dynamic list items
  const len = 16;
  for ( let i = 0; i < len; i++ ) {
  $( `#contents` ).append(`<li>${ Math.floor( Math.random() * 100) }</li>`)
  }
  $(`#array-sum`).html($.sumContents($(`li`)));

  $(`#test`).click(function(){
    $(`#array-sum`).slideFadeOut(4000).show(4000);
    $(`p`).reverseText().css(`background-color`, `yellow`);
  });

});