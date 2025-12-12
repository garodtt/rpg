/* ============================= */
/*   CONFIG SUPABASE (INSERIDO)  */
/* ============================= */
const SUPA_URL = "https://oafqjrzbkgvntwlekmlq.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZnFqcnpia2d2bnR3bGVrbWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQ0NzYsImV4cCI6MjA4MDkyMDQ3Nn0.OPw0x8cpTRgp4IoC42mpU9H1Ld9K2cXGjBAJffAVX3";
const supabase = supabase.createClient(SUPA_URL, SUPA_KEY);

/* ============================= */
/*        TROCAR DE TELA        */
/* ============================= */
function abrir(nome){
    document.querySelectorAll(".tela").forEach(t => t.style.display="none");
    document.getElementById(nome).style.display = "block";
    if(nome === 'fichasSalvas') carregarFichas();
}

/* ============================= */
/*   FICHA – ANTECEDENTES ETC   */
/* ============================= */
const antecedentes = ["atenção","medicina","montaria","negócios","roubo","suor","tradição","violência"];
const atributos = ["Físico","Velocidade","Intelecto","Coragem"];
const antecedenteValores = {};
const atributoValores = {};
antecedentes.forEach(a=> antecedenteValores[a] = 0);
atributos.forEach(a=> atributoValores[a] = 0);

function criarLinha(nome, tipo){
    const div = document.createElement("div");
    div.className = "counter-line";
    div.innerHTML = `
      <strong>${nome}</strong>
      <span>
        <button onclick="alterarValor('${nome}',-1,'${tipo}')">-</button>
        <span id="${tipo}_${nome}">0</span>
        <button onclick="alterarValor('${nome}',1,'${tipo}')">+</button>
      </span>
    `;
    return div;
}

function alterarValor(nome,delta,tipo){
    if(tipo==="ante"){
        antecedenteValores[nome] = Math.max(0, antecedenteValores[nome] + delta);
        document.getElementById("ante_"+nome).textContent = antecedenteValores[nome];
    } else {
        atributoValores[nome] = Math.max(0, atributoValores[nome] + delta);
        document.getElementById("atrib_"+nome).textContent = atributoValores[nome];
    }
}

function montarCampos(){
    const A = document.getElementById("areaAntecedentes");
    const B = document.getElementById("areaAtributos");
    antecedentes.forEach(a => A.appendChild(criarLinha(a,"ante")));
    atributos.forEach(a => B.appendChild(criarLinha(a,"atrib")));
}
montarCampos();

/* ============================= */
/*           XP / AÇÕES          */
/* ============================= */
const acoes = [
  {nome: "Montar acampamento corretamente", xp: 2},
  {nome: "Melhorar o nível da base", xp: 5},
  {nome: "Administrar recursos", xp: 4},
  {nome: "Superar evento noturno no acampamento", xp: 6},
  {nome: "Mapear uma área nova", xp: 6},
  {nome: "Descobrir algo oculto", xp: 10},
  {nome: "Decifrar documentos, bilhetes, mapas ou registros", xp: 8},
  {nome: "Sobreviver a um combate significativo", xp: 15},
  {nome: "Confrontar inimigo mais forte", xp: 20},
  {nome: "Evitar combate com boa estratégia", xp: 12},
  {nome: "Desenvolver o próprio antecedente na história", xp: 15},
  {nome: "Fazer uma conexão forte com um NPC", xp: 10},
  {nome: "Usar habilidades de forma criativa", xp: 8},
  {nome: "Resolver um grande problema da sessão", xp: 30},
  {nome: "Completar um arco curto de missão", xp: 40},
  {nome: "Desvendar um puzzle importante", xp: 15},
  {nome: "Descobrir pista relevante da história", xp: 12},
  {nome: "Tomar decisões difíceis que afetam a trama", xp: 20}
];

const contadores = Array(acoes.length).fill(0);
const listaAcoes = document.getElementById("listaAcoes");

function renderAcoes(){
  listaAcoes.innerHTML = "";
  acoes.forEach((acao,i)=>{
      const row=document.createElement("div");
      row.className="acao-item";
      row.innerHTML=`<div><strong>${acao.nome}</strong> (+${acao.xp} XP) — <span id="cx${i}">0</span>x</div><button onclick="ganharXP(${i})">XP</button>`;
      listaAcoes.appendChild(row);
  });
}
renderAcoes();

function ganharXP(i){
    const xpField = document.getElementById("xp");
    xpField.value = Number(xpField.value || 0) + acoes[i].xp;
    contadores[i]++;
    document.getElementById("cx"+i).textContent = contadores[i];
}

/* Habilidades e Armas */
function addHabilidade(){
    const n=document.getElementById("habilidadeNome").value.trim();
    const d=document.getElementById("habilidadeDesc").value.trim();
    if(!n) return;
    const li=document.createElement("li");
    li.innerHTML = `<strong>${n}</strong> — ${d}`;
    document.getElementById("listaHabilidades").appendChild(li);
    document.getElementById("habilidadeNome").value="";
    document.getElementById("habilidadeDesc").value="";
}
function limparHabilidades(){ document.getElementById("listaHabilidades").innerHTML=""; }

function addArma(){
    const n=document.getElementById("armaNome").value.trim();
    const d=document.getElementById("armaDano").value.trim();
    const m=document.getElementById("armaMunicao").value.trim();
    if(!n) return;
    const li=document.createElement("li");
    li.innerHTML = `<strong>${n}</strong> — Dano: ${d}, Munição: ${m}`;
    document.getElementById("listaArmas").appendChild(li);
    document.getElementById("armaNome").value="";
    document.getElementById("armaDano").value="";
    document.getElementById("armaMunicao").value="";
}
function limparArmas(){ document.getElementById("listaArmas").innerHTML=""; }

/* Limpar ficha */
function limparFicha(){
  document.getElementById("nomePersonagem").value = "";
  document.getElementById("inventario").value = "";
  document.getElementById("xp").value = 0;
  limparHabilidades();
  limparArmas();
  antecedentes.forEach(a => { antecedenteValores[a] = 0; document.getElementById("ante_"+a).textContent = 0; });
  atributos.forEach(a => { atributoValores[a] = 0; document.getElementById("atrib_"+a).textContent = 0; });
  for(let i=0;i<contadores.length;i++){ contadores[i]=0; const el = document.getElementById("cx"+i); if(el) el.textContent = 0; }
  editingId = null;
}

/* ===================================== */
/* GERENCIAMENTO V1 ORIGINAL (manter funções como estava) */
/* ===================================== */
/* ... restante do código de gerenciamento e supabase permanece idêntico ao original ... */
