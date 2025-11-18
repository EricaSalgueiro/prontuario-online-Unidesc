/* Constantes storage */
const KEY_USERS = "po_users_v_final";
const KEY_CURRENT = "po_current_v_final";

/* Helpers storage */
function getUsers(){ return JSON.parse(localStorage.getItem(KEY_USERS) || "[]"); }
function saveUsers(users){ localStorage.setItem(KEY_USERS, JSON.stringify(users)); }
function genId(){ return 'id_' + Math.random().toString(36).slice(2,9); }
function getCurrent(){ return JSON.parse(localStorage.getItem(KEY_CURRENT) || "null"); }
function setCurrent(u){ localStorage.setItem(KEY_CURRENT, JSON.stringify(u)); }
function clearCurrent(){ localStorage.removeItem(KEY_CURRENT); }

/* UI refs */
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');
const authArea = document.getElementById('authArea');
const panel = document.getElementById('panel');
const panelBody = document.getElementById('panelBody');
const fab = document.getElementById('fab');
const btnAddPatientSide = document.getElementById('btnAddPatientSide');
const overlay = document.getElementById('overlay');
const modalContent = document.getElementById('modalContent');
const toast = document.getElementById('toast');

/* Demo user */
(function ensureDemo(){
  const users = getUsers();
  if(!users.find(u=>u.email === "medico@exemplo.com")){
    users.push({ id: genId(), name: "Dr. Demo", email: "medico@exemplo.com", password: "senha123", type:"medico", patients: [], treatments: [] });
    saveUsers(users);
  }
})();

/* Toast (replaces alerts) */
function showToast(msg, type="info"){
  toast.className = "toast " + (type === "success" ? "success" : type === "warn" ? "warn" : type === "error" ? "error" : "info");
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2800);
}

/* Auth helpers */
function clearRegister(){
  document.getElementById('regName').value = "";
  document.getElementById('regEmail').value = "";
  document.getElementById('regPassword').value = "";
  document.getElementById('regType').value = "";
  showToast("Formulário limpo", "info");
}

function showRegister(){ document.getElementById('regName').focus(); showToast("Preencha os dados para registrar", "info"); }

/* Register */
function register(){
  const name = document.getElementById('regName').value.trim();
  const email = (document.getElementById('regEmail').value || '').trim().toLowerCase();
  const pass = document.getElementById('regPassword').value;
  const type = document.getElementById('regType').value;

  if(!name || !email || !pass || !type){
    showToast("Preencha todos os campos.", "warn"); return;
  }

  let users = getUsers();
  if(users.find(u => u.email === email)){
    showToast("E-mail já cadastrado.", "error"); return;
  }

  users.push({ id: genId(), name, email, password: pass, type, patients: [], treatments: [] });
  saveUsers(users);
  showToast("Cadastro efetuado com sucesso! Faça login.", "success");
  clearRegister();
}

/* Login */
function login(){
  const email = (document.getElementById('loginEmail').value || '').trim().toLowerCase();
  const pass = document.getElementById('loginPassword').value;
  if(!email || !pass){ showToast("Informe e-mail e senha.", "warn"); return; }

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === pass);
  if(!user){ showToast("Credenciais inválidas.", "error"); return; }

  setCurrent(user);
  openPanel(user);
}

/* Open main panel */
function openPanel(user){
  authArea.style.display = 'none';
  panel.style.display = 'block';
  logoutBtn.style.display = 'inline-block';
  userInfo.textContent = `${user.name} (${user.email})`;

  if(user.type === 'medico'){
    fab.style.display = 'inline-block';
    btnAddPatientSide.style.display = 'inline-block';
    renderDoctor(user);
  } else {
    fab.style.display = 'none';
    btnAddPatientSide.style.display = 'none';
    renderPatient(user);
  }
}

/* Logout */
function logout(){
  clearCurrent();
  location.reload();
}

/* ============================
   Render médico
   ============================ */
function renderDoctor(doctor){
  const users = getUsers();
  const doc = users.find(u => u.id === doctor.id);
  if(!doc){ showToast("Médico não encontrado.", "error"); logout(); return; }

  const patients = (doc.patients || []).map(pid => users.find(u => u.id === pid)).filter(Boolean);

  let html = `<h3>👨‍⚕️ Painel do Médico — ${escapeHtml(doc.name)}</h3>`;
  html += `<p class="muted">Total de pacientes: ${patients.length}</p>`;

  if(patients.length === 0){
    html += `<div class="card" style="margin-top:12px"><p class="muted">Nenhum paciente. Use + para adicionar.</p></div>`;
    panelBody.innerHTML = html; return;
  }

  html += `<div class="patients-list" style="margin-top:12px">`;
  patients.forEach(p => {
    html += `<div class="patient-box card" id="patient_${p.id}">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <strong style="font-size:16px">${escapeHtml(p.name)}</strong>
          <div class="muted">${escapeHtml(p.email)}</div>
          <div class="muted">CPF: ${escapeHtml(p.cpf || '—')}</div>
          <div class="muted">Nascimento: ${escapeHtml(p.nasc || '—')}</div>
          <div class="muted">Endereço: ${escapeHtml(p.endereco || '—')}</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn small" onclick="openAddTreatment('${p.id}')">+ Tratamento</button>
          <button class="btn edit small" onclick="openEditPatient('${p.id}')">Editar</button>
          <button class="btn danger small" style="background:var(--danger); color:white" onclick="confirmDeletePatient('${p.id}')">Excluir</button>
        </div>
      </div>
      <div style="margin-top:12px">${renderTreatmentList(p)}</div>
    </div>`;
  });
  html += `</div>`;

  panelBody.innerHTML = html;
}

/* Treatment list for patient (with topic) */
function renderTreatmentList(patient){
  if(!patient.treatments || !patient.treatments.length) return `<p class="muted">Nenhum tratamento cadastrado.</p>`;
  let out = '';
  patient.treatments.forEach(t => {
    out += `<div class="treatment">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <div>
          <strong>${escapeHtml(t.title)}</strong>
          <div class="muted" style="margin-top:6px">Tópico: <strong>${escapeHtml(t.topic || '—')}</strong></div>
          <p class="muted" style="margin-top:8px">${escapeHtml(t.description)}</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn small" onclick="openAddMedication('${patient.id}','${t.id}')">+ Medicamento</button>
          <button class="btn edit small" onclick="openEditTreatment('${patient.id}','${t.id}')">Editar</button>
          <button class="btn danger small" style="background:var(--danger);color:white" onclick="deleteTreatment('${patient.id}','${t.id}')">Excluir</button>
        </div>
      </div>
      <div style="margin-top:10px">${renderMedications(patient.id, t)}</div>
    </div>`;
  });
  return out;
}

/* Render medications - pass patientId so buttons know context */
function renderMedications(patientId, treat){
  if(!treat.medications || !treat.medications.length) return `<p class="muted">Nenhum medicamento cadastrado.</p>`;
  let s = '<ul style="margin:6px 0 0 18px">';
  treat.medications.forEach(m => {
    s += `<li style="margin-bottom:8px">
      <strong>${escapeHtml(m.name)}</strong> — ${escapeHtml(m.instructions)} ${m.duration ? `(${escapeHtml(m.duration)})` : ''}
      <div style="margin-top:6px;display:flex;gap:8px">
        <button class="btn small edit" onclick="openEditMedication('${patientId}','${treat.id}','${m.id}')">Editar</button>
        <button class="btn danger small" style="background:var(--danger);color:white" onclick="deleteMedication('${patientId}','${treat.id}','${m.id}')">Excluir</button>
      </div>
    </li>`;
  });
  s += '</ul>';
  return s;
}

/* ============================
   Render paciente
   ============================ */
function renderPatient(patient){
  const users = getUsers();
  const p = users.find(u => u.id === patient.id);
  if(!p){ showToast("Paciente não encontrado.", "error"); logout(); return; }

  let html = `<h3>💊 Painel do Paciente — ${escapeHtml(p.name)}</h3><p class="muted">${escapeHtml(p.email)}</p>`;
  if(!p.treatments || !p.treatments.length){ html += `<p class="muted" style="margin-top:12px">Nenhum tratamento registrado.</p>`; }
  else {
    html += `<div class="patients-list" style="margin-top:12px">`;
    p.treatments.forEach(t => {
      html += `<div class="card">
        <strong>${escapeHtml(t.title)}</strong>
        <div class="muted">Tópico: <strong>${escapeHtml(t.topic || '—')}</strong></div>
        <p class="muted">${escapeHtml(t.description)}</p>
        <div style="margin-top:8px">${renderMedications(p.id, t)}</div>
      </div>`;
    });
    html += `</div>`;
  }
  panelBody.innerHTML = html;
}

/* ============================
   MODAIS & AÇÕES
   ============================ */
function showModal(html){ overlay.style.display='flex'; modalContent.innerHTML = html; }
function closeModal(){ overlay.style.display='none'; modalContent.innerHTML = ''; }

/* ADD PATIENT: improved logic (associate existing patient / create new) */
function openAddPatient(){
  showModal(`<h3>Adicionar Paciente</h3>
    <label>Nome</label><input id="m_name" type="text">
    <label>E-mail</label><input id="m_email" type="email">

    <label>CPF</label><input id="m_cpf" type="text" placeholder="000.000.000-00">
    <label>Data de nascimento</label><input id="m_nasc" type="text" placeholder="dd/mm/aaaa">
    <label>Endereço</label><input id="m_end" type="text" placeholder="Rua, nº, bairro, cidade">

    <div style="display:flex;gap:8px;margin-top:8px"><button class="btn" onclick="saveNewPatient()">Salvar</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>`);
}

function saveNewPatient(){
  const name = (document.getElementById('m_name').value || '').trim();
  const email = (document.getElementById('m_email').value || '').trim().toLowerCase();
  const cpf = (document.getElementById('m_cpf').value || '').trim();
  const nasc = (document.getElementById('m_nasc').value || '').trim();
  const end = (document.getElementById('m_end').value || '').trim();

  if(!name || !email){ showToast("Preencha nome e e-mail.", "warn"); return; }

  const users = getUsers();
  const current = getCurrent();
  if(!current){ showToast("Sessão expirada. Faça login novamente.", "error"); return; }

  // find doctor in user list
  const docIdx = users.findIndex(u => u.id === current.id);
  if(docIdx === -1){ showToast("Médico não encontrado.", "error"); return; }

  // search for existing patient by email
  const existingPatient = users.find(u => u.email === email && u.type === "paciente");

  if(existingPatient){
    // associate patient with doctor if not already associated
    users[docIdx].patients = users[docIdx].patients || [];
    if(!users[docIdx].patients.includes(existingPatient.id)){
      users[docIdx].patients.push(existingPatient.id);
      saveUsers(users);
      setCurrent(users[docIdx]);
      closeModal();
      openPanel(users[docIdx]);
      showToast("Paciente existente associado à sua lista.", "success");
      return;
    } else {
      showToast("Esse paciente já está na sua lista.", "info");
      return;
    }
  }

  // create new patient
  const newP = { 
    id: genId(), 
    name, 
    email, 
    cpf, 
    nasc, 
    endereco: end, 
    password: "123456", 
    type: "paciente", 
    patients: [], 
    treatments: [] 
  };
  users.push(newP);
  users[docIdx].patients = users[docIdx].patients || [];
  users[docIdx].patients.push(newP.id);
  saveUsers(users);
  setCurrent(users[docIdx]);
  closeModal();
  openPanel(users[docIdx]);
  showToast("Paciente criado e adicionado com sucesso!", "success");
}

/* ADD TREATMENT (includes topic) */
function openAddTreatment(pid){
  showModal(`<h3>Novo Tratamento</h3>
    <label>Título</label><input id="t_title" type="text">
    <label>Tópico</label><input id="t_topic" type="text" placeholder="Ex: Cardiologia, Fisioterapia...">
    <label>Descrição</label><textarea id="t_desc"></textarea>
    <div style="display:flex;gap:8px;margin-top:8px"><button class="btn" onclick="saveNewTreatment('${pid}')">Salvar</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>`);
}

function saveNewTreatment(pid){
  const title = (document.getElementById('t_title').value || '').trim();
  const topic = (document.getElementById('t_topic').value || '').trim();
  const desc = (document.getElementById('t_desc').value || '').trim();

  if(!title || !desc){ showToast("Preencha título e descrição.", "warn"); return; }

  const users = getUsers();
  const p = users.find(u => u.id === pid);
  if(!p){ showToast("Paciente não encontrado.", "error"); closeModal(); return; }
  p.treatments = p.treatments || [];
  p.treatments.push({ id: genId(), title, topic, description: desc, medications: [] });
  saveUsers(users);
  closeModal();
  openPanel(getCurrent());
  showToast("Tratamento adicionado.", "success");
}

/* ADD MEDICATION */
function openAddMedication(pid, tid){
  showModal(`<h3>Novo Medicamento</h3>
    <label>Nome</label><input id="med_name" type="text">
    <label>Instruções</label><input id="med_instr" type="text">
    <label>Duração</label><input id="med_duration" type="text">
    <div style="display:flex;gap:8px;margin-top:8px"><button class="btn" onclick="saveNewMedication('${pid}','${tid}')">Salvar</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>`);
}

function saveNewMedication(pid, tid){
  const name = (document.getElementById('med_name').value || '').trim();
  const instr = (document.getElementById('med_instr').value || '').trim();
  const dur = (document.getElementById('med_duration').value || '').trim();

  if(!name){ showToast("Nome do medicamento é obrigatório.", "warn"); return; }

  const users = getUsers();
  const p = users.find(u => u.id === pid);
  if(!p){ showToast("Paciente não encontrado.", "error"); closeModal(); return; }
  const t = p.treatments.find(x => x.id === tid);
  if(!t){ showToast("Tratamento não encontrado.", "error"); closeModal(); return; }
  t.medications = t.medications || [];
  t.medications.push({ id: genId(), name, instructions: instr, duration: dur });
  saveUsers(users);
  closeModal(); openPanel(getCurrent());
  showToast("Medicamento adicionado.", "success");
}

/* EDIT / DELETE actions */
function openEditPatient(pid){
  const users = getUsers(); const p = users.find(u => u.id === pid);
  if(!p){ showToast("Paciente não encontrado.", "error"); return; }
  showModal(`<h3>Editar Paciente</h3>
    <label>Nome</label><input id="ep_name" type="text" value="${escapeHtml(p.name)}">
    <label>E-mail</label><input id="ep_email" type="email" value="${escapeHtml(p.email)}">

    <label>CPF</label><input id="ep_cpf" type="text" value="${escapeHtml(p.cpf || '')}">
    <label>Data de nascimento</label><input id="ep_nasc" type="text" value="${escapeHtml(p.nasc || '')}">
    <label>Endereço</label><input id="ep_end" type="text" value="${escapeHtml(p.endereco || '')}">

    <div style="display:flex;gap:8px;margin-top:8px"><button class="btn" onclick="saveEditPatient('${pid}')">Salvar</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>`);
}

function saveEditPatient(pid){
  const name = (document.getElementById('ep_name').value || '').trim();
  const email = (document.getElementById('ep_email').value || '').trim().toLowerCase();
  if(!name || !email){ showToast("Preencha nome e e-mail.", "warn"); return; }

  const users = getUsers();
  if(users.find(u => u.email === email && u.id !== pid)){ showToast("Outro usuário já possui este e-mail.", "error"); return; }

  const cpf = (document.getElementById('ep_cpf').value || '').trim();
  const nasc = (document.getElementById('ep_nasc').value || '').trim();
  const end = (document.getElementById('ep_end').value || '').trim();

  const idx = users.findIndex(u => u.id === pid);
  users[idx].name = name; users[idx].email = email;
  users[idx].cpf = cpf;
  users[idx].nasc = nasc;
  users[idx].endereco = end;
  saveUsers(users);
  closeModal();
  openPanel(getCurrent());
  showToast("Paciente atualizado.", "success");
}

function confirmDeletePatient(pid){
  if(!confirm("Deseja realmente excluir este paciente?")) return;
  let users = getUsers();
  users.forEach(u => { if(u.type === 'medico' && u.patients) u.patients = u.patients.filter(x => x !== pid); });
  users = users.filter(u => u.id !== pid);
  saveUsers(users);
  openPanel(getCurrent());
  showToast("Paciente excluído.", "success");
}

/* Edit treatment */
function openEditTreatment(pid, tid){
  const users = getUsers(); const p = users.find(u => u.id === pid); const t = p.treatments.find(x => x.id === tid);
  if(!t){ showToast("Tratamento não encontrado.", "error"); return; }
  showModal(`<h3>Editar Tratamento</h3>
    <label>Título</label><input id="et_title" type="text" value="${escapeHtml(t.title)}">
    <label>Tópico</label><input id="et_topic" type="text" value="${escapeHtml(t.topic || '')}">
    <label>Descrição</label><textarea id="et_desc">${escapeHtml(t.description)}</textarea>
    <div style="display:flex;gap:8px;margin-top:8px"><button class="btn" onclick="saveEditTreatment('${pid}','${tid}')">Salvar</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>`);
}

function saveEditTreatment(pid, tid){
  const title = (document.getElementById('et_title').value || '').trim();
  const topic = (document.getElementById('et_topic').value || '').trim();
  const desc = (document.getElementById('et_desc').value || '').trim();
  if(!title || !desc){ showToast("Preencha título e descrição.", "warn"); return; }

  const users = getUsers(); const p = users.find(u => u.id === pid); const t = p.treatments.find(x => x.id === tid);
  t.title = title; t.topic = topic; t.description = desc;
  saveUsers(users); closeModal(); openPanel(getCurrent()); showToast("Tratamento atualizado.", "success");
}

/* Edit medication */
function openEditMedication(pid, tid, mid){
  const users = getUsers(); const p = users.find(u => u.id === pid); const t = p.treatments.find(x => x.id === tid); const m = t.medications.find(x => x.id === mid);
  if(!m){ showToast("Medicamento não encontrado.", "error"); return; }
  showModal(`<h3>Editar Medicamento</h3>
    <label>Nome</label><input id="em_name" type="text" value="${escapeHtml(m.name)}">
    <label>Instruções</label><input id="em_instr" type="text" value="${escapeHtml(m.instructions)}">
    <label>Duração</label><input id="em_duration" type="text" value="${escapeHtml(m.duration || '')}">
    <div style="display:flex;gap:8px;margin-top:8px"><button class="btn" onclick="saveEditMedication('${pid}','${tid}','${mid}')">Salvar</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>`);
}

function saveEditMedication(pid, tid, mid){
  const name = (document.getElementById('em_name').value || '').trim();
  const instr = (document.getElementById('em_instr').value || '').trim();
  const dur = (document.getElementById('em_duration').value || '').trim();
  if(!name){ showToast("Nome obrigatório.", "warn"); return; }

  const users = getUsers(); const p = users.find(u => u.id === pid); const t = p.treatments.find(x => x.id === tid);
  const m = t.medications.find(x => x.id === mid);
  m.name = name; m.instructions = instr; m.duration = dur;
  saveUsers(users); closeModal(); openPanel(getCurrent()); showToast("Medicamento atualizado.", "success");
}

function deleteMedication(pid, tid, mid){
  if(!confirm("Excluir medicamento?")) return;
  const users = getUsers(); const p = users.find(u => u.id === pid); const t = p.treatments.find(x => x.id === tid);
  t.medications = t.medications.filter(x => x.id !== mid); saveUsers(users); openPanel(getCurrent()); showToast("Medicamento excluído.", "success");
}

/* Export / Import backup */
function exportData(){
  const data = { exportedAt: new Date().toISOString(), users: getUsers() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'prontuario_backup.json'; a.click(); URL.revokeObjectURL(a.href);
  showToast("Backup exportado.", "success");
}
function importData(){
  const inp = document.createElement('input'); inp.type='file'; inp.accept='application/json';
  inp.onchange = e => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload = ev => {
      try{
        const parsed = JSON.parse(ev.target.result);
        if(!parsed.users) throw new Error('Formato inválido');
        const existing = getUsers(); const merged = [...existing];
        parsed.users.forEach(u => { if(!merged.find(x => x.email === u.email)) merged.push(u); });
        saveUsers(merged); showToast("Importação concluída.", "success");
        if(getCurrent()){ const cur = getUsers().find(x => x.email === getCurrent().email); if(cur){ setCurrent(cur); openPanel(cur); } }
      }catch(err){ showToast("Erro: " + err.message, "error"); }
    }; r.readAsText(f);
  };
  inp.click();
}

/* Escape helper for safety */
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"'`]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'})[m]); }

/* Quick alias to keep previous naming consistent */
function escape(s){ return escapeHtml(s); }

/* Overlay close on click outside */
overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });

/* On load restore session */
window.addEventListener('load', ()=>{
  const cur = getCurrent();
  if(cur) openPanel(cur);
});
