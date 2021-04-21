import { Object,Circuit } from './index.js';

export default class Point extends Object{
	constructor(id,x,y,spline,previous=false,next=false){
		super(id,x,y,spline);
		this._previous=previous;
		this._next=next;
		this._domObject=this.htmlElement();
		Circuit._pointList[this._spline].push(this);
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
			Circuit._precedent.push([this._id,this._x,this._y,this._spline]);
		});
	}

	onDragEnd(domObject){
		domObject.addEventListener("dragend",(e)=>{
			this._x=e.clientX;
			this._y=e.clientY;
			this.updateElement();
			Circuit.connect(this._spline,Circuit._pointList[this._spline][this._previous]._domObject,this._domObject,Circuit._lineList[this._spline][this._previous]);
			Circuit.connect(this._spline,this._domObject,Circuit._pointList[this._spline][this._next]._domObject,Circuit._lineList[this._spline][this._id]);
		});
	}
}