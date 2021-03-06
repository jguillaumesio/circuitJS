import { Object,Circuit } from './index.js';
import { Creation } from '../classes/index.js';

export default class Point extends Object{
	constructor(id,x,y,spline,color,previous=false,next=false){
		super(id,x,y,spline,color);
		this._previous=previous;
		this._next=next;
		this._domObject=this.htmlElement();
		this._connectedTo=null;
		this.onDragStart();
		this.onDragEnd();
		Circuit._pointList[this._spline].push(this);
	}

	htmlElement(){
		let object = super.htmlElement('point',this._spline);
		object.setAttribute('draggable',true);
		document.getElementById(this._spline+'-points').appendChild(object);
		return object;
	}

	onDragStart(){
		this._domObject.style.cursor = 'move';
		this.addListener(this._domObject,'dragstart',()=>{
			Circuit._precedent.push([this._id,this._x,this._y,this._spline]);
		});
	}

	onDragEnd(){
		this.addListener(this._domObject,'dragend',(e)=>{
			this._x=e.clientX;
			this._y=e.clientY;
			this.updateElement();
			Circuit.connect(this._spline,Circuit._pointList[this._spline][this._previous]._domObject,this._domObject,false,Circuit._lineList[this._spline][this._previous]);
			Circuit.connect(this._spline,this._domObject,Circuit._pointList[this._spline][this._next]._domObject,false,Circuit._lineList[this._spline][this._id]);
			if(this._connectedTo){
				Circuit.connect(this._spline,this._connectedTo._domObject,this._domObject,true,this._connectedToLine);
				console.log(this._connectedToLine);
			}
		});
	}

	onClick(){
		this._domObject.style.cursor = 'default';
		this.addListener(this._domObject,'click',(e)=>{
			if(Creation.selectedPoint){
				this._connectedTo = Creation.selectedPoint;
				this._connectedTo._connectedTo = this;
				let line = Circuit.connect(this._spline,this._connectedTo._domObject,this._domObject,true,false,Circuit.dotSize,1,'blue');
				this._connectedToLine = line;
				this._connectedTo._connectedToLine = line;
				Creation.selectedPoint = null;
			}
			else{
				Creation.selectedPoint = this;
			}
		});
	}

	addListener(domObject,type,func){
		this._listeners[type] = func;
		domObject.addEventListener(type,func,true);
	}

	removeEventListener(type){
		this._domObject.removeEventListener(type,this._listeners[type],true);
		this._listeners[type] = null;
	}

	removeAllEventListeners(){
		for(const type in this._listeners){
			if(this._listeners[type]){
				this.removeEventListener(type);
			}
		}
	}

	changeMode(move){
		this.removeAllEventListeners();
		if(move){
			Creation.selectedPoint = null;
			this.onDragStart();
			this.onDragEnd()
		}
		else{
			this.onClick();
		}
	}
}