function doFirst(){
	//mypic = document.getElementById('facepic');
	//mypic.addEventListener("dragstart",startDrag,false);
	map = document.getElementById('map');
	map.addEventListener('dragenter',function(e){e.preventDefault();},false);
	map.addEventListener('dragleave',dragLeave,false);
	map.addEventListener('dragenter',dragEnter,false);	
	map.addEventListener('dragover',function(e){e.preventDefault();},false);
	map.addEventListener('dragend',endDrag,false);	
	map.addEventListener('drop',dropped,false);
   
}

function endDrag(e){
    e.preventDefault();
	pic = e.target; 
	pic.style.visibility = 'hidden';

}
function dragEnter(e){
	e.preventDefault();
	map.style.background="SkyBlue";
	leftbox.style.border="3px solid red";
}
function dragLeave(e){
	e.preventDefault();
	map.style.background="White";
	map.style.border="3px solid blue";
}
function startDrag(e){
	var code = '<img id = "facepic" src = "yo.jpg">';
	e.dataTransfer.setData('Text', code);

}
function dropped(e){
	e.preventDefault();
	//map.innerHTML = e.dataTransfer.getData('Text');
	alert("image added to map!");

}
window.addEventListener("load",doFirst,false);