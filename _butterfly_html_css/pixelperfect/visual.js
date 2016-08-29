function controllerImages(object){
var img =object['img'];
var opacity = object['opacity'];
var prefix  = object['prefix'];
 
$('<div id="CON_N">'
    +'<span class="b1">+</span>'
    +'<span class="b2">-</span>'
    +'<span class="bx">x</span>' 
    +'<span class="mon opacity">'+opacity+'</span>' 
  +'</div>').prependTo('body');
$('<div id="CON_B" style="position:absolute;min-width:100%;z-index: 1000;"></div>').prependTo('body');
$('<img id="testimg-'+prefix+'" style="display:none;position:relative;" />').attr({'src':img}).prependTo('#CON_B');
$('#testimg-'+prefix).css('opacity',opacity)
$('.mon.opacity').css({'font-size':'11px','color':'red'})
$('#CON_N .b1').click(function () {
  var  opacityClick = (Number($('#testimg-'+prefix).css('opacity')) + 0.10).toFixed(1);
  $('.mon.opacity').html(opacityClick)
  $('#testimg-'+prefix).css('opacity',opacityClick);
});
$('#CON_N .b2').click(function () {
  var  opacityClick = (Number($('#testimg-'+prefix).css('opacity')) - 0.10).toFixed(1);
  $('.mon.opacity').html(opacityClick)
  $('#testimg-'+prefix).css('opacity',opacityClick);
});
$('#CON_N .bx').click(function () {
  $('#testimg-'+prefix).toggle();
});
}
 