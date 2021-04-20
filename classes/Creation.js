import { Circuit } from '../models/index.js'

export default class Creation{

    constructor(circuit,dotSize){
        let extreme = [Creation.getExtremum(circuit[0]),Creation.getExtremum(circuit[1])];
        let resize = Creation.getResize(extreme[1],dotSize);
        let outside = (resize[0]<resize[1]) ? circuit[0] : circuit[1];
        let inside = (resize[0]<resize[1]) ? circuit[1] : circuit[0];
        extreme = (resize[0]<resize[1]) ? extreme[0] : extreme[1];
        Circuit.create(outside,inside,extreme,resize,dotSize);
        this._mode=0;
    }

    static windowSize(){
        let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        return [w,h];
    }

    static getResize(array, dotSize){
        let size = [Creation.windowSize()[0]/(array[1][0]-array[0][0]+2*dotSize),Creation.windowSize()[1]/(array[1][1]-array[0][1]+2*dotSize)];
        let resize = Math.min.apply(Math,size);
        return resize;
    }

    static getExtremum(array){
        let extreme=[[99999,99999],[-99999,-99999]];
        for (const i of array) {
            for(let coord=0;coord<i.length;coord++){
                if(i[coord] > extreme[1][coord]){
                    extreme[1][coord]=i[coord];
                }
                if(i[coord] < extreme[0][coord]){
                    extreme[0][coord]=i[coord];
                }
            }
        }
        return extreme;
    }
}