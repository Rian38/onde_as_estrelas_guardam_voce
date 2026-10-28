const starCanvas = document.getElementById("starfield");
const starContext = starCanvas.getContext("2d");
let stars = [];
let animationFrame = 0;

function seedStars() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  starCanvas.width = Math.floor(window.innerWidth * ratio);
  starCanvas.height = Math.floor(window.innerHeight * ratio);
  starCanvas.style.width = `${window.innerWidth}px`;
  starCanvas.style.height = `${window.innerHeight}px`;
  starContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  const amount = Math.min(220, Math.floor((window.innerWidth * window.innerHeight) / 6500));
  stars = Array.from({ length: amount }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.15 + .25,
    alpha: Math.random() * .55 + .2,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * .008 + .002
  }));
}
function drawStars() {
  starContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const star of stars) {
    star.phase += star.speed;
    const pulse = .72 + Math.sin(star.phase) * .28;
    starContext.beginPath();
    starContext.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starContext.fillStyle = `rgba(224, 219, 255, ${star.alpha * pulse})`;
    starContext.fill();
  }
  animationFrame = requestAnimationFrame(drawStars);
}
seedStars();
drawStars();
window.addEventListener("resize", () => { cancelAnimationFrame(animationFrame); seedStars(); drawStars(); });

const messages = {
  first: {
    label: "uma coisa bonita",
    text: "Talvez você ainda não consiga enxergar tudo o que existe de bonito em você. Tudo bem. Às vezes, a gente precisa de um olhar gentil para lembrar que também merece o carinho que oferece ao mundo."
  },
  second: {
    label: "o jeito como você sente",
    text: "Não diminua a sua intensidade para caber no pouco que alguém consegue oferecer. Sentir muito não é um defeito. É uma parte sua que merece ser compreendida, cuidada e correspondida com sinceridade."
  },
  third: {
    label: "um lembrete",
    text: "Você não precisa conquistar o direito de ser amada. Não precisa ser perfeita, estar sempre bem ou esconder as partes frágeis. Você merece carinho também nos dias em que não consegue ser forte."
  },
  fourth: {
    label: "você merece",
    text: "Merece reciprocidade, respeito, calma, risadas inesperadas, abraços demorados e alguém que tenha vontade de conhecer até os pequenos detalhes que você acha que ninguém nota."
  },
  fifth: {
    label: "um segredo pequeno",
    text: "Eu gosto de descobrir você. Das coisas que você conta sem perceber, dos seus sonhos, do jeito como fala sobre o que ama. Ainda há tanto para conhecer — e acho bonito não precisar ter pressa."
  },
  sixth: {
    label: "continue sonhando",
    text: "Não deixe que as histórias que não deram certo decidam o final de todas as outras. Alguns sonhos demoram, alguns mudam de forma, e outros chegam de um jeito que a gente não imaginava. Continue deixando espaço para o bonito."
  }
};

const messageCard = document.getElementById("messageCard");
const messageLabel = document.getElementById("messageLabel");
const messageText = document.getElementById("messageText");

document.querySelectorAll(".star-point").forEach((star) => {
  star.addEventListener("click", () => {
    const message = messages[star.dataset.message];
    messageLabel.textContent = message.label;
    messageText.textContent = message.text;
    messageCard.hidden = false;
    messageCard.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
document.getElementById("closeMessage").addEventListener("click", () => {
  messageCard.hidden = true;
});

const letters = {
  sad: {
    kicker: "para os dias difíceis",
    title: "Quando o mundo parecer distante",
    content: `<p>Se hoje as coisas estiverem pesadas, não precisa fingir que está tudo bem só para deixar o mundo mais confortável.</p><p>Você pode descansar. Pode não saber explicar o que sente. Pode precisar de silêncio ou de alguém que fique por perto sem exigir que você encontre as palavras certas.</p><p>Queria que você se lembrasse de que um dia difícil não apaga a pessoa incrível que você é. E você não precisa atravessar todos eles tentando provar que consegue sozinha.</p><p>Que estas palavras sejam um cantinho tranquilo para respirar por alguns instantes.</p>`
  },
  self: {
    kicker: "um lembrete gentil",
    title: "Quando você esquecer de si",
    content: `<p>Queria que você pudesse se enxergar por alguns minutos através de um olhar que não procura defeitos, que não compara, que não exige que você seja outra pessoa.</p><p>Talvez percebesse a beleza da sua intensidade, a delicadeza que existe no seu jeito de sentir e a coragem necessária para continuar acreditando em coisas bonitas depois de tantas decepções.</p><p>Você não é invisível por alguém não ter sabido olhar. Não é difícil de amar por alguém não ter sabido corresponder.</p><p>Você continua sendo você. E isso já tem muito valor.</p>`
  },
  secret: {
    kicker: "uma pequena confissão",
    title: "Uma coisa que eu queria que soubesse",
    content: `<p>Eu sei que ainda estamos no começo e que há muito para descobrir um sobre o outro. Não quero apressar as páginas nem fingir que já conheço toda a história.</p><p>Mas gosto da maneira como você me deixa curioso para conhecer o que vem depois. Gosto de ouvir seus sonhos, de perceber os detalhes e de encontrar, aos poucos, as pequenas coisas que fazem você ser quem é.</p><p>Não quero que você precise acreditar em promessas enormes para se sentir especial. Prefiro que o carinho apareça nas atitudes, na atenção e na vontade sincera de continuar conhecendo você.</p><p>Por enquanto, só queria deixar isso guardado aqui: conhecer você tem sido uma surpresa bonita.</p>`
  }
};

const backdrop = document.getElementById("modalBackdrop");
const modalKicker = document.getElementById("modalKicker");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
let lastFocusedElement = null;

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
  if (lastFocusedElement) lastFocusedElement.focus();
}
document.querySelectorAll(".letter-card").forEach((card) => {
  card.addEventListener("click", () => {
    const letter = letters[card.dataset.letter];
    openModal(letter.kicker, letter.title, letter.content);
  });
});
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalDone").addEventListener("click", closeModal);
backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !backdrop.hidden) closeModal();
});

document.getElementById("enterButton").addEventListener("click", () => {
  document.getElementById("universe").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("aboutButton").addEventListener("click", () => {
  openModal(
    "um pequeno segredo",
    "Este lugar foi feito para você",
    `<p>Não existe senha para merecer carinho, nem uma maneira certa de sentir. Este pequeno universo foi criado para guardar palavras que talvez seja bom encontrar em um dia comum ou em um dia difícil.</p><p>Explore sem pressa. Algumas estrelas guardam mensagens; algumas cartas guardam pensamentos. Você pode voltar quando quiser.</p><p class="poem">Que a noite seja gentil.<br>Que os sonhos encontrem caminho.<br>E que você nunca esqueça<br>que também merece ternura.</p>`
  );
});
document.getElementById("storyButton").addEventListener("click", () => {
  openModal(
    "uma história ainda sendo escrita",
    "E se o amor não fosse só ficção?",
    `<p>Havia alguém que, aos poucos, aprendeu a desconfiar dos finais bonitos. Não porque tivesse deixado de sonhar, mas porque às vezes a realidade parecia esquecer de acompanhar as histórias que ela amava.</p><p>Mesmo assim, uma parte dela continuava guardando espaço para o impossível: para as palavras que chegam na hora certa, para os gestos que não precisam ser pedidos, para a sensação tranquila de ser vista sem precisar fazer esforço para aparecer.</p><p>Talvez a vida não siga os roteiros dos livros. Talvez não existam encontros perfeitos nem promessas capazes de prever o futuro. Mas ainda existem pessoas aprendendo a se cuidar, a falar com honestidade e a escolher ficar presentes.</p><p>E esta história não precisa saber o final agora. Por enquanto, basta que exista um começo — escrito com curiosidade, carinho e a coragem de descobrir o próximo capítulo.</p><p class="poem">Algumas histórias não começam com “era uma vez”.<br>Começam com “me conta mais sobre você”.</p>`
  );
});
