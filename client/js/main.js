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
const toggleRightBtn = document.getElementById('toggle-right');
if (toggleRightBtn) {
    toggleRightBtn.addEventListener('click', function() {
        const sidebar = document.getElementById('right-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('expanded');
        }
    });
}

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
    if (!tree) return; // Elemento não existe na página
    
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
    
    li.addEventListener('click', (e) => {
        e.stopPropagation();
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
            console.log('File clicked:', node);
            console.log('window.Editor:', window.Editor);
            // Try to open the file directly
            openFileInEditor(node);
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
    if (!menu) return;
    
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
    menu.style.display = 'block';
    contextNode = node;
    contextParent = parent;
    
    const createFileOpt = document.getElementById('create-file-option');
    const createFolderOpt = document.getElementById('create-folder-option');
    const copyOpt = document.getElementById('copy-option');
    const pasteOpt = document.getElementById('paste-option');
    const deleteOpt = document.getElementById('delete-option');
    const renameOpt = document.getElementById('rename-option');
    
    if (node) {
        if (node.type === 'folder') {
            if (createFileOpt) createFileOpt.style.display = 'block';
            if (createFolderOpt) createFolderOpt.style.display = 'block';
        } else {
            if (createFileOpt) createFileOpt.style.display = 'none';
            if (createFolderOpt) createFolderOpt.style.display = 'none';
        }
        if (copyOpt) copyOpt.style.display = 'block';
        if (pasteOpt) pasteOpt.style.display = 'none';
        if (deleteOpt) deleteOpt.style.display = 'block';
        if (renameOpt) renameOpt.style.display = 'block';
    } else {
        // empty
        if (createFileOpt) createFileOpt.style.display = 'block';
        if (createFolderOpt) createFolderOpt.style.display = 'block';
        if (copyOpt) copyOpt.style.display = 'none';
        if (pasteOpt) pasteOpt.style.display = clipboard ? 'block' : 'none';
        if (deleteOpt) deleteOpt.style.display = 'none';
        if (renameOpt) renameOpt.style.display = 'none';
    }
}

const leftSidebarElement = document.getElementById('left-sidebar');
if (leftSidebarElement) {
    leftSidebarElement.addEventListener('contextmenu', (e) => {
        if (e.target.id === 'folder-content' || e.target.classList.contains('tree') || e.target.id === 'file-tree') {
            e.preventDefault();
            showContextMenu(e, null, null);
        }
    });
}

const createFileOption = document.getElementById('create-file-option');
if (createFileOption) {
    createFileOption.addEventListener('click', () => {
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
}

const createFolderOption = document.getElementById('create-folder-option');
if (createFolderOption) {
    createFolderOption.addEventListener('click', () => {
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
}

const copyOption = document.getElementById('copy-option');
if (copyOption) {
    copyOption.addEventListener('click', () => {
        clipboard = JSON.parse(JSON.stringify(contextNode));
        hideMenu();
    });
}

const pasteOption = document.getElementById('paste-option');
if (pasteOption) {
    pasteOption.addEventListener('click', () => {
        if (clipboard) {
            const target = contextNode ? contextNode : fileSystem;
            target.children.push(JSON.parse(JSON.stringify(clipboard)));
            window.fileSystemData = fileSystem;
            renderTree();
            saveFileSystem();
        }
        hideMenu();
    });
}

const deleteOption = document.getElementById('delete-option');
if (deleteOption) {
    deleteOption.addEventListener('click', () => {
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
}

const renameOption = document.getElementById('rename-option');
if (renameOption) {
    renameOption.addEventListener('click', () => {
        const newName = prompt('Novo nome:', contextNode.name);
        if (newName) {
            contextNode.name = newName;
            window.fileSystemData = fileSystem;
            renderTree();
            saveFileSystem();
        }
        hideMenu();
    });
}

function hideMenu() {
    const contextMenu = document.getElementById('context-menu');
    if (contextMenu) {
        contextMenu.style.display = 'none';
    }
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
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', () => {
        closeLeftSidebar();
    });
}

const closeSidebarBtnChat = document.getElementById('close-sidebar-btn-chat');
if (closeSidebarBtnChat) {
    closeSidebarBtnChat.addEventListener('click', () => {
        closeLeftSidebar();
    });
}

// Add folder and file buttons inside the folder content
const addFolderBtn = document.getElementById('add-folder');
if (addFolderBtn) {
    addFolderBtn.addEventListener('click', () => {
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
}

const addFileBtn = document.getElementById('add-file');
if (addFileBtn) {
    addFileBtn.addEventListener('click', () => {
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
}

// Initialize editor
if (window.Editor && window.Editor.init) {
    window.Editor.init();
}

// Function to open file in editor - handles both direct call and Editor availability
function openFileInEditor(file) {
    console.log('openFileInEditor called with:', file);
    
    // Check if we're on the correct page (index.html with editor)
    const fileEditor = document.getElementById('file-editor');
    
    if (!fileEditor) {
        console.log('Not on index.html page, redirecting...');
        // Store file info in sessionStorage and redirect to index.html
        sessionStorage.setItem('fileToOpen', JSON.stringify(file));
        window.location.href = 'index.html';
        return;
    }
    
    // Check if Editor is available
    if (window.Editor && typeof window.Editor.openFileEditor === 'function') {
        console.log('Editor is available, opening file');
        window.Editor.openFileEditor(file);
    } else {
        console.log('Editor not yet available, trying manual open');
        // Fallback: open editor manually
        manualOpenEditor(file);
    }
}

// Manual editor opening function
function manualOpenEditor(file) {
    console.log('manualOpenEditor called');
    
    // Try to find content first
    const content = document.getElementById('content');
    if (!content) {
        console.error('Content element not found!');
        return;
    }
    
    console.log('Content found, searching for child elements...');
    console.log('Content innerHTML length:', content.innerHTML.length);
    
    // Search within content
    let fileEditor = content.querySelector('#file-editor');
    let defaultContent = content.querySelector('#default-content');
    
    // If not found, try direct search
    if (!fileEditor) {
        console.log('file-editor not found in content, trying document');
        fileEditor = document.getElementById('file-editor');
    }
    
    if (!defaultContent) {
        console.log('default-content not found in content, trying document');
        defaultContent = document.getElementById('default-content');
    }
    
    console.log('Final elements found:', {
        fileEditor: !!fileEditor,
        defaultContent: !!defaultContent,
        content: !!content
    });
    
    if (!fileEditor) {
        console.error('file-editor still not found! HTML structure may be different');
        console.log('Content children:', content.children);
        return;
    }
    
    // Find or create container
    let container = fileEditor.querySelector('.pages-container');
    if (!container) {
        console.log('pages-container not found, searching globally');
        container = document.querySelector('.pages-container');
    }
    
    if (!container) {
        console.error('Could not find pages-container');
        return;
    }
    
    console.log('Container found, creating page...');
    container.innerHTML = '';
    const page = document.createElement('div');
    page.className = 'editor-content page';
    page.contentEditable = 'true';
    page.spellcheck = true;
    page.innerHTML = file.content || '<p>Comece a escrever aqui...</p>';
    container.appendChild(page);
    
    console.log('Setting display styles...');
    fileEditor.style.display = 'flex';
    if (defaultContent) {
        defaultContent.style.display = 'none';
    }
    content.classList.add('editor-open');
    
    // Store current file globally
    window.currentFile = file;
    
    setTimeout(() => {
        page.focus();
        console.log('Editor opened successfully!');
    }, 100);
}

// Load file system on page load
loadFileSystem();

// Check if we need to open a file after redirect
document.addEventListener('DOMContentLoaded', () => {
    const fileToOpen = sessionStorage.getItem('fileToOpen');
    if (fileToOpen) {
        console.log('Found file to open from redirect');
        sessionStorage.removeItem('fileToOpen');
        const file = JSON.parse(fileToOpen);
        
        // Wait a bit for editor to initialize
        setTimeout(() => {
            openFileInEditor(file);
        }, 500);
    }
});

// Chat functionality
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');

// Array to store chat messages
let messages = [];

// Function to add a message to the chat
function addMessage(username, text, isOwn = false) {
    if (!chatMessages) return; // Prevent error if chat not present
    
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
    if (!chatInput) return;
    
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
if (sendChatBtn) {
    sendChatBtn.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Add welcome message
addMessage('Sistema', 'Bem-vindo ao chat! Conectado com sucesso.', false);

// JavaScript para a sidebar esquerda
// Adicione funcionalidades aqui se necessário