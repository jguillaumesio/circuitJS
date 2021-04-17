export default class Circuit{

	static pointNbr=0;
	static lineNbr=0;

	constructor(circuit){
		this._pointList=[];
		this._lineList=[];
		let extreme = getExtremum(circuit);
		console.log(extreme);
		circuit.forEach((coord)=>{
			let point = new Point(Circuit.pointNbr,coord[0]-extreme[0][0],coord[1]-extreme[0][1]);

			let pointDiv = point.htmlElement();

			document.getElementById('points').appendChild(pointDiv);

			pointDiv.addEventListener("drag",(e)=>{
			    move(pointDiv,e.clientX,e.clientY);
			});
			if(Circuit.pointNbr==circuit.length){
				pointDiv.addEventListener("dragend",(e)=>{
					move(pointDiv,e.clientX,e.clientY);
					let line = connect(document.getElementById('point-'+(point._id-1)),document.getElementById('point-'+(point._id)),'red',1,this._lineList[point._id-1]);
					this._lineList[point._id-1] = line;
					let lineTwo = connect(document.getElementById('point-'+(point._id)),document.getElementById('point-0'),'red',1,this._lineList[point._id]);
					this._lineList[point._id] = lineTwo;
					console.log(this._lineList);
				});
			}
			else if(Circuit.pointNbr-1==0){
				pointDiv.addEventListener("dragend",(e)=>{
					move(pointDiv,e.clientX,e.clientY);
					let line = connect(document.getElementById('point-'+(Circuit.pointNbr-1)),document.getElementById('point-'+(point._id)),'red',1,this._lineList[Circuit.pointNbr-1]);
					this._lineList[Circuit.pointNbr-2] = line;
					let lineTwo = connect(document.getElementById('point-'+(point._id)),document.getElementById('point-'+(point._id+1)),'red',1,this._lineList[point._id]);
					this._lineList[point._id-1] = lineTwo;
					console.log(this._lineList);
				});
			}
			else{
				pointDiv.addEventListener("dragend",(e)=>{
					move(pointDiv,e.clientX,e.clientY);
					let line = connect(document.getElementById('point-'+(point._id-1)),document.getElementById('point-'+(point._id)),'red',1,this._lineList[point._id-1]);
					this._lineList[point._id-1] = line;
					let lineTwo = connect(document.getElementById('point-'+(point._id)),document.getElementById('point-'+(point._id+1)),'red',1,this._lineList[point._id]);
					this._lineList[point._id] = lineTwo;
					console.log(this._lineList);
				});
			}

			this._pointList.push(point);
			if(Circuit.pointNbr-2>=0){
				let line = connect(document.getElementById('point-'+(Circuit.pointNbr-2)),document.getElementById('point-'+(Circuit.pointNbr-1)),'red',1);
				this._lineList.push(line);
			}
			if(Circuit.pointNbr==circuit.length){
				let line = connect(document.getElementById('point-'+((Circuit.pointNbr)-1)),document.getElementById('point-0'),'red',1);
				this._lineList.push(line);
			}
		});
	}
}

function getExtremum(array){
	let extreme=[[99999,99999],[-99999,-99999]];
	for (const i of array) {
 		for(let coord=0;coord<i.length;coord++){
 			if(i[coord] > extreme[1][coord]){
				extreme[1][coord]=i[coord]
 			}
			if(i[coord] < extreme[0][coord]){
				extreme[0][coord]=i[coord]
			}
 		}
	}
	return extreme
}

function move(elmt,x,y) {
    elmt.style.top = y + "px";
    elmt.style.left = x + "px";
}

function connect(div1, div2, color, thickness, update=false) {
    var off1 = getOffset(div1);
    var off2 = getOffset(div2);
    var x1 = off1.left + off1.width;
    var y1 = off1.top + off1.height;
    var x2 = off2.left + off2.width;
    var y2 = off2.top;
    var length = getDistance(x1,x2,y1-5,y2+5);
    var cx = ((x1 + x2) / 2) - (length / 2) - 5 ;
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    var angle = getAngle(x1,x2,y1-5,y2+5);
    if(update == false){
    	let line = new Line(Circuit.lineNbr,cx,cy,length,angle);
    	document.getElementById('lines').appendChild(line.htmlElement());
    	return line;
    }
    else{
    	update._x=cx;
    	update._y=cy;
    	update._length=length;
    	update._angle=angle;
    	update.updateElement();
    	return update;
    }
}

function getOffset( el ) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
    };
}

function getAngle(x0,x1,y0,y1){
	return (180/Math.PI*Math.atan((y1-y0)/(x1-x0)));
}

function getDistance(x0,x1,y0,y1){
	return ((x1-x0)**2+(y1-y0)**2)**0.5
}

class Point{
	constructor(id,x,y){
		this._id=id;
		this._x=x;
		this._y=y;
		Circuit.pointNbr+=1;
	}

	htmlElement(){
		let point = document.createElement("div");
		point.classList.add('point');
		point.id = 'point-'+this._id;
		point.style.top=this._y+"px";
		point.style.left=this._x+"px";
		point.setAttribute('draggable',true);
		return point;
	}
}

class Line{
	constructor(id,x,y,length,angle){
		this._id=id;
		this._x=x;
		this._y=y;
		this._length=length;
		this._angle=angle;
		Circuit.lineNbr+=1;
	}

	htmlElement(){
		let line = document.createElement("div");
		line.classList.add('line');
		line.id = 'line-'+this._id;
		line.style.top=this._y+"px";
		line.style.left=this._x+"px";
		line.style.width=this._length+"px";
		line.style.transform="rotate("+this._angle+"deg)";
		return line;
	}

	updateElement(){
		let line = document.getElementById('line-'+this._id);
		line.style.top=this._y+"px";
		line.style.left=this._x+"px";
		line.style.width=this._length+"px";
		line.style.transform="rotate("+this._angle+"deg)";
		console.log(line);
	}
}