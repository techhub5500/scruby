// Editor functionality - Word-like text editor

let currentFile = null;

// Open file editor
function openFileEditor(file) {
    currentFile = file;
    const container = document.querySelector('.pages-container');
    container.innerHTML = '';
    const page = document.createElement('div');
    page.className = 'editor-content page';
    page.contentEditable = true;
    page.spellcheck = true;
    page.innerHTML = file.content || '';
    container.appendChild(page);
    document.getElementById('file-editor').style.display = 'flex';
    document.getElementById('default-content').style.display = 'none';
    document.getElementById('content').classList.add('editor-open');
    
    // Focus on the page
    page.focus();
}

// Save file content
async function saveFile() {
    if (currentFile) {
        const page = document.querySelector('.page');
        currentFile.content = page ? page.innerHTML : '';
        
        // Save to server
        try {
            const response = await fetch(`${API_URL}/filesystem/${USER_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(window.fileSystemData)
            });
            
            if (response.ok) {
                showSaveNotification();
            } else {
                console.error('Error saving file');
            }
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }
}

// Show save notification
function showSaveNotification() {
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.textContent = '✓ Arquivo salvo';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Close editor
function closeEditor() {
    document.getElementById('file-editor').style.display = 'none';
    document.getElementById('default-content').style.display = 'block';
    document.getElementById('content').classList.remove('editor-open');
    currentFile = null;
}

// Text formatting functions
function formatText(command, value = null) {
    document.execCommand(command, false, value);
    document.getElementById('editor-textarea').focus();
}

function clearFormatting() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        const textNode = document.createTextNode(selectedText);
        range.deleteContents();
        range.insertNode(textNode);
    }
    document.getElementById('editor-textarea').focus();
}

// Change font family
function changeFontFamily(font) {
    formatText('fontName', font);
}

// Change font size
function changeFontSize(size) {
    // Convert size to HTML font size (1-7)
    const sizeMap = {
        '10': '1',
        '12': '2',
        '14': '3',
        '16': '4',
        '18': '5',
        '20': '6',
        '24': '7'
    };
    formatText('fontSize', sizeMap[size] || '3');
}

// Initialize editor event listeners
function initEditor() {
    // Save button
    document.getElementById('save-file').addEventListener('click', saveFile);
    
    // Formatting buttons
    document.getElementById('btn-bold').addEventListener('click', () => formatText('bold'));
    document.getElementById('btn-italic').addEventListener('click', () => formatText('italic'));
    document.getElementById('btn-underline').addEventListener('click', () => formatText('underline'));
    document.getElementById('btn-strikethrough').addEventListener('click', () => formatText('strikeThrough'));
    document.getElementById('btn-clear').addEventListener('click', clearFormatting);
    
    // Alignment buttons
    document.getElementById('btn-align-left').addEventListener('click', () => formatText('justifyLeft'));
    document.getElementById('btn-align-center').addEventListener('click', () => formatText('justifyCenter'));
    document.getElementById('btn-align-right').addEventListener('click', () => formatText('justifyRight'));
    
    // List buttons
    document.getElementById('btn-ul').addEventListener('click', () => formatText('insertUnorderedList'));
    document.getElementById('btn-ol').addEventListener('click', () => formatText('insertOrderedList'));
    
    // Font controls
    document.getElementById('font-select').addEventListener('change', (e) => {
        changeFontFamily(e.target.value);
    });
    
    document.getElementById('font-size').addEventListener('change', (e) => {
        changeFontSize(e.target.value);
    });
    
    // Keyboard shortcuts
    document.querySelector('.pages-container').addEventListener('keydown', (e) => {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveFile();
        }
        // Ctrl+A to select all
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            selectAll();
        }
        // Ctrl+B for bold
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            formatText('bold');
        }
        // Ctrl+I for italic
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            formatText('italic');
        }
        // Ctrl+U for underline
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            formatText('underline');
        }
    });
}

function selectAll() {
    const page = document.querySelector('.page');
    if (!page) return;
    
    const range = document.createRange();
    range.selectNodeContents(page);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

// Export functions for use in other files
window.Editor = {
    openFileEditor: openFileEditor,
    saveFile: saveFile,
    closeEditor: closeEditor,
    init: initEditor
};