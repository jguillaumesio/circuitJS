export default class Object{
	constructor(id,x,y){
		this._id=id;
		this._x=x;
		this._y=y;
		this._domObject=null;
	}

	htmlElement(pointOrLine){
		let object = document.createElement("div");
		object.id = pointOrLine+'-'+this._id;
		object.classList.add(pointOrLine);
		object.style.top=this._y+"px";
		object.style.left=this._x+"px";
		return object;
	}

	updateElement(){
		this._domObject.style.top=this._y+"px";
		this._domObject.style.left=this._x+"px";
	}
}