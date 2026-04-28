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
  }
};