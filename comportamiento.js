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

/////TRAER, LLEVAR Y CARGAR EL HISTORIAL DEL STORAGE////////////

let historial = [];

async function getHistorial() {
    let historialJson = localStorage.getItem('historialStorage');
    if (historialJson !== null) {
        let historiale = await JSON.parse(historialJson);
        return historiale;}
    }
   
async function cargarHistorialDelStorage() {
    let recuperado = await getHistorial();    
    let lista = recuperado.lista;    
    lista.forEach (element => historial.push(element));      
         
}
    
async function enviarHistorialAlStorage() {
    historialEnviado = {'lista': historial};
    historialEnviadoJson = JSON.stringify(historialEnviado);    
    localStorage.setItem('historialStorage', historialEnviadoJson);    
}  

async function crearBotonesDeHistorial() {
    let invertido = historial.reverse();
    let divTemporal = document.createElement('div');
    divTemporal.className = 'historial';
    invertido.forEach(element => {
        let btnHistorial = document.createElement('div');
        btnHistorial.className = 'botonHistorial';
        btnHistorial.innerHTML = element;
        divTemporal.appendChild(btnHistorial);
    });
    let contenedorHistorial = document.getElementById('historial');
    contenedorHistorial.innerHTML = divTemporal.innerHTML;
    let buscador = document.getElementById('buscador');
    buscador.appendChild(contenedorHistorial); 
    CrearEventoBotonesDeHistorial();   
}

async function CrearEventoBotonesDeHistorial () {
    let botonesHistorial = await document.getElementsByClassName('botonHistorial');
    let l = botonesHistorial.length;
    for (let index = 0; index < l; index++) {
        botonesHistorial[index].addEventListener('click', ()=>{
            getSearchResults(botonesHistorial[index].textContent);
        })        
    } 
}

///HACER EL SEARCH/////////

const apiKey = 'sJHS3cT47pRbYOwqHplkAGU00zTJIct4';

async function getSearchResults(search) {    
    let url = 'http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey +'&limit=12';
    let found = await fetch(url);
    let json = await found.json();
    let contenedorImagen = document.getElementById('resultadosBusqueda');
    let contenedorTemporal = document.createElement('div');
    
    for (i = 0; i < json.data.length; i++) {
        let imagen = document.createElement('img');
        imagen.src = json.data[i].images.downsized_medium.url;
        contenedorTemporal.appendChild(imagen);
    };

    contenedorImagen.innerHTML = contenedorTemporal.innerHTML;
    desplegableSugerencias.scrollIntoView(); 
    historial.push(search); 
    enviarHistorialAlStorage()
        .then(crearBotonesDeHistorial);
    desactivarBotonBuscar();
}

////ACTIVAR Y DESACTIVAR EL BOTON DE BUSCAR + BUSCAR CON ENTER////////

function buscar() {
    let search = document.getElementById("input").value;
    getSearchResults(search);
}

function ActivarBotonBuscar() {
    let search = document.getElementById('input').value;
    if(search !== ""){
        btnBuscar.classList.remove('buscar');
    }else{
        btnBuscar.classList.add('buscar');
    }
}

function desactivarBotonBuscar(){
    document.getElementById('input').value = "";
    btnBuscar.classList.add('buscar');
    btnBuscar.removeEventListener('click', buscar);
}

function buscarConEnter(event) {
    if (event.keyCode === 13) {
        let search = document.getElementById('input').value;
        getSearchResults(search);
    }
}

/// FRASES SUGERIDAS PARA EL INPUT/////

const frases = [
    'te sugiero que busques gatos',
    'yo buscaría perros, son muy tiernos!',
    'fijate que los loros son muy divertodos',
    'los autos son buena opción',
    'Algo de Star Wars?',
    'Los chiques aman los conejos',
    'Viste los de Michael jackson?',
    'Gente desarrollando webs, debe ser cool!!!',
    'algo de amor?',
    'Messi, ese no falla',
    'Un buen amanecer'];

function ponerFrases() {
    ActivarBotonBuscar();
    let desplegableSugerencias = document.getElementById('desplegableSugerencias');
    let divTemporal = document.createElement('div');
    for (let index = 0; index < 3; index++) {
        let random = Math.floor(Math.random() * 11);
        let frase = document.createElement('p');
        frase.innerHTML = frases[random];
        let fraseEnmarcada = document.createElement('div');
        fraseEnmarcada.setAttribute('class', 'elegida');
        fraseEnmarcada.appendChild(frase);
        divTemporal.appendChild(fraseEnmarcada);
    }
    desplegableSugerencias.innerHTML = divTemporal.innerHTML;
    desplegableSugerencias.style.display = 'flex';
}

/// COLOCAR CUATRO GIF RANDOM /////

async function getRandomResults() {
    let result = await fetch('http://api.giphy.com/v1/gifs/random?api_key=' + apiKey);
    let randoms = await result.json();
    let cierre = document.createElement('img');
    cierre.src = './assets/close.svg';
    let randomText = '#' + randoms.data.title;
    let text = document.createElement('p');
    text.innerHTML = randomText;
    let gradient = document.createElement('div');
    gradient.className = 'gradient';
    gradient.appendChild(text);
    gradient.appendChild(cierre);
    let gif = document.createElement('img');
    gif.className = 'random';
    let src = randoms.data.images.downsized_medium.url;
    gif.src = src;
    let cuadro = document.createElement('div');
    cuadro.className = 'cuadro';
    cuadro.appendChild(gradient);
    cuadro.appendChild(gif);
    let cuadros = document.getElementById('cuadros');
    cuadros.appendChild(cuadro);
    let btnRandom = document.createElement('div');
    btnRandom.className = 'btnRandom';
    btnRandom.innerHTML = 'Ver mas...';
    btnRandom.addEventListener('click', () => {
        getSearchResults(randoms.data.title);
    })
    cuadro.appendChild(btnRandom);
}

function colocarRandoms() {
    for (let index = 0; index < 4; index++) {
        getRandomResults();
    }
}

/// COLOCAR TENDENCIAS/////////////////

async function getTrendingResults() {
    let found = await fetch('http://api.giphy.com/v1/gifs/trending?api_key=' + apiKey);
    let json = await found.json();
    let contenedorImagen = document.getElementById('cuadrosTendencias');
    let contenedorTemporal = document.createElement('div');

    for (i = 0; i < 6; i++) {
        let imagen = document.createElement('img');
        imagen.src = json.data[i].images.downsized_medium.url;
        contenedorTemporal.appendChild(imagen);
    };

    contenedorImagen.innerHTML = contenedorTemporal.innerHTML;

}

///FUNCION PRINCIPAL//////

function cargarPagina() {
    cargarHistorialDelStorage()
        .then(crearBotonesDeHistorial);
    getTrendingResults();
    colocarRandoms();
    desplegable.addEventListener('click', desplegarMenu);
    btnNight.addEventListener('click', cambiarTema);
    btnDay.addEventListener('click', cambiarTema);
    let input = document.getElementById('input');
    input.addEventListener('keydown', ponerFrases);
    input.addEventListener('keydown', buscarConEnter);
    input.addEventListener("change", () => {
        btnBuscar.addEventListener("click", buscar);
    });
}