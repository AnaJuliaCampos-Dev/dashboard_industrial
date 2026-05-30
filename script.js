// Variáveis de escopo global
let intervaloSensor;
let tempoSuperaquecido = 0; // Acumulador de tempo para o desafio extra

/**
 * 1. Validar Acesso do Operador
 */
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
        btnEmergencia.classList.remove("hidden"); // Exibe o botão de emergência físico
        
        // Bloqueia interações no formulário de login pós-acesso bem-sucedido
        inputNome.disabled = true;
        document.getElementById("btn-entrar").disabled = true;

        // Inicializa os módulos industriais
        gerarListaMaquinas();
        inicializarMonitoramento();
    }
}

/**
 * 2. Gerar Lista de Máquinas (Laço For)
 */
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

/**
 * 3. Verificar Status da Máquina (Switch Case)
 */
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

/**
 * 4. Monitorar Sensor Térmico e Desafio Extra
 */
function monitorarSensor() {
    const visorValor = document.getElementById("temperatura-valor");
    const visorStatus = document.getElementById("sensor-status");
    
    // Simulação de temperatura em tempo real (20°C a 100°C)
    const temperatura = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
    
    visorValor.textContent = temperatura;

    // Reseta as classes antes da validação estrutural
    visorValor.className = "";
    visorStatus.className = "";

    // LÓGICA DO DESAFIO EXTRA: Monitoramento do limite crítico de 95°C
    if (temperatura > 95) {
        tempoSuperaquecido += 2.5; // O pooling roda a cada 2.5s, acumulando tempo
        if (tempoSuperaquecido >= 5) { // Passou de 5 segundos contínuos superaquecido
            dispararParadaEmergencia();
            return;
        }
    } else {
        tempoSuperaquecido = 0; // Se baixar de 95°C, zera o contador de segurança
    }

    // Cascata Lógica Padrão do Sensor
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
    else { // Acima de 80°C
        visorValor.classList.add("perigo");
        visorStatus.classList.add("perigo");
        visorStatus.textContent = "CRÍTICO: Supreaquecimento Detectado!";
    }
}

/**
 * AÇÃO DO DESAFIO EXTRA: Bloqueia o SCADA de forma irreversível
 */
function dispararParadaEmergencia() {
    // Para imediatamente a leitura do sensor
    clearInterval(intervaloSensor);

    // Força o visual crítico no visor de temperatura
    const visorValor = document.getElementById("temperatura-valor");
    const visorStatus = document.getElementById("sensor-status");
    visorValor.className = "perigo";
    visorStatus.className = "perigo";
    visorStatus.textContent = "SISTEMA BLOQUEADO DEVIDO A INTERRUPÇÃO CRÍTICA";

    // Bloqueia todos os componentes interativos do painel
    document.getElementById("select-maquinas").disabled = true;
    document.getElementById("btn-emergencia").disabled = true;

    // Dispara o alerta síncrono na tela
    alert("PARADA DE EMERGÊNCIA ATIVADA!");
}

/**
 * Inicializador do barramento SCADA (Pooling de 2.5 segundos)
 */
function inicializarMonitoramento() {
    monitorarSensor();
    intervaloSensor = setInterval(monitorarSensor, 2500);
}