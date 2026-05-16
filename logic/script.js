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


async function loadContent(id) {
  const viewport = document.getElementById('content-viewport');
  const btn = document.getElementById('voidbutton');
  
  // 1. Tenta buscar no objeto 'artigos' (dados.js)
  let post = artigos[id];

  if (post) {
    // Se achou no dados.js, renderiza direto
    renderizar(post);
  } else {
    // 2. Se não achou, tenta buscar o arquivo externo na pasta /articles
    try {
      const response = await fetch(`articles/${id}.json`);
      
      if (!response.ok) throw new Error("Não encontrado");
      
      post = await response.json();
      renderizar(post);
    } catch (error) {
      // 3. SE AMBOS FALHAREM: Mostra a imagem de erro
      viewport.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
          <h2>Artigo não encontrado!</h2>
          <img src="imagens/lain404.png" alt="Erro 404" style="max-width: 100%; margin: 20px 0;">
          <p>O código "${id}" não corresponde a nenhum conteúdo disponível.</p>
        </div>
      `;
      viewport.style.display = 'block';
      viewport.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Função interna para evitar repetir código de estilo e HTML
  function renderizar(conteudo) {
    // Dicionário que traduz a sigla para o nome extenso explicativo
    const dicionarioCategorias = {
      'rev': 'Reverse Engineering',
      'pwn': 'Exploitation (Pwn)',
      'artf': 'Digital Forensics & Artifacts',
      'mal' : 'Malware Analysis',
      'sys': 'System Internals',
      'lab': 'Code Experiments',
      'tool': 'Utilitaries',
      'int': 'Introduction'
    };

    // Pega a sigla que veio do artigo (ex: "rev"), converte para minúsculo 
    // e busca no dicionário. Se não achar, usa a própria sigla como padrão.
    const sigla = conteudo.category.toLowerCase();
    const nomeCompleto = dicionarioCategorias[sigla] || sigla;
    
    const categoriaFormatada = `${nomeCompleto.toUpperCase()}//`;

    viewport.innerHTML = `
      <span class="categoria-topo">${categoriaFormatada}</span>
      <h2>${conteudo.title}</h2>
      <small>Publicado em: ${conteudo.date}</small>
      <div class="texto-artigo">
        ${conteudo.content}
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