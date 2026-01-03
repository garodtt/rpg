export function adicionarPersonagem() {
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

export function atualizarListaIniciativa() {
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


