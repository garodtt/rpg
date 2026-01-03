export function addArma(){
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

export function limparArmas() {
    document.getElementById("listaArmas").innerHTML = "";
}

export function aplicarEventosArma(li){
    const menos = li.querySelector(".menosMunicao");
    const mais = li.querySelector(".maisMunicao");
    const recarregar = li.querySelector(".recarregar");
    const remover = li.querySelector(".removerArma");
    const span = li.querySelector(".municao");

    menos.onclick = () => {
        let m = Number(li.dataset.municaoAtual);
        if(m <= 0) return;
        m--;
        li.dataset.municaoAtual = m;
        span.textContent = m;
        if(m <= 0){
            menos.style.display = "none";
            recarregar.style.display = "inline";
        }
    };

    mais.onclick = () => {
        let m = Number(li.dataset.municaoAtual);
        const max = Number(li.dataset.municaoMax);
        if(m >= max) return;
        m++;
        li.dataset.municaoAtual = m;
        span.textContent = m;
        menos.style.display = "inline";
        recarregar.style.display = "none";
    };

    recarregar.onclick = () => {
        const max = Number(li.dataset.municaoMax);
        li.dataset.municaoAtual = max;
        span.textContent = max;
        menos.style.display = "inline";
        recarregar.style.display = "none";
    };

    remover.onclick = () => {
        if(confirm(`Remover a arma "${li.dataset.nome}"?`)) li.remove();
    };
}