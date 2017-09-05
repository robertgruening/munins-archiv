$(function() {
    setSizes();

	$(window).resize(function() {
	    setSizes();
    });
});

function setSizes() {	   	        
    $("#leftSidebar").height(
	    $("body").height() -
        $("#navigation").outerHeight() -
        $("#breadcrumb").outerHeight() -
        $("#clipboard").outerHeight() -
        16 /* #leftSidebar.padding-top */
    );
}
