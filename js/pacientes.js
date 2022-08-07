
const pacientes = [];
class Paciente {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
let acumulador = ``;

const PacientesAlmacenadosSesion = localStorage.getItem("PacientesAlmacenados");
const parsePaciente = JSON.parse(PacientesAlmacenadosSesion);

for (const objetoPaciente of parsePaciente)
    pacientes.push(new Paciente(objetoPaciente.id, objetoPaciente.name, objetoPaciente.email));

pacientes.forEach((pacienteaux) => {

    acumulador += `<tr>
        <th scope="row">${pacienteaux.id}</th>
        <td>${pacienteaux.name}paciente</td>
        <td>${pacienteaux.email}</td>
        </tr>`;

});

document.getElementById('listado-pacientes').innerHTML = acumulador;