export const artigos = {
  "fragment_000": {
    title: "Introdução",
    date: "25-04-2026",
    content: `
Nesse espaço irei usar para postar conteúdos mais completos que ficaria extenso para o instagram.
Então fiquem ligados que mais coisas legais virão. Meu foco será binary exploitation, reverse engineering e forensics.
    `
  },
  "fragment_002": {
    title: "XOR por baixo dos panos: o que o debugger revela",
    date: "27-04-2026",
    content: `
Ofuscação XOR

1: Introdução
2: A Ofuscação
3: Observando no Assembly
4: O Valor Invisível
5: Onde ele aparece de verdade
6: O que isso realmente significa
7: Final


--[ 1.0 Introdução

XOR (exclusive OR) é uma operação bit a bit entre dois operandos.
O resultado é 1 quando os bits são diferentes e 0 quando são iguais:

0 ^ 0 = 0  
0 ^ 1 = 1  
1 ^ 0 = 1  
1 ^ 1 = 0  


Simples. Direto. Sem firula.

Mas tem uma propriedade que torna isso interessante:

A ^ B ^ B = A


Ou seja, aplicar XOR duas vezes com a mesma chave cancela o efeito.
Isso transforma o XOR em uma operação reversível.

--[ 2.0 A Ofuscação

A ofuscação com XOR é uma técnica leve, rápida e amplamente usada para esconder dados em binários.

Nada de criptografia pesada. Aqui o objetivo não é proteger — é disfarçar.

Malwares usam isso pra:

esconder strings
embaralhar payloads
evitar detecção trivial por assinatura

O funcionamento é direto: você pega um dado e aplica XOR com uma chave.

Essa chave pode ser:

um único byte (single-byte key)
uma sequência de bytes (multi-byte key)

Um caso clássico é o XOR com 0xFF:

X ^ 0xFF


Isso inverte todos os bits do valor — um “NOT disfarçado”.

Importante: XOR não altera significativamente a entropia do dado.
Ou seja, o conteúdo continua parecendo “normal” o suficiente pra não levantar suspeita em mecanismos simples de detecção.

No fim, isso não é criptografia forte.
É só uma camada barata de confusão.

E funciona — contra análise superficial.

--[ 3.0 Observando no Assembly

Agora sai da teoria e entra no que interessa: execução. Mas antes de olhar o Assembly, vamos ver o código original:

#include <stdio.h>

int main(){

  char data = 'A';
  char key = 0x30;

  char enc = data ^ key;
  char dec = enc ^ key;

  printf("Origial: %c\\n", data);
  printf("Encoded: %c\\n", enc);
  printf("Decoded: %c\\n", dec);

  return 0;

}

Após compilar vira algo assim:

...
mov BYTE PTR [rbp-0x1], 0x41   ; 'A'
mov BYTE PTR [rbp-0x2], 0x30   ; chave

movzx eax, BYTE PTR [rbp-0x1]
xor al, BYTE PTR [rbp-0x2]

mov BYTE PTR [rbp-0x3], al

movzx eax, BYTE PTR [rbp-0x3]
xor al, BYTE PTR [rbp-0x2]

mov BYTE PTR [rbp-0x4], al
...

À primeira vista, nada demais.

Mas tem um detalhe curioso:
o valor intermediário não aparece em lugar nenhum.

Você vê 0x41.
Você vê 0x30.
Mas o resultado do XOR… não está lá.

--[ 4.0 O Valor Invisível

Se você fizer a conta:

0x41 ^ 0x30 = 0x71


Esse é o valor que passa pelo registrador.

Mas ele não está no código.
Não está como constante.
Não está salvo em nenhum lugar explícito.

Ele só existe durante a execução.

O disassembly mostra instruções — não resultados.

Então, se você só lê o código, você nunca vê esse valor.

--[ 5.0 Onde ele aparece de verdade

É aqui que o debugger muda o jogo.

Você pausa antes do XOR:

AL = 0x41


Executa uma instrução.

E o valor muda:

AL = 0x71


Simples assim.

O valor não foi “descoberto”.
Ele foi produzido naquele exato momento.

Logo depois, o processo se repete:

0x71 ^ 0x30 = 0x41


E o valor original volta.

Sem mistério. Sem segredo.

--[ 6.0 O que isso realmente significa

Esse padrão aparece o tempo todo:

strings “codificadas” em malware
payloads levemente ofuscados
loaders simples

E quase sempre segue a mesma lógica:

aplica XOR pra esconder
aplica XOR de novo pra recuperar

Se você reconhece isso, você quebra na hora.

--[ 7.0 Fechamento

XOR não protege nada de verdade.

Ele só aposta que você não vai olhar de perto.

Mas no momento que você abre um debugger e acompanha os registradores, a ilusão acaba.

O dado nunca deixou de estar ali.
Só estava esperando você observar no momento certo.
    `
  },
  "fragment_003": {
    title: "Aquisição de Dump de Memória em Linux",
    date: "03-05-2026",
    content: `
O Acquire Volatile Memory for Linux (AVML) é uma ferramenta de aquisição de memória volátil em espaço de usuário (userland) para a arquitetura X86_64, escrita em Rust e projetada para ser implantada como um binário estático.

O AVML pode ser utilizado para adquirir memória sem o conhecimento prévio da distribuição do sistema operacional ou do kernel do alvo. Não é necessária compilação na máquina de destino ou qualquer tipo de fingerprinting. Suas fontes de memória são:

/dev/crash

/proc/kcore

/dev/mem

Se a fonte de memória não for especificada na linha de comando, o AVML percorrerá as fontes disponíveis até encontrar uma funcional.

Esta ferramenta é extremamente prática, pois é distribuída como um binário único, sem dependências e sem a necessidade de criação de objetos de kernel (módulos). Basta executar o binário, especificar o caminho de saída e você terá a imagem da memória.

Primeiro, precisamos tornar este binário executável; para isso, execute:

chmod +x avml

Ao executar o binário sem fornecer um nome de arquivoo com a extensão desejada obtém-se o seguinte:

error: the following required arguments were not provided:
  <FILENAME>

Usage: avml FILENAME

For more information, try '--help'.

O arquivo pode ser salvo localmente em qualquer diretório ou em locais remotos, como compartilhamentos de arquivos de rede, etc. Essa funcionalidade é muito útil, pois permite que os analistas realizem a aquisição e gravem os dados diretamente em um compartilhamento remoto, evitando alterações desnecessárias no servidor comprometido.

Vamos ver o AVML em ação:

./avml Linux_Acquisition.raw

Executando este comando, que criará uma imagem de memória chamada "Linux_Acquisition.raw" no mesmo diretório. O prompt é liberado após breve momemto; você não receberá nenhuma mensagem de confirmação indicando que o AVML concluiu o trabalho.

Quando a execução terminar, vamos listar o conteúdo do diretório para verificar se o dump da memória foi realizado ou não.

ls -la                          
total 2098508
drwxr-xr-x  2 proxyy proxyy       4096 mai  3 15:00 .
drwx------ 16 proxyy proxyy       4096 mai  3 14:51 ..
-rwxrwxr-x  1 proxyy proxyy    1835776 mai  3 14:50 avml
-rw-------  1 root   root   2147016767 mai  3 15:00 Linux_Acquisition.raw

Aqui podemos ver o nome do arquivo junto com seu tamanho. A memória RAM do sistema Linux de onde ele foi adquirido era de 2,1 GB.

Após a aquisição da memória em sistemas Windows ou Linux, os analistas podem analisá-la utilizando ferramentas como o Redline ou o Volatility. 

Realizar a aquisição de memória é algo importante, simples e de enorme valor forense; por isso, todo analista deve saber como executá-la.

 `
  }
};