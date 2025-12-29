
/* ================================= */
/*            CONFIG SUPABASE        */
/* ================================= */
const SUPA_URL = "https://oafqjrzbkgvntwlekmlq.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZnFqcnpia2d2bnR3bGVrbWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQ0NzYsImV4cCI6MjA4MDkyMDQ3Nn0.OPw0x8cpTRgp4IoC42mpU9H1Ld9K2cXGjBAJffAVX3I";

const supabaseClient = window.supabase
    ? window.supabase.createClient(SUPA_URL, SUPA_KEY)
    : null;

if (!supabaseClient) {
    console.error("❌ Supabase SDK não carregado.");
} else {
    console.log("✅ Supabase conectado");
}



/* ================================= */
/*       FUNÇÃO PARA GERAR HASH      */
/* ================================= */
async function gerarHash(texto) {
    const msgUint8 = new TextEncoder().encode(texto);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ================================= */
/*           TROCAR TELAS            */
/* ================================= */
window.abrir = function(nome){
    document.querySelectorAll(".tela").forEach(t => t.style.display = "none");
    document.getElementById(nome).style.display = "block";
};

/* ================================= */
/*        STATUS: VIDA / DOR         */
/* ================================= */

const statusValores = {
  vidaAtual: 0,
  vidaMax: 0,
  dorAtual: 0,
  dorMax: 0
};

function montarStatus() {
  const area = document.getElementById("areaStatus");

  area.innerHTML = `
    <div class="linha">
      ❤️ Vida: <span id="vidaAtual">${statusValores.vidaAtual}</span>
      <button id="menosVida">-1</button>
      <button id="maisVida">+1</button>
    </div>

    <div class="linha">
      💢 Dor: <span id="dorAtual">${statusValores.dorAtual}</span>
      <button id="menosDor">-1</button>
      <button id="maisDor">+1</button>
    </div>
  `;

  // ➖ VIDA
  document.getElementById("menosVida").onclick = () => {
    statusValores.vidaAtual = Math.max(0, statusValores.vidaAtual - 1);
    aplicarDano();
    atualizarStatus();
  };

  // ➕ VIDA
  document.getElementById("maisVida").onclick = () => {
    statusValores.vidaAtual++;
    aplicarDano();
    atualizarStatus();
  };

  // ➖ DOR
  document.getElementById("menosDor").onclick = () => {
    statusValores.dorAtual--;
    aplicarDano();
    atualizarStatus();
  };

  // ➕ DOR
  document.getElementById("maisDor").onclick = () => {
    statusValores.dorAtual++;
    aplicarDano();
    atualizarStatus();
  };
}

function atualizarStatus() {
  document.getElementById("vidaAtual").textContent = statusValores.vidaAtual;
  document.getElementById("dorAtual").textContent = statusValores.dorAtual;
}

/* ================================= */
/*     NORMALIZAÇÃO VIDA / DOR       */
/* ================================= */

function aplicarDano() {
  let { vidaAtual, vidaMax, dorAtual, dorMax } = statusValores;

  // limites superiores
  if (vidaAtual > vidaMax) vidaAtual = vidaMax;
  if (dorAtual > dorMax) dorAtual = dorMax;

  // quebra de resistência
  if (dorAtual <= 0 && dorMax > 0) {
    dorAtual = dorMax;
    vidaAtual--;
  }

  // 🚫 vida nunca abaixo de 0
  if (vidaAtual < 0) vidaAtual = 0;

  statusValores.vidaAtual = vidaAtual;
  statusValores.dorAtual = dorAtual;

  const nomeInput = document.getElementById("nomePersonagem");
  const icone = document.getElementById("iconeMorte");

  if (vidaAtual === 0) {
    nomeInput.classList.add("personagem-caido");
    icone.style.display = "inline";
  } else {
    nomeInput.classList.remove("personagem-caido");
    icone.style.display = "none";
  }
}

/* ================================= */
/*        INICIALIZAÇÃO              */
/* ================================= */

function inicializarStatus(vida, dor) {
  statusValores.vidaMax = vida;
  statusValores.vidaAtual = vida;
  statusValores.dorMax = dor;
  statusValores.dorAtual = dor;
  montarStatus();
}

function reiniciarStatus() {
  const vida = Number(document.getElementById("vidaMaxInput").value);
  const dor = Number(document.getElementById("dorMaxInput").value);

  if (vida > 0 && dor > 0) {
    inicializarStatus(vida, dor);
  }
}

function normalizarId(texto){
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");
}

/* ================================= */
/*    SISTEMA – ANTECEDENTES / ATR   */
/* ================================= */
const antecedentes = ["atenção","medicina","montaria","negócios","roubo","suor","tradição","violência"];
const atributos = ["Físico","Velocidade","Intelecto","Coragem"];

const antecedenteValores = {};
const atributoValores = {};

antecedentes.forEach(a => antecedenteValores[a] = 0);
atributos.forEach(a => atributoValores[a] = 0);

function criarLinha(nome, tipo){
    const div = document.createElement("div");
    div.className = "counter-line";

    const id = (tipo === 'ante'
        ? 'ante_' + normalizarId(nome)
        : 'atrib_' + normalizarId(nome)
    );

    const valorAtual =
        tipo === "ante"
            ? antecedenteValores[nome]
            : atributoValores[nome];

    div.innerHTML = `
        <strong>${nome}</strong>
        <span>
            <button onclick="alterarValor('${nome}',-1,'${tipo}')">-</button>
            <span id="${id}">${valorAtual}</span>
            <button onclick="alterarValor('${nome}',1,'${tipo}')">+</button>
        </span>
    `;
    return div;
}


function alterarValor(nome, delta, tipo){
    if(tipo === "ante"){
        antecedenteValores[nome] = Math.max(0, antecedenteValores[nome] + delta);

        const el = document.getElementById(
            "ante_" + normalizarId(nome)
        );
        if(el) el.textContent = antecedenteValores[nome];

    } else {
        atributoValores[nome] = Math.max(0, atributoValores[nome] + delta);

        const el = document.getElementById(
            "atrib_" + normalizarId(nome)
        );
        if(el) el.textContent = atributoValores[nome];
    }
}


function montarCampos(){
    const A = document.getElementById("areaAntecedentes");
    const B = document.getElementById("areaAtributos");

    A.innerHTML = "";
    B.innerHTML = "";

    antecedentes.forEach(a => A.appendChild(criarLinha(a,"ante")));
    atributos.forEach(a => B.appendChild(criarLinha(a,"atrib")));
}

/* ================================= */
/*                XP                 */
/* ================================= */
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

acoes.forEach((acao,i)=>{
    const row=document.createElement("div");
    row.className="acao-item";
    row.innerHTML=`
      <div><strong>${acao.nome}</strong> (+${acao.xp} XP) — <span id="cx${i}">0</span>x</div>
      <button onclick="ganharXP(${i})">XP</button>
    `;
    listaAcoes.appendChild(row);
});

function ganharXP(i){
    const xpInput = document.getElementById("xp");
    xpInput.value = Number(xpInput.value) + acoes[i].xp;
    contadores[i]++;
    document.getElementById("cx"+i).textContent = contadores[i];
}

/* ================================= */
/*           HABILIDADES             */
/* ================================= */
function addHabilidade(){
    const n=document.getElementById("habilidadeNome").value.trim();
    const d=document.getElementById("habilidadeDesc").value.trim();
    if(!n) return;
    const li=document.createElement("li");
    li.dataset.nome = n;
    li.dataset.desc = d;
    li.innerHTML = `
    <strong>${n}</strong> — ${d}
    <button class="removerHabilidade">🗑️</button>
    `;
    li.querySelector(".removerHabilidade").onclick = () => {
    if(confirm(`Remover a habilidade "${n}"?`)) li.remove();
};

    document.getElementById("listaHabilidades").appendChild(li);
    document.getElementById("habilidadeNome").value="";
    document.getElementById("habilidadeDesc").value="";
}
function limparHabilidades(){ document.getElementById("listaHabilidades").innerHTML=""; }

/* ================================= */
/*               ARMAS               */
/* ================================= */
function addArma(){
    const n = document.getElementById("armaNome").value.trim();
    const d = Number(document.getElementById("armaDano").value);
    const tipo = document.getElementById("armaTipoDano").value;
    const m = Number(document.getElementById("armaMunicao").value);

    if(!n || isNaN(d) || isNaN(m)) return;

    const li = document.createElement("li");

    li.dataset.nome = n;
    li.dataset.dano = d;
    li.dataset.tipoDano = tipo;
    li.dataset.municaoAtual = m;
    li.dataset.municaoMax = m;

    li.innerHTML = `
      <strong>${n}</strong>
      — Dano: ${d} (${tipo})
      — Munição: <span class="municao">${m}</span>

      <button class="menosMunicao">-1</button>
      <button class="maisMunicao">+1</button>
      <button class="recarregar" style="display:none">Recarregar</button>
      <button class="removerArma">🗑️</button>
    `;

    li.querySelector(".menosMunicao").onclick = () => {
        let municao = Number(li.dataset.municaoAtual);
        if(municao <= 0) return;

        municao--;
        li.dataset.municaoAtual = municao;
        li.querySelector(".municao").textContent = municao;

        if(municao <= 0){
            li.querySelector(".menosMunicao").style.display = "none";
            li.querySelector(".recarregar").style.display = "inline";
        }
    };

    li.querySelector(".maisMunicao").onclick = () => {
        let municao = Number(li.dataset.municaoAtual);
        const max = Number(li.dataset.municaoMax);
        if(municao >= max) return;

        municao++;
        li.dataset.municaoAtual = municao;
        li.querySelector(".municao").textContent = municao;

        if(municao > 0){
            li.querySelector(".menosMunicao").style.display = "inline";
            li.querySelector(".recarregar").style.display = "none";
        }
    };

    li.querySelector(".recarregar").onclick = () => {
        const max = Number(li.dataset.municaoMax);
        li.dataset.municaoAtual = max;
        li.querySelector(".municao").textContent = max;
        li.querySelector(".menosMunicao").style.display = "inline";
        li.querySelector(".recarregar").style.display = "none";
    };

    li.querySelector(".removerArma").onclick = () => {
        if(confirm(`Remover a arma "${n}"?`)) li.remove();
    };

    document.getElementById("listaArmas").appendChild(li);

    document.getElementById("armaNome").value = "";
    document.getElementById("armaDano").value = "";
    document.getElementById("armaMunicao").value = "";
}

/* ================================= */
/*          ARMAS / TIRO             */
/* ================================= */

function atirar(liArma) {
    let municao = Number(liArma.dataset.municao || 0);
    const dano = Number(liArma.dataset.dano || 0);

    if (municao <= 0) {
        alert("🔫 Sem munição!");
        return;
    }

    municao--;
    liArma.dataset.municao = municao;

    liArma.innerHTML = `<strong>${liArma.dataset.nome}</strong> — Dano: ${dano}, Munição: ${municao}`;

    aplicarDano(dano);

    
}

/* ================================= */
/*           LIMPAR ARMAS            */
/* ================================= */
function limparArmas() {
    document.getElementById("listaArmas").innerHTML = "";
}

// ===============================
// MONTARIA
// ===============================

let montariaNivel = 1;

// NÍVEL (igual atributo)
function alterarNivelMontaria(valor) {
  montariaNivel += valor;
  if (montariaNivel < 1) montariaNivel = 1;
  document.getElementById("montariaNivel").textContent = montariaNivel;
}

// VIDA
document.getElementById("montariaVidaMax").onchange = () => {
  const vidaMax = Number(montariaVidaMax.value);
  montariaVidaAtual.value = vidaMax;
};

// DOR
document.getElementById("montariaDorMax").onchange = () => {
  montariaDorAtual.value = 0;
};

// SEGURANÇA (nunca passa do máximo)
document.getElementById("montariaVidaAtual").onchange = () => {
  if (Number(montariaVidaAtual.value) > Number(montariaVidaMax.value)) {
    montariaVidaAtual.value = montariaVidaMax.value;
  }
};

document.getElementById("montariaDorAtual").onchange = () => {
  if (Number(montariaDorAtual.value) > Number(montariaDorMax.value)) {
    montariaDorAtual.value = montariaDorMax.value;
  }
};


// ===============================
// INVENTÁRIO
// ===============================

// ---- PLAYER ----
let pesoAtual = 0;

// ---- CAVALO ----
let cavaloAtivo = false;
let pesoCavaloAtual = 0;
let pesoCavaloMax = 0;
let tipoCavaloAnterior = "";
let flagEnviarCavalo = false;

// UI
const statusCavalo = document.getElementById("statusCavalo");
const boxCavalo = document.getElementById("boxCavalo");
const selectTipoCavalo = document.getElementById("tipoCavalo");

// Toggle status cavalo
document.getElementById("btnCavaloStatus").onclick = () => {
  statusCavalo.style.display =
    statusCavalo.style.display === "none" ? "block" : "none";
};

// Flag envio cavalo
document.getElementById("flagCavalo").onclick = () => {
  flagEnviarCavalo = !flagEnviarCavalo;
  document.getElementById("flagCavalo").style.opacity =
    flagEnviarCavalo ? "1" : "0.4";
};

// TROCA TIPO CAVALO
selectTipoCavalo.onchange = () => {
  const novoMax = Number(selectTipoCavalo.value);

  if (!novoMax) {
    cavaloAtivo = false;
    pesoCavaloMax = 0;
    atualizarPesoCavalo();
    boxCavalo.style.display = "none";
    tipoCavaloAnterior = "";
    return;
  }

  // valida peso atual
  if (pesoCavaloAtual > novoMax) {
    alert("🐎 O peso atual do cavalo excede este tipo de montaria!");
    selectTipoCavalo.value = tipoCavaloAnterior;
    return;
  }

  cavaloAtivo = true;
  pesoCavaloMax = novoMax;
  tipoCavaloAnterior = selectTipoCavalo.value;

  atualizarPesoCavalo();
  boxCavalo.style.display = "block";
};

function atualizarPesoAtual() {
  document.getElementById("pesoAtual").value = pesoAtual;
}

function atualizarPesoCavalo() {
  document.getElementById("pesoCavaloAtual").textContent = pesoCavaloAtual;
  document.getElementById("pesoCavaloMax").textContent = pesoCavaloMax;
}

// LIMPAR
function limparInventario() {
  document.getElementById("listaInventario").innerHTML = "";
  document.getElementById("listaInventarioCavalo").innerHTML = "";

  pesoAtual = 0;
  pesoCavaloAtual = 0;

  atualizarPesoAtual();
  atualizarPesoCavalo();
}

// ADD ITEM
function addItem() {
  const nome = itemNome.value.trim();
  const descricao = itemDesc.value.trim();
  const peso = Number(itemPeso.value);
  const qtd = Number(itemQtd.value);
  const pesoMaxPlayer = Number(document.getElementById("pesoMax").value);

  if (!nome || peso < 0 || qtd <= 0) return;

  const pesoTotal = peso * qtd;

  // ---- CAVALO ----
  if (flagEnviarCavalo && cavaloAtivo) {
    if (pesoCavaloAtual + pesoTotal > pesoCavaloMax) {
      alert("🐎 Peso máximo do cavalo excedido!");
      return;
    }

    pesoCavaloAtual += pesoTotal;
    atualizarPesoCavalo();

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${nome}</strong> (${qtd}x)
      — Peso: ${pesoTotal}
      <br><em>${descricao}</em>
      <button>🗑️</button>
    `;

    li.querySelector("button").onclick = () => {
      pesoCavaloAtual -= pesoTotal;
      atualizarPesoCavalo();
      li.remove();
    };

    document.getElementById("listaInventarioCavalo").appendChild(li);
  }

  // ---- PLAYER ----
  else {
    if (pesoAtual + pesoTotal > pesoMaxPlayer) {
      alert("🚫 Peso máximo do personagem excedido!");
      return;
    }

    pesoAtual += pesoTotal;
    atualizarPesoAtual();

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${nome}</strong> (${qtd}x)
      — Peso: ${pesoTotal}
      <br><em>${descricao}</em>
      <button>🗑️</button>
    `;

    li.querySelector("button").onclick = () => {
      pesoAtual -= pesoTotal;
      atualizarPesoAtual();
      li.remove();
    };

    document.getElementById("listaInventario").appendChild(li);
  }

  // RESET
  itemNome.value = "";
  itemDesc.value = "";
  itemPeso.value = "";
  itemQtd.value = 1;
}


/* ================================= */
/*     SUPABASE: SALVAR / CARREGAR   */
/* ================================= */
async function salvarFicha(){
    if(!supabaseClient) return alert("Supabase não configurado.");

    const nome = document.getElementById("nomePersonagem").value.trim();
    if(!nome) return alert("Digite o nome do personagem.");

    const senha = prompt("Digite a senha da ficha:");
    if(!senha) return alert("Senha obrigatória!");

    const senhaHash = await gerarHash(senha);

    const habilidades = [...document.querySelectorAll("#listaHabilidades li")].map(li => ({
        nome: li.dataset.nome,
        desc: li.dataset.desc
    }));

    const armas = [...document.querySelectorAll("#listaArmas li")].map(li => ({
        nome: li.dataset.nome,
        dano: Number(li.dataset.dano),
        municao: Number(li.dataset.municao)
    }));
    
    const inventario = [...document.querySelectorAll("#listaInventario li")].map(li => ({
    nome: li.dataset.nome,
    descricao: li.dataset.descricao,
    peso: Number(li.dataset.peso),
    quantidade: Number(li.dataset.quantidade)
    }));

    const payload = {
    nome,
    habilidade: habilidades,
    arma: armas,
    inventario,

    peso_max: Number(document.getElementById("pesoMax").value),
    dinheiro: Number(document.getElementById("dinheiro").value) || 0,

    xp: Number(document.getElementById("xp").value),

    atributo: JSON.stringify(atributoValores),
    antecedente: JSON.stringify(antecedenteValores),

    vida: statusValores.vidaAtual,
    vida_max: statusValores.vidaMax,
    dor: statusValores.dorAtual,
    dor_max: statusValores.dorMax
};


    try {
        let query;

        // 🔁 SE JÁ EXISTE → UPDATE
        if(fichaAtualId){
            query = supabaseClient
                .from("fichas")
                .update(payload)
                .eq("id", fichaAtualId)
                .select();
        }
        // 🆕 SE NÃO EXISTE → INSERT
        else{
            payload.senha_hash = senhaHash;
            query = supabaseClient
                .from("fichas")
                .insert(payload)
                .select();
        }

        const { error } = await query;
        if(error) throw error;

        alert("✅ Ficha salva com sucesso!");
        listarFichas();

    } catch(err){
        alert("❌ Erro ao salvar: " + err.message);
        console.error(err);
    }
}


async function excluirFicha(id){
    if(!supabaseClient) return;
    const senha = prompt("Digite a senha para excluir esta ficha:");
    if(!senha) return alert("Senha obrigatória!");
    const senhaHash = await gerarHash(senha);

    try{
        const { data, error } = await supabaseClient
            .from("fichas")
            .select("senha_hash")
            .eq("id", id)
            .single();
        if(error) throw error;

        if(data.senha_hash !== senhaHash) return alert("❌ Senha incorreta!");

        const { error: delErr } = await supabaseClient
            .from("fichas")
            .delete()
            .eq("id", id);
        if(delErr) throw delErr;

        listarFichas();
    }catch(err){
        alert("Erro ao excluir: " + err.message);
    }
}

async function carregarFicha(id){
    if(!supabaseClient) return;

    const senha = prompt("Digite a senha da ficha:");
    if(!senha) return alert("Senha obrigatória.");

    const senhaHash = await gerarHash(senha);

    try{
        const { data, error } = await supabaseClient
            .from("fichas")
            .select("*")
            .eq("id", id)
            .single();

        if(error) throw error;

        if(data.senha_hash !== senhaHash){
            return alert("❌ Senha incorreta!");
        }

        // 🔐 marca que esta ficha já existe (ESSENCIAL)
        fichaAtualId = data.id;

       abrir("ficha");
       preencherFormularioComFicha(data);

    } catch(err){
        alert("Erro ao carregar ficha: " + err.message);
        console.error(err);
    }

}

function preencherFormularioComFicha(f){

    // ===============================
    // NOME / INVENTÁRIO / XP
    // ===============================
    document.getElementById("nomePersonagem").value = f.nome ?? "";
    document.getElementById("xp").value = f.xp ?? 0;
    document.getElementById("dinheiro").value = f.dinheiro ?? 0;


    // ===============================
    // ANTECEDENTES (JSON → OBJETO)
    // ===============================
    const antecedentesDB = typeof f.antecedente === "string"
        ? JSON.parse(f.antecedente)
        : f.antecedente || {};

    antecedentes.forEach(nome => {
        antecedenteValores[nome] = antecedentesDB[nome] ?? 0;
    });

    // ===============================
    // ATRIBUTOS (JSON → OBJETO)
    // ===============================
    const atributosDB = typeof f.atributo === "string"
        ? JSON.parse(f.atributo)
        : f.atributo || {};

    atributos.forEach(nome => {
        atributoValores[nome] = atributosDB[nome] ?? 0;
    });

    // ===============================
    // STATUS
    // ===============================
    statusValores.vidaMax   = f.vida_max;
    statusValores.dorMax    = f.dor_max;
    statusValores.vidaAtual = f.vida;
    statusValores.dorAtual  = f.dor;

    document.getElementById("vidaMaxInput").value = f.vida_max;
    document.getElementById("dorMaxInput").value  = f.dor_max;

    // ===============================
    // MONTA A UI COM VALORES CERTOS
    // ===============================
    montarCampos();
    montarStatus();
    aplicarDano();
    // ===============================
    // INVENTÁRIO
    // ===============================
    limparInventario();

    document.getElementById("pesoMax").value = f.peso_max ?? 10;

    if (Array.isArray(f.inventario)) {
        f.inventario.forEach(item => {
            const pesoTotal = item.peso * item.quantidade;
            pesoAtual += pesoTotal;

            const li = document.createElement("li");
            li.dataset.nome = item.nome;
            li.dataset.descricao = item.descricao;
            li.dataset.peso = item.peso;
            li.dataset.quantidade = item.quantidade;

            li.innerHTML = `
                <strong>${item.nome}</strong> (${item.quantidade}x)
                — Peso: ${pesoTotal}
                <br><em>${item.descricao}</em>
                <button class="removerItem">🗑️</button>
            `;

            li.querySelector(".removerItem").onclick = () => {
                pesoAtual -= item.peso * item.quantidade;
                atualizarPesoAtual();
                li.remove();
            };

            document.getElementById("listaInventario").appendChild(li);
        });
    }

    atualizarPesoAtual();

}


/* ================================= */
/*        GERENCIAMENTO              */
/* ================================= */

function adicionarPersonagem() {
    const nome = document.getElementById("nomeInput").value.trim();
    const vidaMax = parseInt(document.getElementById("vidaInput").value);
    const dorMax = parseInt(document.getElementById("dorInput").value);
    const balaMax = parseInt(document.getElementById("balasInput").value);
    const ini = parseInt(document.getElementById("iniInput").value);

    if (!nome || isNaN(vidaMax) || isNaN(dorMax) || isNaN(balaMax)) return;

    const div = document.createElement("div");
    div.className = "personagem";
    div.dataset.ini = ini;
    div.dataset.nome = nome;

    let vida = vidaMax;
    let dor = dorMax;
    let balas = balaMax;

    div.innerHTML = `
    <h3>🤠 ${nome}</h3>
    <div class="linha">⚡ Iniciativa: ${ini}</div>

    <div class="linha">
         Vida: <span class="vida">${vida}</span>
        <button class="menosVida">-1</button>
    </div>

    <div class="linha">
         Dor: <span class="dor">${dor}</span>
        <button class="menosDor">-1</button>
    </div>

    <div class="linha">
         Balas: <span class="balas">${balas}</span> / ${balaMax}
        <button class="menosBala">-1</button>
        <button class="recarregar" style="display:none">Recarregar</button>
    </div>

    <div class="linha">
        <button class="btn excluirPersonagem">❌ Excluir Personagem</button>
    </div>
`;

// 🔹 Adiciona o evento fora do template literal
div.querySelector(".excluirPersonagem").onclick = () => {
    div.remove(); // remove o personagem da lista
    atualizarListaIniciativa(); // atualiza a lista de iniciativa
};

    const vidaSpan = div.querySelector(".vida");
    const dorSpan = div.querySelector(".dor");
    const balaSpan = div.querySelector(".balas");

    div.querySelector(".menosVida").onclick = () => {
        vida = Math.max(0, vida - 1);
        vidaSpan.textContent = vida;
    };

    div.querySelector(".menosDor").onclick = () => {
        dor--;
        if (dor <= 0) {
            dor = dorMax;
            vida = Math.max(0, vida - 1);
            vidaSpan.textContent = vida;
        }
        dorSpan.textContent = dor;
    };

    div.querySelector(".menosBala").onclick = () => {
        balas--;
        if (balas <= 0) {
            balas = 0;
            div.querySelector(".menosBala").style.display = "none";
            div.querySelector(".recarregar").style.display = "inline";
        }
        balaSpan.textContent = balas;
    };

    div.querySelector(".recarregar").onclick = () => {
        balas = balaMax;
        balaSpan.textContent = balas;
        div.querySelector(".menosBala").style.display = "inline";
        div.querySelector(".recarregar").style.display = "none";
    };

    document.getElementById("lista").appendChild(div);
    atualizarListaIniciativa();

    nomeInput.value = vidaInput.value = dorInput.value = balasInput.value = iniInput.value = "";
}

function atualizarListaIniciativa() {
    const chars = [...document.querySelectorAll(".personagem")];
    chars.sort((a, b) => Number(b.dataset.ini) - Number(a.dataset.ini));

    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    chars.forEach(p => lista.appendChild(p));

    const painel = document.getElementById("painelIniciativas");
    painel.innerHTML = chars
        .map(p => `• ${p.dataset.nome} — ${p.dataset.ini}`)
        .join("<br>");
}

/* ================================= */
/*     SUPABASE: LISTAR FICHAS       */
/* ================================= */
async function listarFichas() {
    if(!supabaseClient) return;

    const lista = document.getElementById("listaFichas");
    lista.innerHTML = "Carregando...";

    try {
        const { data, error } = await supabaseClient
            .from("fichas")
            .select("*")
            .order("created_at", { ascending:false });
        if(error) throw error;

        lista.innerHTML = "";
        if(!data.length){
            lista.innerHTML = "<em>Nenhuma ficha.</em>";
            return;
        }

        data.forEach(f => {
            const div = document.createElement("div");
            div.className = "box";
            div.style.marginBottom = "8px";
            div.innerHTML = `
                <strong>${f.nome}</strong><br>
                XP: ${f.xp}<br>
                <button onclick="carregarFicha('${f.id}')">Carregar</button>
                <button onclick="excluirFicha('${f.id}')">Excluir</button>
            `;
            lista.appendChild(div);
        });
    } catch(err) {
        lista.innerHTML = "Erro: " + err.message;
        console.error(err);
    }
}


/* ================================= */
/*           NOVA FICHA              */
/* ================================= */
function novaFicha() { 
    fichaAtualId = null; // limpa referência
    document.getElementById("nomePersonagem").value = "";
    document.getElementById("xp").value = 0;
    document.getElementById("dinheiro").value = 0;

    // Limpar habilidades e armas
    limparHabilidades();
    limparArmas();
    limparInventario();
    document.getElementById("pesoMax").value = 10;


    // Resetar antecedentes e atributos
   Object.keys(antecedenteValores).forEach(k => {
    antecedenteValores[k] = 0;
    const el = document.getElementById("ante_" + normalizarId(k));
    if (el) el.textContent = 0;
    });


    Object.keys(atributoValores).forEach(k => {
    atributoValores[k] = 0;
    const el = document.getElementById("atrib_" + normalizarId(k));
    if (el) el.textContent = 0;
    });


    // Inicializar status com valores padrão
    inicializarStatus(10, 10);

    // Abrir tela da ficha
    abrir("ficha");
}
montarCampos();
// ============================
// FUNÇÃO PARA ABRIR FICHAS SALVAS
// ============================
function abrirFichas() {
    abrir("telaFichas"); // mostra a tela de fichas
    listarFichas();      // atualiza a lista
}


/* ================================= */
/* AUTO-LISTAR FICHAS AO ABRIR       */
/* ================================= */
document.addEventListener("DOMContentLoaded", () => {
    listarFichas();   
});
/* ================================= */
/*         EXPORTAR FUNÇÕES          */
/* ================================= */
window.salvarFicha   = salvarFicha;
window.carregarFicha = carregarFicha;
window.excluirFicha  = excluirFicha;
window.novaFicha     = novaFicha;
window.abrirFichas   = abrirFichas;
window.abrir         = abrir;




