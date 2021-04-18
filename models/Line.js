import { Object,Circuit } from './index.js';

export default class Line extends Object{
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