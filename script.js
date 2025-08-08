// Helper function for UUID generation (simplified for vanilla JS)
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Helper function for class concatenation (simplified cn from lib/utils.ts)
function cn(...args) {
    return args.filter(Boolean).join(' ');
}

// DOM Elements
const htmlElement = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const messagesContainer = document.getElementById('messages-container');
const messagesEndRef = document.getElementById('messages-end-ref');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const lightbulbButton = document.getElementById('lightbulb-button');
const suggestionsBox = document.getElementById('suggestions-box');
const closeSuggestionsButton = document.getElementById('close-suggestions-button');
const suggestionsGrid = document.getElementById('suggestions-grid');

const menuTrigger = document.getElementById('menu-trigger');
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarCloseButton = document.getElementById('sidebar-close-button');
const newConversationButton = document.getElementById('new-conversation-button');
const chatHistoryList = document.getElementById('chat-history-list');
const clearAllHistoryButton = document.getElementById('clear-all-history-button');

// State Variables
let messages = [];
let inputMessage = '';
let isGenerating = false;
let showSuggestions = false;
let chatHistory = [];

// Predefined Responses (same as in page.tsx)
const predefinedResponses = {
    // ESCOLAS/COLÉGIOS
    'melhores escolas sao paulo': "🏫 <strong>Melhores colégios em São Paulo:</strong><br><br>🌟 <strong>Particulares:</strong><br>• Colégio Bandeirantes<br>• Colégio São Luís<br>• Colégio Dante Alighieri<br>• Colégio Rio Branco<br>• Colégio Santa Cruz<br><br>🏛️ <strong>Públicas de destaque:</strong><br>• ETEC (Escolas Técnicas)<br>• Colégio Pedro II<br>• IF-SP (Instituto Federal)<br><br>📍 Todas com excelente infraestrutura e ensino de qualidade!",
    'colegio sao paulo': "🏫 <strong>Melhores colégios em São Paulo:</strong><br><br>🌟 <strong>Particulares:</strong><br>• Colégio Bandeirantes<br>• Colégio São Luís<br>• Colégio Dante Alighieri<br>• Colégio Rio Branco<br>• Colégio Santa Cruz<br><br>🏛️ <strong>Públicas de destaque:</strong><br>• ETEC (Escolas Técnicas)<br>• Colégio Pedro II<br>• IF-SP (Instituto Federal)<br><br>📍 Todas com excelente infraestrutura e ensino de qualidade!",
    'melhores escolas rio grande do sul': "🏫 <strong>Melhores colégios no Rio Grande do Sul:</strong><br><br>🌟 <strong>Particulares:</strong><br>• Colégio Anchieta (Porto Alegre)<br>• Colégio Farroupilha<br>• Colégio Marista Rosário<br>• Colégio João XXIII<br>• Colégio La Salle<br><br>🏛️ <strong>Públicas de destaque:</strong><br>• Colégio Militar de Porto Alegre<br>• IF-RS (Instituto Federal)<br>• Colégio de Aplicação UFRGS<br><br>📍 Tradição e excelência no ensino gaúcho!",
    'colegio rio grande do sul': "🏫 <strong>Melhores colégios no Rio Grande do Sul:</strong><br><br>🌟 <strong>Particulares:</strong><br>• Colégio Anchieta (Porto Alegre)<br>• Colégio Farroupilha<br>• Colégio Marista Rosário<br>• Colégio João XXIII<br>• Colégio La Salle<br><br>🏛️ <strong>Públicas de destaque:</strong><br>• Colégio Militar de Porto Alegre<br>• IF-RS (Instituto Federal)<br>• Colégio de Aplicação UFRGS<br><br>📍 Tradição e excelência no ensino gaúcho!",
    'melhores escolas minas gerais': "🏫 <strong>Melhores colégios em Minas Gerais:</strong><br><br>🌟 <strong>Particulares:</strong><br>• Colégio Santo Antônio (BH)<br>• Colégio Bernoulli<br>• Colégio Magnum<br>• Colégio Santa Dorotéia<br>• Colégio Loyola<br><br>🏛️ <strong>Públicas de destaque:</strong><br>• Colégio Técnico UFMG<br>• IF-MG (Instituto Federal)<br>• Colégio Militar de Belo Horizonte<br><br>📍 Qualidade mineira reconhecida nacionalmente!",
    'colegio minas gerais': "🏫 <strong>Melhores colégios em Minas Gerais:</strong><br><br>🌟 <strong>Particulares:</strong><br>• Colégio Santo Antônio (BH)<br>• Colégio Bernoulli<br>• Colégio Magnum<br>• Colégio Santa Dorotéia<br>• Colégio Loyola<br><br>🏛️ <strong>Públicas de destaque:</strong><br>• Colégio Técnico UFMG<br>• IF-MG (Instituto Federal)<br>• Colégio Militar de Belo Horizonte<br><br>📍 Qualidade mineira reconhecida nacionalmente!",
    // SUPERMERCADOS
    'melhores supermercados sao paulo': "🛒 <strong>Melhores supermercados em São Paulo:</strong><br><br>💰 <strong>Preço e variedade:</strong><br>• Extra Hiper<br>• Carrefour<br>• Walmart (Big)<br>• Atacadão<br><br>🌟 <strong>Qualidade premium:</strong><br>• Pão de Açúcar<br>• St. Marche<br>• Empório Santa Maria<br>• Zona Sul<br><br>🏪 <strong>Regionais:</strong><br>• Sonda Supermercados<br>• Dia Supermercado<br><br>📍 Ótimas opções para todos os bolsos!",
    'melhores supermercados rio grande do sul': "🛒 <strong>Melhores supermercados no Rio Grande do Sul:</strong><br><br>💰 <strong>Preço e variedade:</strong><br>• Zaffari<br>• Nacional<br>• Big (Walmart)<br>• Carrefour<br><br>🌟 <strong>Qualidade regional:</strong><br>• Bourbon<br>• Unisuper<br>• Super Muffato<br>• Imec<br><br>🏪 <strong>Atacado:</strong><br>• Makro<br>• Atacadão<br><br>📍 Tradição gaúcha no varejo!",
    'melhores supermercados minas gerais': "🛒 <strong>Melhores supermercados em Minas Gerais:</strong><br><br>💰 <strong>Preço e variedade:</strong><br>• EPA Supermercados<br>• Carrefour<br>• Extra<br>• Atacadão<br><br>🌟 <strong>Qualidade regional:</strong><br>• Verdemar<br>• Super Nosso<br>• BH Supermercados<br>• Bahamas<br><br>🏪 <strong>Tradicionais:</strong><br>• Pão de Açúcar<br>• Big<br><br>📍 Qualidade mineira no atendimento!",
    // ORFANATOS/ADOÇÃO
    'melhores orfanatos sao paulo': "👶 <strong>Instituições para adoção em São Paulo:</strong><br><br>🏠 <strong>Principais instituições:</strong><br>• Casa Lar Meimei<br>• Lar Sírio Pró-Infância<br>• Fundação Abrinq<br>• Casa de Zion<br>• Lar das Crianças<br><br>📋 <strong>Processo legal:</strong><br>• Cadastro Nacional de Adoção (CNA)<br>• Vara da Infância e Juventude<br>• Curso preparatório obrigatório<br><br>⚖️ <strong>IMPORTANTE:</strong> A adoção deve ser feita através dos canais oficiais da Justiça!<br><br>📞 <strong>Contato:</strong> Tribunal de Justiça de SP",
    'melhores orfanatos rio grande do sul': "👶 <strong>Instituições para adoção no Rio Grande do Sul:</strong><br><br>🏠 <strong>Principais instituições:</strong><br>• Casa Lar Menino Jesus<br>• Fundação Fé e Alegria<br>• Casa da Criança e do Adolescente<br>• Lar Escola Santa Rita<br>• Instituto Amigos de Lucas<br><br>📋 <strong>Processo legal:</strong><br>• Cadastro Nacional de Adoção (CNA)<br>• Vara da Infância e Juventude<br>• Curso preparatório obrigatório<br><br>⚖️ <strong>IMPORTANTE:</strong> Adoção deve ser feita através dos canais oficiais da Justiça!<br><br>📞 <strong>Contato:</strong> Tribunal de Justiça do RS",
    'melhores orfanatos minas gerais': "👶 <strong>Instituições para adoção em Minas Gerais:</strong><br><br>🏠 <strong>Principais instituições:</strong><br>• Casa do Caminho<br>• Lar Fabiano de Cristo<br>• Casa Lar Amor de Mãe<br>• Instituto Padre Machado<br>• Casa da Criança São Vicente<br><br>📋 <strong>Processo legal:</strong><br>• Cadastro Nacional de Adoção (CNA)<br>• Vara da Infância e Juventude<br>• Curso preparatório obrigatório<br><br>⚖️ <strong>IMPORTANTE:</strong> Adoção deve ser feita através dos canais oficiais da Justiça!<br><br>📞 <strong>Contato:</strong> Tribunal de Justiça de MG",
    // CAPACIDADES DO BOT
    'minhas capacidades': "🎯 <strong>Eu posso ajudar você com:</strong><br><br>🏫 <strong>Educação:</strong><br>• Melhores escolas por região<br>• Informações sobre colégios<br>• Dicas educacionais<br><br>🛒 <strong>Compras:</strong><br>• Melhores supermercados<br>• Dicas de economia<br>• Onde encontrar produtos<br><br>👶 <strong>Adoção:</strong><br>• Informações sobre o processo<br>• Instituições credenciadas<br>• Orientações legais<br><br>💬 <strong>E muito mais!</strong> Pergunte à vontade! 😊",
};

// Suggested Questions (same as in page.tsx)
const suggestedQuestions = [
    { text: "Melhores escolas São Paulo", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gamepad"><path d="M6 12H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M12 6v4"/><path d="M15 9h-6"/><path d="M12 18v4"/><path d="M17 17l-2 2"/><path d="M17 17l2 2"/><path d="M17 17l-2-2"/><path d="M17 17l2-2"/><path d="M7 17l-2 2"/><path d="M7 17l2 2"/><path d="M7 17l-2-2"/><path d="M7 17l2-2"/></svg>' },
    { text: "Melhores escolas Rio Grande do Sul", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/></svg>' },
    { text: "Melhores supermercados São Paulo", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/></svg>' },
    { text: "Melhores supermercados Rio Grande do Sul", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2h-2c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1"/><path d="M17 15v7"/></svg>' },
    { text: "Melhores orfanatos São Paulo", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.0 0 0 0 0-5H18"/><path d="M4.5 22H19.5"/><path d="M12 17V2"/><path d="M12 17H6.5a2.5 2.5 0 0 0 0 5H17.5a2.5 2.5 0 0 0 0-5H12Z"/></svg>' },
    { text: "Melhores orfanatos Rio Grande do Sul", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cpu"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M6 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="M18 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"/><path d="M6 6v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/><path d="M18 18v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/></svg>' },
    { text: "Melhores orfanatos Minas Gerais", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2h-2c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1"/><path d="M17 15v7"/></svg>' },
    { text: "Melhores supermercados Minas Gerais", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-warehouse"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M2 20h20"/><path d="M6 14v6"/><path d="M10 14v6"/><path d="M14 14v6"/><path d="M18 14v6"/></svg>' },
    { text: "Melhores escolas Minas Gerais", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-anchor"><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M12 2a7 7 0 0 0-7 7v5H2l8 8 8-8h-3V9a7 7 0 0 0-7-7Z"/></svg>' },
    { text: "Minhas capacidades", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>' },
];

const initialWelcomeMessage = {
    id: uuidv4(),
    sender: 'bot',
    text: 'Olá! Eu sou o ChatDonety! 👋 Seu assistente pessoal para poder te ajudar em procura de escolas, orfanatos, mercados e muito mais! Pergunte-me qualquer coisa ou use o menu para ver sugestões.',
    timestamp: Date.now(),
};

// --- Functions ---

function renderMessages() {
    messagesContainer.innerHTML = ''; // Clear existing messages
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = cn(
            "chat-message",
            msg.sender === 'user' ? "user" : "bot"
        );

        const avatarHtml = msg.sender === 'user'
            ? `<div class="message-avatar user"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`
            : `<div class="message-avatar bot"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot"><path d="M12 8V4H8"/><path d="M22 13a8 8 0 0 1-8 8H6a8 8 0 0 1-8-8V7a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v6Z"/><path d="M2 14h2c2 0 2 2 4 2s4-2 6-2s4 2 4 2h2"/></svg></div>`;

        const timestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageElement.innerHTML = `
            ${msg.sender === 'bot' ? avatarHtml : ''}
            <div class="message-content">
                <p class="message-text">${msg.text}</p>
                <span class="message-timestamp">${timestamp}</span>
            </div>
            ${msg.sender === 'user' ? avatarHtml : ''}
        `;
        messagesContainer.appendChild(messageElement);
    });

    if (isGenerating) {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="logo-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot"><path d="M12 8V4H8"/><path d="M22 13a8 8 0 0 1-8 8H6a8 8 0 0 1-8-8V7a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v6Z"/><path d="M2 14h2c2 0 2 2 4 2s4-2 6-2s4 2 4 2h2"/></svg>
            </div>
            <div class="dot-flashing-wrapper">
                <div class="dot-flashing"></div>
            </div>
        `;
        messagesContainer.appendChild(typingIndicator);
    }

    scrollToBottom();
}

function scrollToBottom() {
    messagesEndRef.scrollIntoView({ behavior: "smooth" });
}

function toggleTheme() {
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        htmlElement.classList.add('dark');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }
}

function handleSendMessage(e) {
    e.preventDefault();
    if (messageInput.value.trim() && !isGenerating) {
        const userMessageText = messageInput.value.trim();
        const userMessage = {
            id: uuidv4(),
            sender: 'user',
            text: userMessageText,
            timestamp: Date.now(),
        };
        messages = [...messages, userMessage];
        messageInput.value = '';
        inputMessage = ''; // Clear internal state
        isGenerating = true;
        renderMessages(); // Render user message and typing indicator

        const normalizedQuestion = userMessageText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        let botResponseText = 'Desculpe, não entendi sua pergunta. Por favor, tente uma das sugestões ou reformule.';

        if (predefinedResponses[normalizedQuestion]) {
            botResponseText = predefinedResponses[normalizedQuestion];
        } else {
            if (normalizedQuestion.includes('escola') && predefinedResponses[normalizedQuestion.replace('escola', 'colegio')]) {
                botResponseText = predefinedResponses[normalizedQuestion.replace('escola', 'colegio')];
            } else if (normalizedQuestion.includes('colegio') && predefinedResponses[normalizedQuestion.replace('colegio', 'escola')]) {
                botResponseText = predefinedResponses[normalizedQuestion.replace('colegio', 'escola')];
            }
        }

        setTimeout(() => {
            const botResponse = {
                id: uuidv4(),
                sender: 'bot',
                text: botResponseText,
                timestamp: Date.now(),
            };
            messages = [...messages, botResponse];
            isGenerating = false;
            renderMessages(); // Render bot response
            saveMessages();
        }, 1000);
    }
}

function toggleSuggestions() {
    showSuggestions = !showSuggestions;
    if (showSuggestions) {
        suggestionsBox.classList.remove('hidden');
        renderSuggestions();
    } else {
        suggestionsBox.classList.add('hidden');
    }
}

function renderSuggestions() {
    suggestionsGrid.innerHTML = '';
    suggestedQuestions.forEach((suggestion, index) => {
        const button = document.createElement('button');
        button.className = 'suggestion-button';
        button.innerHTML = `${suggestion.icon} <span class="flex-1 text-sm font-medium">${suggestion.text}</span>`;
        button.onclick = () => handleSuggestionClick(suggestion.text);
        suggestionsGrid.appendChild(button);
    });
}

function handleSuggestionClick(suggestionText) {
    messageInput.value = suggestionText;
    inputMessage = suggestionText; // Update internal state
    toggleSuggestions(); // Close suggestions
    messageInput.focus(); // Focus input after selecting suggestion
}

function saveMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function loadMessages() {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
    } else {
        messages = [initialWelcomeMessage];
    }
    renderMessages();
}

function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    renderChatHistory();
}

function loadChatHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
    }
    renderChatHistory();
}

function renderChatHistory() {
    chatHistoryList.innerHTML = '';
    if (chatHistory.length === 0) {
        chatHistoryList.innerHTML = '<p class="no-history-message">Nenhuma conversa salva.</p>';
    } else {
        chatHistory.forEach(item => {
            const button = document.createElement('button');
            button.className = 'sidebar-button';
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span class="flex-1">${item.title}</span>
                <span class="text-xs text-dark-text-secondary dark:text-light-text-secondary ml-2 flex-shrink-0">
                    ${new Date(item.timestamp).toLocaleDateString()}
                </span>
            `;
            button.onclick = () => loadConversation(item);
            chatHistoryList.appendChild(button);
        });
    }
}

function startNewConversation() {
    if (messages.length > 1 || (messages.length === 1 && messages[0].id !== initialWelcomeMessage.id)) {
        const newHistoryItem = {
            id: uuidv4(),
            timestamp: Date.now(),
            messages: messages,
            title: messages[1] ? messages[1].text.substring(0, 30) + (messages[1].text.length > 30 ? '...' : '') : 'Nova Conversa',
        };
        chatHistory = [newHistoryItem, ...chatHistory];
        saveChatHistory();
    }
    messages = [initialWelcomeMessage];
    saveMessages();
    renderMessages();
    closeSidebar();
}

function loadConversation(historyItem) {
    messages = historyItem.messages;
    saveMessages(); // Save loaded conversation as current
    renderMessages();
    closeSidebar();
}

function clearAllHistory() {
    if (window.confirm('Tem certeza que deseja limpar TODO o histórico de conversas? Esta ação é irreversível.')) {
        localStorage.removeItem('chatHistory');
        chatHistory = [];
        renderChatHistory();
        // If current conversation is not initial, also clear it
        if (messages.length > 1 || messages[0].id !== initialWelcomeMessage.id) {
            messages = [initialWelcomeMessage];
            saveMessages();
            renderMessages();
        }
        closeSidebar();
    }
}

function openSidebar() {
    sidebarMenu.classList.add('open');
    sidebarOverlay.classList.add('open');
    loadChatHistory(); // Reload history when opening sidebar
}

function closeSidebar() {
    sidebarMenu.classList.remove('open');
    sidebarOverlay.classList.remove('open');
}

// --- Event Listeners ---
themeToggle.addEventListener('click', toggleTheme);
chatForm.addEventListener('submit', handleSendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        handleSendMessage(e);
    }
});
lightbulbButton.addEventListener('click', toggleSuggestions);
closeSuggestionsButton.addEventListener('click', toggleSuggestions);

menuTrigger.addEventListener('click', openSidebar);
sidebarCloseButton.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar); // Close sidebar when clicking overlay
newConversationButton.addEventListener('click', startNewConversation);
clearAllHistoryButton.addEventListener('click', clearAllHistory);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    loadChatHistory();
    // Set initial theme icon visibility
    if (htmlElement.classList.contains('dark')) {
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    } else {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    }
});
