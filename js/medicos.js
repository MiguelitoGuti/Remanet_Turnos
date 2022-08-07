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
    constructor(id, dia, mes, anio, fecha, hora, paciente, email, estado, medico, diaturno, dni, telefono, mediconombre) {
        this.id = id;
        this.dia = dia;
        this.mes = mes;
        this.anio = anio;
        this.fecha = fecha;
        this.hora = hora;
        this.paciente = paciente;
        this.email = email;
        this.estado = estado;
        this.medico = medico;
        this.diaturno = diaturno;
        this.dni = dni;
        this.telefono = telefono;
        this.mediconombre = mediconombre;
    }
}

date = new Date();
year = date.getFullYear();
month = date.getMonth() + 1;

let acumulador = ``;

let agendaCreada = localStorage.getItem('agendaCreada')
if (agendaCreada == 'S') {

    const turnosAlmacenadosSesion = localStorage.getItem("TurnosAlmacenados");
    const parseTurnos = JSON.parse(turnosAlmacenadosSesion);

    for (const objetoturno of parseTurnos) {
        turnos.push(new Turno(objetoturno.id, objetoturno.dia, objetoturno.mes, objetoturno.anio, objetoturno.fecha, objetoturno.hora, objetoturno.paciente, objetoturno.mail, objetoturno.estado, objetoturno.medico, objetoturno.diaturno, objetoturno.dni, objetoturno.telefono, objetoturno.mediconombre));
    }
}

const medicosAlmacenadosSesion = localStorage.getItem("MedicosAlmacenados");
const parseMedicos = JSON.parse(medicosAlmacenadosSesion);

for (const objetoMedico of parseMedicos)
    medicos.push(new Medico(objetoMedico.ident, objetoMedico.nombre, objetoMedico.matricula));

medicos.forEach((medicoaux) => {

    let medicoSesion = medicoaux.ident
    switch (medicoSesion) {
        case 0:
            if (localStorage.getItem("AgendaMedico0") != 'S') {

                acumulador += `<tr>
                    <td>
                        <button id="crear-turnos" class="botonesOpciones" onclick="crearTurnos(${medicoaux.ident},${month},${year})">crear agenda</button>
                    </td>
                        <td>${medicoaux.ident}</td>
                        <td>${medicoaux.nombre}</td>
                        <td>${medicoaux.matricula}</td>
                    </tr>`;
            } else {

                acumulador += `<tr>
                        <td></td>
                        <td>${medicoaux.ident}</td>
                        <td>${medicoaux.nombre}</td>
                        <td>${medicoaux.matricula}</td>
                    </tr>`;
            }
            break;
        case 1:
            if (localStorage.getItem("AgendaMedico1") != 'S') {

                acumulador += `<tr>
                    <td>
                        <button id="crear-turnos" class="botonesOpciones" onclick="crearTurnos(${medicoaux.ident},${month},${year})">crear agenda</button>
                    </td>
                        <td>${medicoaux.ident}</td>
                        <td>${medicoaux.nombre}</td>
                        <td>${medicoaux.matricula}</td>
                    </tr>`;
            } else {

                acumulador += `<tr>
                        <td></td>
                        <td>${medicoaux.ident}</td>
                        <td>${medicoaux.nombre}</td>
                        <td>${medicoaux.matricula}</td>
                    </tr>`;
            }
            break;
        case 2:
            if (localStorage.getItem("AgendaMedico2") != 'S') {

                acumulador += `<tr>
                    <td>
                        <button id="crear-turnos" class="botonesOpciones" onclick="crearTurnos(${medicoaux.ident},${month},${year})">crear agenda</button>
                    </td>
                        <td>${medicoaux.ident}</td>
                        <td>${medicoaux.nombre}</td>
                        <td>${medicoaux.matricula}</td>
                    </tr>`;
            } else {

                acumulador += `<tr>
                        <td></td>
                        <td>${medicoaux.ident}</td>
                        <td>${medicoaux.nombre}</td>
                        <td>${medicoaux.matricula}</td>
                    </tr>`;
            }
            break;
    }
});

document.getElementById('listado-medicos').innerHTML = acumulador;

function crearTurnos(medicoturnoid, mes, anio) {

    Swal.fire({
        title: 'Confirma Creacion de Agenda?',
        icon: 'question',
        showCloseButton: true,
        confirmButtonText: 'Confirmar',
    }).then((result) => {

        if (result.isConfirmed) {

            let finMes = 31;
            for (let indice = 1; indice <= finMes; indice++) {
                crearTurnoDia(medicoturnoid, indice, mes, anio);
            }
            switch (medicoturnoid) {
                case 0:
                    localStorage.setItem("AgendaMedico0", 'S');
                    break;
                case 1:
                    localStorage.setItem("AgendaMedico1", 'S');
                    break;
                case 2:
                    localStorage.setItem("AgendaMedico2", 'S');
                    break;
            }
            location.reload();
        }
    })
}

function crearTurnoDia(medicoTurnoId, dia, mes, anio) {

    let horaInicial = 7;
    let horaInicialtxt = '';
    let fechaTurnoFormat = dia.toString() + '/' + mes.toString() + '/' + anio.toString();
    let fechaTurnoTxt = anio.toString() + '-' + mes.toString() + '-' + dia.toString();
    let fechaTurno = new Date(fechaTurnoTxt);
    let diaTurno = fechaTurno.getDay();
    let nombreMedico = medicos[medicoTurnoId].nombre;
    if (diaTurno == 1 || diaTurno == 2 || diaTurno == 3 || diaTurno == 4 || diaTurno == 5) {

        for (let indice = 0; indice <= 6; indice++) {

            horaInicial = horaInicial + 1;
            horaInicialtxt = horaInicial.toString();
            horaInicialtxt = horaInicialtxt.padStart(2, '0') + ':00';
            indiceTurno = dia.toString() + mes.toString() + anio.toString() + medicoTurnoId.toString() + horaInicial.toString();
            turnos.push(new Turno(indiceTurno, dia, mes, anio, fechaTurnoFormat, horaInicialtxt, '', '', 'P', medicoTurnoId, diaTurno, '', '', nombreMedico));
        }

    }

    localStorage.setItem('agendaCreada', 'S');
    const guardarTurnosSesion = JSON.stringify(turnos);
    localStorage.setItem("TurnosAlmacenados", guardarTurnosSesion);

}

function borraragenda() {
    localStorage.removeItem('agendaCreada');
    localStorage.removeItem('TurnosAlmacenados')
    localStorage.removeItem('AgendaMedico0')
    localStorage.removeItem('AgendaMedico1')
    localStorage.removeItem('AgendaMedico2')
    localStorage.removeItem('MedicosAlmacenados')
    localStorage.removeItem('PacientesAlmacenados')
    localStorage.removeItem('TurnoId')
    location.reload();
}

