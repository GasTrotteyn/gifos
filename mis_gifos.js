window.addEventListener('load', cargarPagina);

///DESPLEGADO DE MENU DE TEMAS/////

let menu = document.getElementById('menu');
let desplegable = document.getElementById('desplegable');

function desplegarMenu(event) {
    menu.style.display = 'flex';
    document.body.addEventListener('click', () => {
        menu.style.display = 'none';
    })
    event.stopPropagation()
}

///CAMBIO DE TEMA

let btnNight = document.getElementById('btnNight');
let btnDay = document.getElementById('btnDay');
let body = document.body;
let gradient = document.getElementsByClassName('gradient');
let logo = document.getElementById('logoDia');
let botones = document.getElementsByClassName('boton');
let gris = document.getElementById('gris');
let btnBuscar = document.getElementById('botonBuscar');

function cambiarTema() {
    body.classList.toggle('dark-body');
    for (let index = 0; gradient.length > index; index++) {
        gradient[index].classList.toggle('dark-gradient');
    }
    logo.src = cambiarlogo();
    for (let index = 0; botones.length > index; index++) {
        botones[index].classList.toggle('dark-botones');
    }
    gris.classList.toggle('dark-gris');
    btnBuscar.classList.toggle('dark-botonBuscar');
}

function cambiarlogo() {
    if (body.className === 'dark-body') {
        return './assets/gifOF_logo_dark.png'
    } else {
        return './assets/gifOF_logo.png'
    }
}
///////// OCULTAR INSTRUCCIONES Y MOSTRAR LAS PANTALLAS///////////////////////

let cuadrosVideo = document.getElementById('cuadrosVideo');
let btnComenzar = document.getElementById('btnComenzar');
let instrucciones = document.getElementById('instrucciones');
function mostrarPantallas() {
    cuadrosVideo.style.display = 'flex';
    instrucciones.style.display = 'none';
}



/////CAPTURAR IMAGEN DE LA CÁMARA Y MOSTRAR POR PANTALLA///////////////

const constraints = {
    audio: false,
    video: {
        height: { max: 300 }
    }
};

let cuadroVideo = document.getElementById('cuadroVideo');
let btnStart = document.getElementById('btnStart');
let btnStop = document.getElementById('btnStop');

async function getVideoFromCamera() {
    try {
        let stream = await navigator.mediaDevices.getUserMedia(constraints);
        //console.log(stream);
        return stream;
    } catch (err) {
        console.log('No se pudo tomar el video de la cámara:' + err);
    }
};

async function showVideo() {
    let stream = await getVideoFromCamera();
    //console.log (stream);
    cuadroVideo.srcObject = stream;
    cuadroVideo.play();
    btnStop.disabled = false;
}

function stopShowVideo() {

    cuadroVideo.pause();
    btnStop.disabled = true;
}

/////FUNCION DE GRABAR VIDEO////////////////////////

let btnStartRecord = document.getElementById('btnStartRecord');
let btnStartRecord2 = document.getElementById('btnStartRecord2');
let btnStopRecord = document.getElementById('btnStopRecord');
let btnStopRecord2 = document.getElementById('btnStopRecord2');
let cuadroParaGif = document.getElementById('cuadroParaGif');

let recorder
let bandera = false;
let segundos = document.getElementById('segundos');
let centiSegundos = document.getElementById('centiSegundos');

async function recordVideo() {
    showVideo();
    let stream = await getVideoFromCamera();
    recorder = RecordRTC(stream, {
        type: 'gif',
    });
    recorder.startRecording();
    btnStopRecord.disabled = false;
    btnStopRecord2.disabled = false;
    bandera = true;
    startTimer();
}

async function startTimer() {
    let time = 0;
    let segs = 0;
    segundos.innerHTML = segs;
    centiSegundos.innerHTML = time;
    setInterval(() => {
        if (bandera) {
            if (time == 99) {
                segs++;
                segundos.innerHTML = segs;
                time = 0;
            }
            time++;
            centiSegundos.innerHTML = time;
        } else {
            time = 0;
            segs = 0;
        };
    }, 10);


}

async function stopRecordVideo() {
    //stopShowVideo();
    recorder.stopRecording(async function () {
        let blob = recorder.getBlob();
        let url = URL.createObjectURL(blob);
        //console.log(url);
        cuadroParaGif.src = url;
        //cuadroParaGif.play();
    });
    btnStopRecord.disabled = true;
    btnStopRecord2.disabled = true;
    bandera = false;
};

///ENVIAR EL GIF////

const apiKey = 'sJHS3cT47pRbYOwqHplkAGU00zTJIct4';
let btnUploadGif = document.getElementById('btnUploadGif');

async function packGif() {
    mostrarSubiendo();
    let form = new FormData();
    let blob = await recorder.getBlob();
    form.append('file', blob, 'myGif.gif');
    form.append('api_key', apiKey);
    sendGif(form);

}

async function sendGif(form) {
    fetch('https://upload.giphy.com/v1/gifs' + '?api_key=' + apiKey, {
        method: 'POST',
        body: form,
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw "Error en la llamada";
        };
    }).then((datos) => {
        id = datos.data.id;
        mostrarExito();
        crearEnlace(id);        
        return id;
    }).then((id) => {
        meterNuevo(id);
        console.log(id);
    });
}

/// OCULTAR PANTALLAS DE VIDEO Y MOSTRAR CUADRO DE SUBIDA ////

let subiendo = document.getElementById('subiendo');

function mostrarSubiendo() {
    cuadrosVideo.style.display = 'none';
    subiendo.style.display = 'inline-block';
}

//// OCULTAR CUADRO DE SUBIDA Y MOSTRAR CUADRO DE EXITO CON OPCIONES A COPIAR ENLACE Y DESCARGAR GIFO///////

let exito = document.getElementById('exito');
let cuadroParaGifExito = document.getElementById('cuadroParaGifExito');
let enlace = document.getElementById('enlace');
let btnDescargarGuifo = document.getElementById('btnDescargarGuifo');

function crearEnlace(id) {
    let url = `https://media1.giphy.com/media/${id}/giphy.gif?cid=52afa79a31b48e99d4268c4cc71df9dcbf8f8b3c9db10a07&rid=giphy.gif`;
    enlace.innerHTML = url;
}

async function mostrarExito() {
    exito.style.display = 'inline-block';
    subiendo.style.display = 'none';
    let blob = recorder.getBlob();
    let url = URL.createObjectURL(blob);    
    cuadroParaGifExito.src = url;
}

////CARGAR EL LOCALSTORAGE GUARDAR EN UN ARRAY Y RECARGAR CON CADA SUBIDA DE GIF ////////////////

async function traerDelStorage() {
    let subidos = [];
    let refrescadojson = localStorage.getItem('gifGuardados');
    if (refrescadojson !== null) {
        let refrescado = await JSON.parse(refrescadojson);
        let lista = refrescado.lista
        lista.forEach(element => {
            subidos.push(element);
        });
        console.log (subidos);
        return subidos;
    }
}


let cuadros = document.getElementById('cuadros');

async function crearCuadrosSubidos() {
    let subidos = await traerDelStorage();
    cuadros.innerHTML = '';
    subidos.forEach(element => {
        let img = document.createElement('img');
        img.src = `https://media1.giphy.com/media/${element}/giphy.gif?cid=52afa79a31b48e99d4268c4cc71df9dcbf8f8b3c9db10a07&rid=giphy.gif`;
        cuadros.appendChild(img);
    })
}

async function meterNuevo(idNuevo){
    let subidos = await traerDelStorage();
    subidos.push(idNuevo);
    console.log(subidos);
    let listaConNuevo = {'lista' : subidos};
    let listaConNuevoJson = await JSON.stringify(listaConNuevo);
    localStorage.setItem('gifGuardados', listaConNuevoJson); 
    await crearCuadrosSubidos();
}

//let prueba = ['UukjKxeRlpXLkZ8jY6']
//localStorage.setItem('gifGuardados',JSON.stringify({'lista' : prueba}));
/*
https://media3.giphy.com/media/UukjKxeRlpXLkZ8jY6/giphy-downsized-medium.gif?cid=52afa79a22d81ba421c4503309da4820ab3be05a044c9529&rid=giphy-downsized-medium.gif

https://media1.giphy.com/media/5wFUxSV2R7wi7NJX8x/giphy.gif?cid=52afa79a31b48e99d4268c4cc71df9dcbf8f8b3c9db10a07&rid=giphy.gif

UukjKxeRlpXLkZ8jY6

*/




///FUNCION PRINCIPAL//////

function cargarPagina() {
    btnComenzar.addEventListener('click', mostrarPantallas);
    btnStart.addEventListener('click', showVideo);
    btnStop.addEventListener('click', stopShowVideo);
    btnStartRecord.addEventListener('click', recordVideo);
    btnStartRecord2.addEventListener('click', recordVideo);
    btnStopRecord.addEventListener('click', stopRecordVideo);
    btnStopRecord2.addEventListener('click', stopRecordVideo);
    btnUploadGif.addEventListener('click', packGif);
    desplegable.addEventListener('click', desplegarMenu);
    btnNight.addEventListener('click', cambiarTema);
    btnDay.addEventListener('click', cambiarTema);
    crearCuadrosSubidos();

}

