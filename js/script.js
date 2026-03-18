/* =========================================
   CONTROLE DE FONTE E TEMA
========================================= */

// Define o tamanho inicial da fonte em pixels
let fontSize = 20;

// Função para aumentar a letra (chamada pelo botão A+)
function fontPlus() {
    fontSize += 2; // Adiciona 2 pixels ao tamanho atual
    document.body.style.fontSize = fontSize + "px"; // Aplica o novo tamanho ao corpo (body) da página
}

// Função para diminuir a letra (chamada pelo botão A-)
function fontMinus() {
    fontSize -= 2; // Subtrai 2 pixels do tamanho atual
    document.body.style.fontSize = fontSize + "px"; // Aplica o novo tamanho ao corpo da página
}

// Função para alternar entre modo claro e escuro (chamada pelo botão dark)
function toggleDark() {
    // O método 'toggle' funciona como um interruptor:
    // Se a classe "dark" não existir no <body>, ele a adiciona. Se já existir, ele a remove.
    document.body.classList.toggle("dark");
}

/* =========================================
   OCULTAR / MOSTRAR TEXTO
========================================= */

// Variável para controlar o estado atual: false = texto visível, true = texto oculto
let isTextHidden = false;

// Função que esconde/mostra o texto e gerencia o ícone (chamada pelo botão ocultar texto)
function toggleText() {
    // Pegamos os elementos que vamos manipular no HTML usando seus IDs
    const textContent = document.getElementById("textContent");
    const audioIcon = document.getElementById("audioIcon");
    const btnToggle = document.getElementById("btnToggleText");

    // Inverte o estado atual (se era falso vira verdadeiro e vice-versa)
    isTextHidden = !isTextHidden;

    if (isTextHidden) {
        // Se for para ocultar:
        textContent.style.display = "none"; // Some com a div do texto
        audioIcon.style.display = "block";  // Mostra a div do ícone de fones de ouvido
        btnToggle.innerText = "show text"; // Muda o escrito do botão
    } else {
        // Se for para mostrar novamente:
        textContent.style.display = "block"; // Mostra o texto
        audioIcon.style.display = "none";    // Esconde o ícone
        btnToggle.innerText = "hide text"; // Volta o botão ao normal
        
        // Se o áudio estiver tocando (karaokê rodando), ao voltar o texto, 
        // a tela rola suavemente para a frase que está sendo lida no momento.
        if (activeSegment) {
            activeSegment.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }
}

/* =========================================
   SISTEMA DE KARAOKÊ (SINCRONIA ÁUDIO-TEXTO)
========================================= */

// Seleciona o elemento <audio> da página
const audio = document.getElementById("audio");

// Seleciona todos os parágrafos que têm a classe ".segment"
const segments = document.querySelectorAll(".segment");

// Variável para guardar qual parágrafo está destacado (tocando) no momento
let activeSegment = null;

// O evento 'timeupdate' é disparado dezenas de vezes por segundo enquanto o áudio toca.
// Ele fica "escutando" o progresso do áudio.
audio.addEventListener("timeupdate", () => {

    // Pega o tempo exato (em segundos) em que o áudio está tocando agora
    const time = audio.currentTime;

    // Passa por cada um dos parágrafos do texto (segmentos) para checar o tempo
    segments.forEach(seg => {

        // Lê os atributos "data-start" e "data-end" do HTML e os transforma em números (parseFloat)
        const start = parseFloat(seg.dataset.start);
        const end = parseFloat(seg.dataset.end);

        // Verifica se o tempo atual do áudio está "dentro" do intervalo de tempo deste parágrafo
        if (time >= start && time < end) {

            // Se o parágrafo atual for DIFERENTE do que já estava ativo, precisamos mudar o destaque
            if (activeSegment !== seg) {

                // Se já havia um parágrafo destacado antes, removemos a classe "active" (o fundo amarelo) dele
                if (activeSegment) {
                    activeSegment.classList.remove("active");
                }

                // Adicionamos a classe "active" (fundo amarelo) no novo parágrafo que está sendo lido
                seg.classList.add("active");

                // Faz a tela rolar automaticamente para acompanhar a leitura, 
                // deixando o parágrafo atual sempre centralizado ("center") e de forma suave ("smooth").
                seg.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                // Atualizamos a nossa memória: o parágrafo ativo agora é este
                activeSegment = seg;
            }
        }
    });
});