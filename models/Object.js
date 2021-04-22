export default class Object{
	constructor(id,x,y,spline,color){
		this._id=id;
		this._x=x;
		this._y=y;
		this._color=color;
		this._listeners ={"dragstart":null,"dragend":null,"click":null};
		this._spline=spline
		this._domObject=null;
	}

	htmlElement(pointOrLine,spline){
		let object = document.createElement("div");
		object.id = spline+'-'+pointOrLine+'-'+this._id;
		object.classList.add(pointOrLine);
		object.style.background=this._color;
		object.style.top=this._y+"px";
		object.style.left=this._x+"px";
		return object;
	}

	updateElement(){
		this._domObject.style.top=this._y+"px";
		this._domObject.style.left=this._x+"px";
	}
}