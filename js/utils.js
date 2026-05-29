/* ==========================================================================
   SAMYAK - UTILITY FUNCTIONS (utils.js)
   ========================================================================== */

function cleanDuplicatedTableHeaders(text) {
    if (!text) return text;
    const lines = text.split('\n');
    const cleanedLines = [];
    let activeTableHeader = null;
    let activeTableSeparator = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        const isTableLine = trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2;

        if (isTableLine) {
            const isSeparator = trimmed.replace(/[^|:\-]/g, '').trim() === trimmed && trimmed.includes('-');
            
            if (isSeparator) {
                if (cleanedLines.length > 0) {
                    const prevLine = cleanedLines[cleanedLines.length - 1].trim();
                    if (activeTableHeader && prevLine === activeTableHeader && activeTableSeparator !== null) {
                        cleanedLines.pop();
                        continue;
                    }
                    if (activeTableSeparator === null) {
                        activeTableSeparator = trimmed;
                    }
                }
            } else {
                if (activeTableHeader === null) {
                    activeTableHeader = trimmed;
                    activeTableSeparator = null;
                } else if (trimmed === activeTableHeader) {
                    let nextIsSeparator = false;
                    if (i + 1 < lines.length) {
                        const nextTrimmed = lines[i + 1].trim();
                        if (nextTrimmed.startsWith('|') && nextTrimmed.endsWith('|')) {
                            nextIsSeparator = nextTrimmed.replace(/[^|:\-]/g, '').trim() === nextTrimmed && nextTrimmed.includes('-');
                        }
                    }
                    if (nextIsSeparator) {
                        i++;
                        continue;
                    }
                }
            }
        } else {
            activeTableHeader = null;
            activeTableSeparator = null;
        }

        cleanedLines.push(line);
    }
    return cleanedLines.join('\n');
}

// 5. PARSER & HTML BUILDER
function preProcessText(text) {
    if (!text) return '';
    text = cleanDuplicatedTableHeaders(text);
    
    let formatted = text.replace(/\r/g, '').replace(/[\u200B\uFEFF\u200C\u200D\u200E\u200F]/g, '');
    
    // 1. Insert newlines before any diamond emojis unless preceded by '#' (markdown headings)
    formatted = formatted.replace(/([^\n#\s])\s*(🔶|🔷|🔸|🔹|♦️|💎)/g, '$1\n$2');
    
    // 2. Insert newlines before bullet points if not already preceded by one
    formatted = formatted.replace(/([^\n])\s*(•|●|■|▪|▫|[\u2022\u25CF\u25AA\u25AB])/g, '$1\n$2');
    
    // 3. Insert newlines before known sections if they are embedded in text
    const autoSplitSections = [
        "योजनाएँ एवं नीतियाँ", "योजनाएँ एवं नीतियां", "योजनाएं एवं नीतियां", 
        "महोत्सव/मेले/कार्यक्रम", "महोत्सव, मेले व कार्यक्रम", "महोत्सव, मेले और कार्यक्रम",
        "आर्थिक विकास व समझौते", "आर्थिक विकास", "आर्थिक विकास और समझौते"
    ];
    autoSplitSections.forEach(sec => {
        const escapedSec = sec.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`([^\\n#\\s])\\s*(${escapedSec})`, 'g');
        formatted = formatted.replace(regex, '$1\n$2');
    });

    return formatted;
}

function formatMarkdownText(text) {
    if (!text) return '';
    const colorMap = {
        'y': 'yellow', 'yellow': 'yellow',
        'g': 'green', 'green': 'green',
        'p': 'pink', 'pink': 'pink',
        'b': 'blue', 'blue': 'blue',
        'o': 'orange', 'orange': 'orange'
    };
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/==(?:(yellow|green|pink|blue|orange|y|g|p|b|o)\|)?(.*?)==/gi, (match, color, content) => {
            const colorKey = (color || 'yellow').toLowerCase();
            const normalizedColor = colorMap[colorKey] || 'yellow';
            return `<mark class="text-highlight highlight-${normalizedColor}">${content}</mark>`;
        });

    // 1. Math Unicode Shorthand Replacements
    const mathSymbols = {
        '\\\\alpha': 'α',
        '\\\\beta': 'β',
        '\\\\gamma': 'γ',
        '\\\\delta': 'δ',
        '\\\\Delta': 'Δ',
        '\\\\theta': 'θ',
        '\\\\lambda': 'λ',
        '\\\\mu': 'μ',
        '\\\\pi': 'π',
        '\\\\sigma': 'σ',
        '\\\\omega': 'ω',
        '\\\\phi': 'φ',
        '\\\\infty': '∞',
        '\\\\times': '×',
        '\\\\div': '÷',
        '\\\\pm': '±',
        '\\\\leq': '≤',
        '\\\\geq': '≥',
        '\\\\neq': '≠',
        '\\\\approx': '≈',
        '\\\\sqrt': '√',
        '\\\\degree': '°'
    };
    for (const [key, unicode] of Object.entries(mathSymbols)) {
        formatted = formatted.replace(new RegExp(key, 'g'), unicode);
    }

    // 2. Exponent / Superscript parsing
    formatted = formatted.replace(/([a-zA-Z0-9\u0900-\u097F\)\}\]]+)\s*\^\s*\((.*?)\)/g, '$1<sup>$2</sup>');
    formatted = formatted.replace(/([a-zA-Z0-9\u0900-\u097F\)\}\]]+)\s*\^\s*([0-9a-zA-Z\u0900-\u097F+\-/*=]+)/g, '$1<sup>$2</sup>');

    // 3. Subscript parsing
    formatted = formatted.replace(/([a-zA-Z0-9\u0900-\u097F\)\}\]]+)\s*_\s*\((.*?)\)/g, '$1<sub>$2</sub>');
    formatted = formatted.replace(/([a-zA-Z0-9\u0900-\u097F\)\}\]]+)\s*_\s*([0-9a-zA-Z\u0900-\u097F+\-/*=]+)/g, '$1<sub>$2</sub>');

    return formatted;
}

function parseCommentAttributes(str) {
    const attrs = {};
    const content = str.replace('<!--', '').replace('-->', '').trim();
    const pipeIdx = content.indexOf('|');
    if (pipeIdx === -1) return attrs;
    
    const partsStr = content.substring(pipeIdx + 1);
    const parts = partsStr.split('|');
    parts.forEach(part => {
        const eqIdx = part.indexOf('=');
        if (eqIdx !== -1) {
            const key = part.substring(0, eqIdx).trim();
            const val = part.substring(eqIdx + 1).trim();
            attrs[key] = val;
        }
    });
    return attrs;
}

function createEndDividerElement() {
    const dividerContainer = document.createElement('div');
    dividerContainer.className = 'end-page-divider';
    
    const sym = customDesignSettings.endStarSymbol || '✦';
    
    const star1 = document.createElement('span');
    star1.className = 'star-symbol';
    star1.textContent = sym;
    
    const star2 = document.createElement('span');
    star2.className = 'star-symbol';
    star2.textContent = sym;
    
    const star3 = document.createElement('span');
    star3.className = 'star-symbol';
    star3.textContent = sym;
    
    dividerContainer.appendChild(star1);
    dividerContainer.appendChild(star2);
    dividerContainer.appendChild(star3);
    
    return dividerContainer;
}

function getTelegramLink(input) {
    if (!input) return '#';
    const trimmed = input.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }
    const handle = trimmed.startsWith('@') ? trimmed.substring(1) : trimmed;
    return `https://t.me/${handle}`;
}

function getYouTubeLink(input) {
    if (!input) return '#';
    const trimmed = input.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }
    if (trimmed.startsWith('@')) {
        return `https://youtube.com/${trimmed}`;
    }
    return `https://youtube.com/results?search_query=${encodeURIComponent(trimmed)}`;
}

// Markdown text insert/wrap helper
function insertWrappedAtCursor(myField, prefix, suffix) {
    myField.focus();
    const startPos = myField.selectionStart;
    const endPos = myField.selectionEnd;
    const selectedText = myField.value.substring(startPos, endPos);
    const replacement = prefix + selectedText + suffix;
    
    myField.value = myField.value.substring(0, startPos)
        + replacement
        + myField.value.substring(endPos, myField.value.length);
        
    // Reset cursor selection
    if (selectedText.length > 0) {
        myField.selectionStart = startPos;
        myField.selectionEnd = startPos + replacement.length;
    } else {
        myField.selectionStart = startPos + prefix.length;
        myField.selectionEnd = startPos + prefix.length;
    }
}

function insertAtCursor(myField, myValue) {
    insertWrappedAtCursor(myField, myValue, '');
}
