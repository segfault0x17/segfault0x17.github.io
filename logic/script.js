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

    viewport.style.background = 'black';
    viewport.style.display = 'block';
    viewport.scrollIntoView({ behavior: 'smooth' });
    btn.style.display = 'block';
  }

}

function handleRouting(){
  const articleId = window.location.hash.slice(1) || 'fragment_000';

  if(articleId){
    loadContent(articleId);
  }
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);

function backButton() {
  
  const viewport = document.getElementById('content-viewport');
  
  viewport.innerHTML = '';
  
  // REMOVE O FUNDO PRETO (torna transparente para ver o wrapper)
  viewport.style.backgroundColor = 'transparent';
  viewport.style.display = 'none'; // Esconde a área para não bloquear cliques no wrapper
  
  document.getElementById('voidbutton').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.history.pushState("", document.title, window.location.pathname); // limpa o # da url clicar em /void
}

const voidtext = document.getElementById("middle-info");
let j = 0;

function type2() {
  const text2 = "you are already inside[...]";
  if (j < text2.length) {
    voidtext.innerHTML += text2.charAt(j);
    j++;
    setTimeout(type2, 25);
  } else {
    voidtext.innerHTML += '<span class="cursor"></span>';
  }

}
type2();



// Torna a função global para o 'onclick' do HTML funcionar com módulos
window.loadContent = loadContent;
window.backButton = backButton;