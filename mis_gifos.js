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
        console.log(stream);
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
}

function stopShowVideo() {
    cuadroVideo.pause();
}

/////FUNCION DE GRABAR VIDEO////////////////////////

let btnStartRecord = document.getElementById('btnStartRecord');
let btnStopRecord = document.getElementById('btnStopRecord');
let cuadroParaGif = document.getElementById('cuadroParaGif');

let recorder 

async function recordVideo() {
    let stream = await getVideoFromCamera();
    recorder = RecordRTC(stream, {
        type: 'gif',
    });
    recorder.startRecording();
}


async function stopRecordVideo() {
    recorder.stopRecording(async function () {
        let blob = recorder.getBlob();
        let url = URL.createObjectURL(blob);
        console.log(url);
        cuadroParaGif.src = url;
        //cuadroParaGif.play();
    });
};


///FUNCION PRINCIPAL//////

function cargarPagina() {
    btnStart.addEventListener('click', showVideo);
    btnStop.addEventListener('click', stopShowVideo);
    btnStartRecord.addEventListener('click', recordVideo);
    btnStopRecord.addEventListener('click', stopRecordVideo);
    desplegable.addEventListener('click', desplegarMenu);
    btnNight.addEventListener('click', cambiarTema);
    btnDay.addEventListener('click', cambiarTema);

}

