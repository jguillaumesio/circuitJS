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
		        let precedent = this._precedent.pop();
		        let circuit = precedent._pointList.map((point)=>[point._x,point._y]);
		        console.log(circuit);
		        this.deconstruct();
		        Circuit.pointNbr=0;
		        Circuit.lineNbr=0;
		        delete this;
		        new Circuit(circuit);
		  }
		});
		circuit.forEach((coord)=>{
			let point = new Point(Circuit.pointNbr,(coord[0]-extreme[0][0])*resize,(coord[1]-extreme[0][1])*resize);
			this._pointList.push(point);
			let pointDiv = point.htmlElement();

			document.getElementById('points').appendChild(pointDiv);

			pointDiv.addEventListener("drag",(e)=>{
				this._precedent.push(this);
			    move(pointDiv,e.clientX,e.clientY);
			});
			if(Circuit.pointNbr==circuit.length){
				this.moveAll(pointDiv,point,point._id-1,point._id,0);
			}
			else if(Circuit.pointNbr-1==0){
				this.moveAll(pointDiv,point,Circuit.pointNbr-1,point._id,point._id+1);
			}
			else{
				this.moveAll(pointDiv,point,point._id-1,point._id,point._id+1);
			}

			if(Circuit.pointNbr-2>=0){
				this.addLine(Circuit.pointNbr-2,Circuit.pointNbr-1);
			}
			if(Circuit.pointNbr==circuit.length){
				this.addLine(Circuit.pointNbr-1,0);
			}
		});
	}

	addLine(id1,id2){
		let line = connect(document.getElementById('point-'+id1),document.getElementById('point-'+id2),'red',1);
		this._lineList.push(line);
	}

	moveAll(pointDiv,point,id1,id2,id3){
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
			let line = connect(document.getElementById('point-'+id1),document.getElementById('point-'+id2),'red',1,this._lineList[id1]);
			let lineTwo = connect(document.getElementById('point-'+id2),document.getElementById('point-'+id3),'red',1,this._lineList[id2]);
		});
	}

	deconstruct(){
		let destruct=['lines','points'];
		for(const div of destruct){
			const el = document.getElementById(div);
		  	while (el.firstChild){
		  		el.removeChild(el.firstChild);
		  	}
		}
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

	updateElement(){
		let point = document.getElementById('point-'+this._id);
		point.style.top=this._y+"px";
		point.style.left=this._x+"px";
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
	}
}