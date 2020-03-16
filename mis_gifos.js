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
function mostrarPantallas (){
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

async function recordVideo() {
    showVideo();
    let stream = await getVideoFromCamera();
    recorder = RecordRTC(stream, {
        type: 'gif',
    });
    recorder.startRecording();
    btnStopRecord.disabled = false;
    btnStopRecord2.disabled = false;
}


async function stopRecordVideo() {
    stopShowVideo();
    recorder.stopRecording(async function () {
        let blob = recorder.getBlob();
        let url = URL.createObjectURL(blob);
        //console.log(url);
        cuadroParaGif.src = url;
        //cuadroParaGif.play();
    });
    btnStopRecord.disabled = true;
    btnStopRecord2.disabled = true;
};

///ENVIAR EL GIF////

const apiKey = 'sJHS3cT47pRbYOwqHplkAGU00zTJIct4';
let btnUploadGif = document.getElementById('btnUploadGif');

async function packGif() {
    let form = new FormData();
    let blob = await recorder.getBlob();
    form.append('file', blob, 'myGif.gif');
    form.append('api_key', apiKey);
    sendGif(form);
    
}

function sendGif(form) {    
    fetch('https://upload.giphy.com/v1/gifs' + '?api_key=' + apiKey, {
        method: 'POST',
        body: form,
    }).then(function(response) {
        if(response.ok) {
            return response.json();
        } else {
            throw "Error en la llamada";
        };
    }).then((datos) => {
        console.log (datos.data.id);
        return datos.data.id
    });
}


//// OFRECER AL USUARIO LA URL PARA COMPARTIR SU NUEVO GIF///////



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

}

