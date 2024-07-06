// máximo de pedidos por dia 
const orderMax = 5;

// Função para gerenciar o número do pedido, aumentando e resetando a cada 24 horas
function incrementOrderNumber() {
    let now = new Date();
    now.setHours(now.getHours() - 3); // Ajusta para o fuso horário de Brasília/São Paulo
    let today = now.toISOString().split('T')[0];
    let savedDate = localStorage.getItem('lastOrderDate');
    let orderNumber = parseInt(localStorage.getItem('orderNumber')) || 0;

    let hour = now.getUTCHours(); // Obtém a hora atual ajustada para o fuso horário

    // Verifica se é um novo dia ou se o pedido foi feito após as 12h
    if (savedDate !== today) {
        orderNumber = 0;
        localStorage.setItem('orderNumber', orderNumber);
        localStorage.setItem('lastOrderDate', today);
    } else if (hour >= 12) {
        return -1; // Indica que o horário de pedido foi encerrado
    }

    if (orderNumber >= orderMax) {
        return -2; // Indica que o limite de pedidos foi atingido
    }

    orderNumber += 1;
    localStorage.setItem('orderNumber', orderNumber);
    localStorage.setItem('lastOrderDate', today);

    return orderNumber;
}

// aumentar a quantidade do topo simples
function add(id) {
    let input = document.getElementById(id);
    let value = parseInt(input.value);
    if (value < input.max) {
        input.value = value + 1;
    }
}

// diminuir a quantidade do topo simples
function subtract(id) {
    let input = document.getElementById(id);
    let value = parseInt(input.value);
    if (value > input.min) {
        input.value = value - 1;
    }
}

// Função para avançar para a próxima etapa
function nextStep() {
    let topperValue = parseInt(document.getElementById('cakeTopper').value);
    if (topperValue > 0) {
        document.getElementById('orderForm').style.display = 'none';
        document.getElementById('secondStep').style.display = 'block';
        let detailsContainer = document.getElementById('cakeTopperDetails');
        detailsContainer.innerHTML = ''; // Limpa os detalhes anteriores

        for (let i = 1; i <= topperValue; i++) {
            detailsContainer.innerHTML += `
                <div class="infoPage">
                    <h4>Informações do Topo Simples Nº${i}</h4>
                    <hr>

                    <div class="cake"> 
                    <label for="tema${i}">* Tema do topo: </label>
                    <input placeholder="ex.: galinha pintadinha" type="text" id="tema${i}" name="tema${i}" required><br>
                    </div>

                    
                    <div class="cake">
                    <label class="tam" for="tamanho${i}">* Tamanho por <br>centímetros<br> ou por fatia: </label>
                    <input placeholder="ex.: 15cm ou 10 fatias" type="text" id="tamanho${i}" name="tamanho${i}" required><br>
                    </div>

                    <div class="cake"> 
                    <label for="idade${i}">* Idade no topo: </label>
                    <input placeholder="ex.: 0" type="text" id="idade${i}" name="idade${i}" required><br>
                    </div>

                    <div class="cake"> 
                    <label for="nome${i}">* Nome no topo: </label>
                    <input placeholder="ex.: Maria" type="text" id="nome${i}" name="nome${i}" required><br>
                    </div>

                    <div class="cake"> 
                    <label for="extra${i}">Informação extra: <br> (opcional)</label>
                    <input placeholder="ex.: não tem idade" type="text" id="extra${i}" name="extra${i}"><br>
                    </div>
                </div>
            `;
        }
    } else {
        alert('Por favor, selecione uma quantidade');
    }
}

// Função para voltar à etapa anterior
function goBack() {
    document.getElementById('secondStep').style.display = 'none';
    document.getElementById('orderForm').style.display = 'block';
}


// Função para enviar a mensagem para o WhatsApp
function sendMessage() {
    let orderNumber = incrementOrderNumber();

    if (orderNumber === -1) {
        alert('Horário de pedido encerrado');
        return;
    }

    if (orderNumber === -2) {
        alert('Limite máximo de pedidos atingido');
        return;
    }

    let message = `Pedido Nº ${orderNumber}:\n`;
    let topperValue = parseInt(document.getElementById('cakeTopper').value);
    let allFieldsFilled = true;

    for (let i = 1; i <= topperValue; i++) {
        let tamanho = document.getElementById(`tamanho${i}`).value;
        let tema = document.getElementById(`tema${i}`).value;
        let nome = document.getElementById(`nome${i}`).value;
        let idade = document.getElementById(`idade${i}`).value;
        let extra = document.getElementById(`extra${i}`).value;

        if (!tamanho || !tema || !nome || !idade) {
            allFieldsFilled = false;
            break;
        }

        message += `Informações do Topo Simples Nº${i}:\n`;
        message += `Tema: ${tema}\n`;
        message += `Tamanho: ${tamanho}\n`;
        message += `Idade: ${idade}\n`;
        message += `Nome: ${nome}\n`;
        if (extra) message += `Informação extra: ${extra}\n`;
    }

    if (allFieldsFilled) {
        let phoneNumber = '+5521994681814';
        let whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
}