const API_URL = "http://localhost:8080/api/usuarios";

// Abas
function mostrarAba(nome) {
  document.querySelectorAll(".aba").forEach(a => a.classList.remove("ativa"));
  document.getElementById(nome).classList.add("ativa");
}

// Mostrar/ocultar formulários
function toggleFormulario(id) {
  const form = document.getElementById(id);
  form.classList.toggle("oculto");
}

// Cancelar cadastro
function cancelarCadastro(id) {
  document.getElementById(id).reset();
  document.getElementById(id).classList.add("oculto");
}

// Carregar médicos (para cadastro e filtro)
async function carregarMedicos() {
  const res = await fetch(`${API_URL}/tipo/MEDICO`);
  const medicos = await res.json();

  const selectCadastro = document.getElementById("medicoResponsavel");
  const selectFiltro = document.getElementById("filtroMedico");

  // Limpa selects
  selectCadastro.innerHTML = '<option value="">Selecione o Médico Responsável</option>';
  selectFiltro.innerHTML = '<option value="">Todos os Médicos</option>';

  medicos.forEach(m => {
    const opt1 = document.createElement("option");
    opt1.value = m.id;
    opt1.textContent = m.nome;
    selectCadastro.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = m.id;
    opt2.textContent = m.nome;
    selectFiltro.appendChild(opt2);
  });
}

// Listar médicos
async function listarMedicos() {
  const res = await fetch(`${API_URL}/tipo/MEDICO`);
  const medicos = await res.json();
  const tbody = document.querySelector("#tabelaMedicos tbody");
  tbody.innerHTML = "";
  medicos.forEach(m => {
    tbody.innerHTML += `
      <tr>
        <td>${m.nome}</td>
        <td>${m.email}</td>
        <td>${m.crm || ""}</td>
        <td>
          <button onclick="editarMedico(${m.id})">Editar</button>
          <button onclick="excluirUsuario(${m.id})">Excluir</button>
        </td>
      </tr>`;
  });
  carregarMedicos();
}

// Listar pacientes com filtro
async function listarPacientes() {
  const res = await fetch(`${API_URL}/tipo/PACIENTE`);
  let pacientes = await res.json();
  const filtroMedico = document.getElementById("filtroMedico").value;

  // Filtra localmente se o backend não tiver endpoint específico
  if (filtroMedico) {
    pacientes = pacientes.filter(p => p.medicoResponsavel && p.medicoResponsavel.id == filtroMedico);
  }

  // Buscar nomes dos médicos (fallback)
  const medicosRes = await fetch(`${API_URL}/tipo/MEDICO`);
  const medicos = await medicosRes.json();

  const tbody = document.querySelector("#tabelaPacientes tbody");
  tbody.innerHTML = "";
  pacientes.forEach(p => {
    const medico = medicos.find(m => m.id === (p.medicoResponsavel?.id || p.medicoId));
    tbody.innerHTML += `
      <tr>
        <td>${p.nome}</td>
        <td>${p.email}</td>
        <td>${medico ? medico.nome : "—"}</td>
        <td>
          <button onclick="editarPaciente(${p.id})">Editar</button>
          <button onclick="excluirUsuario(${p.id})">Excluir</button>
        </td>
      </tr>`;
  });
}

// Cadastrar/atualizar médico
async function salvarMedico(e) {
  e.preventDefault();
  const id = document.getElementById("medicoId").value;
  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;
  const body = {
    nome: document.getElementById("nomeMedico").value,
    email: document.getElementById("emailMedico").value,
    senha: document.getElementById("senhaMedico").value,
    tipo: "MEDICO",
    crm: document.getElementById("crmMedico").value
  };
  await fetch(url, { method: metodo, headers: {"Content-Type": "application/json"}, body: JSON.stringify(body) });
  listarMedicos();
  cancelarCadastro("formMedico");
}

// Cadastrar/atualizar paciente
async function salvarPaciente(e) {
  e.preventDefault();
  const id = document.getElementById("pacienteId").value;
  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;
  const body = {
    nome: document.getElementById("nomePaciente").value,
    email: document.getElementById("emailPaciente").value,
    senha: document.getElementById("senhaPaciente").value,
    tipo: "PACIENTE",
    medicoResponsavel: { id: document.getElementById("medicoResponsavel").value }
  };
  await fetch(url, { method: metodo, headers: {"Content-Type": "application/json"}, body: JSON.stringify(body) });
  listarPacientes();
  cancelarCadastro("formPaciente");
}

// Editar médico
async function editarMedico(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const medico = await res.json();
  document.getElementById("formMedico").classList.remove("oculto");
  document.getElementById("medicoId").value = medico.id;
  document.getElementById("nomeMedico").value = medico.nome;
  document.getElementById("emailMedico").value = medico.email;
  document.getElementById("crmMedico").value = medico.crm;
}

// Editar paciente
async function editarPaciente(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const paciente = await res.json();
  document.getElementById("formPaciente").classList.remove("oculto");
  document.getElementById("pacienteId").value = paciente.id;
  document.getElementById("nomePaciente").value = paciente.nome;
  document.getElementById("emailPaciente").value = paciente.email;
  document.getElementById("medicoResponsavel").value = paciente.medicoResponsavel?.id || "";
}

// Excluir
async function excluirUsuario(id) {
  if (!confirm("Excluir este registro?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  listarMedicos();
  listarPacientes();
}

// Inicializar
listarMedicos();
listarPacientes();
