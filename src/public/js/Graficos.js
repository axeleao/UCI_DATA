$(document).ready(function(){
function getLabels(tipo_Dato, signo_Dato){
    var EtiquetasX = [];
    var val_Frec = [];
    var val_Sat = [];
    var val_Sist = [];
    var val_Diast = [];
    var idPaciente = document.getElementById("idPaciente").value;
    $.ajax({
        type: 'POST',
        data: { idPaciente },
        url: '/admin/get_Signos_Vitales',
        success: function (data) {
            data.forEach(dat => {
                console.log("AJAX FUNCTION Signos getLabels****************************");
                EtiquetasX.unshift(dat.hora_dia);

                val_Frec.unshift(dat.valor_Toma_Frec);
                console.log("AJAX FUNCTION Signos FREC ****************************");
                console.log(val_Frec);

                val_Sat.unshift(dat.valor_Toma_Sat);
                console.log("AJAX FUNCTION Signos SAT ****************************");
                console.log(val_Sat);

                val_Sist.unshift(dat.sistolica);
                console.log("AJAX FUNCTION Signos SISTÓLICA ****************************");
                console.log(val_Sist);

                val_Diast.unshift(dat.diastolica);
                console.log("AJAX FUNCTION Signos SISTÓLICA ****************************");
                console.log(val_Diast);
            })
        }
    })
    if(tipo_Dato == 'labels' && signo_Dato == 'labels'){
        console.log("Los labels son: ***********----------------------************");
        console.log(EtiquetasX);
        return EtiquetasX;
    }else if(tipo_Dato == 'data' && signo_Dato == 'FREC'){
        console.log("Los DATOS val_Frec son: ***********----------------------************");
        console.log(val_Frec);
        return val_Frec;
    }else if(tipo_Dato == 'data' && signo_Dato == 'SAT'){
        console.log("Los DATOS val_Sat son: ***********----------------------************");
        console.log(val_Sat);
        return val_Sat;
    }else if(tipo_Dato == 'data' && signo_Dato == 'SIST'){
        console.log("Los DATOS son: ***********----------------------************");
        console.log(val_Sist);
        return val_Sist;
    }else /*if(tipo_Dato == 'labels' && signo_Dato == 'DIAST')*/{
        console.log("Los DATOS son: ***********----------------------************");
        console.log(val_Diast);
        return val_Diast;
    }
    
};

//var arreglo = [];
//arreglo = getLabels();
//console.log("Labels son: ");
//var arreglo2 = arreglo;
//console.log("Labels son: ");
//var idPaciente = document.getElementById("idPaciente").value;
//console.log(idPaciente);

//let canvas_Prueba = document.getElementById("Signos_Prueba").getContext("2d");
let canvas_Prueba = document.getElementById("Signos_Vitales").getContext("2d");


var datos = {
    type: "bar",
    data:{
        type: 'bar',
        labels : getLabels("labels", "labels"),
        datasets:[
            {
                type: 'line',
                label: "Saturación Oxigeno",
                borderColor:"rgb(0,0,255)",
                fill: false,
                data : getLabels("data", "SAT"),
            },
            {
                type: 'line',
                label: "Frec. Cardiaca",
                borderColor:"rgba(0,0,0, 0.60)",
                fill: false,
                data : getLabels("data", "FREC"),
            },
            {
            type: 'bar',
            label: "PA Sistólica",
            backgroundColor: 'rgba(220,70,0, 0.60)',
            borderColor:"rgb(255,0,0)",
            data : getLabels("data", "SIST"),
        },
        {
            type: 'bar',
            label: "PA Diastólica",
            borderColor:"rgb(255,0,0)",
            backgroundColor: 'rgba(0, 200, 0, 0.5)',
            data : getLabels("data", "DIAST"),
        },
        
        
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        scales: {
                yAxes: [{
                    ticks: {
                        min: 50,
                        stepSize: 5,
                        max: 100
                    }
                }]
            }
    }
};

window.line = new Chart(canvas_Prueba, datos);

var grafico_Prueba =  new Chart(canvas_Prueba,{
    type: "line",
    data:{
        //labels:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], // barras
        labels : getLabels("labels"),
        datasets:[{
            label: "Presión Arterial",
            //backgroundColor: "rgba(255,255,255, 0.10)",
            borderColor:"rgb(255,0,0)",
            //data:[120,100,120, 150],//,118,120,125,122,118, 120,120,120,131], // valores de las barras
            data : getLabels("data"),
        }         
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 200,
                right: 200,
                top: 0,
                bottom: 0
            }
        },
        scales: {
                yAxes: [{
                    ticks: {
                        min: 50,
                        stepSize: 5,
                        max: 100
                    }
                }]
            }
    }
})



/*
$.ajax({
    type: 'POST',
    //data: { fecha_Clase, IdEscenario },
    url: '/admin/get_Signos_Vitales',
    success: function (data) {
        console.log("Los signos vitales son");
        
        data.forEach(dat => {
            console.log("AJAX FUNCTION Signos Vitales______________****************************");
            //option.append(`<option value="${dat.horario_Clase}">${dat.horario_Clase}</option>`);
            console.log(dat.valor_Toma_Frec);
            console.log(dat.hora_dia);
        })
    }
})


$(function () {
    $('#escenarioProfile').change(function () {
        console.log("IdHora de la CLASE ES ..........................");
        var fecha_Clase = document.getElementById("fechaAddClase").value;
        var IdEscenario = document.getElementById("escenarioProfile").value;
        console.log("Hora y Escenario de la CLASE ES ..........................");
        console.log(fecha_Clase);
        console.log(IdEscenario);
        $.ajax({
            type: 'POST',
            data: { fecha_Clase, IdEscenario },
            url: '/admin/generarHorarios',
            success: function (data) {
                var option = $('#idHora');
                option.html('');
                option.append(`<option value="0">Selecciona la Hora</option>`);
                data.forEach(dat => {
                    console.log("AJAX FUNCTION hora de la  CLASE______________****************************");
                    option.append(`<option value="${dat.horario_Clase}">${dat.horario_Clase}</option>`);
                    console.log(dat.idClase);
                })
            }
        })
    });

});*/


/*
let miCanvas = document.getElementById("Signos_Vitales").getContext("2d");
//window.alert("Entra al Script");
//alert("Texto a mostrar");
//confirm("mensaje");

    var chart =  new Chart(miCanvas,{
        type: "line",
        data:{
            labels:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], // barras
            datasets:[{
                label: "Presión Arterial",
                //backgroundColor: "rgba(255,255,255, 0.10)",
                borderColor:"rgb(255,0,0)",
                data:[120,115,128,118, 120,138,128,118, 120,135,125,131], // valores de las barras
            },{
                label: "Saturación de Oxigeno",
                //backgroundColor: "rgba(255,255,255, 0.10)",
                borderColor:"rgb(0,0,150)",
                data:[112,115,131,120, 120,138,108,118, 120,135,120,131], // valores de las barras
            },{
                label: "Frecuencia Cardiaca",
                //backgroundColor: "rgba(255,255,255, 0.10)",
                borderColor:"rgb(0,150,0)",
                data:[86,100,92,85,88,93,97,102, 95,90,90,87], // valores de las barras
            }            
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
*/

let Canvas_P_Crit = document.getElementById("Signos_Criticos").getContext("2d");
    var char =  new Chart(Canvas_P_Crit,{
        type: "polarArea",
        data:{
            labels:[ "Sat. Min", "Sat. Máx", "Frec. Min", "Frec Máx", "Pres. Sis. Min" ,"Pres. Sis. Máx","Pres. Dia. Min" ,"Pres. Dia. Máx",], // barras
            datasets:[{
                label: "Presión Arterial",
                backgroundColor:[
                                "rgba(0,0,255, 0.80)", //Azul
                                "rgba(0,0,255, 0.30)", //Azul
                                "rgba(0,0,0, 0.70)", //Gris
                                "rgba(0,0,0, 0.30)", //Gris
                                "rgba(220,70,0, 0.60)", //Anaranjado Quemado
                                "rgba(220,70,0, 0.30)", //Anaranjado Quemado
                                "rgba(0,255,0, 0.99)", //verde
                                "rgba(0,255,0, 0.60)",//verde
                            ],
                //borderColor:"rgb(255,0,0)",
                data:[90,100,60, 100, 60, 80, 80, 120], // valores de las barras
            }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    /*let Canvas_P_Crit = document.getElementById("Signos_Criticos").getContext("2d");
    var char =  new Chart(Canvas_P_Crit,{
        type: "polarArea",
        data:{
            labels:[ "Elevada", "HiperTensión Niv 1", "HiperTensión Niv 2", "HiperTensión Niv 3", "Normal" ,], // barras
            datasets:[{
                label: "Presión Arterial",
                backgroundColor:[
                                "rgba(255,255,0, 0.60)", //Amarillo
                                "rgba(255,171,0, 0.60)", //Anaranjado
                                "rgba(220,70,0, 0.60)", //Anaranjado Quemado
                                "rgba(100,20,20, 0.60)", //Vinotinto
                                "rgba(128,240,0, 0.60)", //verde
                            ],
                //borderColor:"rgb(255,0,0)",
                data:[130,140,180, 200, 120], // valores de las barras
            }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });*/

    /*setInterval2(function(){
        char.grafico_Prueba.datasets.splice(0);
         var newData = {
             data : [getRandom(50, 190),getRandom(50, 190),getRandom(50, 190),getRandom(50, 190)]
         };
         char.grafico_Prueba.datasets.push(newData);
         window.grafico_Prueba.update();
     }, 2000);*/

    setInterval(function(){
        /*char.data.datasets.splice(0);
        var newData = {
            backgroundColor:[
                "rgba(255,255,0, 0.60)", //Amarillo
                "rgba(255,171,0, 0.60)", //Anaranjado
                "rgba(220,70,0, 0.60)", //Anaranjado Quemado
                "rgba(100,20,20, 0.60)", //Vinotinto
                "rgba(128,240,0, 0.60)", //verde
            ],
            data : [getRandom(50, 190),getRandom(50, 190),getRandom(50, 190),getRandom(50, 190),getRandom(50, 190)]
        };
        
        char.data.datasets.push(newData);*/
        

        /*grafico_Prueba.data.labels.splice(0);
        var newGraficoLabel = {
            labels : getLabels("labels"),
        };
        grafico_Prueba.data.labels.push(newGraficoLabel);*/

        //grafico_Prueba.data.datasets.splice(0);
        
        /*
        datos.data.datasets.splice(0);
        var newGraficoData = {
            label: "Presión Arterial",
            borderColor:"rgb(255,0,0)",
            data : getLabels("data"),
        };
        console.log("DATOS*************************************************************");
        //console.log(newGraficoLabel);
        console.log(newGraficoData);
        
        //grafico_Prueba.data.datasets.push(newGraficoData);
        datos.data.datasets.push(newGraficoData);
        */
        window.line.update();

        

        /*getLabels("labels");
        getLabels("data");
        grafico_prueba();*/

        //char.update();

    }, 10000);


    function getRandom(min, max){
        return Math.round(Math.random()*(max-min)+min);
    }

});