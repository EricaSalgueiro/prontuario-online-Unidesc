/* =====================
   UTILITÁRIOS / STORAGE
   ===================== */
const KEY_USERS = "po_users_v3";
const KEY_CURRENT = "po_current_v3";

function genId(){ return 'id_' + Math.random().toString(36).slice(2, 9); }
function now(){ return new Date().toISOString(); }

function getUsers(){ return JSON.parse(localStorage.getItem(KEY_USERS) || "[]"); }
function saveUsers(users){ localStorage.setItem(KEY_USERS, JSON.stringify(users)); }
function getCurrent(){ return JSON.parse(localStorage.getItem(KEY_CURRENT) || "null"); }
function setCurrent(u){ localStorage.setItem(KEY_CURRENT, JSON.stringify(u)); }
function clearCurrent(){ localStorage.removeItem(KEY_CURRENT); }

/* =====================
   ELEMENTOS DA INTERFACE
   ===================== */
const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");

const btnToRegister = document.getElementById("btnToRegister");
const btnToLogin = document.getElementById("btnToLogin");
const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");

const authCard = document.querySelector(".auth-card");
const panel = document.getElementById("panel");
const panelTitle = document.getElementById("panelTitle");
const panelBody = document.getElementById("panelBody");

const userNameEl = document.getElementById("userName");
const userEmailEl = document.getElementById("userEmail");
const btnLogout = document.getElementById("btnLogout");

const fabAdd = document.getElementById("fabAdd");
const overlay = document.getElementById("overlay");
const modalContent = document.getElementById("modalContent");

/* =====================
   TROCAR TELA LOGIN/REGISTRO
   ===================== */
btnToRegister.onclick = () => {
    loginView.style.display = "none";
    registerView.style.display = "block";
};

btnToLogin.onclick = () => {
    registerView.style.display = "none";
    loginView.style.display = "block";
};

/* =====================
   REGISTRO
   ===================== */
btnRegister.onclick = () => {
    const name = regName.value.trim();
    const email = regEmail.value.trim().toLowerCase();
    const pass = regPass.value;
    const type = regType.value;

    if (!name || !email || !pass || !type) {
        alert("Preencha todos os campos!");
        return;
    }

    let users = getUsers();
    if (users.some(u => u.email === email)) {
        alert("Este e-mail já está cadastrado!");
        return;
    }

    users.push({
        id: genId(),
        name,
        email,
        password: pass,
        type,
        patients: [],
        
        /* Novo modelo para médico */
        treatments: [],

        /* Novo modelo para paciente */
        treatmentHistory: []
    });

    saveUsers(users);

    alert("Conta criada! Faça login.");
    btnToLogin.click();
};

/* =====================
   LOGIN
   ===================== */
btnLogin.onclick = () => {
    const email = loginEmail.value.toLowerCase().trim();
    const pass = loginPass.value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === pass);

    if (!user) {
        alert("Credenciais inválidas!");
        return;
    }

    setCurrent(user);
    showPanel(user);
};

/* =====================
   MOSTRAR PAINEL
   ===================== */
function showPanel(user){
    authCard.style.display = "none";
    panel.style.display = "block";

    userNameEl.textContent = user.name;
    userEmailEl.textContent = user.email;

    if (user.type === "medico") {
        panelTitle.textContent = "Painel do Médico";
        fabAdd.style.display = "block";
        renderDoctor(user);
        fabAdd.onclick = openAddPatientModal;
    } 
    else {
        panelTitle.textContent = "Meus Tratamentos";
        fabAdd.style.display = "none";
        renderPatient(user);
    }
}

btnLogout.onclick = () => {
    clearCurrent();
    location.reload();
};

