// Editor functionality - Word-like text editor

let currentFile = null;

// Open file editor
function openFileEditor(file) {
    console.log('Opening file:', file);
    currentFile = file;
    
    const fileEditor = document.getElementById('file-editor');
    const defaultContent = document.getElementById('default-content');
    const content = document.getElementById('content');
    const container = document.querySelector('.pages-container');
    
    if (!fileEditor || !defaultContent || !content || !container) {
        console.error('Editor elements not found');
        return;
    }
    
    container.innerHTML = '';
    const page = document.createElement('div');
    page.className = 'editor-content page';
    page.contentEditable = true;
    page.spellcheck = true;
    page.innerHTML = file.content || '';
    container.appendChild(page);
    
    fileEditor.style.display = 'flex';
    defaultContent.style.display = 'none';
    content.classList.add('editor-open');
    
    // Focus on the page
    setTimeout(() => page.focus(), 100);
    
    console.log('Editor opened successfully');
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
    // Check if save button exists before adding listener
    const saveBtn = document.getElementById('save-file');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveFile);
    }
    
    // Check if all buttons exist before adding listeners
    const btnBold = document.getElementById('btn-bold');
    const btnItalic = document.getElementById('btn-italic');
    const btnUnderline = document.getElementById('btn-underline');
    const btnStrikethrough = document.getElementById('btn-strikethrough');
    const btnClear = document.getElementById('btn-clear');
    
    if (btnBold) btnBold.addEventListener('click', () => formatText('bold'));
    if (btnItalic) btnItalic.addEventListener('click', () => formatText('italic'));
    if (btnUnderline) btnUnderline.addEventListener('click', () => formatText('underline'));
    if (btnStrikethrough) btnStrikethrough.addEventListener('click', () => formatText('strikeThrough'));
    if (btnClear) btnClear.addEventListener('click', clearFormatting);
    
    // Alignment buttons
    const btnAlignLeft = document.getElementById('btn-align-left');
    const btnAlignCenter = document.getElementById('btn-align-center');
    const btnAlignRight = document.getElementById('btn-align-right');
    
    if (btnAlignLeft) btnAlignLeft.addEventListener('click', () => formatText('justifyLeft'));
    if (btnAlignCenter) btnAlignCenter.addEventListener('click', () => formatText('justifyCenter'));
    if (btnAlignRight) btnAlignRight.addEventListener('click', () => formatText('justifyRight'));
    
    // List buttons
    const btnUl = document.getElementById('btn-ul');
    const btnOl = document.getElementById('btn-ol');
    
    if (btnUl) btnUl.addEventListener('click', () => formatText('insertUnorderedList'));
    if (btnOl) btnOl.addEventListener('click', () => formatText('insertOrderedList'));
    
    // Font controls
    const fontSelect = document.getElementById('font-select');
    const fontSize = document.getElementById('font-size');
    
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            changeFontFamily(e.target.value);
        });
    }
    
    if (fontSize) {
        fontSize.addEventListener('change', (e) => {
            changeFontSize(e.target.value);
        });
    }
    
    // Keyboard shortcuts
    const pagesContainer = document.querySelector('.pages-container');
    if (pagesContainer) {
        pagesContainer.addEventListener('keydown', (e) => {
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
if (typeof window !== 'undefined') {
    window.Editor = {
        openFileEditor: openFileEditor,
        saveFile: saveFile,
        closeEditor: closeEditor,
        init: initEditor
    };
    
    // Auto-initialize if DOM is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEditor);
    } else {
        // DOM is already ready, initialize now
        initEditor();
    }
}