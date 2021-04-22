import { Object,Circuit } from './index.js';

export default class Line extends Object{
	constructor(id,x,y,spline,length,angle,color){
		super(id,x,y,spline,color);
		this._length=length;
		this._angle=angle;
		this._domObject=this.htmlElement();
		Circuit._lineList[this._spline].push(this);
	}

	htmlElement(){
		let object = super.htmlElement('line',this._spline);
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