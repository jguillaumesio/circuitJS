import { Object,Circuit } from './index.js';

export default class Point extends Object{
	constructor(id,x,y,previous=false,next=false){
		super(id,x,y);
		this._previous=previous;
		this._next=next;
		this._domObject=this.htmlElement();
		Circuit.pointNbr+=1;
		Circuit._pointList.push(this);
	}

	htmlElement(){
		let object = super.htmlElement('point');
		object.setAttribute('draggable',true);
		this.onDragStart(object);
		this.onDragEnd(object);
		document.getElementById('points').appendChild(object);
		return object;
	}

	onDragStart(domObject){
		domObject.addEventListener("dragstart",(e)=>{
			Circuit._precedent.push([this._id,this._x,this._y]);
		});
	}

	onDragEnd(domObject){
		domObject.addEventListener("dragend",(e)=>{
			this._x=e.clientX;
			this._y=e.clientY;
			this.updateElement();
			Circuit.connect(Circuit._pointList[this._previous]._domObject,this._domObject,Circuit._lineList[this._previous]);
			Circuit.connect(this._domObject,Circuit._pointList[this._next]._domObject,Circuit._lineList[this._id]);
		});
	}
}