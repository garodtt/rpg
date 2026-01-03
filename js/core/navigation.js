export function abrir(nome) {
  document.querySelectorAll(".tela").forEach(t => t.style.display="none");
  document.getElementById(nome).style.display="block";
}