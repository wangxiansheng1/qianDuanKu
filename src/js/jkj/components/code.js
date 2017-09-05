/* AdminJKJ $.jkj
 * ==========================
 * @作者 尹喜晨
 * @日期 2017-06-08
 *
 * 修改日志：
 *
 */
/*! xmp 代码展开
 */
$('[data-xmp]').click(function(){
	var t=$(this).text();
	if(t=="展开代码"){
		$(this).next('xmp').css("height","auto");
		$(this).text("收起代码");
	}else{
		$(this).next('xmp').css("height","100px");
		$(this).text("展开代码");
	}  
});
