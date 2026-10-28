// O céu que fica ao fundo do site.
// As estrelas são desenhadas no canvas para manter a animação leve.
const starCanvas = document.getElementById("starfield");
const starContext = starCanvas.getContext("2d", {
  alpha: true
});

let stars = [];
let animationFrame = 0;
let ultimoQuadro = 0;
let temporizadorResize = 0;

// 30 FPS são suficientes para o brilho das estrelas
// sem exigir tanto do navegador.
const intervaloQuadros = 1000 / 30;

// Se a pessoa prefere menos animações, respeitamos isso.
const reduzirMovimento = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

function seedStars() {
  const largura = window.innerWidth;
  const altura = window.innerHeight;

  // Limitamos a resolução para não sobrecarregar telas muito densas.
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

  starCanvas.width = Math.round(largura * ratio);
  starCanvas.height = Math.round(altura * ratio);

  starCanvas.style.width = `${largura}px`;
  starCanvas.style.height = `${altura}px`;

  starContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  // A quantidade acompanha o tamanho da tela,
  // mas nunca passa de 180 estrelas.
  const quantidade = Math.min(
    180,
    Math.floor((largura * altura) / 7500)
  );

  stars = Array.from({ length: quantidade }, () => ({
    x: Math.random() * largura,
    y: Math.random() * altura,
    radius: Math.random() * 1.15 + 0.25,
    alpha: Math.random() * 0.55 + 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.008 + 0.002
  }));
}

function desenharEstrelas() {
  starContext.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  for (const estrela of stars) {
    const brilho =
      0.72 + Math.sin(estrela.phase) * 0.28;

    starContext.beginPath();
    starContext.arc(
      estrela.x,
      estrela.y,
      estrela.radius,
      0,
      Math.PI * 2
    );

    starContext.fillStyle =
      `rgba(224, 219, 255, ${estrela.alpha * brilho})`;

    starContext.fill();
  }
}

function animarCeu(tempoAtual) {
  if (document.hidden || reduzirMovimento.matches) {
    animationFrame = 0;
    return;
  }

  animationFrame = requestAnimationFrame(animarCeu);

  const tempoDecorrido = tempoAtual - ultimoQuadro;

  if (tempoDecorrido < intervaloQuadros) {
    return;
  }

  ultimoQuadro = tempoAtual - (
    tempoDecorrido % intervaloQuadros
  );

  for (const estrela of stars) {
    // Como diminuímos os quadros, compensamos a velocidade
    // para as estrelas continuarem piscando como antes.
    estrela.phase += estrela.speed * 2;
  }

  desenharEstrelas();
}

function pausarCeu() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
}

function iniciarCeu() {
  pausarCeu();
  ultimoQuadro = 0;

  seedStars();
  desenharEstrelas();

  if (!document.hidden && !reduzirMovimento.matches) {
    animationFrame = requestAnimationFrame(animarCeu);
  }
}

// Acendemos o céu assim que a página carrega.
iniciarCeu();

// Se a janela mudar de tamanho, esperamos um instante
// antes de reorganizar as estrelas.
window.addEventListener("resize", () => {
  clearTimeout(temporizadorResize);

  temporizadorResize = setTimeout(() => {
    iniciarCeu();
  }, 180);
});

// Não precisamos gastar recursos animando uma aba que ninguém está vendo.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pausarCeu();
  } else {
    ultimoQuadro = 0;

    if (!reduzirMovimento.matches && !animationFrame) {
      animationFrame = requestAnimationFrame(animarCeu);
    }
  }
});

// Se a preferência de movimento mudar, ajustamos o céu também.
reduzirMovimento.addEventListener("change", iniciarCeu);


// As 18 estrelas guardam palavras diferentes.
// Começamos com seis mensagens pequenas e seguimos com doze poesias.

const messages = {

  // Estrela 1: um olhar mais gentil sobre si mesma.
  first: {
    label: "uma coisa bonita",
    text: `Talvez você ainda não consiga enxergar tudo o que existe de bonito em você. Tudo bem. Às vezes, a gente precisa de um olhar gentil para lembrar que também merece o carinho que oferece ao mundo.`
  },

  // Estrela 2: sobre sentir muito e não precisar esconder isso.
  second: {
    label: "o jeito como você sente",
    text: `Não diminua a sua intensidade para caber no pouco que alguém consegue oferecer. Sentir muito não é um defeito. É uma parte sua que merece ser compreendida, cuidada e correspondida com sinceridade.`
  },

  // Estrela 3: o amor não deveria depender de perfeição.
  third: {
    label: "um lembrete",
    text: `Você não precisa conquistar o direito de ser amada. Não precisa ser perfeita, estar sempre bem ou esconder as partes frágeis. Você merece carinho também nos dias em que não consegue ser forte.`
  },

  // Estrela 4: algumas coisas que ela merece viver.
  fourth: {
    label: "você merece",
    text: `Merece reciprocidade, respeito, calma, risadas inesperadas, abraços demorados e alguém que tenha vontade de conhecer até os pequenos detalhes que você acha que ninguém nota.`
  },

  // Estrela 5: uma confissão pequena, mas sincera.
  fifth: {
    label: "um segredo pequeno",
    text: `Eu gosto de descobrir você. Das coisas que você conta sem perceber, dos seus sonhos, do jeito como fala sobre o que ama. Ainda há tanto para conhecer — e acho bonito não precisar ter pressa.`
  },

  // Estrela 6: os sonhos dela ainda merecem espaço.
  sixth: {
    label: "continue sonhando",
    text: `Não deixe que as histórias que não deram certo decidam o final de todas as outras. Alguns sonhos demoram, alguns mudam de forma, e outros chegam de um jeito que a gente não imaginava. Continue deixando espaço para o bonito.`
  },

  // Estrela 7: uma princesa que passou tempo demais sem ser enxergada.
  nova7: {
    label: "A princesa que se sentia invisível",
    text: `Dizem que existia uma princesa de beleza tão singular que nem mesmo as flores mais delicadas ousavam competir com ela. Seus olhos castanhos guardavam a ternura de mil entardeceres, e em seu coração habitavam sonhos tão belos que talvez nem os livros conseguissem descrevê-los.

Mas havia algo de triste naquela princesa. Embora todos pudessem vê-la, poucos realmente a enxergavam. E, com o passar dos anos, ela começou a acreditar que o amor que tanto imaginava pertencia somente às histórias que lia.

Até que, em algum lugar distante, alguém que também conhecia a solidão encontrou o caminho até ela.

E, pela primeira vez, talvez a princesa não precisasse sonhar com alguém que a enxergasse.

Porque havia alguém que, mesmo diante de um céu repleto de estrelas, descobrira que seus olhos eram o lugar mais bonito para se perder.`
  },

  // Estrela 8: porque alguns olhos conseguem guardar um universo inteiro.
  nova8: {
    label: "O paraíso dos olhos castanhos",
    text: `Sempre achei curioso como o mundo procura a beleza em lugares tão distantes. Há quem atravesse oceanos para contemplar o pôr do sol, quem suba montanhas para tocar as nuvens, quem passe noites inteiras procurando estrelas cadentes.

E então existem os seus olhos.

Castanhos como a terra depois da chuva, profundos como um céu que ainda não revelou todas as suas constelações, doces como a última luz de um entardecer de verão.

Não sei se você percebe, mas há algo neles que me faz esquecer por alguns instantes tudo o que existe ao redor.

Talvez seja por isso que, quando penso no paraíso, já não imagino um lugar distante, cercado de anjos e jardins eternos.

Imagino apenas a sorte de estar perto o suficiente para olhar nos seus olhos e encontrar, dentro deles, um mundo onde eu gostaria de permanecer.`
  },

  // Estrela 9: um jardim de lírios e uma vida tranquila a dois.
  nova9: {
    label: "Se eu pudesse lhe oferecer um jardim",
    text: `Se eu pudesse lhe oferecer um jardim, plantaria lírios onde a luz da manhã primeiro tocasse a terra. Deixaria que as borboletas dançassem entre as flores e que os pássaros cantassem baixinho, como se soubessem que aquele lugar fora criado para alguém especial.

Haveria uma pequena casa, janelas abertas para o campo e uma varanda de onde pudéssemos assistir à chuva sem precisar fugir dela.

E talvez, numa tarde qualquer, você estivesse sentada entre os lírios, lendo um daqueles livros que tanto ama, enquanto eu fingiria admirar a paisagem.

Mas a verdade é que meus olhos estariam em você.

Porque de que me serviria possuir o jardim mais bonito do mundo, se a flor que eu mais desejasse contemplar estivesse justamente ali, sorrindo sem perceber?`
  },

  // Estrela 10: quem disse que os romances precisam ficar apenas nos livros?
  nova10: {
    label: "As páginas que ainda não foram escritas",
    text: `Talvez você tenha encontrado nos livros aquilo que tantas vezes lhe faltou na realidade.

Amores que atravessam distâncias, pessoas que reconhecem umas às outras mesmo entre multidões, encontros que parecem desafiar a própria lógica do destino.

Imagino quantas vezes você fechou um livro desejando, em silêncio, que alguém pudesse amá-la com aquela mesma intensidade.

E sabe o que acho bonito?

Que, apesar de tudo, alguma parte de você continuou acreditando.

Eu não sei escrever um destino perfeito, tampouco posso prometer que a vida terá a delicadeza das suas histórias favoritas.

Mas gostaria de lhe mostrar que o romance não precisa existir apenas entre páginas.

Que ainda existem olhares que demoram, mãos que desejam permanecer entrelaçadas e corações que encontram poesia na simples existência de alguém.

E, quem sabe, um dia você descubra que a história mais bonita da sua vida não estava esperando para ser lida.

Estava esperando para ser vivida.`
  },

  // Estrela 11: às vezes, duas pessoas se encontram justamente na solidão.
  nova11: {
    label: "Quando duas solidões se encontram",
    text: `Durante muito tempo, pensei que a solidão fosse apenas a ausência de alguém.

Mas existem solidões que permanecem mesmo quando estamos cercados de pessoas. São aquelas que habitam o silêncio entre uma conversa e outra, os pensamentos que nunca conseguimos explicar e os sonhos que guardamos por medo de ninguém compreendê-los.

Talvez você também conheça esse lugar.

Talvez, enquanto eu procurava palavras para sentimentos que não sabia nomear, você estivesse em algum canto do mundo desejando ser compreendida sem precisar explicar tudo.

E pensar nisso me provoca uma ternura estranha.

Porque, entre tantas pessoas, tantas histórias e tantos caminhos que poderiam nunca ter se cruzado, os nossos se encontraram.

Não sei se duas solidões são capazes de se completar.

Mas gosto de imaginar que, quando dois corações se reconhecem, a solidão deixa de parecer uma sentença e começa a se transformar em um lugar de onde podemos partir juntos.`
  },

  // Estrela 12: acolher até aquilo que ela aprendeu a esconder.
  nova12: {
    label: "O que eu gostaria de dizer ao seu coração",
    text: `Se eu pudesse conversar por alguns minutos com o seu coração, pediria que ele me contasse tudo aquilo que você aprendeu a esconder.

Perguntaria quantas vezes ele se encheu de esperança, quantas vezes precisou recolher os próprios pedaços e quantos sonhos deixou guardados para não sofrer novamente.

E, depois de ouvi-lo, talvez eu não soubesse dizer nada extraordinário.

Apenas lhe pediria, com toda a delicadeza que fosse capaz de encontrar, que não tivesse vergonha de continuar sentindo.

Porque há algo profundamente belo em um coração que, mesmo conhecendo a tristeza, ainda deseja oferecer amor.

E, se algum dia você me permitir conhecer esse lado seu, gostaria de recebê-lo sem pressa, sem julgamentos e sem tentar transformar sua sensibilidade em algo menor.

Afinal, não são apenas suas partes felizes que merecem carinho.

São todas elas.`
  },

  // Estrela 13: o desejo de estar presente até nos dias mais comuns.
  nova13: {
    label: "A delicadeza de desejar ficar",
    text: `Há algo que considero mais bonito do que as grandes declarações de amor: a vontade de permanecer nas pequenas coisas.

Estar ao seu lado enquanto você me conta sobre um livro. Ouvir uma música e descobrir que ela lhe lembra alguma memória antiga. Caminhar sem destino, conversar até tarde ou simplesmente dividir um silêncio confortável.

Gostaria de conhecer o som da sua risada quando você esquece de se preocupar com o mundo. De aprender a reconhecer quando seus olhos estão felizes, mesmo antes de você dizer qualquer coisa.

E talvez seja isso que mais me encante.

Não apenas imaginar os momentos extraordinários que poderíamos viver, mas desejar também aqueles dias comuns em que nada grandioso acontece.

Porque, quando alguém desperta em nós a vontade de transformar o cotidiano em lembrança, talvez já exista ali alguma coisa muito especial.`
  },

  // Estrela 14: conhecer alguém também é explorar um universo desconhecido.
  nova14: {
    label: "O universo que existe em você",
    text: `Às vezes, olho para o céu e me pergunto quantas estrelas existem além daquelas que conseguimos enxergar.

Quantos mundos permanecem escondidos, quantas histórias jamais conheceremos, quantas belezas continuam existindo mesmo sem ninguém para contemplá-las.

E então penso em você.

Penso em todos os pensamentos que ainda não me contou, nos sonhos que guarda em silêncio, nas lembranças que fizeram de você quem é hoje.

Existe um universo inteiro por trás do seu sorriso.

E o que mais me fascina não é imaginar que um dia conhecerei todos os seus mistérios, mas perceber que há uma infinidade de pequenas descobertas esperando por nós.

Se o universo é infinito, talvez conhecer alguém de verdade também seja.

E eu não me importaria de passar muito tempo descobrindo as constelações que habitam você.`
  },

  // Estrela 15: tantos caminhos possíveis, mas o nosso acabou se cruzando.
  nova15: {
    label: "Se o destino tivesse mãos",
    text: `Se o destino tivesse mãos, eu gostaria de perguntar o que o levou a aproximar duas histórias tão diferentes e, ao mesmo tempo, tão parecidas.

Teria sido acaso? Uma coincidência entre milhares de outras? Ou algum capricho do universo, desses que só compreendemos depois que acontecem?

Não sei.

Mas acho extraordinário pensar que, antes de nos conhecermos, existiam tantos caminhos capazes de nos levar para longe um do outro.

Bastaria uma escolha diferente, uma conversa que nunca começasse, um dia em que ninguém tivesse coragem de dizer a primeira palavra.

E, ainda assim, aqui estamos.

Talvez eu nunca descubra por que certas pessoas aparecem em nossas vidas.

Mas há encontros que despertam em nós uma gratidão tão silenciosa que, por alguns instantes, até o acaso parece ter feito poesia.`
  },

  // Estrela 16: algumas pessoas transformam músicas em lembranças.
  nova16: {
    label: "A música que ainda não terminou",
    text: `Existem músicas que ouvimos apenas uma vez e esquecemos. Outras permanecem conosco por anos, escondidas entre lembranças, lugares e pessoas.

Mas algumas parecem nascer para guardar um sentimento que ainda não sabemos explicar.

Às vezes, imagino uma noite tranquila, o céu iluminado por estrelas e uma música tocando baixinho enquanto estamos próximos, sem pressa de voltar para lugar algum.

Talvez você encostasse a cabeça no meu ombro. Talvez conversássemos sobre coisas sem importância. Talvez não disséssemos absolutamente nada.

E, naquele instante, eu desejaria que o tempo aprendesse a caminhar mais devagar.

Não porque o mundo tivesse deixado de existir, mas porque haveria algo tão bonito naquele pequeno momento que eu não gostaria de vê-lo terminar.

Talvez seja isso que algumas pessoas fazem conosco.

Transformam uma música comum em algo que desejamos ouvir para sempre.`
  },

  // Estrela 17: um presente especial para o dia em que ela nasceu.
  nova17: {
    label: "O dia em que o mundo ganhou você",
    text: `Hoje, em algum lugar entre as lembranças de quem a ama e os sonhos que você ainda deseja realizar, existe uma data que merece ser celebrada.

O dia em que você nasceu.

Gosto de imaginar que, naquela ocasião, o mundo não fazia ideia da pessoa que acabara de receber.

Não sabia dos seus futuros sorrisos, dos livros que um dia você amaria, dos sonhos que fariam seus olhos brilhar, nem de todas as vezes em que sua existência tornaria a vida de alguém um pouco mais bonita.

E, entre tantas coisas que eu poderia lhe desejar, há uma que guardo com especial carinho:

Que você viva o amor que tantas vezes imaginou. Que encontre felicidade nas pequenas coisas. Que seus sonhos não percam a cor e que nunca mais precise duvidar de que merece ser vista, escolhida e amada.

E, se a vida me permitir, gostaria de estar por perto para testemunhar alguns desses sonhos se realizando.

Feliz aniversário, minha linda.

Que o mundo seja gentil com você. E que este novo capítulo lhe ofereça motivos para sorrir que nem os seus livros mais bonitos conseguiram prever.`
  },

  // Estrela 18: a última poesia explica por que este céu existe.
  nova18: {
    label: "Onde as estrelas guardam você",
    text: `Se um dia você se perguntar por que escolhi as estrelas para guardar estas palavras, talvez a resposta seja mais simples do que parece.

Porque sempre encontrei algo de fascinante na maneira como elas continuam brilhando, mesmo quando ninguém está olhando.

E você me lembra um pouco disso.

Talvez tenha passado muito tempo acreditando que sua luz não alcançava ninguém. Talvez tenha se acostumado a guardar os sonhos mais bonitos em lugares onde ninguém pudesse encontrá-los.

Mas eu gostaria que, ao olhar para este pequeno céu, você se lembrasse de uma coisa:

Existe alguém que enxerga beleza até nos detalhes que você considera comuns. Alguém que deseja conhecer suas histórias, ouvir seus sonhos, descobrir seus medos e admirar cada pequena parte do universo que existe em você.

Não sei o que o futuro escreverá sobre nós. Ainda existem páginas em branco, caminhos desconhecidos e tantas coisas que precisamos descobrir.

Mas, se me perguntassem o que desejo neste instante, eu responderia sem precisar procurar palavras extraordinárias:

Gostaria de continuar encontrando motivos para fazer você sorrir.

Porque, entre tantas estrelas que eu poderia escolher para iluminar este lugar, foi a sua existência que me fez querer construir um céu inteiro.`
  }

};


// Aqui fazemos cada estrela revelar a mensagem que guarda.
// O texto é dividido em parágrafos para facilitar a leitura.

const messageCard = document.getElementById("messageCard");
const messageLabel = document.getElementById("messageLabel");
const messageText = document.getElementById("messageText");

let ultimaEstrela = null;

// Guardamos até qual estrela ela conseguiu chegar.
// A jornada começa pela primeira.
// Este pequeno registro guarda o caminho que ela já percorreu.
// Assim, as descobertas não desaparecem quando o site é fechado.
const chaveProgresso = "ondeAsEstrelasGuardamVoce_saveStory_v1";

function salvarHistoria() {
  const progresso = {
    estrelaAtual,
    cartasDesbloqueadas,
    historiaDesbloqueada,
    cartasLidas: Array.from(cartasLidas)
  };

  try {
    localStorage.setItem(chaveProgresso, JSON.stringify(progresso));
  } catch (erro) {
    console.warn("Não foi possível salvar a jornada:", erro);
  }
}

function carregarHistoria() {
  try {
    const salvo = localStorage.getItem(chaveProgresso);

    if (!salvo) return null;

    return JSON.parse(salvo);
  } catch (erro) {
    console.warn("Não foi possível recuperar a jornada:", erro);
    return null;
  }
}

let estrelaAtual = 1;

// Organizamos as estrelas na mesma sequência do HTML.
const todasEstrelas = Array.from(
  document.querySelectorAll(".star-point")
);

// Apenas as estrelas já descobertas podem ser abertas.
function atualizarEstrelas() {
  todasEstrelas.forEach((estrela, indice) => {
    const numero = indice + 1;

    estrela.disabled = numero > estrelaAtual;

    estrela.classList.toggle(
      "estrela-descoberta",
      numero < estrelaAtual
    );

    estrela.classList.toggle(
      "estrela-seguinte",
      numero === estrelaAtual
    );
  });
}

// A primeira estrela acende quando a página é carregada.
atualizarEstrelas();

document.querySelectorAll(".star-point").forEach((star) => {
  star.addEventListener("click", () => {
    const message = messages[star.dataset.message];

    if (!message) return;

    ultimaEstrela = star;
    messageLabel.textContent = message.label;
    messageText.replaceChildren();

    message.text.trim().split(/\n\s*\n/).forEach((paragrafo) => {
      const elemento = document.createElement("p");
      elemento.textContent = paragrafo.trim();
      messageText.appendChild(elemento);
    });

    messageCard.hidden = false;

    messageCard.scrollIntoView({
      behavior: reduzirMovimento.matches ? "auto" : "smooth",
      block: "start"
    });

    if (reduzirMovimento.matches) {
      messageCard.focus({ preventScroll: true });
    }
  });
});

// Cada mensagem concluída abre o caminho para a próxima estrela.
// Ela também pode voltar e reler qualquer uma das anteriores.
document.getElementById("closeMessage").addEventListener(
  "click",
  () => {
    messageCard.hidden = true;

    const numeroEstrela =
      todasEstrelas.indexOf(ultimaEstrela) + 1;

    // Só avançamos quando ela termina a estrela da vez.
    if (
  numeroEstrela === estrelaAtual &&
  estrelaAtual < 18
) {
  estrelaAtual++;
  atualizarEstrelas();

  // A próxima estrela já fica guardada para quando ela voltar.
  salvarHistoria();
}

    // A última estrela encerra o céu e abre o caminho das cartas.
    const ultimaMensagem =
      ultimaEstrela?.dataset.message === "nova18";

    if (ultimaMensagem) {
  // A última estrela abre o próximo capítulo.
  cartasDesbloqueadas = true;
  atualizarJornada();

  // O céu foi concluído. As cartas agora fazem parte da jornada salva.
  salvarHistoria();

  document.getElementById("letters").scrollIntoView({
    behavior: reduzirMovimento.matches ? "auto" : "smooth",
    block: "start"
  });

  return;
}

    // Depois da leitura, voltamos ao desenho da constelação.
    document.getElementById("constellation").scrollIntoView({
      behavior: reduzirMovimento.matches ? "auto" : "smooth",
      block: "center"
    });

    // O destaque do teclado acompanha a próxima estrela disponível.
    const proximaEstrela = todasEstrelas[estrelaAtual - 1];

    if (proximaEstrela) {
      proximaEstrela.focus({ preventScroll: true });
    }
  }
);

// As três cartas têm propósitos diferentes.
// Elas podem ser abertas em qualquer ordem, sem precisar seguir uma sequência.

const letters = {
  sad: {
    kicker: "para os dias difíceis",
    title: "Quando o mundo parecer distante",
    content: `
      <p>Se hoje as coisas estiverem pesadas, não precisa fingir que está tudo bem só para deixar o mundo mais confortável.</p>
      <p>Você pode descansar. Pode não saber explicar o que sente. Pode precisar de silêncio ou de alguém que fique por perto sem exigir que você encontre as palavras certas.</p>
      <p>Queria que você se lembrasse de que um dia difícil não apaga a pessoa incrível que você é. E você não precisa atravessar todos eles tentando provar que consegue sozinha.</p>
      <p>Que estas palavras sejam um cantinho tranquilo para respirar por alguns instantes.</p>
    `
  },

  self: {
    kicker: "um lembrete gentil",
    title: "Quando você esquecer de si",
    content: `
      <p>Queria que você pudesse se enxergar por alguns minutos através de um olhar que não procura defeitos, que não compara, que não exige que você seja outra pessoa.</p>
      <p>Talvez percebesse a beleza da sua intensidade, a delicadeza que existe no seu jeito de sentir e a coragem necessária para continuar acreditando em coisas bonitas depois de tantas decepções.</p>
      <p>Você não é invisível por alguém não ter sabido olhar. Não é difícil de amar por alguém não ter sabido corresponder.</p>
      <p>Você continua sendo você. E isso já tem muito valor.</p>
    `
  },

  secret: {
    kicker: "uma pequena confissão",
    title: "Uma coisa que eu queria que soubesse",
    content: `
      <p>Eu sei que ainda estamos no começo e que há muito para descobrir um sobre o outro. Não quero apressar as páginas nem fingir que já conheço toda a história.</p>
      <p>Mas gosto da maneira como você me deixa curioso para conhecer o que vem depois. Gosto de ouvir seus sonhos, de perceber os detalhes e de encontrar, aos poucos, as pequenas coisas que fazem você ser quem é.</p>
      <p>Não quero que você precise acreditar em promessas enormes para se sentir especial. Prefiro que o carinho apareça nas atitudes, na atenção e na vontade sincera de continuar conhecendo você.</p>
      <p>Por enquanto, só queria deixar isso guardado aqui: conhecer você tem sido uma surpresa bonita.</p>
    `
  }
};


// Cartas e história compartilham a mesma janela.
// Mudamos o conteúdo conforme o botão escolhido.

const backdrop = document.getElementById("modalBackdrop");
const modalKicker = document.getElementById("modalKicker");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

let lastFocusedElement = null;

// Guardamos quais cartas já foram abertas e fechadas.
// Assim, reler a mesma carta não conta como uma nova descoberta.
const cartasLidas = new Set();
let cartaAtual = null;

// As próximas partes ficam esperando até chegar a hora delas.
const secaoCartas = document.getElementById("letters");
const secaoHistoria = document.getElementById("story");

const botoesCartas = document.querySelectorAll(".letter-card");
const botaoHistoria = document.getElementById("storyButton");

let cartasDesbloqueadas = false;
let historiaDesbloqueada = false;

function atualizarJornada() {
  secaoCartas.classList.toggle("bloqueada", !cartasDesbloqueadas);
  secaoHistoria.classList.toggle("bloqueada", !historiaDesbloqueada);

  botoesCartas.forEach((botao) => {
    botao.disabled = !cartasDesbloqueadas;
  });

  botaoHistoria.disabled = !historiaDesbloqueada;
}

// Antes de começar uma nova jornada, verificamos
// se ela já deixou alguma descoberta guardada aqui.
const progressoSalvo = carregarHistoria();

if (progressoSalvo) {
  if (
    Number.isInteger(progressoSalvo.estrelaAtual) &&
    progressoSalvo.estrelaAtual >= 1 &&
    progressoSalvo.estrelaAtual <= 18
  ) {
    estrelaAtual = progressoSalvo.estrelaAtual;
  }

  cartasDesbloqueadas =
    progressoSalvo.cartasDesbloqueadas === true;

  historiaDesbloqueada =
    progressoSalvo.historiaDesbloqueada === true;

  if (Array.isArray(progressoSalvo.cartasLidas)) {
    progressoSalvo.cartasLidas.forEach((carta) => {
      if (["sad", "self", "secret"].includes(carta)) {
        cartasLidas.add(carta);
      }
    });
  }
}

// Atualizamos o céu e as próximas etapas
// de acordo com o ponto em que ela parou.
atualizarEstrelas();
atualizarJornada();

function openModal(kicker, title, html) {
  lastFocusedElement = document.activeElement;

  modalKicker.textContent = kicker;
  modalTitle.textContent = title;
  modalContent.innerHTML = html;

  backdrop.hidden = false;
  document.body.style.overflow = "hidden";

  document.getElementById("closeModal").focus();
}

function closeModal() {
  backdrop.hidden = true;
  document.body.style.overflow = "";

  // Devolvemos o foco ao botão que abriu a janela.
  if (lastFocusedElement) {
    lastFocusedElement.focus({ preventScroll: true });
  }

  if (cartaAtual) {
    cartasLidas.add(cartaAtual);
    cartaAtual = null;

    // Mesmo que ela leia apenas uma carta,
    // essa descoberta continuará guardada.
    salvarHistoria();

    // Depois de fechar as três cartas diferentes,
    // seguimos automaticamente para a história.
   if (cartasLidas.size === 3) {
  cartasLidas.clear();

  // As três cartas foram descobertas.
  // Agora ela pode conhecer a história.
  historiaDesbloqueada = true;
  atualizarJornada();

  // A história foi desbloqueada e continuará disponível.
salvarHistoria();

  document.getElementById("story").scrollIntoView({
    behavior: reduzirMovimento.matches ? "auto" : "smooth",
    block: "center"
  });
 }
  }
}

// Cada botão procura sua carta pelo identificador no HTML.
document.querySelectorAll(".letter-card").forEach((card) => {
  card.addEventListener("click", () => {
    const identificador = card.dataset.letter;
    const letter = letters[identificador];

    if (!letter) return;

    cartaAtual = identificador;

    openModal(
      letter.kicker,
      letter.title,
      letter.content
    );
  });
});

// Os dois botões da janela fazem a mesma coisa: guardar e fechar.
document.getElementById("closeModal").addEventListener(
  "click",
  closeModal
);

document.getElementById("modalDone").addEventListener(
  "click",
  closeModal
);

// Um clique na parte escura também fecha a janela,
// mas clicar dentro dela não deve fazer isso.
backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) {
    closeModal();
  }
});

// Escape fecha a janela. Com Tab, o foco continua
// circulando entre os elementos disponíveis dentro dela.
document.addEventListener("keydown", (event) => {
  if (backdrop.hidden) return;

  if (event.key === "Escape") {
    closeModal();
    return;
  }

  if (event.key === "Tab") {
    const elementos = Array.from(
      backdrop.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
    );

    if (!elementos.length) return;

    const primeiro = elementos[0];
    const ultimo = elementos[elementos.length - 1];

    if (event.shiftKey && document.activeElement === primeiro) {
      event.preventDefault();
      ultimo.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === ultimo
    ) {
      event.preventDefault();
      primeiro.focus();
    }
  }
});


// O primeiro botão leva direto ao céu de mensagens.
document.getElementById("enterButton").addEventListener(
  "click",
  () => {
    document.getElementById("universe").scrollIntoView({
      behavior: reduzirMovimento.matches ? "auto" : "smooth"
    });
  }
);


// Uma pequena explicação sobre o lugar que estamos construindo.
// Ela aparece na mesma janela usada pelas cartas.
document.getElementById("aboutButton").addEventListener(
  "click",
  () => {
    openModal(
      "um pequeno segredo",
      "Este lugar foi feito para você",
      `
        <p>Não existe senha para merecer carinho, nem uma maneira certa de sentir. Este pequeno universo foi criado para guardar palavras que talvez seja bom encontrar em um dia comum ou em um dia difícil.</p>

        <p>Explore sem pressa. Algumas estrelas guardam mensagens; algumas cartas guardam pensamentos. Você pode voltar quando quiser.</p>

        <p class="poem">Que a noite seja gentil.<br>Que os sonhos encontrem caminho.<br>E que você nunca esqueça<br>que também merece ternura.</p>
      `
    );
  }
);


// A última parte da jornada: uma história sobre sentimentos
// que talvez não precisem existir apenas nos livros.
document.getElementById("storyButton").addEventListener(
  "click",
  () => {
    openModal(
      "uma história ainda sendo escrita",
      "E se o amor não fosse só ficção?",
      `
        <p>Havia alguém que, aos poucos, aprendeu a desconfiar dos finais bonitos. Não porque tivesse deixado de sonhar, mas porque às vezes a realidade parecia esquecer de acompanhar as histórias que ela amava.</p>

        <p>Mesmo assim, uma parte dela continuava guardando espaço para o impossível: para as palavras que chegam na hora certa, para os gestos que não precisam ser pedidos, para a sensação tranquila de ser vista sem precisar fazer esforço para aparecer.</p>

        <p>Talvez a vida não siga os roteiros dos livros. Talvez não existam encontros perfeitos nem promessas capazes de prever o futuro. Mas ainda existem pessoas aprendendo a se cuidar, a falar com honestidade e a escolher ficar presentes.</p>

        <p>E esta história não precisa saber o final agora. Por enquanto, basta que exista um começo — escrito com curiosidade, carinho e a coragem de descobrir o próximo capítulo.</p>

        <p class="poem">Algumas histórias não começam com “era uma vez”.<br>Começam com “me conta mais sobre você”.</p>
      `
    );
  }
);