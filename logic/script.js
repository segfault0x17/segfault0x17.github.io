import { artigos } from './dados.js';

const terminal = document.getElementById("terminal");
const text = "welcome to wired... loading fragments";

let motorDeEscrever;

// Coloca um texto inicial (com o cursor) para a div não ficar vazia
terminal.innerHTML = "<span class='cursor'>$</span>";

function type() {
  // Limpa qualquer digitação anterior
  clearInterval(motorDeEscrever);
  let i = 0;
  
  motorDeEscrever = setInterval(() => {
    // A cada passo, pegamos o texto até a letra atual e adicionamos o cursor no final
    if (i < text.length) {
      terminal.innerHTML = text.substring(0, i + 1) + "<span class='cursor'>_</span>";
      i++;
    } else { 
      // Quando termina, para o motor, mas deixa o texto com o cursor piscando
      clearInterval(motorDeEscrever);
      terminal.innerHTML = text + "<span class='cursor'>_</span>";
    }
  }, 50);
}

terminal.addEventListener("mouseenter", function() {
  type();
});

const text2 = "you are already inside[...]";
const voidtext = document.getElementById("middle-info");
let j = 0;

function type2() {
  if (j < text2.length) {
    voidtext.innerHTML += text2.charAt(j);
    j++;
    setTimeout(type2, 25);
  } else {
    voidtext.innerHTML += '<span class="cursor"></span>';
  }
}
type2();


function loadContent(id) {
  const viewport = document.getElementById('content-viewport');
  const btn = document.getElementById('voidbutton');
  const post = artigos[id];

  if (post) {
    viewport.innerHTML = `
      <h2>${post.title}</h2>
      <small>Publicado em: ${post.date}</small>
      <div class="texto-artigo">
        ${post.content}
      </div>
    `;
    btn.style.display = 'block';
  }
}

// Torna a função global para o 'onclick' do HTML funcionar com módulos
window.loadContent = loadContent;


function backButton() {
  document.getElementById('content-viewport').innerHTML = '';
  document.getElementById('voidbutton').style.display = 'none'; // Esconde ao voltar
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.backButton = backButton;