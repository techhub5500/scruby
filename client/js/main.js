// JavaScript combinado para header e sidebars

// Initialize left sidebar as collapsed
document.addEventListener('DOMContentLoaded', function() {
    const leftSidebar = document.getElementById('left-sidebar');
    leftSidebar.classList.add('collapsed');
});

// Function to open left sidebar with specific content
function openLeftSidebar(contentId) {
    const sidebar = document.getElementById('left-sidebar');
    const allContents = sidebar.querySelectorAll('.sidebar-content');
    
    // Hide all contents
    allContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Show the requested content
    const targetContent = document.getElementById(contentId);
    if (targetContent) {
        targetContent.style.display = 'block';
    }
    
    // Open sidebar
    sidebar.classList.remove('collapsed');
}

// Function to close left sidebar
function closeLeftSidebar() {
    const sidebar = document.getElementById('left-sidebar');
    sidebar.classList.add('collapsed');
    
    // Hide all contents
    const allContents = sidebar.querySelectorAll('.sidebar-content');
    allContents.forEach(content => {
        content.style.display = 'none';
    });
}

// Toggle right sidebar
document.getElementById('toggle-right').addEventListener('click', function() {
    const sidebar = document.getElementById('right-sidebar');
    sidebar.classList.toggle('expanded');
});

// Resize left sidebar
const leftSidebar = document.getElementById('left-sidebar');
let isResizingLeft = false;

leftSidebar.addEventListener('mousemove', (e) => {
    if (!leftSidebar.classList.contains('collapsed') && e.offsetX > leftSidebar.offsetWidth - 10) {
        leftSidebar.style.cursor = 'ew-resize';
    } else {
        leftSidebar.style.cursor = 'default';
    }
});

leftSidebar.addEventListener('mousedown', (e) => {
    if (!leftSidebar.classList.contains('collapsed') && e.offsetX > leftSidebar.offsetWidth - 10) {
        isResizingLeft = true;
        e.preventDefault();
    }
});

document.addEventListener('mousemove', (e) => {
    if (isResizingLeft) {
        const newWidth = e.clientX;
        if (newWidth > 100 && newWidth < window.innerWidth - 200) {
            leftSidebar.style.width = newWidth + 'px';
        }
    }
});

document.addEventListener('mouseup', () => {
    isResizingLeft = false;
});

// Resize right sidebar
const rightSidebar = document.getElementById('right-sidebar');
let isResizingRight = false;

rightSidebar.addEventListener('mousemove', (e) => {
    if (e.offsetX < 10) {
        rightSidebar.style.cursor = 'ew-resize';
    } else {
        rightSidebar.style.cursor = 'default';
    }
});

rightSidebar.addEventListener('mousedown', (e) => {
    if (rightSidebar.classList.contains('expanded') && e.offsetX < 10) {
        isResizingRight = true;
        e.preventDefault();
    }
});

document.addEventListener('mousemove', (e) => {
    if (isResizingRight) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 100 && newWidth < window.innerWidth - 200) {
            rightSidebar.style.width = newWidth + 'px';
        }
    }
});

document.addEventListener('mouseup', () => {
    isResizingRight = false;
});

// File system
const API_URL = 'http://localhost:3001/api';
const USER_ID = 'default-user'; // Por enquanto um usuário padrão

// Expose globally for editor.js
window.API_URL = API_URL;
window.USER_ID = USER_ID;

let fileSystem = {
    name: 'Root',
    type: 'folder',
    children: []
};

// Expose fileSystem globally for editor
window.fileSystemData = fileSystem;

// Load file system from server
async function loadFileSystem() {
    try {
        const response = await fetch(`${API_URL}/filesystem/${USER_ID}`);
        if (response.ok) {
            fileSystem = await response.json();
            window.fileSystemData = fileSystem;
            currentFolder = fileSystem; // Update currentFolder reference
            renderTree();
        }
    } catch (error) {
        console.error('Error loading file system:', error);
    }
}

// Save file system to server
async function saveFileSystem() {
    try {
        const response = await fetch(`${API_URL}/filesystem/${USER_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fileSystem)
        });
        if (response.ok) {
            console.log('File system saved successfully');
            const data = await response.json();
            console.log('Server response:', data);
        } else {
            console.error('Error saving file system. Status:', response.status);
            const errorText = await response.text();
            console.error('Error details:', errorText);
        }
    } catch (error) {
        console.error('Error saving file system:', error);
    }
}

let currentFolder = fileSystem;
let clipboard = null;
let nodeMap = new Map();

function isDescendant(node, potentialAncestor) {
    if (node.type !== 'folder') return false;
    for (let child of node.children) {
        if (child === potentialAncestor || isDescendant(child, potentialAncestor)) {
            return true;
        }
    }
    return false;
}

function renderTree() {
    nodeMap.clear();
    const tree = document.getElementById('file-tree');
    tree.innerHTML = '';
    
    // Remove old event listeners by cloning
    const newTree = tree.cloneNode(false);
    tree.parentNode.replaceChild(newTree, tree);
    
    // Add drop event to the tree for moving to root
    newTree.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedNode) {
            e.dataTransfer.dropEffect = 'move';
            newTree.classList.add('drag-over');
        }
    });
    
    newTree.addEventListener('dragleave', () => {
        newTree.classList.remove('drag-over');
    });
    
    newTree.addEventListener('drop', (e) => {
        e.preventDefault();
        newTree.classList.remove('drag-over');
        if (draggedNode && draggedParent) {
            const index = draggedParent.children.indexOf(draggedNode);
            if (index !== -1) {
                draggedParent.children.splice(index, 1);
                fileSystem.children.push(draggedNode);
                window.fileSystemData = fileSystem;
                renderTree();
                saveFileSystem();
            }
        }
    });
    
    if (fileSystem.children && fileSystem.children.length > 0) {
        fileSystem.children.forEach(child => renderNode(child, newTree, fileSystem));
    }
}

function renderNode(node, parentElement, parentNode) {
    const li = document.createElement('li');
    li.className = node.type;
    if (node.type === 'folder' && node.children.length > 0) {
        li.classList.add('has-children');
    }
    
    // Create icon element
    const icon = document.createElement('i');
    if (node.type === 'folder') {
        icon.className = 'fas fa-folder';
        li.classList.add('folder-closed');
    } else {
        icon.className = 'fas fa-file';
    }
    
    // Create text node
    const textNode = document.createTextNode(' ' + node.name);
    
    // Append icon and text
    li.appendChild(icon);
    li.appendChild(textNode);
    
    li.draggable = true;
    
    li.addEventListener('click', () => {
        if (node.type === 'folder') {
            li.classList.toggle('expanded');
            const icon = li.querySelector('i');
            if (li.classList.contains('expanded')) {
                icon.className = 'fas fa-folder-open';
            } else {
                icon.className = 'fas fa-folder';
            }
            currentFolder = node;
        } else if (node.type === 'file') {
            if (window.Editor && window.Editor.openFileEditor) {
                window.Editor.openFileEditor(node);
            }
        }
    });
    
    li.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, node, parentNode);
    });
    
    // Drag and drop events
    li.addEventListener('dragstart', (e) => {
        draggedNode = node;
        draggedParent = parentNode;
        e.dataTransfer.effectAllowed = 'move';
        li.classList.add('dragging');
    });
    
    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
        draggedNode = null;
        draggedParent = null;
    });
    
    li.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (node.type === 'folder' && draggedNode && draggedNode !== node) {
            e.dataTransfer.dropEffect = 'move';
            li.classList.add('drag-over');
        } else {
            e.dataTransfer.dropEffect = 'none';
        }
    });
    
    li.addEventListener('dragleave', () => {
        li.classList.remove('drag-over');
    });
    
    li.addEventListener('drop', (e) => {
        e.preventDefault();
        li.classList.remove('drag-over');
        if (node.type === 'folder' && draggedNode && draggedNode !== node && draggedParent && !isDescendant(draggedNode, node)) {
            // Move the node
            const index = draggedParent.children.indexOf(draggedNode);
            if (index !== -1) {
                draggedParent.children.splice(index, 1);
                node.children.push(draggedNode);
                window.fileSystemData = fileSystem;
                renderTree();
                saveFileSystem();
            }
        }
    });
    
    nodeMap.set(li, {node, parent: parentNode});
    parentElement.appendChild(li);

    if (node.type === 'folder' && node.children.length > 0) {
        const ul = document.createElement('ul');
        node.children.forEach(child => renderNode(child, ul, node));
        parentElement.appendChild(ul);
    }
}

let draggedNode = null;
let draggedParent = null;

function showContextMenu(e, node, parent) {
    const menu = document.getElementById('context-menu');
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
    menu.style.display = 'block';
    contextNode = node;
    contextParent = parent;
    if (node) {
        if (node.type === 'folder') {
            document.getElementById('create-file-option').style.display = 'block';
            document.getElementById('create-folder-option').style.display = 'block';
        } else {
            document.getElementById('create-file-option').style.display = 'none';
            document.getElementById('create-folder-option').style.display = 'none';
        }
        document.getElementById('copy-option').style.display = 'block';
        document.getElementById('paste-option').style.display = 'none';
        document.getElementById('delete-option').style.display = 'block';
        document.getElementById('rename-option').style.display = 'block';
    } else {
        // empty
        document.getElementById('create-file-option').style.display = 'block';
        document.getElementById('create-folder-option').style.display = 'block';
        document.getElementById('copy-option').style.display = 'none';
        document.getElementById('paste-option').style.display = clipboard ? 'block' : 'none';
        document.getElementById('delete-option').style.display = 'none';
        document.getElementById('rename-option').style.display = 'none';
    }
}

document.getElementById('left-sidebar').addEventListener('contextmenu', (e) => {
    if (e.target.id === 'folder-content' || e.target.classList.contains('tree') || e.target.id === 'file-tree') {
        e.preventDefault();
        showContextMenu(e, null, null);
    }
});

document.getElementById('create-file-option').addEventListener('click', () => {
    const target = contextNode ? contextNode : fileSystem;
    const name = prompt('Nome do arquivo:');
    if (name) {
        target.children.push({
            name: name,
            type: 'file',
            content: ''
        });
        window.fileSystemData = fileSystem;
        renderTree();
        saveFileSystem();
    }
    hideMenu();
});

document.getElementById('create-folder-option').addEventListener('click', () => {
    const target = contextNode ? contextNode : fileSystem;
    const name = prompt('Nome da pasta:');
    if (name) {
        target.children.push({
            name: name,
            type: 'folder',
            children: []
        });
        window.fileSystemData = fileSystem;
        renderTree();
        saveFileSystem();
    }
    hideMenu();
});

document.getElementById('copy-option').addEventListener('click', () => {
    clipboard = JSON.parse(JSON.stringify(contextNode));
    hideMenu();
});

document.getElementById('paste-option').addEventListener('click', () => {
    if (clipboard) {
        const target = contextNode ? contextNode : fileSystem;
        target.children.push(JSON.parse(JSON.stringify(clipboard)));
        window.fileSystemData = fileSystem;
        renderTree();
        saveFileSystem();
    }
    hideMenu();
});

document.getElementById('delete-option').addEventListener('click', () => {
    if (confirm(`Apagar "${contextNode.name}"?`)) {
        const index = contextParent.children.indexOf(contextNode);
        if (index !== -1) {
            contextParent.children.splice(index, 1);
            window.fileSystemData = fileSystem;
            renderTree();
            saveFileSystem();
        }
    }
    hideMenu();
});

document.getElementById('rename-option').addEventListener('click', () => {
    const newName = prompt('Novo nome:', contextNode.name);
    if (newName) {
        contextNode.name = newName;
        window.fileSystemData = fileSystem;
        renderTree();
        saveFileSystem();
    }
    hideMenu();
});

function hideMenu() {
    document.getElementById('context-menu').style.display = 'none';
}

document.addEventListener('click', () => {
    hideMenu();
});

// Event listeners for sidebar icons
document.getElementById('home-icon-btn').addEventListener('click', () => {
    // Redirecionar para página inicial
    window.location.href = 'home.html';
});

document.getElementById('folder-icon-btn').addEventListener('click', () => {
    openLeftSidebar('folder-content');
});

document.getElementById('chat-icon-btn').addEventListener('click', () => {
    openLeftSidebar('chat-content');
});

// Close buttons for each sidebar content
document.getElementById('close-sidebar-btn').addEventListener('click', () => {
    closeLeftSidebar();
});

document.getElementById('close-sidebar-btn-chat').addEventListener('click', () => {
    closeLeftSidebar();
});

// Add folder and file buttons inside the folder content
document.getElementById('add-folder').addEventListener('click', () => {
    const name = prompt('Nome da pasta:');
    if (name) {
        fileSystem.children.push({
            name: name,
            type: 'folder',
            children: []
        });
        
        currentFolder = fileSystem; // Reset to root
        window.fileSystemData = fileSystem;
        
        renderTree();
        saveFileSystem();
    }
});

document.getElementById('add-file').addEventListener('click', () => {
    const name = prompt('Nome do arquivo:');
    if (name) {
        fileSystem.children.push({
            name: name,
            type: 'file',
            content: ''
        });
        
        currentFolder = fileSystem;
        window.fileSystemData = fileSystem;
        renderTree();
        saveFileSystem();
    }
});

// Initialize editor
if (window.Editor && window.Editor.init) {
    window.Editor.init();
}

// Load file system on page load
loadFileSystem();

// Chat functionality
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');

// Array to store chat messages
let messages = [];

// Function to add a message to the chat
function addMessage(username, text, isOwn = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isOwn ? 'own-message' : ''}`;
    
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-username">${username}</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-text">${text}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Store message
    messages.push({ username, text, time, isOwn });
}

// Function to send a message
function sendMessage() {
    const text = chatInput.value.trim();
    if (text) {
        addMessage('Você', text, true);
        chatInput.value = '';
        
        // Simulate response from other user (for demonstration)
        setTimeout(() => {
            const responses = [
                'Entendi!',
                'Interessante!',
                'Pode me explicar melhor?',
                'Obrigado pela informação!',
                'Estou trabalhando nisso.',
                'Vou verificar e te retorno.'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage('Usuário ' + Math.floor(Math.random() * 3 + 1), randomResponse, false);
        }, 1000 + Math.random() * 2000);
    }
}

// Event listeners for chat
sendChatBtn.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

// Add welcome message
addMessage('Sistema', 'Bem-vindo ao chat! Conectado com sucesso.', false);

// JavaScript para a sidebar esquerda
// Adicione funcionalidades aqui se necessário