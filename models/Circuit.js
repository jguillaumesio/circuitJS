import { Point,Line } from './index.js'

export default class Circuit{

	static pointNbr=0;
	static lineNbr=0;
	//static createMode=true; //pass to false to move
	static dotSize;

	constructor(circuit,dotSize){
		this._pointList=[];
		this._lineList=[];
		this._precedent=[];
		Circuit.dotSize=dotSize;
		this.draw(circuit);
	}

	draw(circuit){
		let extreme = Circuit.getExtremum(circuit);
		let resize = Circuit.getResize(extreme);
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

			    	this.updateLine(previousPoint._id,point._id,line);
			    	this.updateLine(point._id,nextPoint._id,lineTwo);
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
		this._lineList.push(Circuit.connect(this._pointList[id1]._domObject,this._pointList[id2]._domObject));
	}

	updateLine(id1,id2,line){
		Circuit.connect(this._pointList[id1]._domObject,this._pointList[id2]._domObject,line);
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
			let line = Circuit.connect(this._pointList[id1]._domObject,this._pointList[id2]._domObject,this._lineList[id1]);
			let lineTwo = Circuit.connect(this._pointList[id2]._domObject,this._pointList[id3]._domObject,this._lineList[id2]);
		});
	}

	static connect(div1, div2, update=false, dot=Circuit.dotSize,thickness=1, color='red') {
		let mid = dot/2;
	    let off1 = Circuit.getOffset(div1);
	    let off2 = Circuit.getOffset(div2);
	    let x1 = off1.left + off1.width;
	    let y1 = off1.top + off1.height;
	    let x2 = off2.left + off2.width;
	    let y2 = off2.top;
	    let length = Circuit.getDistance(x1,x2,y1-mid,y2+mid);
	    let cx = ((x1 + x2) / 2) - (length / 2) - mid ;
	    let cy = ((y1 + y2) / 2) - (thickness / 2);
	    let angle = Circuit.getAngle(x1,x2,y1-mid,y2+mid);
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

	static windowSize(){
		let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		return [w,h-10];
	}

	static getResize(array){
		let size = [Circuit.windowSize()[0]/(array[1][0]-array[0][0]+2*Circuit.dotSize),Circuit.windowSize()[1]/(array[1][1]-array[0][1]+2*Circuit.dotSize)];
		let resize = Math.min.apply(Math,size);
		return resize;
	}

	static getExtremum(array){
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

	static getOffset( el ) {
	    let rect = el.getBoundingClientRect();
	    return {
	        left: rect.left + window.pageXOffset,
	        top: rect.top + window.pageYOffset,
	        width: rect.width || el.offsetWidth,
	        height: rect.height || el.offsetHeight
	    };
	}

	static getAngle(x0,x1,y0,y1){
		return (180/Math.PI*Math.atan((y1-y0)/(x1-x0)));
	}

	static getDistance(x0,x1,y0,y1){
		return ((x1-x0)**2+(y1-y0)**2)**0.5;
	}
}