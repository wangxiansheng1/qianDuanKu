$(function(){
	$(".sidebar-toggle").click(function(){
    	var isScale = $("body").hasClass("sidebar-collapse");
    	if(isScale){
    		$(this).find(".fa-caret-left").show();
    		$(this).find(".fa-caret-right").hide();
    		
    	}else{
    		$(this).find(".fa-caret-left").hide();
    		$(this).find(".fa-caret-right").show();
    	}
    });
});
