let intervaloSensor;
let tempoSuperaquecido = 0; 

function validarAcesso() {
    const inputNome = document.getElementById("operador-nome");
    const mensagemErro = document.getElementById("mensagem-erro");
    const painelPrincipal = document.getElementById("painel-principal");
    const btnEmergencia = document.getElementById("btn-emergencia");

    if (inputNome.value.trim() === "") {
        mensagemErro.textContent = "ACESSO NEGADO: Identificação do operador obrigatória.";
        painelPrincipal.classList.add("hidden");
    } else {
        mensagemErro.textContent = "";
        painelPrincipal.classList.remove("hidden");
        btnEmergencia.classList.remove("hidden");
        
        inputNome.disabled = true;
        document.getElementById("btn-entrar").disabled = true;

        gerarListaMaquinas();
        inicializarMonitoramento();
    }
}

function gerarListaMaquinas() {
    const select = document.getElementById("select-maquinas");
    const tiposMaquinas = ["Prensa Hidráulica 01", "Torno CNC 02", "Injetora Termoplástica 03", "Braço Robótico Kuka 04", "Esteira Transportadora 05"];
    
    select.innerHTML = '<option value="">-- Selecione o Maquinário --</option>';

    for (let i = 0; i < tiposMaquinas.length; i++) {
        let opcao = document.createElement("option");
        opcao.value = `maq_${i + 1}`;
        opcao.textContent = tiposMaquinas[i];
        select.appendChild(opcao);
    }
}

function atualizarStatusMaquina() {
    const select = document.getElementById("select-maquinas");
    const statusTexto = document.getElementById("status-texto");
    const maquinaSelecionada = select.value;

    switch (maquinaSelecionada) {
        case "maq_1":
            statusTexto.textContent = "Status: Operando em Carga Nominal";
            break;
        case "maq_2":
            statusTexto.textContent = "Status: Alerta de Vibração nos Rolamentos";
            break;
        case "maq_3":
            statusTexto.textContent = "Status: Ociosa - Sem Alimentação de Polímeros";
            break;
        case "maq_4":
            statusTexto.textContent = "Status: Sincronização de Eixos Concluída";
            break;
        case "maq_5":
            statusTexto.textContent = "Status: Bloqueio de Emergência Óptico Ativado";
            break;
        default:
            statusTexto.textContent = "Aguardando seleção de máquina...";
            break;
    }
}

function monitorarSensor() {
    const visorValor = document.getElementById("temperatura-valor");
    const visorStatus = document.getElementById("sensor-status");
    
    const temperatura = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
    
    visorValor.textContent = temperatura;

    visorValor.className = "";
    visorStatus.className = "";

    if (temperatura > 95) {
        tempoSuperaquecido += 2.5; 
        if (tempoSuperaquecido >= 5) { 
            dispararParadaEmergencia();
            return;
        }
    } else {
        tempoSuperaquecido = 0;
    }

    if (temperatura < 50) {
        visorValor.classList.add("normal");
        visorStatus.classList.add("normal");
        visorStatus.textContent = "Barramento: Estável";
    } 
    else if (temperatura >= 50 && temperatura <= 80) {
        visorValor.classList.add("alerta");
        visorStatus.classList.add("alerta");
        visorStatus.textContent = "Aviso: Dissipação Térmica Necessária";
    } 
    else {
        visorValor.classList.add("perigo");
        visorStatus.classList.add("perigo");
        visorStatus.textContent = "CRÍTICO: Supreaquecimento Detectado!";
    }
}

function dispararParadaEmergencia() {
    clearInterval(intervaloSensor);

    const visorValor = document.getElementById("temperatura-valor");
    const visorStatus = document.getElementById("sensor-status");
    visorValor.className = "perigo";
    visorStatus.className = "perigo";
    visorStatus.textContent = "SISTEMA BLOQUEADO DEVIDO A INTERRUPÇÃO CRÍTICA";

    document.getElementById("select-maquinas").disabled = true;
    document.getElementById("btn-emergencia").disabled = true;

    alert("PARADA DE EMERGÊNCIA ATIVADA!");
}

function inicializarMonitoramento() {
    monitorarSensor();
    intervaloSensor = setInterval(monitorarSensor, 2500);
}