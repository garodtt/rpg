/* ============================= */
/*   CONFIG SUPABASE (INSERIDO)  */
/* ============================= */
const SUPA_URL = "https://oafqjrzbkgvntwlekmlq.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZnFqcnpia2d2bnR3bGVrbWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQ0NzYsImV4cCI6MjA4MDkyMDQ3Nn0.OPw0x8cpTRgp4IoC42mpU9H1Ld9K2cXGjBAJffAVX3";

// Supabase v2 client (global createClient available when including the CDN script)
const supabase = typeof createClient === 'function' ? createClient(SUPA_URL, SUPA_KEY) : null;
if(!supabase) console.warn('Supabase client not found. Verifique se o script do SDK está incluído.');

/* ============================= */
/*        TROCAR DE TELA        */
/* ============================= */
function abrir(nome){
    document.querySelectorAll(".tela").forEach(t => t.style.display="none");
    document.getElementById(nome).style.display = "block";
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

    // IDs must be valid without spaces
    const id = (tipo==='ante' ? 'ante_'+nome : 'atrib_'+nome).replace(/\s+/g,'_');

    div.innerHTML = `\n      <strong>${nome}</strong>\n      <span>\n        <button onclick="alterarValor('${nome}',-1,'${tipo}')">-</button>\n        <span id="${id}">0</span>\n        <button onclick="alterarValor('${nome}',1,'${tipo}')">+</button>\n      </span>\n    `;
    return div;
}

function alterarValor(nome,delta,tipo){
    if(tipo==="ante"){
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

/* XP */
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


/* Habilidades */
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

/* Armas */
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
    document.getElementById("armaNome").value = document.getElementById("armaDano").value = document.getElementById("armaMunicao").value = "";
}
function limparArmas(){ document.getElementById("listaArmas").innerHTML=""; }

/* ===================================== */
/*     GERENCIAMENTO V1 ORIGINAL         */
/* ===================================== */
function adicionarPersonagem() {
    const nome = nomeInput.value;
    const vidaMax = parseInt(vidaInput.value);
    const dorMax = parseInt(dorInput.value);
    const balaMax = parseInt(balasInput.value);
    const ini = parseInt(iniInput.value);

    if (!nome || !vidaMax || !dorMax || !balaMax) return;

    const div = document.createElement("div");
    div.className = "personagem";
    div.dataset.ini = ini;
    div.dataset.nome = nome;

    let vida = vidaMax;
    let dor = dorMax;
    let balas = balaMax;

    div.innerHTML = `
        <h2>🤠 ${nome}</h2>
        <div class="linha">Iniciativa: ${ini}</div>

        <div class="linha">Vida: <span class="vida">${vida}</span> <button class="menosVida">-1</button></div>
        <div class="linha">Dor: <span class="dor">${dor}</span> <button class="menosDor">-1</button></div>
        <div class="linha">Balas: <span class="balas">${balas}</span> / ${balaMax}
          <button class="menosBala">-1</button>
          <button class="recarregar" style="display:none;">Recarregar</button>
        </div>
    `;

    const vidaSpan = div.querySelector('.vida');
    const dorSpan = div.querySelector('.dor');
    const balaSpan = div.querySelector('.balas');
    const btnVida = div.querySelector('.menosVida');
    const btnDor = div.querySelector('.menosDor');
    const btnBala = div.querySelector('.menosBala');
    const btnRecarregar = div.querySelector('.recarregar');

    btnVida.onclick = () => { vida = Math.max(0, vida - 1); vidaSpan.textContent = vida; };
    btnDor.onclick = () => {
        dor--;
        if(dor<=0){ dor=dorMax; vida=Math.max(0,vida-1); vidaSpan.textContent=vida; }
        dorSpan.textContent=dor;
    };
    btnBala.onclick = () => {
        balas--;
        if(balas<=0){ balas=0; btnBala.style.display='none'; btnRecarregar.style.display='inline'; }
        balaSpan.textContent = balas;
    };
    btnRecarregar.onclick = () => {
        balas = balaMax;
        balaSpan.textContent = balas;
        btnBala.style.display='inline';
        btnRecarregar.style.display='none';
    };

    lista.appendChild(div);
    atualizarListaIniciativa();

    nomeInput.value = vidaInput.value = dorInput.value = balasInput.value = iniInput.value = "";
}

function atualizarListaIniciativa(){
    const chars=[...document.querySelectorAll('.personagem')];
    chars.sort((a,b)=> parseInt(b.dataset.ini) - parseInt(a.dataset.ini));

    lista.innerHTML="";
    chars.forEach(c => lista.appendChild(c));

    painelIniciativas.innerHTML = chars.map(c => `• ${c.dataset.nome} — ${c.dataset.ini}`).join("<br>");
}

/* ============================= */
/*   SUPABASE: SALVAR / LISTAR   */
/* ============================= */

async function salvarFicha(){
    if(!supabase) return alert('Supabase não configurado corretamente.');

    const nome = document.getElementById('nomePersonagem').value.trim();
    if(!nome) return alert('Digite o nome do personagem.');

    // pegar habilidades
    const habilidades = [...document.querySelectorAll('#listaHabilidades li')].map(li=>({nome: li.dataset.nome||li.innerText, desc: li.dataset.desc||''}));
    const armas = [...document.querySelectorAll('#listaArmas li')].map(li=>({nome: li.dataset.nome||li.innerText, dano: Number(li.dataset.dano)||0, municao: Number(li.dataset.municao)||0}));
    const inventario = document.getElementById('inventario').value.trim();
    const xp = Number(document.getElementById('xp').value) || 0;

    // copiar objetos de antecedentes e atributos
    const antecedentesObj = {...antecedenteValores};
    const atributosObj = {...atributoValores};

    const payload = {
        nome,
        habilidade: habilidades,   // envia como JSON (requer coluna jsonb na tabela)
        arma: armas,
        inventario,
        xp,
        atributo: atributosObj,
        antecedente: antecedentesObj
    };

    try{
        const { data, error } = await supabase.from('fichas').insert(payload).select();
        if(error) throw error;
        alert('Ficha salva com sucesso! ID: ' + (data && data[0] && data[0].id ? data[0].id : 'desconhecido'));
        listarFichas();
    }catch(err){
        console.error(err);
        alert('Erro ao salvar: ' + (err.message||err));
    }
}

async function listarFichas(){
    if(!supabase) return;
    // tenta criar a área de listagem se não existir
    let area = document.getElementById('areaFichasList');
    if(!area){
        area = document.createElement('div');
        area.id = 'areaFichasList';
        area.className = 'box';
        area.innerHTML = '<h2>Fichas Salvas</h2><div id="listaFichas"></div>';
        document.getElementById('ficha').appendChild(area);
    }

    const lista = document.getElementById('listaFichas');
    lista.innerHTML = 'Carregando...';

    try{
        const { data, error } = await supabase.from('fichas').select('*').order('created_at', { ascending:false }).limit(100);
        if(error) throw error;
        if(!data || data.length===0){ lista.innerHTML = '<em>Nenhuma ficha encontrada</em>'; return; }

        lista.innerHTML = '';
        data.forEach(f => {
            const div = document.createElement('div');
            div.className = 'box';
            div.style.marginBottom = '8px';
            const nome = f.nome || '---';
            const id = f.id;
            const xp = f.xp || 0;
            const created = f.created_at ? new Date(f.created_at).toLocaleString() : '';

            div.innerHTML = `<strong>${nome}</strong> <br>XP: ${xp} — ${created}<br>
                <button onclick="carregarFicha('${id}')">Carregar</button>
                <button onclick="excluirFicha('${id}')">Excluir</button>
                <pre style=\"white-space:pre-wrap;max-height:120px;overflow:auto;\">${JSON.stringify({habilidade:f.habilidade, arma:f.arma, antecedente:f.antecedente, atributo:f.atributo, inventario:f.inventario}, null, 2)}</pre>`;
            lista.appendChild(div);
        });
    }catch(err){
        console.error(err);
        lista.innerHTML = 'Erro ao listar: ' + (err.message||err);
    }
}

async function excluirFicha(id){
    if(!supabase) return;
    if(!confirm('Excluir ficha ' + id + '?')) return;
    try{
        const { error } = await supabase.from('fichas').delete().eq('id', id);
        if(error) throw error;
        alert('Ficha excluída.');
        listarFichas();
    }catch(err){
        console.error(err);
        alert('Erro ao excluir: ' + (err.message||err));
    }
}

async function carregarFicha(id){
    if(!supabase) return;
    try{
        const { data, error } = await supabase.from('fichas').select('*').eq('id', id).limit(1).single();
        if(error) throw error;
        preencherFormularioComFicha(data);
        abrir('ficha');
        window.scrollTo(0,0);
    }catch(err){
        console.error(err);
        alert('Erro ao carregar ficha: ' + (err.message||err));
    }
}

function preencherFormularioComFicha(f){
    // limpar form atual
    limparHabilidades();
    limparArmas();
    // nome
    document.getElementById('nomePersonagem').value = f.nome || '';
    document.getElementById('inventario').value = f.inventario || '';
    document.getElementById('xp').value = f.xp || 0;

    // habilidades (assume array)
    if(Array.isArray(f.habilidade)){
        f.habilidade.forEach(h => {
            const li = document.createElement('li');
            li.dataset.nome = h.nome || '';
            li.dataset.desc = h.desc || h.descricao || '';
            li.innerHTML = `<strong>${h.nome||''}</strong> — ${h.desc||h.descricao||''}`;
            document.getElementById('listaHabilidades').appendChild(li);
        });
    }

    // armas
    if(Array.isArray(f.arma)){
        f.arma.forEach(a => {
            const li = document.createElement('li');
            li.dataset.nome = a.nome || '';
            li.dataset.dano = a.dano || a.dano || 0;
            li.dataset.municao = a.municao || a.municao || 0;
            li.innerHTML = `<strong>${a.nome||''}</strong> — Dano: ${a.dano||0}, Munição: ${a.municao||0}`;
            document.getElementById('listaArmas').appendChild(li);
        });
    }

    // antecedentes e atributos — atualiza os contadores
    Object.keys(antecedenteValores).forEach(k => {
        const val = (f.antecedente && f.antecedente[k]) ? Number(f.antecedente[k]) : 0;
        antecedenteValores[k] = val;
        const el = document.getElementById('ante_'+k.replace(/\s+/g,'_'));
        if(el) el.textContent = val;
    });
    Object.keys(atributoValores).forEach(k => {
        const val = (f.atributo && f.atributo[k]) ? Number(f.atributo[k]) : 0;
        atributoValores[k] = val;
        const el = document.getElementById('atrib_'+k.replace(/\s+/g,'_'));
        if(el) el.textContent = val;
    });
}

// carregar lista assim que o script for executado (se quiser automático)
// comentar se não desejar carregamento automático
listarFichas();
