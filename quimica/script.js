const field = document.getElementById("field");
const soul = document.getElementById("soul");
const choices = document.querySelectorAll(".choice");
const texts = document.querySelectorAll(".choice-text");
const questionText = document.querySelector(".pergunta-texto");
const characters = document.getElementById("characters");
const hpFill = document.getElementById("hp-fill");
const hpCount = document.getElementById("hp-count");
const music = document.getElementById("mettaton-music");
const deathSound = document.getElementById("death-sound");
const deathSong = document.getElementById("death-song");
let canMove = true;
let hp = 999;
const maxHP = 999;
let faseAtual = 1;
let ataques = [];

window.addEventListener('resize', () => {

  larguraTela = window.innerWidth;
  alturaTela = window.innerHeight;


  ataques.forEach(ataque => {
    ataque.x = calcularNovaPosicaoX(ataque);
    ataque.y = calcularNovaPosicaoY(ataque);
  });


});

const perguntas = [
  {
    pergunta: "Qual a massa de 2 mols de água?",
    alternativas: ["38g", "36g", "40g", "23g"],
    correta: "B"
  },
  {
    pergunta: "Quantos mols existem em 88g de CO₂",
    alternativas: ["1 mol", "2 mols", "3 mols", "4 mols"],
    correta: "B"
  },
  {
    pergunta: "Qual o número de moléculas em 0.5 mol de O₂",
    alternativas: ["1,204 x 10²³", "3,522 × 10²³", "3,000 × 10²³", "3,011 × 10²³"],
    correta: "D"
  },
  {
    pergunta: "Quantos mols existem em 36 g de H₂O?",
    alternativas: ["1 mol", "4 mols", "6 mols", "2 mols"],
    correta: "D"
  },
  {
    pergunta: "Quantos mols há em 120 g de Ca?",
    alternativas: ["2 mols", "3 mols", "4 mols", "5 mols"],
    correta: "B"
  },
  {
    pergunta: "Quantas moléculas há em 0,1 mol de glicose?",
    alternativas: ["6,00×10²²", "3,011×10²²", "6,022 × 10²²", "6,500×10²²"],
    correta: "C"
  },
  {
    pergunta: "Quantos mols de moléculas há em 3,01×10² moléculas de NH₃?",
    alternativas: ["2,00 x 10-²¹", "6,02 x 10-²³", "1,00 x 10-²⁰", "5,00 x 10-²²"],
    correta: "D"
  },
  {
    pergunta: " Quantos íons há em 3 mols de NaCl completamente dissociado?",
    alternativas: ["6,02 × 10²³", " 1,81 × 10²⁴", "3,61×10²⁴", "2,41 × 10²⁴"],
    correta: "C"
  },
  {
    pergunta: "Qual o número de moléculas presentes em 0,75 mol de C₂H₄?",
    alternativas: ["4,52 × 10²³", "6,02 × 10²³", "3,01 × 10²³", "9,03 × 10²³"],
    correta: "A"
  },
  {
    pergunta: "Quantas moléculas há em 90 g de H₂O₂?",
    alternativas: ["2,65 × 10²³", "1,59 × 10²⁴", "2,01 × 10²⁴", "9,48 × 10²³"],
    correta: "B"
  }
];

let perguntaAtual = 0;
let acertos = 0;
let x = 0, y = 0;
const step = 6;
const pressed = new Set();
let currentHover = null;

function carregarPergunta() {
  if (perguntaAtual >= perguntas.length) {
    questionText.textContent = `Fim do jogo! Você acertou ${acertos} de ${perguntas.length}`;
    field.style.display = "None";
    texts.forEach(t => t.textContent = '');
    return;
  }

  const atual = perguntas[perguntaAtual];
  questionText.textContent = atual.pergunta;
  texts[0].textContent = atual.alternativas[0];
  texts[1].textContent = atual.alternativas[1];
  texts[2].textContent = atual.alternativas[2];
  texts[3].textContent = atual.alternativas[3];
}


let intervalosDeAtaque = [];
function reduceHP() {
  if (hp > 0) {
    hp--;
    const percent = (hp / maxHP) * 100;
    hpFill.style.width = percent + "%";
    hpCount.textContent = `${hp}/${maxHP}`;
  }

  if (hp === 0) {
     canMove = false;
 intervalosDeAtaque.forEach(clearInterval);
    intervalosDeAtaque.length = 0;

  const elementsToHide = document.querySelectorAll(
    "#characters, .choice-group, .pergunta-texto, #hp-container, #fight-buttons, #hp-fill, #hp-count"
  );
  music.pause();
  deathSound.play();

  elementsToHide.forEach(elem => {
    elem.style.display = "none";
  });
  field.style.border = "0px";


  
  setTimeout(() => {
    soul.style.backgroundImage = "url('./imgs/brokenHeart.webp')";
  }, 1800);
setTimeout(() => {
    deathSong.play();
}, 4000);

  }
}

function tick() {
  if(canMove){
  let dx = 0, dy = 0;
  if (pressed.has("w")) dy -= step;
  if (pressed.has("s")) dy += step;
  if (pressed.has("a")) dx -= step;
  if (pressed.has("d")) dx += step;

  const maxX = field.clientWidth - soul.offsetWidth;
  const maxY = field.clientHeight - soul.offsetHeight;
  x = Math.max(0, Math.min(maxX, x + dx));
  y = Math.max(0, Math.min(maxY, y + dy));

  soul.style.left = x + "px";
  soul.style.top = y + "px";

  checkCollision();
  }
}

function getRelativeRect(el) {
  const elRect = el.getBoundingClientRect();
  const fieldRect = field.getBoundingClientRect();
  return {
    left: elRect.left - fieldRect.left,
    top: elRect.top - fieldRect.top,
    right: elRect.right - fieldRect.left,
    bottom: elRect.bottom - fieldRect.top,
  };
}

function checkCollision() {
  const soulBox = getRelativeRect(soul);
  currentHover = null;

  choices.forEach(choice => {
    const box = getRelativeRect(choice);
    const overlap = !(soulBox.right < box.left ||
                      soulBox.left > box.right ||
                      soulBox.bottom < box.top ||
                      soulBox.top > box.bottom);

    if (overlap) {
      choice.classList.add("highlight");
      currentHover = choice.id;
    } else {
      choice.classList.remove("highlight");
    }
  });
}

document.addEventListener("keydown", e => {
  pressed.add(e.key.toLowerCase());

  if (e.key === "z" || e.key === "Enter") {
    if (currentHover) {
      triggerAction(currentHover);
    }
  }
});

document.addEventListener("keyup", e => pressed.delete(e.key.toLowerCase()));
setInterval(tick, 20);

function triggerAction(choiceID) {
  const atual = perguntas[perguntaAtual];
  if (choiceID === atual.correta) {
    acertos++;
    proximaFase()
  }else{
    reduceHP();
    proximaFase();
  }
  perguntaAtual++;
  carregarPergunta();
}

window.addEventListener('load', () => {
  carregarPergunta();
  iniciarAtaqueDaFase()
  music.volume = 0.3;
  music.loop = true;
  music.play().catch(e => {
    console.log("Autoplay bloqueado, toque ao apertar uma tecla.");
    document.addEventListener("keydown", () => {
      music.play();
    }, { once: true });
  });
});


function iniciarObstaculosIniciais() {

    const obstaculo = document.createElement("div");
    obstaculo.classList.add("obstaculo");
    
    const startX = Math.random() * (field.clientWidth - 20);
    obstaculo.style.left = `${startX}px`;
    obstaculo.style.top = `-20px`;
    
    field.appendChild(obstaculo);

    let posY = -20;
    const velocidade = 2 + Math.random() * 2;

    const movimento = setInterval(() => {
      posY += velocidade;
      obstaculo.style.top = `${posY}px`;

      const obsRect = getRelativeRect(obstaculo);
      const soulRect = getRelativeRect(soul);

      const colisao = !(obsRect.right < soulRect.left ||
                        obsRect.left > soulRect.right ||
                        obsRect.bottom < soulRect.top ||
                        obsRect.top > soulRect.bottom);

      if (colisao) {
        field.removeChild(obstaculo);
        clearInterval(movimento);
        reduceHP();
      }

      if (posY > field.clientHeight) {
        field.removeChild(obstaculo);
        clearInterval(movimento);
      }

    }, 20);


}


function iniciarObstaculosGrandes() {
  const ataqueVertical = setInterval(() => {
    criarObstaculoGrandeVertical("top");
    criarObstaculoGrandeVertical("bottom");
  }, 1300);
  intervalosDeAtaque.push(ataqueVertical);

  

  setTimeout(() => {
    const ataqueHorizontal = setInterval(() => {
      criarObstaculoGrandeHorizontal("left");
      criarObstaculoGrandeHorizontal("right");
    }, 1300);
    intervalosDeAtaque.push(ataqueHorizontal);


  }, 3000);

  
}



function criarObstaculoGrandeVertical(from) {
  const obstaculo = document.createElement("div");
  obstaculo.classList.add("obstaculo-grande");
  obstaculo.style.width = "80px";
  obstaculo.style.height = "150px";

  const startX = Math.random() * (field.clientWidth - 80);
  obstaculo.style.left = `${startX}px`;
  obstaculo.style.top = from === "top" ? "-100px" : `${field.clientHeight + 100}px`;

  field.appendChild(obstaculo);

  let posY = from === "top" ? -100 : field.clientHeight + 100;
  const velocidade = from === "top" ? 8 : -8;

  let colidiu = false;
  const mover = setInterval(() => {
    posY += from === "top" ? velocidade : velocidade;
    obstaculo.style.top = `${posY}px`;

    const obsRect = getRelativeRect(obstaculo);
  const soulRect = getRelativeRect(soul);

  const colisao = !(obsRect.right < soulRect.left ||
                    obsRect.left > soulRect.right ||
                    obsRect.bottom < soulRect.top ||
                    obsRect.top > soulRect.bottom);

  if (colisao && !colidiu) {
    colidiu = true;
    reduceHP();
  }


    const foraDoCampo = from === "top" ? posY > field.clientHeight : posY < -100;
    if (foraDoCampo) {
      clearInterval(mover);
      field.removeChild(obstaculo);
    }
  }, 20);
}

function criarObstaculoGrandeHorizontal(from) {
  const obstaculo = document.createElement("div");
  obstaculo.classList.add("obstaculo-grande");
  obstaculo.style.width = "150px";
  obstaculo.style.height = "80px";

  const startY = Math.random() * (field.clientHeight - 80);
  obstaculo.style.top = `${startY}px`;
  obstaculo.style.left = from === "left" ? "-150px" : `${field.clientWidth + 150}px`;

  field.appendChild(obstaculo);

  let posX = from === "left" ? -150 : field.clientWidth + 150;
  const velocidade = from === "left" ? 8 : -8;

  let colidiu = false;
  const mover = setInterval(() => {
    posX += velocidade;
    obstaculo.style.left = `${posX}px`;

    const soulRect = getRelativeRect(soul);
    const obsRect = getRelativeRect(obstaculo);

    const colisao = !(obsRect.right < soulRect.left ||
                      obsRect.left > soulRect.right ||
                      obsRect.bottom < soulRect.top ||
                      obsRect.top > soulRect.bottom);

    if (!colidiu && colisao) {
      colidiu = true;
      reduceHP();
      field.removeChild(obstaculo);
      clearInterval(mover);
    }

    if ((from === "left" && posX > field.clientWidth) || 
        (from === "right" && posX < -150)) {
      field.removeChild(obstaculo);
      clearInterval(mover);
    }
  }, 20);
}

function ataqueLinhaHorizontalAnimado() {
  const posY = Math.random() * (field.clientHeight - 90);


  const aviso = document.createElement("div");
  aviso.classList.add("aviso-linha");
  aviso.style.width = "100%";
  aviso.style.height = "60px";
  aviso.style.top = `${posY}px`;
  aviso.style.left = "0";

  field.appendChild(aviso);

  setTimeout(() => {
    field.removeChild(aviso);

    const linha = document.createElement("div");
    linha.classList.add("obstaculo-grande");
    linha.style.width = "100%";
    linha.style.height = "60px";
    linha.style.position = "absolute";
    linha.style.left = "0";
    linha.style.top = "-60px"; 

    field.appendChild(linha);

    let pos = -60;
    const finalY = posY;
    let colidiu = false;

    const mover = setInterval(() => {
      pos += 10;
      linha.style.top = `${pos}px`;

      if (pos >= finalY) {
        linha.style.top = `${finalY}px`;
        clearInterval(mover);
      }

      const linhaRect = getRelativeRect(linha);
      const soulRect = getRelativeRect(soul);

      const colisao = !(linhaRect.right < soulRect.left ||
                        linhaRect.left > soulRect.right ||
                        linhaRect.bottom < soulRect.top ||
                        linhaRect.top > soulRect.bottom);

      if (colisao && !colidiu) {
        colidiu = true;
        reduceHP();
      }
    }, 20);

    setTimeout(() => {
      field.removeChild(linha);
    }, 2000);
  }, 1000); 
}
function ataqueLinhaVerticalAnimado() {
  const posX = Math.random() * (field.clientWidth - 80);


  const aviso = document.createElement("div");
  aviso.classList.add("aviso-linha");
  aviso.style.width = "60px";
  aviso.style.height = "100%";
  aviso.style.left = `${posX}px`;
  aviso.style.top = "0";

  field.appendChild(aviso);

  setTimeout(() => {
    field.removeChild(aviso);


    const linha = document.createElement("div");
    linha.classList.add("obstaculo-grande");
    linha.style.width = "60px";
    linha.style.height = "100%";
    linha.style.position = "absolute";
    linha.style.left = "-60px";
    linha.style.top = "0";

    field.appendChild(linha);

    let pos = -60;
    const finalX = posX;
    let colidiu = false;

    const mover = setInterval(() => {
      pos += 10;
      linha.style.left = `${pos}px`;

      if (pos >= finalX) {
        linha.style.left = `${finalX}px`;
        clearInterval(mover);
      }

      const linhaRect = getRelativeRect(linha);
      const soulRect = getRelativeRect(soul);

      const colisao = !(linhaRect.right < soulRect.left ||
                        linhaRect.left > soulRect.right ||
                        linhaRect.bottom < soulRect.top ||
                        linhaRect.top > soulRect.bottom);

      if (colisao && !colidiu) {
        colidiu = true;
        reduceHP();
      }
    }, 20);

    setTimeout(() => {
      field.removeChild(linha);
    }, 2000);
  }, 1000);
}


function iniciarAtaqueDaFase() {
  pararTodosOsAtaques(); 

  if (faseAtual >= 1 && faseAtual <= 3) {
    iniciarObstaculosPequenos(); 
  } else if (faseAtual >= 4 && faseAtual <= 7) {
    iniciarObstaculosGrandes(); 
  } else if (faseAtual >= 8 && faseAtual <= 10) {
    iniciarLinhas(); 
  }
}

function proximaFase() {
  faseAtual++;
  iniciarAtaqueDaFase();
}


function iniciarObstaculosPequenos() {
  const ataque = setInterval(() => {
    iniciarObstaculosIniciais();
  }, 200);

  intervalosDeAtaque.push(ataque);

 
}



function iniciarLinhas() {
  const ataque = setInterval(() => {
    ataqueLinhaHorizontalAnimado();
    ataqueLinhaVerticalAnimado();
  }, 2500);

  intervalosDeAtaque.push(ataque);

  
}



function pararTodosOsAtaques() {
  intervalosDeAtaque.forEach(intervalo => clearInterval(intervalo));
  intervalosDeAtaque = [];
}
