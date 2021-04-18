import { Object,Circuit } from './index.js';

export default class Point extends Object{
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