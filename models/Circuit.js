import { Point,Line } from './index.js'

export default class Circuit{

	static _pointList={"outside":[],"inside":[]};
	static _lineList={"outside":[],"inside":[]};
	static _precedent=[];
	static dotSize;

	static create (outside,inside,extreme,resize,dotSize){
		Circuit.dotSize=dotSize;
		document.getElementById('container').style.display="block";
		Circuit.draw('outside',outside,extreme,resize);
		Circuit.draw('inside',inside,extreme,resize);
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

					Circuit.connect(point._spline,previousPoint._domObject,point._domObject,line);
					Circuit.connect(point._spline,point._domObject,nextPoint._domObject,lineTwo);
				}
			}
		});
	}

	static draw(spline,circuit,extreme,resize){
		circuit.forEach((coord)=>{
			if(Circuit._pointList[spline].length==0){
				let ok = new Point(Circuit._pointList[spline].length,(coord[0]-extreme[0][0])*resize,(coord[1]-extreme[0][1])*resize,spline,circuit.length-1,1);
				console.log(ok);
			}
			else if(Circuit._pointList[spline].length+1==circuit.length){
				let ok = new Point(Circuit._pointList[spline].length,(coord[0]-extreme[0][0])*resize,(coord[1]-extreme[0][1])*resize,spline,Circuit._pointList[spline].length-1,0)
				console.log(ok);
			}
			else{
				new Point(Circuit._pointList[spline].length,(coord[0]-extreme[0][0])*resize,(coord[1]-extreme[0][1])*resize,spline,Circuit._pointList[spline].length-1,Circuit._pointList[spline].length+1);
			}

			if(Circuit._pointList[spline].length>=2){
				Circuit.connect(spline,Circuit._pointList[spline][Circuit._pointList[spline].length-2]._domObject,Circuit._pointList[spline][Circuit._pointList[spline].length-1]._domObject);
			}
			if(Circuit._pointList[spline].length==circuit.length){
				Circuit.connect(spline,Circuit._pointList[spline][0]._domObject,Circuit._pointList[spline][Circuit._pointList[spline].length-1]._domObject);
			}
		});
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
	    	let line = new Line(Circuit._lineList[spline].length,cx,cy,spline,length,angle);
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

	static getOffset(el){
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