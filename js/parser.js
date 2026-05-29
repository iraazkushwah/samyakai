/* ==========================================================================
   SAMYAK - MARKDOWN PARSER & ELEMENT GENERATOR (parser.js)
   ========================================================================== */

function parseTextToBlocks(text) {
    // Preserving trailing spaces and newlines to prevent cursor jumping
    text = text || '';
    text = preProcessText(text);
    const lines = text.split('\n');
    const blocks = [];
    
    const knownSections = [
        "योजनाएँ एवं नीतियाँ", "योजनाएँ एवं नीतियां", "योजनाएं एवं नीतियां", 
        "महोत्सव/मेले/कार्यक्रम", "महोत्सव, मेले व कार्यक्रम", "महोत्सव, मेले और कार्यक्रम",
        "आर्थिक विकास व समझौते", "आर्थिक विकास", "आर्थिक विकास और समझौते",
        "चर्चित व्यक्तित्व", "पुरस्कार", "खेल", "खेल समाचार", "विविध", 
        "विविध घटनाक्रम", "प्रमुख अभियान"
    ];

    for (let i = 0; i < lines.length; i++) {
        const start = i;
        const line = lines[i];
        const trimmed = line.trim();
        if (!trimmed) {
            blocks.push({
                type: 'empty',
                markdown: '',
                startLine: start,
                endLine: i
            });
            continue;
        }

        // 0.2 BOX CONTAINER BLOCK DETECTOR
        const bulletRegex = /^\s*(?:[•\-\*\u2022\u25CF]|\(\d+\)|\d+\.)\s*/;
        const cleanBoxLine = trimmed.replace(bulletRegex, '').trim();

        if (cleanBoxLine.startsWith('[box') && cleanBoxLine.endsWith(']')) {
            const boxType = cleanBoxLine.substring(1, cleanBoxLine.length - 1); // e.g. "box", "box-double", "box-dashed", "box-bg", "box-royal"
            let boxLines = [];
            i++; // consume opening tag line
            while (i < lines.length) {
                const nextLine = lines[i];
                const nextTrimmed = nextLine.trim();
                const nextCleanBoxLine = nextTrimmed.replace(bulletRegex, '').trim();
                if (nextCleanBoxLine === '[/box]') {
                    break;
                }
                boxLines.push(nextLine);
                i++;
            }
            blocks.push({
                type: 'box-container',
                boxType: boxType,
                markdown: boxLines.join('\n'),
                startLine: start,
                endLine: i
            });
            continue;
        }

        // Match 'space [1-50]' (optional brackets, count defaults to 1, capped at 50)
        const spaceMatch = trimmed.match(/^\[?(space|spce)(?:\s+(\d+))?\]?$/i);
        if (spaceMatch) {
            const count = Math.min(50, spaceMatch[2] ? parseInt(spaceMatch[2], 10) : 1);
            blocks.push({
                type: 'spacer',
                count: count,
                markdown: trimmed,
                startLine: start,
                endLine: i
            });
            continue;
        }

        // Custom Parsed Template Comment Blocks
        if (trimmed.startsWith('<!-- personality|') && trimmed.endsWith('-->')) {
            blocks.push({
                type: 'personality',
                markdown: trimmed,
                startLine: start,
                endLine: i
            });
            continue;
        }
        if (trimmed.startsWith('<!-- stats|') && trimmed.endsWith('-->')) {
            blocks.push({
                type: 'stats',
                markdown: trimmed,
                startLine: start,
                endLine: i
            });
            continue;
        }
        if (trimmed.startsWith('<!-- facts-grid|') && trimmed.endsWith('-->')) {
            blocks.push({
                type: 'facts-grid',
                markdown: trimmed,
                startLine: start,
                endLine: i
            });
            continue;
        }
        if (trimmed.startsWith('<!-- announcement|') && trimmed.endsWith('-->')) {
            blocks.push({
                type: 'announcement',
                markdown: trimmed,
                startLine: start,
                endLine: i
            });
            continue;
        }

        // 0. TABLE DETECTOR WITH CONFIG SUPPORT
        let tableConfig = null;
        if (trimmed.startsWith('<!-- table|') && trimmed.endsWith('-->')) {
            tableConfig = trimmed;
            if (i + 1 < lines.length && lines[i + 1].trim().startsWith('|') && lines[i + 1].trim().endsWith('|')) {
                i++; // consume comment, move to first table row
                let tableLines = [lines[i]];
                while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|') && lines[i + 1].trim().endsWith('|')) {
                    i++;
                    tableLines.push(lines[i]);
                }
                blocks.push({
                    type: 'table',
                    config: tableConfig,
                    markdown: tableLines.join('\n'),
                    startLine: start,
                    endLine: i
                });
                continue;
            }
        } else if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
            let tableLines = [line];
            while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|') && lines[i + 1].trim().endsWith('|')) {
                i++;
                tableLines.push(lines[i]);
            }
            blocks.push({
                type: 'table',
                config: null,
                markdown: tableLines.join('\n'),
                startLine: start,
                endLine: i
            });
            continue;
        }

        // Chapter Banner/Header detector: [chapter 1] Title | Subtitle (number is optional)
        const chapterMatch = trimmed.match(/^\[chapter(?:\s+(\d+))?\]\s*([^|]+)(?:\|\s*(.+))?$/i);
        if (chapterMatch) {
            blocks.push({
                type: 'chapter-header',
                number: chapterMatch[1] || '',
                title: chapterMatch[2].trim(),
                subtitle: chapterMatch[3] ? chapterMatch[3].trim() : '',
                markdown: line,
                startLine: start,
                endLine: i
            });
            continue;
        }

        // 0.5 PAGEBREAK DETECTOR
        if (trimmed === '[pagebreak]' || trimmed === '---') {
            blocks.push({
                type: 'pagebreak',
                markdown: line,
                startLine: start,
                endLine: i
            });
            continue;
        }

        // 0.55 COLUMN BREAK DETECTOR
        if (trimmed === '[columnbreak]' || trimmed === '[colbreak]') {
            blocks.push({
                type: 'columnbreak',
                markdown: line,
                startLine: start,
                endLine: i
            });
            continue;
        }


        // 0.6 THANK YOU BOX DETECTOR / STAR DIVIDER
        if (trimmed === '[thankyou]' || trimmed === '***' || trimmed === '* * *' || trimmed === '✦ ✦ ✦') {
            blocks.push({
                type: 'thankyou',
                markdown: line,
                startLine: start,
                endLine: i
            });
            continue;
        }

        const cleanLine = trimmed.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '').trim();

        // 1. SECTION BAR DETECTOR
        if (trimmed.startsWith('# ') || (trimmed.startsWith('#') && !trimmed.startsWith('##'))) {
            blocks.push({
                type: 'section',
                markdown: line,
                startLine: start,
                endLine: i
            });
        } else if (
            !trimmed.startsWith('##') &&
            !/^[🔶🔷🔸🔹♦️💎]/u.test(trimmed) &&
            knownSections.some(sec => {
                const cleanSec = sec.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '').trim();
                return cleanLine === cleanSec || trimmed === sec;
            })
        ) {
            blocks.push({
                type: 'section',
                markdown: line,
                startLine: start,
                endLine: i
            });
        } 
        
        // 2. TOPIC HEADING DETECTOR
        else if (
            trimmed.startsWith('## ') || 
            trimmed.startsWith('##') || 
            /^[🔶🔷🔸🔹♦️💎]/u.test(trimmed) ||
            /^##\s*[🔶🔷🔸🔹♦️💎]/u.test(trimmed)
        ) {
            blocks.push({
                type: 'topic',
                markdown: line,
                startLine: start,
                endLine: i
            });
        } 
        
        // 3. BULLET ITEM DETECTOR
        else if (
            trimmed.startsWith('•') || 
            trimmed.startsWith('-') || 
            trimmed.startsWith('*') || 
            /^\(\d+\)/.test(trimmed) || 
            /^\d+\./.test(trimmed)
        ) {
            blocks.push({
                type: 'bullet',
                markdown: line,
                startLine: start,
                endLine: i
            });
        } 
        
        // 4. HIGHLIGHT BOX / QUOTE DETECTOR
        else if (trimmed.startsWith('> ')) {
            blocks.push({
                type: 'box',
                markdown: line,
                startLine: start,
                endLine: i
            });
        } 

        // 4.5 IMAGE DETECTOR
        else if (trimmed.startsWith('![') && trimmed.endsWith(')')) {
            blocks.push({
                type: 'image',
                markdown: line,
                startLine: start,
                endLine: i
            });
        }
        
        // 5. REGULAR BODY PARAGRAPH
        else {
            blocks.push({
                type: 'paragraph',
                markdown: line,
                startLine: start,
                endLine: i
            });
        }
    }

    return blocks;
}

function renderBlockToNode(block) {
    const line = block.markdown.trim();
    
    if (block.type === 'box-container') {
        const containerEl = document.createElement('div');
        containerEl.className = `premium-box ${block.boxType || 'box'}`;
        
        // Parse the internal markdown into blocks recursively
        const innerBlocks = parseTextToBlocks(block.markdown);
        
        // Render and append each block
        innerBlocks.forEach(innerBlock => {
            const node = renderBlockToNode(innerBlock);
            if (node) {
                containerEl.appendChild(node);
            }
        });
        
        return containerEl;
    }
    
    if (block.type === 'personality') {
        const attrs = parseCommentAttributes(line);
        const card = document.createElement('div');
        card.className = 'personality-feature-card';
        
        const avatar = document.createElement('div');
        avatar.className = 'personality-avatar-wrapper';
        avatar.textContent = attrs.avatar || '👤';
        
        const info = document.createElement('div');
        info.className = 'personality-info';
        
        const name = document.createElement('div');
        name.className = 'personality-name';
        name.textContent = attrs.name || 'ऋषभ पारेख';
        
        const title = document.createElement('div');
        title.className = 'personality-title';
        title.textContent = attrs.title || 'संस्कृत व्याकरण विशेषज्ञ';
        
        const desc = document.createElement('div');
        desc.className = 'personality-description';
        desc.textContent = attrs.desc || 'विवरण उपलब्ध नहीं है।';
        
        info.appendChild(name);
        info.appendChild(title);
        info.appendChild(desc);
        card.appendChild(avatar);
        card.appendChild(info);
        return card;
    }
    if (block.type === 'stats') {
        const attrs = parseCommentAttributes(line);
        const grid = document.createElement('div');
        grid.className = 'stats-callout-grid';
        
        if (attrs.num1 || attrs.lbl1) {
            const c1 = document.createElement('div');
            c1.className = 'stat-card';
            c1.innerHTML = `
                <div class="stat-number">${attrs.num1 || '0'}</div>
                <div class="stat-label">${attrs.lbl1 || 'Label'}</div>
                <div class="stat-desc">${attrs.desc1 || ''}</div>
            `;
            grid.appendChild(c1);
        }
        if (attrs.num2 || attrs.lbl2) {
            const c2 = document.createElement('div');
            c2.className = 'stat-card';
            c2.innerHTML = `
                <div class="stat-number">${attrs.num2 || '0'}</div>
                <div class="stat-label">${attrs.lbl2 || 'Label'}</div>
                <div class="stat-desc">${attrs.desc2 || ''}</div>
            `;
            grid.appendChild(c2);
        }
        if (attrs.num3 || attrs.lbl3) {
            const c3 = document.createElement('div');
            c3.className = 'stat-card';
            c3.innerHTML = `
                <div class="stat-number">${attrs.num3 || '0'}</div>
                <div class="stat-label">${attrs.lbl3 || 'Label'}</div>
                <div class="stat-desc">${attrs.desc3 || ''}</div>
            `;
            grid.appendChild(c3);
        }
        return grid;
    }
    if (block.type === 'facts-grid') {
        const attrs = parseCommentAttributes(line);
        const grid = document.createElement('div');
        grid.className = 'quick-facts-grid';
        
        for (let k = 1; k <= 4; k++) {
            if (attrs[`t${k}`] || attrs[`d${k}`]) {
                const card = document.createElement('div');
                card.className = 'fact-card';
                card.innerHTML = `
                    <div class="fact-title">📌 ${attrs[`t${k}`] || 'Fact Title'}</div>
                    <div class="fact-desc">${attrs[`d${k}`] || 'Fact detail description goes here.'}</div>
                `;
                grid.appendChild(card);
            }
        }
        return grid;
    }
    if (block.type === 'announcement') {
        const attrs = parseCommentAttributes(line);
        const box = document.createElement('div');
        box.className = 'announcement-alert-box';
        
        const title = document.createElement('div');
        title.className = 'announcement-title';
        title.innerHTML = `📢 <span>${attrs.title || 'विशेष सूचना'}</span>`;
        
        const content = document.createElement('div');
        content.className = 'announcement-content';
        content.textContent = attrs.content || 'महत्वपूर्ण सूचना यहाँ प्रदर्शित होगी।';
        
        box.appendChild(title);
        box.appendChild(content);
        return box;
    }

    if (block.type === 'chapter-header') {
        const headerEl = document.createElement('div');
        headerEl.className = 'chapter-header';

        const titleGroup = document.createElement('div');
        titleGroup.className = 'chapter-title-group';

        if (block.number) {
            const numWrapper = document.createElement('div');
            numWrapper.className = 'chapter-number-wrapper';

            const accentBg = document.createElement('div');
            accentBg.className = 'chapter-number-bg-accent';

            const mainBg = document.createElement('div');
            mainBg.className = 'chapter-number-bg-main';

            const numVal = document.createElement('span');
            numVal.className = 'chapter-number-val';
            numVal.textContent = block.number;

            mainBg.appendChild(numVal);
            numWrapper.appendChild(accentBg);
            numWrapper.appendChild(mainBg);

            headerEl.appendChild(numWrapper);
            titleGroup.style.paddingRight = '70px'; // Offset for centering when number box is present
        } else {
            titleGroup.style.paddingRight = '0'; // Center perfectly without offset when no number box is present
        }

        const mainTitle = document.createElement('h2');
        mainTitle.className = 'chapter-main-title';
        mainTitle.textContent = block.title;

        titleGroup.appendChild(mainTitle);

        if (block.subtitle) {
            const subTitle = document.createElement('h3');
            subTitle.className = 'chapter-sub-title';
            subTitle.textContent = block.subtitle;
            titleGroup.appendChild(subTitle);
        }

        headerEl.appendChild(titleGroup);
        return headerEl;
    }

    // 1. SECTION BAR RENDER
    if (block.type === 'section') {
        const sectionTitle = line.replace(/^#+\s*/, '').replace(/^[?？\s]+/, '').trim();
        const sectionEl = document.createElement('h1');
        sectionEl.className = 'section-heading-bar';
        sectionEl.setAttribute('data-shape', customDesignSettings.sectionShape || 'rectangle');
        sectionEl.textContent = sectionTitle;
        return sectionEl;
    } 
    
    // 2. TOPIC HEADING RENDER
    else if (block.type === 'topic') {
        let topicTitle = line;
        if (topicTitle.startsWith('##')) {
            topicTitle = topicTitle.replace(/^##+\s*/, '');
        }
        
        let icon = '🔶'; // Default icon
        const emojiMatch = topicTitle.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Emoji}|\S)\s*/u);
        if (emojiMatch) {
            const matchedIcon = emojiMatch[1];
            if (!/^[a-zA-Z0-9\u0900-\u097F]/.test(matchedIcon)) {
                icon = matchedIcon;
                topicTitle = topicTitle.substring(emojiMatch[0].length).trim();
            }
        }

        topicTitle = topicTitle.replace(/^[🔶🔷🔸🔹♦️💎]\s*/, '').trim();

        // Apply global topic icon style if it's the default orange diamond
        if (icon === '🔶') {
            const globalIconStyle = customDesignSettings.topicIcon || 'orange-diamond';
            if (globalIconStyle === 'blue-diamond') icon = '🔷';
            else if (globalIconStyle === 'star') icon = '⭐';
            else if (globalIconStyle === 'pushpin') icon = '📌';
            else if (globalIconStyle === 'rocket') icon = '🚀';
            else if (globalIconStyle === 'nib') icon = '✒️';
            else if (globalIconStyle === 'pencil') icon = '📝';
            // Premium Magazine Icons
            else if (globalIconStyle === 'crown') icon = '👑';
            else if (globalIconStyle === 'fleur-de-lis') icon = '⚜️';
            else if (globalIconStyle === 'sparkles') icon = '✨';
            else if (globalIconStyle === 'book') icon = '📖';
            else if (globalIconStyle === 'jewel') icon = '💎';
            else if (globalIconStyle === 'quill') icon = '🪶';
            else if (globalIconStyle === 'trophy') icon = '🏆';
            // Hand Icons
            else if (globalIconStyle === 'hand-right') icon = '👉';
            else if (globalIconStyle === 'hand-writing') icon = '✍️';
            else if (globalIconStyle === 'hand-thumb') icon = '👍';
            else if (globalIconStyle === 'hand-up') icon = '👆';
            else if (globalIconStyle === 'none') icon = '';
        }

        const topicContainer = document.createElement('div');
        topicContainer.className = 'topic-container';
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'topic-title';
        titleEl.innerHTML = `<span class="diamond">${icon}</span> ${topicTitle}`;

        const divider = document.createElement('div');
        divider.className = 'topic-divider';

        topicContainer.appendChild(titleEl);
        topicContainer.appendChild(divider);
        return topicContainer;
    } 
    
    // 3. BULLET ITEM RENDER
    else if (block.type === 'bullet') {
        let bulletText = line.replace(/^[•\-\*\u2022\u25CF]\s*/, '').trim();
        const item = document.createElement('div');
        item.className = 'bullet-item';
        let formattedText = formatMarkdownText(bulletText);
        item.innerHTML = formattedText;
        return item;
    } 
    
    // 4. HIGHLIGHT BOX / QUOTE RENDER
    else if (block.type === 'box') {
        const highlightText = line.substring(2).trim();
        const box = document.createElement('div');
        box.className = 'highlight-box';
        box.textContent = highlightText;
        return box;
    } 

    // 4.5 IMAGE RENDER
    else if (block.type === 'image') {
        const match = line.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (match) {
            const altText = match[1];
            const src = match[2];
            
            const parts = altText.split('|');
            const captionText = parts[0] || 'Photo';
            const widthVal = parts[1] || '90%';
            const alignVal = parts[2] || 'center';

            const imgContainer = document.createElement('div');
            imgContainer.className = 'inserted-image-container';
            
            if (alignVal === 'left') {
                imgContainer.style.alignItems = 'flex-start';
            } else if (alignVal === 'right') {
                imgContainer.style.alignItems = 'flex-end';
            } else {
                imgContainer.style.alignItems = 'center';
            }

            const img = document.createElement('img');
            img.className = 'inserted-image';
            img.alt = captionText;
            img.style.width = widthVal;
            
            if (uploadedImages && uploadedImages[src]) {
                img.src = uploadedImages[src];
            } else {
                img.src = src;
            }
            
            imgContainer.appendChild(img);

            if (captionText && captionText !== 'none') {
                const caption = document.createElement('div');
                caption.className = 'inserted-image-caption';
                caption.textContent = captionText;
                imgContainer.appendChild(caption);
            }
            return imgContainer;
        }
        // Fallback if regex failed
        const emptyDiv = document.createElement('div');
        return emptyDiv;
    }

    // 4.75 TABLE RENDER
    else if (block.type === 'table') {
        const table = document.createElement('table');
        table.className = 'markdown-table';

        // Apply configuration if present
        if (block.config) {
            const parts = block.config.replace('<!--', '').replace('-->', '').split('|');
            parts.forEach(part => {
                const kv = part.trim().split('=');
                if (kv.length === 2) {
                    const key = kv[0].trim().toLowerCase();
                    const val = kv[1].trim();
                    if (key === 'width') {
                        table.style.width = val;
                    } else if (key === 'align') {
                        if (val === 'center') {
                            table.style.marginLeft = 'auto';
                            table.style.marginRight = 'auto';
                        } else if (val === 'right') {
                            table.style.marginLeft = 'auto';
                            table.style.marginRight = '0';
                        } else {
                            table.style.marginLeft = '0';
                            table.style.marginRight = 'auto';
                        }
                    }
                }
            });
        }
        
        const tbody = document.createElement('tbody');
        const lines = block.markdown.split('\n');
        
        let isFirstRow = true;
        
        for (let j = 0; j < lines.length; j++) {
            const line = lines[j].trim();
            if (!line) continue;
            
            // Skip separator row
            if (j === 1 && line.replace(/[^|:\-]/g, '').trim() === line) {
                continue;
            }
            
            const cells = line.split('|')
                .map(c => c.trim())
                .slice(1, -1);
            
            const tr = document.createElement('tr');
            const isHeader = isFirstRow;
            isFirstRow = false;
            
            cells.forEach(cellText => {
                const cell = document.createElement(isHeader ? 'th' : 'td');
                let formattedText = formatMarkdownText(cellText);
                cell.innerHTML = formattedText;
                tr.appendChild(cell);
            });
            
            tbody.appendChild(tr);
        }
        
        table.appendChild(tbody);
        return table;
    }
    
    // 4.9 EMPTY SPACER RENDER
    else if (block.type === 'empty') {
        const p = document.createElement('p');
        p.className = 'body-text empty-line';
        p.innerHTML = '&nbsp;';
        return p;
    }
    
    // 4.95 SPACER BLOCK RENDER (DYNAMIC GAP)
    else if (block.type === 'spacer') {
        const div = document.createElement('div');
        div.className = 'vertical-spacer';
        div.style.display = 'block';
        div.style.width = '100%';
        const count = block.count || 1;
        div.style.height = `calc(var(--content-font-size) * var(--content-line-height, 1.45) * ${count})`;
        return div;
    }
    
    
    // 4.96 END DIVIDER (***) RENDER
    else if (block.type === 'thankyou') {
        return createEndDividerElement();
    }
    
    // 4.97 COLUMN BREAK RENDER
    else if (block.type === 'columnbreak') {
        const div = document.createElement('div');
        div.className = 'column-break';
        return div;
    }
    
    // 5. REGULAR BODY PARAGRAPH RENDER
    else {
        const p = document.createElement('p');
        p.className = 'body-text';
        let formattedText = formatMarkdownText(line);
        p.innerHTML = formattedText;
        return p;
    }
}

function updateNodeContent(node, type, markdown) {
    let line = markdown.trim();
    if (type === 'bullet') {
        let bulletText = line.replace(/^[•\-\*\u2022\u25CF]\s*/, '').trim();
        let formattedText = formatMarkdownText(bulletText);
        node.innerHTML = formattedText;
    } else if (type === 'box') {
        let highlightText = line.replace(/^\s*>\s*/, '').trim();
        node.textContent = highlightText;
    } else if (type === 'table') {
        const tbody = document.createElement('tbody');
        const lines = markdown.split('\n');
        let isFirstRow = true;
        
        for (let j = 0; j < lines.length; j++) {
            const line = lines[j].trim();
            if (!line) continue;
            
            if (j === 1 && line.replace(/[^|:\-]/g, '').trim() === line) {
                continue;
            }
            
            const cells = line.split('|')
                .map(c => c.trim())
                .slice(1, -1);
            
            const tr = document.createElement('tr');
            const isHeader = isFirstRow;
            isFirstRow = false;
            
            cells.forEach(cellText => {
                const cell = document.createElement(isHeader ? 'th' : 'td');
                let formattedText = formatMarkdownText(cellText);
                cell.innerHTML = formattedText;
                tr.appendChild(cell);
            });
            
            tbody.appendChild(tr);
        }
        node.innerHTML = '';
        node.appendChild(tbody);
    } else if (type === 'empty') {
        node.innerHTML = '&nbsp;';
    } else if (type === 'spacer') {
        const spaceMatch = markdown.trim().match(/^\[?(space|spce)(?:\s+(\d+))?\]?$/i);
        const count = Math.min(50, (spaceMatch && spaceMatch[2]) ? parseInt(spaceMatch[2], 10) : 1);
        node.style.height = `calc(var(--content-font-size) * var(--content-line-height, 1.45) * ${count})`;
    } else if (type === 'thankyou') {
        if (node.querySelector('h1')) node.querySelector('h1').textContent = lastPageData.title;
        if (node.querySelector('h2')) node.querySelector('h2').textContent = lastPageData.subtitle;
        if (node.querySelector('p')) node.querySelector('p').textContent = lastPageData.tagline;
    } else {
        let formattedText = formatMarkdownText(line);
        node.innerHTML = formattedText;
    }
}

// High-performance memoization cache to keep height estimations lightning fast
const heightEstimationCache = new Map();

// Helper to estimate height of a parsed block of content to reduce layout thrashing
function estimateBlockHeight(block, fontSize, lineSpacing, isTwoCol = false) {
    const cacheKey = `${block.type}_${fontSize}_${lineSpacing}_${isTwoCol}_${block.markdown}`;
    if (heightEstimationCache.has(cacheKey)) {
        return heightEstimationCache.get(cacheKey);
    }

    const result = calculateBlockHeightRaw(block, fontSize, lineSpacing, isTwoCol);
    heightEstimationCache.set(cacheKey, result);
    return result;
}

function calculateBlockHeightRaw(block, fontSize, lineSpacing, isTwoCol = false) {
    const lineHeight = fontSize * lineSpacing;
    const text = block.markdown || '';
    const trimmed = text.trim();
    if (!trimmed) return lineHeight;

    switch (block.type) {
        case 'box-container':
            {
                const innerBlocks = parseTextToBlocks(block.markdown);
                let innerHeight = 0;
                innerBlocks.forEach(inner => {
                    innerHeight += estimateBlockHeight(inner, fontSize, lineSpacing, isTwoCol);
                });
                return innerHeight + 24; // Inner blocks height + 24px box padding
            }
        case 'section':
            return 55; // 18px font size + padding/margin
        case 'topic':
            return 45; // 15px font size + padding/margin
        case 'empty':
            return lineHeight;
        case 'spacer':
            {
                const spaceMatch = trimmed.match(/^\[?(space|spce)(?:\s+(\d+))?\]?$/i);
                const count = Math.min(50, (spaceMatch && spaceMatch[2]) ? parseInt(spaceMatch[2], 10) : 1);
                return lineHeight * count;
            }
        case 'thankyou':
            return 60;
        case 'columnbreak':
            return 0;
        case 'image':
            return 220; // conservative estimate for image height
        case 'table':
            {
                const rows = text.split('\n').filter(l => l.trim()).length;
                return (rows * 32) + 20; // 32px per row + padding/margin
            }
        case 'box':
            {
                const baseWidth = isTwoCol ? 270 : 600;
                const charsPerLine = Math.max(20, Math.floor(baseWidth / (0.6 * fontSize)));
                const lines = Math.ceil(trimmed.length / charsPerLine) || 1;
                return (lines * lineHeight) + 30; // box has border/padding
            }
        case 'bullet':
        case 'paragraph':
        default:
            {
                const baseWidth = isTwoCol ? 290 : 640;
                const charsPerLine = Math.max(20, Math.floor(baseWidth / (0.55 * fontSize)));
                const lines = Math.ceil(trimmed.length / charsPerLine) || 1;
                return (lines * lineHeight) + 8; // small margin/gap
            }
    }
}
