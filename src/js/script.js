let inputUser;
let buttonUser;
document.addEventListener('DOMContentLoaded', function() {
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
        document.querySelector('.chat-body').innerHTML = savedChatHistory;
    }
    inputUser = document.getElementById('input-user');
    buttonUser = document.getElementById('button-user');

    function checkInput() {
        if (inputUser.value.trim() === '') {
            buttonUser.style.opacity = '0.5';
            buttonUser.disabled = true;
        } else {
            buttonUser.style.opacity = '1';
            buttonUser.disabled = false;
        }
    }
    checkInput();

    inputUser.addEventListener('input', checkInput);

    function saveChatHistory() {
        const chatHistory = document.querySelector('.chat-body').innerHTML;
        localStorage.setItem('chatHistory', chatHistory);
    }
let messages = JSON.parse(localStorage.getItem('messages')) || [];

buttonUser.addEventListener('click', async function() {
    if (!buttonUser.disabled) {
        buttonUser.disabled = true;
        
        document.getElementById('typing-indicator').style.display = 'block';
        
        const chatBody = document.querySelector('.chat-body');
        const newMessageDiv = document.createElement('div');
        newMessageDiv.className = 'message-animation';
        const textUserDiv = document.createElement('div');
        textUserDiv.className = 'text-user';
        textUserDiv.style.display = "flex";
        textUserDiv.style.justifyContent = "flex-end";
        const userText = document.createElement('p');
        userText.style.background = "rgb(118, 106, 200)";
        userText.style.padding = "10px";
        userText.style.maxWidth = "330px"
        userText.style.fontFamily = '"OpenSans"';
        userText.style.fontWeight = '400';
        userText.style.fontSize = '17px';
        userText.style.borderRadius = "10px";
        userText.textContent = inputUser.value;
        textUserDiv.appendChild(userText);
        newMessageDiv.appendChild(textUserDiv);
        
        chatBody.appendChild(newMessageDiv);
        saveChatHistory();
        checkInput();
        buttonUser.style.opacity = '0.5';
        const prompt = inputUser.value;
        inputUser.value = '';
        
        messages.push({
            role: "user",
            content: prompt
        });

        let fetchBody = {
            prompt: prompt,
            markdown: false,
            messages: messages
        };

        const modelSelect = document.querySelector('select');
        const selectedModel = modelSelect.value;

        let fetchUrl;
        if (selectedModel === "s2") {
            fetchUrl = "https://nexra.aryahcr.cc/api/chat/gptweb"; 
        } else {
            fetchUrl = "https://nexra.aryahcr.cc/api/chat/gpt";
            fetchBody.model = selectedModel;
        }

        fetch(fetchUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fetchBody)
        }).then((response) => {
            if (!response.ok) {
                buttonUser.disabled = false;
                throw new Error('Network response was not ok');
            }
            return response.text();
        }).then((text) => {
            try {
                buttonUser.disabled = false;
                const trimmedText = text.trim().replace(/^_+/, '');
                const data = JSON.parse(trimmedText);
                document.getElementById('typing-indicator').style.display = 'none';
                if (data.gpt || data.gpt) {
                    messages.push({
                        role: "assistant",
                        content: data.gpt || data.gpt 
                    });

                    localStorage.setItem('messages', JSON.stringify(messages));

                    const chatBody = document.querySelector('.chat-body');
                    const newMessageDiv = document.createElement('div');
                    newMessageDiv.className = 'message-animation';
                    const textGptDiv = document.createElement('div');
                    textGptDiv.className = 'text-gpt';
                    textGptDiv.style.display = "flex";
                    const gptText = document.createElement('p');
                    gptText.style.background = "rgb(39, 39, 39)";
                    gptText.style.padding = "10px";
                    gptText.style.fontFamily = '"OpenSans"';
                    gptText.style.fontWeight = '400';
                    gptText.style.fontSize = '17px';
                    gptText.style.maxWidth = '330px';
                    gptText.style.borderRadius = "10px";
                    gptText.textContent = data.gpt || data.gpt;
                    textGptDiv.appendChild(gptText);
                    newMessageDiv.appendChild(textGptDiv);
                    chatBody.appendChild(newMessageDiv);
                    saveChatHistory();

                    gptMessageDiv.scrollIntoView({ behavior: 'smooth' });
                } else {
                    document.getElementById('typing-indicator').textContent = 'Ошибка';
                    document.getElementById('typing-indicator').style.display = 'block';
                
                    setTimeout(function() {
                        document.getElementById('typing-indicator').style.display = 'none';
                    }, 3000);
                }
            } catch (error) {
                console.error('Failed to parse JSON:', error);
            }
        }).catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
});

    const removeChatButton = document.getElementById('remove_chat');

    removeChatButton.addEventListener('click', function() {
        const chatBody = document.querySelector('.chat-body');
    
        Array.from(chatBody.children).forEach(child => {
            child.classList.add('fade-out');
        });
    
        setTimeout(() => {
            chatBody.innerHTML = '';
            messages = [];
            localStorage.removeItem('messages');
            localStorage.removeItem('chatHistory');
        }, 500);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menu-button');
    const headerMenuTop = document.querySelector('.header-menu-top');
    const hiddenTopElements = document.querySelectorAll('.hidden-top');
    function toggleMenu() {
        if (headerMenuTop.style.display === 'flex') {
            hiddenTopElements.forEach(element => {
                headerMenuTop.classList.remove('fade-in');
                headerMenuTop.classList.add('fade-out');
                element.classList.add('hidden-top-out');
                setTimeout(function() {
                    headerMenuTop.style.display = 'none'; // Скрываем контейнер после завершения ани��аци���������� всех элемен��������ов
                }, 300);
            });
            setTimeout(function() {
                element.style.display = 'none'; // Скрываем э��емен�� после завершения анимации
                element.classList.remove('hidden-top-out'); // Удаляем класс после завершения ани����ации
            }, 300);
        } else {
            headerMenuTop.style.display = 'flex';
            hiddenTopElements.forEach(element => {
                headerMenuTop.classList.remove('fade-out');
                headerMenuTop.classList.add('fade-in');
                element.style.display = 'flex'; // Показываем элементы
                element.classList.remove('hidden-top-out'); // Удаляем класс, чтобы анимация могла повторно применяться
            });
        }
    }

    headerMenuTop.addEventListener('click', toggleMenu);
    menuButton.addEventListener('click', toggleMenu);

    hiddenTopElements.forEach(element => {
        element.addEventListener('click', function() {
            headerMenuTop.style.display = 'none';
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const chatBody = document.getElementById('chat-body');
    const greeting = document.getElementById('greeting');

    function updateGreetingDisplay() {
        if (!chatBody || !greeting) {
            console.error('Element not found: chat-body or greeting');
            return;
        }

        const hasOtherElements = Array.from(chatBody.children).some(child => child !== greeting);

        chatBody.style.justifyContent = chatBody.children.length === 0 ? 'center' : (hasOtherElements ? 'flex-start' : 'center');

        greeting.style.display = chatBody.children.length === 0 ? 'flex' : (hasOtherElements ? 'none' : 'flex');
    }

    const observer = new MutationObserver(updateGreetingDisplay);
    observer.observe(chatBody, { childList: true });

    updateGreetingDisplay();

});

document.addEventListener('DOMContentLoaded', function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false; 
    recognition.maxAlternatives = 1; 

    const buttonMicro = document.getElementById('button-micro');
    const inputUser = document.getElementById('input-user');
    const microphoneImg = buttonMicro.querySelector('img'); 

    let isRecording = false; 


    buttonMicro.addEventListener('click', function() {
        if (isRecording) {
            recognition.stop();
            isRecording = false;
            buttonMicro.style.transform = '';
            microphoneImg.src = 'src/img/microphone.png';
        } else {
            recognition.start();
            isRecording = true;
            buttonMicro.style.transform = 'scale(1.3)';
            microphoneImg.src = 'src/img/microphonereg.png';
        }
    });

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        inputUser.value = speechResult;
        buttonUser.disabled = false;
        buttonUser.style.opacity = '1';
    };

    recognition.onspeechend = function() {
        recognition.stop();
    };

    recognition.onerror = function(event) {
        console.error('Ошибка SpeechRecognition:', event.error);
    };
});
document.addEventListener('DOMContentLoaded', function() {
    const modelSelect = document.querySelector('select');
    const gptHeader = document.querySelector('.chat-hedaer p');
    const chatBody = document.querySelector('.chat-body');

    gptHeader.textContent = 'GPT-4';
    gptHeader.style.fontSize = "16px";
    gptHeader.style.fontWeight = "800";

    modelSelect.addEventListener('change', function() {
        const selectedModel = modelSelect.value;
        Array.from(chatBody.children).forEach(child => {
            child.classList.add('fade-out');
        });

        setTimeout(() => {
            chatBody.innerHTML = '';
            messages = [];
            localStorage.removeItem('messages');
            localStorage.removeItem('chatHistory');
        }, 500); // Задержка равна времени анимации

        if (selectedModel === "s1") {
            gptHeader.textContent = 'GPT-4';
        } else if (selectedModel === "s2") {
            gptHeader.textContent = 'GPT-4 WEB';
        }
    });
});
function typingAnimation() {
    const typingDots = document.getElementById('typing-dots');
    let dots = '';
    let i = 0;

    const addDots = () => {
        if (i < 3) {
            dots += '.';
            typingDots.textContent = dots;
            i++;
            setTimeout(addDots, 500);
        } else {
            removeDots();
        }
    };

    const removeDots = () => {
        if (i > 0) {
            dots = dots.slice(0, -1);
            typingDots.textContent = dots;
            i--;
            setTimeout(removeDots, 500);
        } else {
            addDots();
        }
    };

    addDots();
}
typingAnimation();

function checkInternetConnection() {
    const onlineStatus = document.getElementById('online-status'); // Предполагается, что у вас есть элемент с id 'online-status' в вашем HTML

    if (navigator.onLine) {
        onlineStatus.textContent = 'В сети';
        onlineStatus.style.color = 'green';
    } else {
        onlineStatus.textContent = 'Не в сети';
        onlineStatus.style.color = 'red';
    }
}

checkInternetConnection();
window.addEventListener('online', checkInternetConnection);
window.addEventListener('offline', checkInternetConnection);


document.addEventListener('DOMContentLoaded', function() {
    const photoButton = document.getElementById('photo');

    photoButton.addEventListener('click', function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                console.log('Выбран файл:', file);
                const fileURL = URL.createObjectURL(file);
                Tesseract.recognize(
                    fileURL,
                    'rus',
                    { logger: m => console.log(m) }
                ).then(({ data: { text } }) => {
                    inputUser.value = text; // Устанавливаем распознанный текст в inputUser
                    buttonUser.disabled = false; // Убедимся, что кнопка отправки не отключена
                    buttonUser.style.opacity = '1'; // Устанавливаем прозрачность кнопки в нормальное состояние
                    buttonUser.click(); // Имитируем нажатие кнопки отправки
                    saveChatHistory(); // Сохраняем историю чата
                    saveChatHistory();
                })
                .catch(err => {
                    console.error('Ошибка при распознавании текста:', err);
                });
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();

        fileInput.addEventListener('change', function() {
            document.body.removeChild(fileInput);
        });
    });
});