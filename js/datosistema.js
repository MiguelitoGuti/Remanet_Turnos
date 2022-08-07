
 pedirPacientes = async () => {
    const respuestaPaciente = await fetch("https://jsonplaceholder.typicode.com/users")
    const pacientes = await respuestaPaciente.json()

    const guardarPacientesSesion = JSON.stringify(pacientes);
    localStorage.setItem("PacientesAlmacenados", guardarPacientesSesion);
};

const pedirMedicos = async () => {
    const respuestaMedico = await fetch("../json/medicos.json")
    const medicos = await respuestaMedico.json()
    
    const guardarMedicosSesion = JSON.stringify(medicos);
    localStorage.setItem("MedicosAlmacenados", guardarMedicosSesion);
};

pedirPacientes();
pedirMedicos();


