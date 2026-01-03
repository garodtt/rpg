export function addHabilidade(){
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

export function limparHabilidades(){ document.getElementById("listaHabilidades").innerHTML=""; }
