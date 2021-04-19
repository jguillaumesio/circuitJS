import { Object,Circuit } from './index.js';

export default class Point extends Object{
	constructor(id,x,y,spline,previous=false,next=false){
		super(id,x,y,spline);
		this._previous=previous;
		this._next=next;
		this._domObject=this.htmlElement();
		Circuit.pointNbr+=1;
		if(this._spline=='outside'){
			Circuit._pointList[0].push(this);
		}
		else{
			Circuit._pointList[1].push(this);
		}
	}

	htmlElement(){
		let object = super.htmlElement('point',this._spline);
		object.setAttribute('draggable',true);
		this.onDragStart(object);
		this.onDragEnd(object);
		document.getElementById(this._spline+'-points').appendChild(object);
		return object;
	}

	onDragStart(domObject){
		domObject.addEventListener("dragstart",(e)=>{
			if(this._spline=="outside"){
				Circuit._precedent.push([this._id,this._x,this._y,0]);
			}
			else{
				Circuit._precedent.push([this._id,this._x,this._y,1]);
			}
		});
	}

	onDragEnd(domObject){
		domObject.addEventListener("dragend",(e)=>{
			this._x=e.clientX;
			this._y=e.clientY;
			this.updateElement();
			if(this._spline=="outside"){
				Circuit.connect(this._spline,Circuit._pointList[0][this._previous]._domObject,this._domObject,Circuit._lineList[0][this._previous]);
				Circuit.connect(this._spline,this._domObject,Circuit._pointList[0][this._next]._domObject,Circuit._lineList[0][this._id]);
			}
			else{
				Circuit.connect(this._spline,Circuit._pointList[1][this._previous]._domObject,this._domObject,Circuit._lineList[1][this._previous]);
				Circuit.connect(this._spline,this._domObject,Circuit._pointList[1][this._next]._domObject,Circuit._lineList[1][this._id]);
			}
		});
	}
}