
const medicos = [];
const turnos = [];
const pacientes = [];

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

class Medico {
    constructor(ident, nombre, matricula) {
        this.ident = ident;
        this.nombre = nombre;
        this.matricula = matricula;
    }
}

class Paciente {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

// Traer medicos sesion
const medicosAlmacenadosSesion = localStorage.getItem("MedicosAlmacenados");
const parseMedicos = JSON.parse(medicosAlmacenadosSesion);

for (const objetoMedico of parseMedicos)
    medicos.push(new Medico(objetoMedico.ident, objetoMedico.nombre, objetoMedico.matricula));

// Traer pacientes sesion

const PacientesAlmacenadosSesion = localStorage.getItem("PacientesAlmacenados");
const parsePaciente = JSON.parse(PacientesAlmacenadosSesion);

for (const objetoPaciente of parsePaciente)
    pacientes.push(new Paciente(objetoPaciente.id, objetoPaciente.name, objetoPaciente.email));

let acumulador = ``;

// crear turnos obtenidos de sesion


let agendaCreada = localStorage.getItem('agendaCreada')
if (agendaCreada == 'S') {

    const turnosAlmacenadosSesion = localStorage.getItem("TurnosAlmacenados");
    const parseTurnos = JSON.parse(turnosAlmacenadosSesion);

    for (const objetoturno of parseTurnos) {
        turnos.push(new Turno(objetoturno.id, objetoturno.dia, objetoturno.mes, objetoturno.anio, objetoturno.fecha, objetoturno.hora, objetoturno.paciente, objetoturno.mail, objetoturno.estado, objetoturno.medico, objetoturno.diaturno, objetoturno.dni, objetoturno.telefono, objetoturno.mediconombre));
    }

}

date = new Date();
year = date.getFullYear();
month = date.getMonth() + 1;
day = date.getDate();

crearComboMedico();
crearComboPacientes();
crearDiasMes();


// funciones

function solicitarDatos(turnosesion) {
    localStorage.setItem('TurnoId', turnosesion);// guardar en sesion
    const posicionTurno = turnos.findIndex(turnoaux => {
        return turnoaux.id == turnosesion;
    });
    acumulador = ``;
    acumulador += `FECHA: ${turnos[posicionTurno].fecha} HORA: ${turnos[posicionTurno].hora} MEDICO: ${turnos[posicionTurno].mediconombre}`;
    document.getElementById('info-turno').innerHTML = acumulador;
}

function crearDiasMes() {

    // crear turnos para todos los dias del mes Lunes a Viernes, y calendario en HTML
    let finMes = 31;
    let dias = ``;
    dias += `<button id="dia-turno" class="formatodia"></button>`
    for (let indice = 1; indice <= finMes; indice++) {
        dias += `<button id="dia-turno" class="formatodia" onclick="crearTurnosDia(${indice},${month},${year})">${indice}</button>`
    }
    dias += `<button id="dia-turno" class="formatodia"></button>`;
    dias += `<button id="dia-turno" class="formatodia"></button>`;
    dias += `<button id="dia-turno" class="formatodia"></button>`;
    document.getElementById('dias-mes').innerHTML = dias;
}

function crearTurnosDia(dia, mes, anio) {

    // crear turnos para un dia segun medico, botones para seleccionar turno y cuenta turnos otorgados y disponibles 
    let cantTurnosOtorg = 0;
    let cantTurnosDisp = 0;
    let medicoId = document.getElementById('combo-medico').value;
    
    if (medicoId != 99 && dia >= day) {

        document.getElementById("nombre-medico1").innerHTML = 'MEDICO: ' + medicos[medicoId].nombre;

        let turnosFiltrados = [];
        turnosFiltrados = turnos.filter((turnoFiltro) => turnoFiltro.dia == dia && turnoFiltro.mes == mes && turnoFiltro.anio == anio && turnoFiltro.medico == medicoId);
        acumulador = ``;
        turnosFiltrados.forEach((turnoindividual) => {

            let estadoTurno = turnoindividual.estado;
            estadoTurno == 'O' ? cantTurnosOtorg++ : cantTurnosOtorg;
            estadoTurno == 'P' ? cantTurnosDisp++ : cantTurnosDisp;
            switch (estadoTurno) {

                case 'A':
                    acumulador += `<div class="alineacionCentro espacioInferior">
                        <button id="asignar-turno" class="botonesTurnosAnulado">${turnoindividual.fecha} ${turnoindividual.hora} - ANULADO</button>
                        <button id="anular-turno" class="botonOculto"></button>
                        </div>`;
                    break;

                case 'O':
                    acumulador += `<div class="alineacionCentro espacioInferior">
                        <button id="asignar-turno" class="botonesTurnosOcupado">${turnoindividual.fecha} ${turnoindividual.hora} - PACIENTE: ${turnoindividual.paciente}</button>
                        <button id="anular-turno" class="botonOculto"></button>
                        </div>`;
                    break;

                case 'P':
                    acumulador += `<div class="alineacionCentro espacioInferior">
                        <button id="asignar-turno" class="botonesTurnos" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="solicitarDatos(${turnoindividual.id})">${turnoindividual.fecha} ${turnoindividual.hora} - DISPONIBLE</button>
                        <button id="anular-turno" class="botonesAnularTurnos" onclick="anularTurno(${turnoindividual.id})">Anular</button>
                        </div>`;
                    break;
            }
        });
        document.getElementById('turnos-medico1').innerHTML = acumulador;
        document.getElementById("TxtDisp1").innerHTML = "DISPONIBLES: " + cantTurnosDisp;
        document.getElementById("TxtOtor1").innerHTML = "OTORGADOS: " + cantTurnosOtorg;
    } else {

        document.getElementById("nombre-medico1").innerHTML = `MEDICO: ${medicos[medicoId].nombre}`;
        acumulador = ``;
        document.getElementById('turnos-medico1').innerHTML = acumulador;
        document.getElementById("TxtDisp1").innerHTML = "DISPONIBLES: " + cantTurnosDisp;
        document.getElementById("TxtOtor1").innerHTML = acumulador;
    }

};


function confirmarDatos() {

    let idturno = localStorage.getItem('TurnoId'); // Recupero de sesion
    let idPersona = document.getElementById("combo-persona").value;
    let dniPersona = document.getElementById('dni-paciente').value;
    let telefonoPersona = document.getElementById('telefono-paciente').value;
    
    if (idPersona != 99 && dniPersona != '' && telefonoPersona != '') {

        Swal.fire({
            title: 'Confirma Asignación del Turno?',
            icon: 'question',
            showCloseButton: true,
            confirmButtonText: 'Confirmar',
            confirmButtonColor: '#3085d6',
        }).then((result) => {

            if (result.isConfirmed) {
                // Asigno los datos ingresados en el turno seleccionado y cambio estado de turno a Ocupado
                const posicionTurno = turnos.findIndex(turnoaux => {
                    return turnoaux.id == idturno;
                });
                const posicionPaciente = pacientes.findIndex(pacienteaux => {
                    return pacienteaux.id == idPersona;
                });
                turnos[posicionTurno].mail = pacientes[posicionPaciente].email;
                turnos[posicionTurno].paciente = pacientes[posicionPaciente].name;
                turnos[posicionTurno].estado = 'O';
                turnos[posicionTurno].dni = dniPersona;
                turnos[posicionTurno].telefono = telefonoPersona;

                // actualizo datos sesion
                const guardarTurnosConfirmacion = JSON.stringify(turnos);
                localStorage.removeItem('TurnoId');
                localStorage.setItem("TurnosAlmacenados", guardarTurnosConfirmacion);
                location.reload();
            }
        })
    }
}

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

function crearComboMedico() {
    acumulador = ``;
    acumulador += `<option value=99>(Seleccione Medico)</option>`;
    medicos.forEach(medicoaux => {
        acumulador += `<option value=${medicoaux.ident}>${medicoaux.nombre}</option>`;
    })
    document.getElementById('combo-medico').innerHTML = acumulador;
}

function crearComboPacientes() {
    acumulador = ``;
    acumulador += `<option value=99>(Seleccione Paciente)</option>`;
    pacientes.forEach(pacienteaux => {
        acumulador += `<option value=${pacienteaux.id}>${pacienteaux.name}</option>`;
    })
    document.getElementById('combo-persona').innerHTML = acumulador;
}

function limpiarVariables(){
    localStorage.removeItem('TurnoId'); // Recupero de sesion
    location.reload();
}