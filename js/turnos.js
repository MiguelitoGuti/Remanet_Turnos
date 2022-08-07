const medicos = [];
const turnos = [];

class Medico {
    constructor(ident, nombre, matricula) {
        this.ident = ident;
        this.nombre = nombre;
        this.matricula = matricula;
    }
}

class Turno {
    constructor(id, dia, mes, anio, fecha, hora, paciente, mail, estado, medico, diaturno, dni, telefono, mediconombre) {
        this.id = id;
        this.dia = dia;
        this.mes = mes;
        this.anio = anio;
        this.fecha = fecha;
        this.hora = hora;
        this.paciente = paciente;
        this.mail = mail;
        this.estado = estado;
        this.medico = medico;
        this.diaturno = diaturno;
        this.dni = dni;
        this.telefono = telefono;
        this.mediconombre = mediconombre;
    }
}

// Traer medicos sesion
const medicosAlmacenadosSesion = localStorage.getItem("MedicosAlmacenados");
const parseMedicos = JSON.parse(medicosAlmacenadosSesion);

for (const objetoMedico of parseMedicos)
    medicos.push(new Medico(objetoMedico.ident, objetoMedico.nombre, objetoMedico.matricula));

// Traer turnos de sesion

let acumulador = ``;
let agendaCreada = localStorage.getItem('agendaCreada')
if (agendaCreada == 'S') {

    const turnosAlmacenadosSesion = localStorage.getItem("TurnosAlmacenados");
    const parseTurnos = JSON.parse(turnosAlmacenadosSesion);

    for (const objetoturno of parseTurnos) {
        turnos.push(new Turno(objetoturno.id, objetoturno.dia, objetoturno.mes, objetoturno.anio, objetoturno.fecha, objetoturno.hora, objetoturno.paciente, objetoturno.mail, objetoturno.estado, objetoturno.medico, objetoturno.diaturno, objetoturno.dni, objetoturno.telefono, objetoturno.mediconombre));
    }

    let turnosFiltrados = [];
    turnosFiltrados = turnos.filter((turnoFiltro) => turnoFiltro.paciente !== '');

    turnosFiltrados.sort((a, b) => {
        let da = a.dia, db = b.dia;
        return db - da;
    });

    turnosFiltrados.forEach((turnoaux) => {

        acumulador += `<tr>
            
            <td>
            <button id="anular-turno" class="botonesAnularTurnosABM" onclick="anularTurno(${turnoaux.id})">Anular</button>
            </td>
            <td>
            <button id="borrar-paciente" class="botonesQuitarPacienteABM" onclick="quitarPersonaTurno(${turnoaux.id})">Borrar Pac</button>
            </td>
            <td>${turnoaux.id}</td>
            <td>${turnoaux.fecha}</td>
            <td>${turnoaux.hora}</td>
            <td>${turnoaux.dni}</td>
            <td>${turnoaux.paciente}</td>
            <td>${turnoaux.mail}</td>
            <td>${turnoaux.telefono}</td>
            <td>${turnoaux.mediconombre}</td>
            </tr>`;

    });
    document.getElementById('listado-turnos').innerHTML = acumulador;
}
crearComboMedico();

function anularTurno(idturno) {

    Swal.fire({
        title: 'Confirma Anulacion del Turno?',
        icon: 'warning',
        showCloseButton: true,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#3085d6',
    }).then((result) => {

        if (result.isConfirmed) {

            // Borro paciente y cambio estado a Anulado
            const posicionTurno = turnos.findIndex(turnoaux => {
                return turnoaux.id == idturno;
            });
            turnos[posicionTurno].mail = '';
            turnos[posicionTurno].paciente = '';
            turnos[posicionTurno].estado = 'A';
            turnos[posicionTurno].dni = '';
            turnos[posicionTurno].telefono = '';

            // actualizo datos sesion
            const guardarTurnosAnulacion = JSON.stringify(turnos);
            localStorage.setItem("TurnosAlmacenados", guardarTurnosAnulacion);
            location.reload();
        }
    })
}

function quitarPersonaTurno(idturno) {

    Swal.fire({
        title: 'Confirma Borrar Paciente del Turno?',
        icon: 'question',
        showCloseButton: true,
        confirmButtonText: 'Confirmar',
    }).then((result) => {

        if (result.isConfirmed) {

            // Borro Paciente y cambio estado a Pendiente
            const posicionTurno = turnos.findIndex(turnoaux => {
                return turnoaux.id == idturno;
            });
            turnos[posicionTurno].mail = '';
            turnos[posicionTurno].paciente = '';
            turnos[posicionTurno].estado = 'P';
            turnos[posicionTurno].dni = '';
            turnos[posicionTurno].telefono = '';

            // actualizo datos sesion
            const guardarTurnosBorraPac = JSON.stringify(turnos);
            localStorage.setItem("TurnosAlmacenados", guardarTurnosBorraPac);
            location.reload();

        }
    })
}

function buscar() {

    let pacienteBus = document.getElementById('PacBus').value;
    let dniBus = document.getElementById('DniBus').value;
    let medicoBus = document.getElementById('MedicoBus').value;
    let fechaBus = document.getElementById('FechaBus').value;
    let acumulador = ``;
    let agendaCreada = localStorage.getItem('agendaCreada');
    if (agendaCreada == 'S') {

        let turnosFiltrados = [];
        turnosFiltrados = turnos.filter((turnoFiltro) => turnoFiltro.paciente !== '');
        if (pacienteBus !== '') {
            turnosFiltrados = turnos.filter((turnoFiltro) => turnoFiltro.paciente !== '' && turnoFiltro.paciente === pacienteBus);
        }

        if (dniBus !=='') {
            turnosFiltrados = turnosFiltrados.filter((turnoFiltro) => turnoFiltro.paciente !== '' && turnoFiltro.dni === dniBus);
        }

        if (medicoBus !== 'ND') {
            turnosFiltrados = turnosFiltrados.filter((turnoFiltro) => turnoFiltro.paciente !== '' && turnoFiltro.medico == medicoBus);
        }

        if (fechaBus !== '') {
            let anio = fechaBus.substring(0,4);
            let mes = fechaBus.substring(5,7);
            let dia = fechaBus.substring(8);
            turnosFiltrados = turnosFiltrados.filter((turnoFiltro) => turnoFiltro.paciente !== '' && turnoFiltro.dia == dia && turnoFiltro.mes == mes && turnoFiltro.anio == anio);
        }

        turnosFiltrados.sort((a, b) => {
            let da = a.dia, db = b.dia;
            return db - da;
        });

        turnosFiltrados.forEach((turnoaux) => {

            acumulador += `<tr>
                
                <td>
                <button id="anular-turno" class="botonesAnularTurnosABM" onclick="anularTurno(${turnoaux.id})">Anular</button>
                </td>
                <td>
                <button id="borrar-paciente" class="botonesQuitarPacienteABM" onclick="quitarPersonaTurno(${turnoaux.id})">Borrar Pac</button>
                </td>
                <td>${turnoaux.id}</td>
                <td>${turnoaux.fecha}</td>
                <td>${turnoaux.hora}</td>
                <td>${turnoaux.dni}</td>
                <td>${turnoaux.paciente}</td>
                <td>${turnoaux.mail}</td>
                <td>${turnoaux.telefono}</td>
                <td>${turnoaux.mediconombre}</td>
                </tr>`;

        });
        document.getElementById('listado-turnos').innerHTML = acumulador;
    }
}

function crearComboMedico() {
    acumulador = ``;
    let opcionVacia = 'ND'
    acumulador += `<option value =${opcionVacia}>(TODOS)</option>`;
    medicos.forEach(medicoaux => {
        acumulador += `<option value=${medicoaux.ident}>${medicoaux.nombre}</option>`;
    })
    document.getElementById('MedicoBus').innerHTML = acumulador;
}

function limpiar(){
    location.reload();
}