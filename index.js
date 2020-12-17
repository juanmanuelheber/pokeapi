const URL = "https://pokeapi.co/api/v2/pokemon/"; // URL para fetch de Pokemon
const characters = []; // Guardo los resultados del Fetch de Pokemon
let equipoPokemon = []; // Guardo el equipo Pokemon elegido
let cantPokemon = 50; // Cantidad de Pokemon a traer
let cont = 0; // Contador para Ataque
let puntosPlayer = 0;
let puntosBot = 0;
let ataques = 0;

// Previene el envío del formulario
const sub = (e) => {
    e.preventDefault();
}

// Hace la petición según la URL
const fetchData = async (url = URL) => {
    try {
        const response = await fetch(url);
        const results = await response.json();
        return results;
    } catch (err) {
        console.error(err);
    }
}

// Muestra el modal y carga dinámicamente la información del personaje
const abrirEquipo = (characters, equipoPokemon) => {
    $("#modalEquipo").modal("show");
    for (let i = 0; i < equipoPokemon.length; i++) {
        let idPokemon = equipoPokemon[i] - 1;
        document.querySelector(`#pokemonEquipo${i}`).innerHTML = `<img class="w-100 m-auto" src="${characters[idPokemon].sprites.front_default}">`
    }
}

// Función para primer letra mayúscula
const mayus = (string) => string.charAt(0).toUpperCase() + string.slice(1);
// Funcion para mostrar un elemento
const mostrar = (elem) => elem.classList.remove("oculto");
// Funcion para ocultar un elemento
const ocultar = (elem) => elem.classList.add("oculto");
// Funcion para habilitar un elemento
const habilitar = (elem) => elem.disabled = false;
// Funcion para deshabilitar un elemento
const deshabilitar = (elem) => elem.disabled = true;
// Funcion para opacar elemento al 50%
const opacar = (elem) => elem.style.opacity = "0.6";
// Habilita/Deshabilita botón de buscar
const boton=(input="#inputCantidad")=>document.querySelector(input).value!==""?habilitar(document.querySelector("#btnCargar")):deshabilitar(document.querySelector("#btnCargar"));

// Carga estadísticas (Ataque)
const cargarStats = (id, div, puntos) => {
    document.querySelector(div).innerHTML = `
    <h4>${mayus(characters[id].name)}</h4>
    <div class="row">
    <div class="col-9">
    ${characters[id].stats[1].stat.name}<div class="progress"><div class="progress-bar bg-danger" style="width: ${characters[id].stats[1].base_stat}%" role="progressbar" aria-valuenow="${characters[id].stats[1].base_stat}" aria-valuemin="0" aria-valuemax="100">${characters[id].stats[1].base_stat}</div></div>
    ${characters[id].stats[2].stat.name}<div class="progress"><div class="progress-bar bg-primary" style="width: ${characters[id].stats[2].base_stat}%" role="progressbar" aria-valuenow="${characters[id].stats[2].base_stat}" aria-valuemin="0" aria-valuemax="100">${characters[id].stats[2].base_stat}</div></div>
    </div>
    <div class="col-2">
    <div id=${puntos} class="text-center text-danger puntos mt-3"></div>
    </div>
    </div>`;
}
// Carga Imagen (Ataque)
const cargarImagen = (id, div) =>document.querySelector(div).innerHTML = `<img class="w-100 m-auto" src="${div === "#imgPlayer" ? characters[id].sprites.front_default : characters[id].sprites.back_default}">`

// Devuelve 1 si gana el primer jugador
const pokemonGanador = (ataque1, defensa1, ataque2, defensa2, poke) => {
    let playerTotal = ataque1 - defensa2 +  defensa1 - ataque2;
    let botTotal = ataque2 - defensa1 + defensa2 - ataque1;
    if (playerTotal > botTotal) {
        document.querySelector("#pokeWin").innerHTML = `<h2 class=text-center">GANA ${mayus(poke)}!</h2>`
        return 1;
    } else {
        // document.querySelector("#pokeWin").innerHTML=`<h2 class=text-center">EMPATE!</h2>`
        return 0;
    }
}

// Crea Nodos de Stats e Imagen
const elegirPokemon = (id, indice) => {
    ataques++;

    document.querySelector("#pokeWin").innerHTML = `<h2 class=text-center">EMPATE!</h2>`
    // Carga estadísticas e imagen del jugador
    cargarStats(id, "#statsPlayer", "puntosPlayer");
    cargarImagen(id, "#imgPlayer");
    let ataquePlayer = characters[id].stats[1].base_stat;
    let defensaPlayer = characters[id].stats[2].base_stat;
    // Asigna el botón del Pokemon a "boton"
    let boton = document.querySelector(indice).firstChild
    // Deshabilita botón
    deshabilitar(boton);
    // Saca la clase del botón para que el mouse no sea pointer
    boton.classList.remove("pokeAtack");
    // Opaca el pokemon usado
    opacar(boton.firstChild)

    // Cambio ID a random para cargar el oponente
    idBot = parseInt(Math.random() * cantPokemon)
    // Carga estadísticas e imagen del oponente
    cargarStats(idBot, "#statsBot", "puntosBot");
    cargarImagen(idBot, "#imgBot");
    let ataqueBot = characters[idBot].stats[1].base_stat;
    let defensaBot = characters[idBot].stats[2].base_stat;
    // Crea array de Pokebolas del Oponente 
    let pokebolas = document.querySelectorAll(".pokeBot");
    // Cambia la Pokebola por el Pokemon
    pokebolas[cont].src = characters[idBot].sprites.front_default;
    // Agranda la imagen del Pokemon
    pokebolas[cont].classList.add("w-100");
    // Opaca el Pokemon usado
    opacar(pokebolas[cont]);
    // Aumenta el contador para el próximo ataque
    cont++;

    // Suma 1 si gana Player o Bot
    puntosPlayer += pokemonGanador(ataquePlayer, defensaPlayer, ataqueBot, defensaBot, characters[id].name);
    puntosBot += pokemonGanador(ataqueBot, defensaBot, ataquePlayer, defensaPlayer, characters[idBot].name);

    document.querySelector("#puntosPlayer").innerHTML = puntosPlayer;
    document.querySelector("#puntosBot").innerHTML = puntosBot;

    // Muestra el modal de Pokemon Ganador
    setTimeout(() => {
        $("#modalPokeWin").modal("show");
    }, 1000);

    // Muestra el modal del Jugador Ganador
    if (ataques === equipoPokemon.length) {
        let resultado = "";
        if (puntosPlayer > puntosBot) {
            resultado = "PUDISTE DERROTAR AL LÍDER DEL GYM!!! 🙌🏻";
        } else if (puntosPlayer < puntosBot) {
            resultado = "TE DERROTARON! TE AVISAMOS QUE NO IBA A SER FÁCIL 😝";
        } else {
            resultado = "EMPATARON! TE FALTÓ POCO 😬"
        }
        // Cambia el InnerHTML del modal de Jugador Ganador en cuanto se cierra el modal de Pokemon Ganador
        $('#modalPokeWin').on('hidden.bs.modal', function (e) {
            document.querySelector("#ganador").innerHTML = `<h2 class=text-center">${resultado}</h2>`
            $("#modalGanador").modal("show");
        })
    }

}

// Carga dinámicamente el equipo en Ataque
const cargarAtaque = (characters, equipoPokemon) => {
    for (let i = 0; i < equipoPokemon.length; i++) {
        let idPokemon = equipoPokemon[i] - 1;
        document.querySelector(`#pokemonAtaque${i}`).innerHTML = `<button class="bg-transparent border-0 pokeAtack" type="button" onClick="elegirPokemon(${idPokemon},'#pokemonAtaque${i}')"><img class="w-100 m-auto imgAtaque" src="${characters[idPokemon].sprites.front_default}" ></button>`
    }
}

// Función para agregar un personaje al equipo
const agregarPokemon = (id) => {
    if (equipoPokemon.length < 6) {
        // Agrego el id en un Array
        equipoPokemon.push(id)
        // Switch de botones Agregar y Sacar
        mostrar(document.querySelector(`#btnSacar${id}`));
        ocultar(document.querySelector(`#btnAgregar${id}`));
    }
}

// Función para sacar un personaje del equipo
const sacarPokemon = (id) => {
    // Saco el id del Array
    equipoPokemon = equipoPokemon.filter(elem => elem !== id);
    // Switch de botones Agregar y Sacar
    mostrar(document.querySelector(`#btnAgregar${id}`));
    ocultar(document.querySelector(`#btnSacar${id}`));
}

// Función para borrar los personajes del div
const limpiarPersonajes = () => document.querySelector("#personajes").innerHTML = "";

// Crea Nodo
const crearNodo = (element) => {
    const nodo = `
    <div class="card text-white col-10 col-sm-5 col-md-3 m-3 p-3">
        <img class="card-img-top w-75 m-auto" src="${element.sprites.front_default}" alt="Card image cap">
        <div class="card-body">
            <h3 class="card-title text-center text-nowrap">${mayus(element.name)}</h3>
            <p class="text-center">N° Pokedex: ${element.id}</p>
            <div class="d-none d-md-block">
            <h4 class="card-title text-center">Stats</h4>
            ${element.stats[0].stat.name}<div class="progress"><div class="progress-bar bg-success" style="width: ${element.stats[0].base_stat}%" role="progressbar" aria-valuenow="${element.stats[0].base_stat}" aria-valuemin="0" aria-valuemax="100">${element.stats[0].base_stat}</div></div>
            ${element.stats[1].stat.name}<div class="progress"><div class="progress-bar bg-danger" style="width: ${element.stats[1].base_stat}%" role="progressbar" aria-valuenow="${element.stats[1].base_stat}" aria-valuemin="0" aria-valuemax="100">${element.stats[1].base_stat}</div></div>
            ${element.stats[2].stat.name}<div class="progress"><div class="progress-bar bg-primary" style="width: ${element.stats[2].base_stat}%" role="progressbar" aria-valuenow="${element.stats[2].base_stat}" aria-valuemin="0" aria-valuemax="100">${element.stats[2].base_stat}</div></div>
            ${element.stats[3].stat.name}<div class="progress"><div class="progress-bar bg-warning" style="width: ${element.stats[3].base_stat}%" role="progressbar" aria-valuenow="${element.stats[3].base_stat}" aria-valuemin="0" aria-valuemax="100">${element.stats[3].base_stat}</div></div>
            ${element.stats[4].stat.name}<div class="progress"><div class="progress-bar bg-info" style="width: ${element.stats[4].base_stat}%" role="progressbar" aria-valuenow="${element.stats[4].base_stat}" aria-valuemin="0" aria-valuemax="100">${element.stats[4].base_stat}</div></div>
            ${element.stats[5].stat.name}<div class="progress"><div class="progress-bar bg-secondary" style="width: ${element.stats[5].base_stat}%" role="progressbar" aria-valuenow="${element.stats[5].base_stat}" aria-valuemin="0" aria-valuemax="100">${element.stats[5].base_stat}</div></div>
            </div>
        </div>
        <button type="button" onClick="agregarPokemon(${element.id})" class="btnAgregar" id="btnAgregar${element.id}">+</button>
        <button type="button" onClick="sacarPokemon(${element.id})" class="btnSacar oculto" id="btnSacar${element.id}">-</button>
    </div>
    `;
    document.querySelector("#personajes").insertAdjacentHTML("beforeend", nodo);
}

// Recorre el JSON y agrega personajes en un Array
const mapearPersonajes = (personajes) => characters.push(personajes);

const start = async () => {
    // Activa el botón de buscar cuando el input no está vacío
    document.querySelector("#inputCantidad").addEventListener("input",()=>boton());

    // Deshabilita el botón de buscar
    deshabilitar(document.querySelector("#btnCargar"));

    // Oculta la barra de progreso
    ocultar(document.querySelector(".progress"));

    // Muestra el modal de Instrucciones al inicio
    $("#modalInfo").modal("show");
    
    // Habilita los tooltips
    $(function () { $('[data-toggle="tooltip"]').tooltip() })

    // Deshabilita el envío del form
    document.querySelector("#formCantidad").addEventListener("submit",sub);

    // Busca la cantidad de Pokemon indicados
    document.querySelector("#btnCargar").addEventListener("click",async()=>{
    
    // Toma el valor del input
    cantPokemon=parseInt(document.querySelector("#inputCantidad").value);

    // Deshabilito el boton de Cargar
    deshabilitar(document.querySelector("#btnCargar"));

    // Muestra la barra de progreso
    mostrar(document.querySelector(".progress"));

    // Fetch de personajes
    for (let i = 1; i < cantPokemon + 1; i++) { // modificar el tamaño del array para tomar más personajes
        // Hago fetch de cada id de personaje
        data = await fetchData(URL + i);
        // Agrego la info del fetch en un Array
        characters.push(data);
        // Anima la barra de progreso
        document.querySelector("#progreso").setAttribute(`style`,`width:${characters.length/cantPokemon*100}%`);
    }

    document.querySelector("#personajes").innerHTML="";

    // Mapeo el Array de personajes y llamo a Crear Nodos
    characters.map(character => crearNodo(character));
    
    // Al click en la pokebola, abre el modal mostrando el equipo
    document.querySelector("#imgPokebola").addEventListener("click", () => abrirEquipo(characters, equipoPokemon));
    
    // Al click en Atacar, se borran los personajes y se crea el Ataque
    document.querySelector("#btnAtacar").addEventListener("click", () => {
        // Oculta la Pokebola
        ocultar(document.querySelector("#imgPokebola"));
        // Oculta el menú de Logo
        ocultar(document.querySelector("#menu"));
        // Borra es listado de Pokemon
        limpiarPersonajes();
        // Muestra el div de Ataque
        mostrar(document.querySelector("#ataque"));
        // Carga los Pokemon en divPlayer
        cargarAtaque(characters, equipoPokemon);
    });
})


}

window.onload = start;
