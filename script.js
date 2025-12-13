/* ================================= */
/*            CONFIG SUPABASE        */
/* ================================= */
const SUPA_URL = "https://oafqjrzbkgvntwlekmlq.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZnFqcnpia2d2bnR3bGVrbWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQ0NzYsImV4cCI6MjA4MDkyMDQ3Nn0.OPw0x8cpTRgp4IoC42mpU9H1Ld9K2cXGjBAJffAVX3I";

const supabase = window.supabase
    ? window.supabase.createClient(SUPA_URL, SUPA_KEY)
    : null;

if (!supabase) {
    console.error("❌ Supabase client não encontrado.");
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
function abrir(nome){
    document.querySelectorAll(".tela").forEach(t => t.style.display="none");
    document.getElementById(nome).style.display = "block";
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
    const id = (tipo === 'ante' ? 'ante_'+nome : 'atrib_'+nome).replace(/\s+/g,'_');
    div.innerHTML = `
        <strong>${nome}</strong>
        <span>
            <button onclick="alterarValor('${nome}',-1,'${tipo}')">-</button>
            <span id="${id}">0</span>
            <button onclick="alterarValor('${nome}',1,'${tipo}')">+</button>
        </span>
    `;
    return div;
}

function alterarValor(nome, delta, tipo){
    if(tipo === "ante"){
        antecedenteValores[nome] = Math.max(0, antecedenteValores[nome] + delta);
        document.getElementById("ante_"+nome.replace(/\s+/g,'_')).textContent = antecedenteValores[nome];
    } else {
        atributoValores[nome] = Math.max(0, atributoValores[nome] + delta);
        document.getElementById("atrib_"+nome.replace(/\s+/g,'_')).textContent = atributoValores[nome];
    }
}

function montarCampos(){
    const A = document.getElementById("areaAntecedentes");
    const B = document.getElementById("areaAtributos");
    antecedentes.forEach(a => A.appendChild(criarLinha(a,"ante")));
    atributos.forEach(a => B.appendChild(criarLinha(a,"atrib")));
}
montarCampos();

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
    li.innerHTML = `<strong>${n}</strong> — ${d}`;
    document.getElementById("listaHabilidades").appendChild(li);
    document.getElementById("habilidadeNome").value="";
    document.getElementById("habilidadeDesc").value="";
}
function limparHabilidades(){ document.getElementById("listaHabilidades").innerHTML=""; }

/* ================================= */
/*               ARMAS               */
/* ================================= */
function addArma(){
    const n=document.getElementById("armaNome").value.trim();
    const d=document.getElementById("armaDano").value.trim();
    const m=document.getElementById("armaMunicao").value.trim();
    if(!n) return;
    const li=document.createElement("li");
    li.dataset.nome = n;
    li.dataset.dano = d;
    li.dataset.municao = m;
    li.innerHTML = `<strong>${n}</strong> — Dano: ${d}, Munição: ${m}`;
    document.getElementById("listaArmas").appendChild(li);
    document.getElementById("armaNome").value="";
    document.getElementById("armaDano").value="";
    document.getElementById("armaMunicao").value="";
}
function limparArmas(){ document.getElementById("listaArmas").innerHTML=""; }

/* ================================= */
/*     SUPABASE: SALVAR / CARREGAR   */
/* ================================= */
async function salvarFicha(){
    if(!supabase) return alert("Supabase não configurado.");
    const nome = document.getElementById("nomePersonagem").value.trim();
    if(!nome) return alert("Digite o nome do personagem.");

    // Criar senha apenas aqui, discreto
    const senha = prompt("Crie uma senha para esta ficha (visível ao digitar):");
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

    const payload = {
        nome,
        habilidade: habilidades,
        arma: armas,
        inventario: document.getElementById("inventario").value.trim(),
        xp: Number(document.getElementById("xp").value),
        atributo: {...atributoValores},
        antecedente: {...antecedenteValores},
        senha_hash: senhaHash
    };

    try{
        const { data, error } = await supabase
            .from("fichas")
            .insert(payload)
            .select();
        if(error) throw error;
        alert("Ficha salva! ID: " + data[0].id);
        listarFichas();
    }catch(err){
        alert("Erro ao salvar: " + err.message);
    }
}

async function listarFichas(){
    if(!supabase) return;

    let area = document.getElementById("areaFichasList");
    if(!area){
        area = document.createElement("div");
        area.id = "areaFichasList";
        area.className = "box";
        area.innerHTML = `<h2>Fichas Salvas</h2><div id="listaFichas"></div>`;
        document.getElementById("ficha").appendChild(area);
    }

    const lista = document.getElementById("listaFichas");
    lista.innerHTML = "Carregando...";

    try{
        const { data, error } = await supabase
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
    }catch(err){
        lista.innerHTML = "Erro: " + err.message;
    }
}

async function excluirFicha(id){
    if(!supabase) return;
    const senha = prompt("Digite a senha para excluir esta ficha:");
    if(!senha) return alert("Senha obrigatória!");
    const senhaHash = await gerarHash(senha);

    try{
        const { data, error } = await supabase
            .from("fichas")
            .select("senha_hash")
            .eq("id", id)
            .single();
        if(error) throw error;

        if(data.senha_hash !== senhaHash) return alert("❌ Senha incorreta!");

        const { error: delErr } = await supabase
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
    if(!supabase) return;
    const senha = prompt("Digite a senha da ficha:");
    if(!senha) return alert("Senha obrigatória.");
    const senhaHash = await gerarHash(senha);

    try{
        const { data, error } = await supabase
            .from("fichas")
            .select("*")
            .eq("id", id)
            .single();
        if(error) throw error;

        if(data.senha_hash !== senhaHash) return alert("❌ Senha incorreta!");
        preencherFormularioComFicha(data);
        abrir("ficha");
    }catch(err){
        alert("Erro ao carregar: " + err.message);
    }
}

function preencherFormularioComFicha(f){
    limparHabilidades();
    limparArmas();
    document.getElementById("nomePersonagem").value = f.nome;
    document.getElementById("inventario").value = f.inventario || "";
    document.getElementById("xp").value = f.xp || 0;

    (Array.isArray(f.habilidade) ? f.habilidade : []).forEach(h => {
        const li = document.createElement("li");
        li.dataset.nome = h.nome;
        li.dataset.desc = h.desc;
        li.innerHTML = `<strong>${h.nome}</strong> — ${h.desc}`;
        document.getElementById("listaHabilidades").appendChild(li);
    });

    (Array.isArray(f.arma) ? f.arma : []).forEach(a => {
        const li = document.createElement("li");
        li.dataset.nome = a.nome;
        li.dataset.dano = a.dano;
        li.dataset.municao = a.municao;
        li.innerHTML = `<strong>${a.nome}</strong> — Dano: ${a.dano}, Munição: ${a.municao}`;
        document.getElementById("listaArmas").appendChild(li);
    });

    Object.keys(antecedenteValores).forEach(k => {
        const val = f.antecedente?.[k] ?? 0;
        antecedenteValores[k] = val;
        document.getElementById("ante_"+k.replace(/\s+/g,'_')).textContent = val;
    });

    Object.keys(atributoValores).forEach(k => {
        const val = f.atributo?.[k] ?? 0;
        atributoValores[k] = val;
        document.getElementById("atrib_"+k.replace(/\s+/g,'_')).textContent = val;
    });
}

/* AUTO-LISTAR */
listarFichas();
