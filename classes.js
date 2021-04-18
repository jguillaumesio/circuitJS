export default class Circuit{

	static pointNbr=0;
	static lineNbr=0;
	static createMode=true;//pass to false to move

	constructor(circuit){
		this._pointList=[];
		this._lineList=[];
		this._precedent=[];
		this.draw(circuit);
	}

	draw(circuit){
		let extreme = getExtremum(circuit);
		let resize = getResize(extreme);
		document.addEventListener('keydown', (event)=>{
		    if (event.ctrlKey && event.key === 'z') {
		    	if(this._precedent.length != 0){
		    		let previous = this._precedent.pop();

			    	let point = this._pointList[previous[0]]; //actual point
			  		let previousPoint = this._pointList[point._previous]; //previous point
			    	let nextPoint = this._pointList[point._next]; //next point

			    	let line = this._lineList[point._previous];
			    	let lineTwo = this._lineList[point._id]

			    	point._x=previous[1];
			    	point._y=previous[2];
			    	point.updateElement();

			    	connect(previousPoint._domObject,point._domObject,'red',1,line);
			    	connect(point._domObject,nextPoint._domObject,'red',1,lineTwo);
		    	}
		  }
		});
		circuit.forEach((coord)=>{
			let point;
			if(Circuit.pointNbr==0){
				point = new Point(Circuit.pointNbr,(coord[0]-extreme[0][0])*resize,(coord[1]-extreme[0][1])*resize,circuit.length-1,Circuit.pointNbr+1);
			}
			else if(Circuit.pointNbr==circuit.length-1){
				point = new Point(Circuit.pointNbr,(coord[0]-extreme[0][0])*resize,(coord[1]-extreme[0][1])*resize,Circuit.pointNbr-1,0);
			}
			else{
				point = new Point(Circuit.pointNbr,(coord[0]-extreme[0][0])*resize,(coord[1]-extreme[0][1])*resize,Circuit.pointNbr-1,Circuit.pointNbr+1);
			}

			this._pointList.push(point);

			document.getElementById('points').appendChild(point._domObject);

			point._domObject.addEventListener("dragstart",(e)=>{
				this._precedent.push([point._id,point._x,point._y]);
			});
			point._domObject.addEventListener("drag",(e)=>{
			    move(point._domObject,e.clientX,e.clientY);
			});
			
			this.moveAll(point._domObject,point._previous,point._id,point._next);

			if(Circuit.pointNbr-2>=0){
				this.addLine(Circuit.pointNbr-2,Circuit.pointNbr-1);
			}
			if(Circuit.pointNbr==circuit.length){
				this.addLine(Circuit.pointNbr-1,0);
			}
		});
	}

	addLine(id1,id2){
		let line = connect(this._pointList[id1]._domObject,this._pointList[id2]._domObject,'red',1);
		this._lineList.push(line);
	}

	moveAll(pointDiv,id1,id2,id3){
		pointDiv.addEventListener("dragend",(e)=>{
			let movedPoint;
		    this._pointList.forEach((moved)=>{
		    	if(moved._id.toString()==pointDiv.id.split('-')[1]){
		    		movedPoint = moved;
		    	}
		    });
		    movedPoint._x=e.clientX;
		    movedPoint._y=e.clientY;
			movedPoint.updateElement();
			let line = connect(this._pointList[id1]._domObject,this._pointList[id2]._domObject,'red',1,this._lineList[id1]);
			let lineTwo = connect(this._pointList[id2]._domObject,this._pointList[id3]._domObject,'red',1,this._lineList[id2]);
		});
	}
}

function windowSize(){
	let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	return [w,h-10];
}

function getResize(array){
	let size = [windowSize()[0]/(array[1][0]-array[0][0]),windowSize()[1]/(array[1][1]-array[0][1])];
	let resize = Math.min.apply(Math,size);
	return resize;
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

function move(elmt,x,y){
	elmt._x=x;
	elmt._y=y;
}

function connect(div1, div2, color, thickness, update=false, dot=4) {
	let mid = dot/2;
    let off1 = getOffset(div1);
    let off2 = getOffset(div2);
    let x1 = off1.left + off1.width;
    let y1 = off1.top + off1.height;
    let x2 = off2.left + off2.width;
    let y2 = off2.top;
    let length = getDistance(x1,x2,y1-mid,y2+mid);
    let cx = ((x1 + x2) / 2) - (length / 2) - mid ;
    let cy = ((y1 + y2) / 2) - (thickness / 2);
    let angle = getAngle(x1,x2,y1-mid,y2+mid);
    if(update == false){
    	let line = new Line(Circuit.lineNbr,cx,cy,length,angle);
    	document.getElementById('lines').appendChild(line._domObject);
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
    let rect = el.getBoundingClientRect();
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

class Object{
	constructor(id,x,y){
		this._id=id;
		this._x=x;
		this._y=y;
		this._domObject=null;
	}

	htmlElement(pointOrLine){
		let object = document.createElement("div");
		object.id = pointOrLine+'-'+this._id;
		object.classList.add(pointOrLine);
		object.style.top=this._y+"px";
		object.style.left=this._x+"px";
		return object;
	}

	updateElement(){
		this._domObject.style.top=this._y+"px";
		this._domObject.style.left=this._x+"px";
	}
}

class Point extends Object{
	constructor(id,x,y,previous=false,next=false){
		super(id,x,y);
		this._previous=previous;
		this._next=next;
		this._domObject=this.htmlElement();
		Circuit.pointNbr+=1;
	}

	htmlElement(){
		let object = super.htmlElement('point');
		object.setAttribute('draggable',true);
		return object;
	}
}

class Line extends Object{
	constructor(id,x,y,length,angle){
		super(id,x,y);
		this._length=length;
		this._angle=angle;
		this._domObject=this.htmlElement();
		Circuit.lineNbr+=1;
	}

	htmlElement(){
		let object = super.htmlElement('line');
		object.style.width=this._length+"px";
		object.style.transform="rotate("+this._angle+"deg)";
		return object;
	}

	updateElement(){
		super.updateElement();
		this._domObject.style.width=this._length+"px";
		this._domObject.style.transform="rotate("+this._angle+"deg)";
	}
}