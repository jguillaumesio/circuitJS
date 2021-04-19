import { Point,Line } from './index.js'

export default class Circuit{

	static _pointList={"outside":[],"inside":[]};
	static _lineList={"outside":[],"inside":[]};
	static pointNbr=0;
	static lineNbr=0;
	static _precedent=[];
	static dotSize;

	constructor(outside,inside,dotSize){
		Circuit.dotSize=dotSize;
		let extreme = Circuit.getExtremum(outside);
		let resize = Circuit.getResize(extreme);
		this.draw('outside',outside,extreme,resize);
		this.draw('inside',inside,extreme,resize);
		document.addEventListener('keydown', (event)=>{
			if (event.ctrlKey && event.key === 'z') {
				if(Circuit._precedent.length != 0){
					let previousState = Circuit._precedent.pop();

					let point = Circuit._pointList[previousState[3]][previousState[0]]; //actual point
					let previousPoint = Circuit._pointList[previousState[3]][point._previous]; //previous point
					let nextPoint = Circuit._pointList[previousState[3]][point._next]; //next point

					let line = Circuit._lineList[previousState[3]][point._previous];
					let lineTwo = Circuit._lineList[previousState[3]][point._id];

					point._x=previousState[1];
					point._y=previousState[2];
					point.updateElement();

					Circuit.updateLine(point._spline,previousPoint._id,point._id,line);
					Circuit.updateLine(point._spline,point._id,nextPoint._id,lineTwo);
				}
			}
		});
	}

	draw(spline,circuit,extreme,resize){
		circuit.forEach((coord)=>{
			let point;
			if(Circuit.pointNbr==0){
				point = new Point(Circuit.pointNbr,(coord[0]-extreme[0][0])*resize,(coord[1]-extreme[0][1])*resize,spline,circuit.length-1,Circuit.pointNbr+1);
			}
			else if(Circuit.pointNbr==circuit.length-1){
				point = new Point(Circuit.pointNbr,(coord[0]-extreme[0][0])*resize,(coord[1]-extreme[0][1])*resize,spline,Circuit.pointNbr-1,0);
			}
			else{
				point = new Point(Circuit.pointNbr,(coord[0]-extreme[0][0])*resize,(coord[1]-extreme[0][1])*resize,spline,Circuit.pointNbr-1,Circuit.pointNbr+1);
			}

			if(Circuit.pointNbr-2>=0){
				Circuit.addLine(spline,Circuit.pointNbr-2,Circuit.pointNbr-1);
			}
			if(Circuit.pointNbr==circuit.length){
				Circuit.addLine(spline,Circuit.pointNbr-1,0);
			}
		});
		Circuit.pointNbr=0;
		Circuit.lineNbr=0;
	}

	static addLine(spline,id1,id2){
		Circuit.connect(spline,Circuit._pointList[spline][id1]._domObject,Circuit._pointList[spline][id2]._domObject);
	}

	static updateLine(spline,id1,id2,line){
		Circuit.connect(spline,Circuit._pointList[spline][id1]._domObject,Circuit._pointList[spline][id2]._domObject,line);
	}

	static connect(spline,div1, div2, update=false, dot=Circuit.dotSize,thickness=1, color='red') {
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
	    	let line = new Line(Circuit.lineNbr,cx,cy,spline,length,angle);
	    	document.getElementById(spline+'-lines').appendChild(line._domObject);
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

	static getOffset(el){
		//console.log(el);
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