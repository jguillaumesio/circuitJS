import Creation from './classes/Creation.js';

document.getElementById('upload_circuit_form').addEventListener('click',()=>{
    let file = document.getElementById("upload_circuit").files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            let lines = evt.target.result;
            new Creation(parseDXF(lines),4);
        }
    }
});

function parseDXF(dxf){
    let lines=dxf.split(/\r\n|\n/);
    let circuit=[];
    let spline=[];
    let coord={"x":false,"y":false};
    for(let line=0;line<lines.length;line++){
        if(lines[line] === 'SEQEND'){
            circuit.push(spline);
            spline=[];
        }
        if(lines[line] === ' 10') {
            coord.x = lines[line + 1];
        }
        else if(lines[line] === ' 20'){
            coord.y = lines[line + 1];
        }
        else if(lines[line] === ' 30'){
            if(coord.x != '0.0' && coord.y != '0.0'){
                spline.push([parseFloat(coord.x),parseFloat(coord.y)]);
                coord={"x":false,"y":false};
            }
        }
    }
    return circuit;
}