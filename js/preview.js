/* ==========================================================================
   SAMYAK - PREVIEW GENERATOR & PAGINATION CONTROLLER (preview.js)
   ========================================================================== */

// Dynamic page watermark injector
function injectWatermark(pageElement) {
    if (watermarkSettings.type === 'none') return;

    const wrapper = pageElement.querySelector('.inner-border-wrapper');
    if (!wrapper) return;

    const watermarkDiv = document.createElement('div');
    watermarkDiv.className = 'page-watermark';

    // Apply Position Styling (center, top-left, top-right, bottom-left, bottom-right)
    if (watermarkSettings.position === 'center') {
        watermarkDiv.style.alignItems = 'center';
        watermarkDiv.style.justifyContent = 'center';
    } else if (watermarkSettings.position === 'top-left') {
        watermarkDiv.style.alignItems = 'flex-start';
        watermarkDiv.style.justifyContent = 'flex-start';
        watermarkDiv.style.padding = '20px';
    } else if (watermarkSettings.position === 'top-right') {
        watermarkDiv.style.alignItems = 'flex-start';
        watermarkDiv.style.justifyContent = 'flex-end';
        watermarkDiv.style.padding = '20px';
    } else if (watermarkSettings.position === 'bottom-left') {
        watermarkDiv.style.alignItems = 'flex-end';
        watermarkDiv.style.justifyContent = 'flex-start';
        watermarkDiv.style.padding = '20px';
    } else if (watermarkSettings.position === 'bottom-right') {
        watermarkDiv.style.alignItems = 'flex-end';
        watermarkDiv.style.justifyContent = 'flex-end';
        watermarkDiv.style.padding = '20px';
    }

    // Apply Rotation and Opacity
    const transformStr = `rotate(${watermarkSettings.rotation}deg)`;
    
    if (watermarkSettings.type === 'text') {
        const textSpan = document.createElement('span');
        textSpan.className = 'watermark-text-el';
        textSpan.textContent = watermarkSettings.text;
        textSpan.style.fontSize = `${watermarkSettings.size}px`;
        textSpan.style.color = watermarkSettings.color;
        textSpan.style.opacity = watermarkSettings.opacity;
        textSpan.style.transform = transformStr;
        textSpan.style.display = 'inline-block';
        watermarkDiv.appendChild(textSpan);
    } else if (watermarkSettings.type === 'image' && watermarkSettings.imageSrc) {
        const img = document.createElement('img');
        img.src = watermarkSettings.imageSrc;
        img.style.width = `${watermarkSettings.size}%`;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.opacity = watermarkSettings.opacity;
        img.style.transform = transformStr;
        img.style.display = 'inline-block';
        watermarkDiv.appendChild(img);
    }

    // Insert watermark at the beginning of the wrapper so it stands behind other elements
    wrapper.insertBefore(watermarkDiv, wrapper.firstChild);
}

// Dynamic page numbering and header styling helper
function applyPaginationStyling(pageNumText, pageNum) {
    pageNumText.textContent = pageNum;
    pageNumText.style.fontSize = 'var(--custom-header-font-size, 15px)';
    pageNumText.style.color = customDesignSettings.pageNumColor || '#000000';
}

// Helper to append gold ornate corners to a page
function appendCornerDecorators(pageElement) {
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    corners.forEach(cornerClass => {
        const decor = document.createElement('div');
        decor.className = `corner-decor ${cornerClass}`;
        pageElement.appendChild(decor);
    });
}

// Cover Page DOM builder
function createCoverPageDOM() {
    const coverData = pagesData[0];

    const page = document.createElement('div');
    page.className = 'a4-page cover-page';
    if (coverData.coverTheme && coverData.coverTheme !== 'default') {
        page.classList.add(`cover-theme-${coverData.coverTheme}`);
    }
    page.setAttribute('data-page', 1);

    // Append corner decorators
    appendCornerDecorators(page);

    const innerBorder = document.createElement('div');
    innerBorder.className = 'inner-border-wrapper';
    innerBorder.classList.add(`cover-border-${coverData.coverBorderPattern || 'solid'}`);

    const coverContent = document.createElement('div');
    coverContent.className = 'cover-page-content';
    const hasTagline = coverData.tagline && coverData.tagline.trim() !== '';
    if (!hasTagline) {
        coverContent.classList.add('tagline-empty');
    }

    // Emblem (Feature 2)
    let emblemEl = null;
    if (coverData.coverEmblem && coverData.coverEmblem !== 'none') {
        emblemEl = document.createElement('div');
        emblemEl.className = `cover-emblem cover-emblem-${coverData.coverEmblem}`;
        if (coverData.coverEmblem === 'royal-seal') {
            emblemEl.innerHTML = '<div class="seal-inner"><span class="seal-icon">⚜️</span><span class="seal-text">सम्यक विशेष</span></div>';
        } else if (coverData.coverEmblem === 'verified-badge') {
            emblemEl.innerHTML = '<div class="badge-inner"><span class="badge-icon">✓</span><span class="badge-text">प्रमाणित नोट्स</span></div>';
        } else if (coverData.coverEmblem === 'exclusive-star') {
            emblemEl.innerHTML = '<div class="star-inner"><span class="star-icon">★</span><span class="star-text">EXCLUSIVE</span></div>';
        } else if (coverData.coverEmblem === 'vintage-emblem') {
            emblemEl.innerHTML = '<div class="vintage-inner"><span class="vintage-icon">🖨️</span><span class="vintage-text">ESTD 2026</span></div>';
        }
    }

    // Magazine Classification
    const classificationEl = document.createElement('div');
    classificationEl.className = 'cover-classification';
    classificationEl.textContent = coverData.classification || '';
    classificationEl.style.setProperty('font-size', (coverData.classificationSize || 24) + 'px', 'important');
    if (!coverData.classification) {
        classificationEl.style.minHeight = '30px';
    }

    // Title
    const titleEl = document.createElement('h1');
    titleEl.className = 'cover-title';
    titleEl.textContent = coverData.title;
    titleEl.style.setProperty('font-size', (coverData.titleSize || 52) + 'px', 'important');

    // Tagline Box
    const taglineBox = document.createElement('div');
    taglineBox.className = 'cover-tagline-box';
    const taglineH3 = document.createElement('h3');
    taglineH3.textContent = coverData.tagline;
    taglineH3.style.setProperty('font-size', (coverData.taglineSize || 20) + 'px', 'important');
    taglineBox.appendChild(taglineH3);
    if (!hasTagline) {
        taglineBox.style.display = 'none';
    }

    // Subtitle
    const subtitleEl = document.createElement('h2');
    subtitleEl.className = 'cover-subtitle';
    subtitleEl.textContent = coverData.subtitle;
    subtitleEl.style.setProperty('font-size', (coverData.subtitleSize || 21) + 'px', 'important');

    // Table of Contents Placeholder
    const tocPlaceholder = document.createElement('div');
    tocPlaceholder.id = 'toc-placeholder';
    tocPlaceholder.className = 'toc-container';
    if (customDesignSettings.showCoverTOC === false) {
        tocPlaceholder.style.display = 'none';
    }

    if (emblemEl) {
        coverContent.appendChild(emblemEl);
    }
    coverContent.appendChild(classificationEl);
    coverContent.appendChild(titleEl);
    coverContent.appendChild(taglineBox);
    coverContent.appendChild(subtitleEl);
    coverContent.appendChild(tocPlaceholder);

    innerBorder.appendChild(coverContent);
    page.appendChild(innerBorder);

    return page;
}

// Content Page DOM builder
function createContentPageDOM(pageNum, visualPageNum) {
    const coverData = pagesData[0];

    const page = document.createElement('div');
    page.className = 'a4-page';
    page.setAttribute('data-page', pageNum);

    // Append corner decorators
    appendCornerDecorators(page);

    const innerBorder = document.createElement('div');
    innerBorder.className = 'inner-border-wrapper';

    // Header
    const header = document.createElement('div');
    header.className = 'page-header';
    
    const headerLeft = document.createElement('div');
    headerLeft.className = 'header-left';

    if (customDesignSettings.headerLogoSrc) {
        const logoImg = document.createElement('img');
        logoImg.src = customDesignSettings.headerLogoSrc;
        logoImg.className = 'header-logo-img';
        headerLeft.appendChild(logoImg);
    }

    const titleSpan = document.createElement('span');
    titleSpan.textContent = coverData.title;
    headerLeft.appendChild(titleSpan);

    const headerCenter = document.createElement('div');
    headerCenter.className = 'header-center';
    const centerSpan = document.createElement('span');
    centerSpan.textContent = coverData.subtitle; // Month / Subtitle of magazine
    headerCenter.appendChild(centerSpan);

    const headerRight = document.createElement('div');
    headerRight.className = 'header-right page-number-text';
    applyPaginationStyling(headerRight, visualPageNum);

    header.appendChild(headerLeft);
    header.appendChild(headerCenter);
    header.appendChild(headerRight);

    const headerLine = document.createElement('div');
    headerLine.className = 'header-line';

    // Content Wrapper
    const content = document.createElement('div');
    content.className = 'page-content';
    if (visualPageNum !== 999 && pagesData[visualPageNum] && pagesData[visualPageNum].layout === 'two-column') {
        content.classList.add('layout-two-column');
    }

    // Footer
    const footer = document.createElement('div');
    footer.className = 'page-footer placement-' + (socialSettings.placement || 'split');

    if (socialSettings && (socialSettings.telegramText || socialSettings.youtubeText)) {
        const fsVal = socialSettings.fontSize || 11;
        const svgSize = Math.max(10, fsVal + 2);
        // Left: Telegram Link
        if (socialSettings.telegramText) {
            const tgLink = document.createElement('a');
            tgLink.className = 'footer-social-link';
            tgLink.href = getTelegramLink(socialSettings.telegramText);
            tgLink.target = '_blank';
            tgLink.rel = 'noopener noreferrer';
            tgLink.style.fontSize = `${fsVal}px`;
            tgLink.innerHTML = `<svg class="social-svg-icon" viewBox="0 0 24 24" width="${svgSize}" height="${svgSize}"><path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.24-.213-.054-.33-.373-.12l-6.87 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.536-.2 1.006.12.836.953z"/></svg> ${socialSettings.telegramText}`;
            footer.appendChild(tgLink);
        }
        // Right: YouTube Link
        if (socialSettings.youtubeText) {
            const ytLink = document.createElement('a');
            ytLink.className = 'footer-social-link';
            ytLink.href = getYouTubeLink(socialSettings.youtubeText);
            ytLink.target = '_blank';
            ytLink.rel = 'noopener noreferrer';
            ytLink.style.fontSize = `${fsVal}px`;
            ytLink.innerHTML = `<svg class="social-svg-icon" viewBox="0 0 24 24" width="${svgSize}" height="${svgSize}"><path fill="currentColor" d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> ${socialSettings.youtubeText}`;
            ytLink.style.fontSize = `${fsVal}px`;
            footer.appendChild(ytLink);
        }
    }

    innerBorder.appendChild(header);
    innerBorder.appendChild(headerLine);
    innerBorder.appendChild(content);
    innerBorder.appendChild(footer);
    page.appendChild(innerBorder);

    return { pageElement: page, contentElement: content };
}

// Render right-side actual A4 pages sequentially
function renderPreview() {
    // Save current scroll positions of the preview canvas scroll wrapper to prevent jumping
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    const savedScrollTop = canvasWrapper ? canvasWrapper.scrollTop : 0;
    const savedScrollLeft = canvasWrapper ? canvasWrapper.scrollLeft : 0;

    // Cancel any pending debounced render since we are executing a render now
    if (typeof renderTimeout !== 'undefined' && renderTimeout !== null) {
        clearTimeout(renderTimeout);
    }
    // Measure dynamic available height of page content container
    if (cachedMaxContentHeight === null) {
        const tempPageStruct = createContentPageDOM(999, 999);
        tempPageStruct.pageElement.style.position = 'absolute';
        tempPageStruct.pageElement.style.visibility = 'hidden';
        tempPageStruct.pageElement.style.top = '-9999px';
        document.body.appendChild(tempPageStruct.pageElement);
        const measuredHeight = tempPageStruct.contentElement.clientHeight;
        document.body.removeChild(tempPageStruct.pageElement);
        if (measuredHeight > 0) {
            cachedMaxContentHeight = measuredHeight;
        }
    }
    MAX_CONTENT_HEIGHT = cachedMaxContentHeight || 910;

    function getBlockMarkdownForSave(block) {
        if (block.type === 'table' && block.excludeHeadersFromMarkdown) {
            const lines = block.markdown.split('\n');
            return lines.slice(2).join('\n');
        }
        return block.markdown;
    }

    // Clear canvas
    pagesContainer.innerHTML = '';

    // 1. Render Cover Page (Page 1)
    const coverPageElement = createCoverPageDOM();
    // Prevent watermark on cover page as per user request
    pagesContainer.appendChild(coverPageElement);

    // 1.5 Track cursor position in content pages
    const isEditorActive = (activePageIndex > 0 && activePageIndex < pagesData.length) && 
                           (document.activeElement === pageContentInput || window.forceFocusEditor);
    let cursorStart = 0;
    let cursorEnd = 0;
    let globalCursorPos = 0;

    if (activePageIndex > 0 && activePageIndex < pagesData.length) {
        if (isEditorActive) {
            cursorStart = pageContentInput.selectionStart;
            cursorEnd = pageContentInput.selectionEnd;
        }
        // Calculate global cursor position in unified content text
        let accumulatedLength = 0;
        for (let idx = 1; idx < pagesData.length; idx++) {
            if (idx === activePageIndex) {
                globalCursorPos = accumulatedLength + cursorStart;
                break;
            }
            accumulatedLength += pagesData[idx].text.length + 1; // +1 for newline separator
        }
    }

    // 2. Distribute blocks across Content Pages dynamically
    const fullContentMarkdown = pagesData.slice(1).map(p => p.text).join('\n');
    const blocks = parseTextToBlocks(fullContentMarkdown);
    currentRenderedBlocks = blocks; // Save globally for scroll sync
    

    // Assign original unique IDs to blocks for drag-and-drop tracking (all blocks, including thankyou!)
    blocks.forEach((block, idx) => {
        block.id = idx;
    });

    let currentVisualPageNum = 1;
    let currentPageStruct = createContentPageDOM(2, 1);
    injectWatermark(currentPageStruct.pageElement);
    pagesContainer.appendChild(currentPageStruct.pageElement);

    let activeBulletListElement = null;
    let pageContentMarkdownArray = [];
    let currentPageMarkdownLines = [];
    let sectionInfoList = [];

    // Track estimated height of content on the current page to reduce DOM layout reads
    let currentPageHeight = 0;
    const checkThreshold = MAX_CONTENT_HEIGHT - 35; // Dynamically check scrollHeight only near the very limit (1-2 lines away) to prevent massive layout thrashing

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block.type === 'pagebreak') {
            currentPageMarkdownLines.push(block.markdown);
            pageContentMarkdownArray.push(currentPageMarkdownLines.join('\n'));
            currentPageMarkdownLines = [];
            
            currentVisualPageNum++;
            currentPageStruct = createContentPageDOM(currentVisualPageNum + 1, currentVisualPageNum);
            injectWatermark(currentPageStruct.pageElement);
            pagesContainer.appendChild(currentPageStruct.pageElement);
            activeBulletListElement = null;
            currentPageHeight = 0; // Reset height estimate for new page
            continue;
        }

        const node = renderBlockToNode(block);
        if (node && typeof node.setAttribute === 'function') {
            node.setAttribute('data-block-id', block.id);
            node.setAttribute('draggable', 'true');
        }

        if (block.type === 'bullet') {
            if (!activeBulletListElement) {
                activeBulletListElement = document.createElement('div');
                activeBulletListElement.className = 'bullet-list';
                activeBulletListElement.setAttribute('data-bullet-style', customDesignSettings.bulletStyle || 'classic');
                currentPageStruct.contentElement.appendChild(activeBulletListElement);
            }
            activeBulletListElement.appendChild(node);
        } else {
            currentPageStruct.contentElement.appendChild(node);
            activeBulletListElement = null;
        }

        if (block.type === 'section') {
            sectionInfoList.push({
                name: node.textContent,
                startPage: currentVisualPageNum
            });
        }

        // Check if page layout is two column
        const isTwoCol = currentPageStruct.contentElement.classList.contains('layout-two-column');

        // Estimate the height of the current block
        const estHeight = estimateBlockHeight(block, contentFontSize, parseFloat(globalLineSpacingSelect.value || 1.45), isTwoCol);
        currentPageHeight += estHeight;

        // Check if page overflows
        let isOverflow = false;
        if (isTwoCol) {
            // In two column layouts, check scrollWidth if the estimated content height is close to the double-column limit
            // Using MAX_CONTENT_HEIGHT * 2.0 - 180 as threshold to prevent layout thrashing and only check near limits
            if (currentPageHeight > (MAX_CONTENT_HEIGHT * 2.0 - 180)) {
                isOverflow = currentPageStruct.contentElement.scrollWidth > (currentPageStruct.contentElement.clientWidth + 2);
            }
        } else if (currentPageHeight > checkThreshold) {
            // Only read scrollHeight when estimated height gets close to or exceeds limit
            const actualHeight = currentPageStruct.contentElement.scrollHeight;
            currentPageHeight = actualHeight; // Sync running estimate with actual measurement
            isOverflow = actualHeight > MAX_CONTENT_HEIGHT;
        }

        if (isOverflow) {
            // We have an overflow. Let's see if we can split this block.
            let canSplit = (block.type === 'paragraph' || block.type === 'bullet' || block.type === 'box' || block.type === 'table');
            let splitSuccess = false;

            if (canSplit) {
                // Extract prefix for formatting preservation
                let prefix = "";
                if (block.type === 'bullet') {
                    const match = block.markdown.match(/^\s*(•|●|■|▪|▫|[\u2022\u25CF\u25AA\u25AB]|\-|\*|\(\d+\)|\d+\.)\s*/);
                    if (match) prefix = match[0];
                } else if (block.type === 'box') {
                    const match = block.markdown.match(/^\s*>\s*/);
                    if (match) prefix = match[0];
                }

                // Split markdown: by lines for tables, by words for others
                let words = [];
                if (block.type === 'table') {
                    words = block.markdown.split('\n');
                } else {
                    words = block.markdown.split(/(\s+)/);
                }

                // Helper to temporarily update node text/rows and check if it fits
                const testFit = (wordCount) => {
                    let separator = (block.type === 'table') ? '\n' : '';
                    let testMarkdown = words.slice(0, wordCount).join(separator);
                    updateNodeContent(node, block.type, testMarkdown);
                    if (isTwoCol) {
                        return currentPageStruct.contentElement.scrollWidth <= (currentPageStruct.contentElement.clientWidth + 2);
                    } else {
                        return currentPageStruct.contentElement.scrollHeight <= MAX_CONTENT_HEIGHT;
                    }
                };

                // Binary search for the maximum number of words/rows that fit
                let low = 1;
                if (block.type === 'table') {
                    low = 3; // Table needs header (0), separator (1), and at least 1 data row (2)
                }
                let high = words.length;
                let splitIndex = 0;

                // Only search if the minimum fit fits
                if (testFit(low)) {
                    while (low <= high) {
                        let mid = Math.floor((low + high) / 2);
                        if (testFit(mid)) {
                            splitIndex = mid;
                            low = mid + 1;
                        } else {
                            high = mid - 1;
                        }
                    }
                }

                if (splitIndex > 0 && splitIndex < words.length) {
                    // We found a valid split point!
                    let fitSeparator = (block.type === 'table' ? '\n' : '');
                    let fitMarkdown = words.slice(0, splitIndex).join(fitSeparator);
                    let remainingMarkdown = words.slice(splitIndex).join(fitSeparator);

                    let canSplitTable = (block.type === 'table' && splitIndex >= 3);
                    let canSplitText = false;
                    
                    if (block.type !== 'table') {
                        // Count actual words in fit content to avoid tiny hanging splits
                        let fitWordsCount = words.slice(0, splitIndex).filter(w => w.trim().length > 0).length;
                        if (block.type === 'bullet') {
                            fitWordsCount = words.slice(0, splitIndex).filter(w => w.trim().length > 0 && !/^[•\-\*\u2022\u25CF\u25AA\u25AB]/.test(w)).length;
                        }
                        canSplitText = (fitWordsCount >= 2);
                    }

                    // We split if requirements are met
                    if ((canSplitTable || canSplitText) && remainingMarkdown.trim().length > 0) {
                        // Update current node with the fit content
                        updateNodeContent(node, block.type, fitMarkdown);
                        block.markdown = fitMarkdown;

                        // Prepend prefix to remaining markdown if needed
                        if (block.type === 'table') {
                            // For tables, prepend header (0) and separator (1) rows to the remaining table
                            let headerRow = words[0];
                            let separatorRow = words[1];
                            remainingMarkdown = headerRow + '\n' + separatorRow + '\n' + remainingMarkdown;
                        } else if (prefix) {
                            // If remaining markdown doesn't start with prefix, add it
                            if (!remainingMarkdown.trim().startsWith(prefix.trim())) {
                                remainingMarkdown = prefix + remainingMarkdown.trimStart();
                            }
                        }

                        // Save current page
                        currentPageMarkdownLines.push(getBlockMarkdownForSave(block));
                        pageContentMarkdownArray.push(currentPageMarkdownLines.join('\n'));
                        currentPageMarkdownLines = [];

                        // Start new page
                        currentVisualPageNum++;
                        currentPageStruct = createContentPageDOM(currentVisualPageNum + 1, currentVisualPageNum);
                        injectWatermark(currentPageStruct.pageElement);
                        pagesContainer.appendChild(currentPageStruct.pageElement);
                        activeBulletListElement = null;
                        currentPageHeight = 0; // Reset height estimate for new page

                        // Insert remaining block into blocks array to be processed next
                        blocks.splice(i + 1, 0, {
                            type: block.type,
                            markdown: remainingMarkdown,
                            id: block.id,
                            excludeHeadersFromMarkdown: true
                        });

                        splitSuccess = true;
                    }
                }
            }

            if (!splitSuccess) {
                // Restore the node's original full content since the split failed or was too small
                if (canSplit) {
                    updateNodeContent(node, block.type, block.markdown);
                }

                // Fall back to moving the entire block to the next page.
                let isOnlyItem = false;
                if (block.type === 'bullet') {
                    isOnlyItem = (currentPageStruct.contentElement.children.length === 1 && activeBulletListElement.children.length === 1);
                } else {
                    isOnlyItem = (currentPageStruct.contentElement.children.length === 1);
                }

                if (!isOnlyItem) {
                    // Move it to next page
                    if (block.type === 'bullet') {
                        if (activeBulletListElement) {
                            activeBulletListElement.removeChild(node);
                            if (activeBulletListElement.children.length === 0) {
                                currentPageStruct.contentElement.removeChild(activeBulletListElement);
                            }
                        }
                    } else {
                        currentPageStruct.contentElement.removeChild(node);
                    }

                    // Save current page markdown
                    pageContentMarkdownArray.push(currentPageMarkdownLines.join('\n'));
                    currentPageMarkdownLines = [];

                    // Start new page
                    currentVisualPageNum++;
                    currentPageStruct = createContentPageDOM(currentVisualPageNum + 1, currentVisualPageNum);
                    injectWatermark(currentPageStruct.pageElement);
                    pagesContainer.appendChild(currentPageStruct.pageElement);
                    activeBulletListElement = null;

                    // Append node to the new page
                    if (block.type === 'bullet') {
                        activeBulletListElement = document.createElement('div');
                        activeBulletListElement.className = 'bullet-list';
                        activeBulletListElement.setAttribute('data-bullet-style', customDesignSettings.bulletStyle || 'classic');
                        currentPageStruct.contentElement.appendChild(activeBulletListElement);
                        activeBulletListElement.appendChild(node);
                    } else {
                        currentPageStruct.contentElement.appendChild(node);
                    }

                    // Sync estimate height for new page and add the moved block's height estimate
                    currentPageHeight = estHeight;

                    // If section, correct its start page
                    if (block.type === 'section') {
                        const lastSec = sectionInfoList[sectionInfoList.length - 1];
                        if (lastSec) lastSec.startPage = currentVisualPageNum;
                    }
                }
            }
        }

        // Only push to currentPageMarkdownLines if we didn't already push and clear it in splitSuccess
        if (currentPageStruct.contentElement.contains(node) || (activeBulletListElement && activeBulletListElement.contains(node))) {
            currentPageMarkdownLines.push(getBlockMarkdownForSave(block));
        }
    }

    // Save last content page
    pageContentMarkdownArray.push(currentPageMarkdownLines.join('\n'));

    // Update pagesData array with paginated content
    const coverPage = pagesData[0];
    const newContentPages = pageContentMarkdownArray.map((txt, index) => {
        const oldPage = pagesData[index + 1];
        const oldLayout = oldPage ? (oldPage.layout || 'single') : 'single';
        return {
            type: 'content',
            text: txt,
            layout: oldLayout
        };
    });
    pagesData = [coverPage, ...newContentPages];

    // Recalculate activePageIndex and relative cursor position in the new pagesData!
    // Only recalculate activePageIndex if currently editing a content page (not Cover or End Page)
    if (activePageIndex > 0 && activePageIndex < pagesData.length && pagesData.length > 1) {
        let accumulatedLength = 0;
        let found = false;
        for (let idx = 1; idx < pagesData.length; idx++) {
            const pageLen = pagesData[idx].text.length;
            if (globalCursorPos >= accumulatedLength && globalCursorPos <= accumulatedLength + pageLen + 1) {
                activePageIndex = idx;
                cursorStart = Math.max(0, Math.min(globalCursorPos - accumulatedLength, pageLen));
                cursorEnd = cursorStart;
                found = true;
                break;
            }
            accumulatedLength += pageLen + 1;
        }
        if (!found) {
            activePageIndex = Math.max(1, Math.min(activePageIndex, pagesData.length - 1));
            cursorStart = pagesData[activePageIndex] ? pagesData[activePageIndex].text.length : 0;
            cursorEnd = cursorStart;
        }
    }

    // 4. Generate dynamic Table of Contents inside Cover Page
    populateCoverPageTOC(sectionInfoList);

    // 5. Restore spotlight outline around active edited page
    let pageSelectorIndex = activePageIndex + 1;
    if (activePageIndex === pagesData.length) {
        pageSelectorIndex = pagesData.length; // Spotlight the last content page where the inline thank you box is
    }
    const activeA4Page = document.querySelector(`.a4-page[data-page="${pageSelectorIndex}"]`);
    if (activeA4Page) {
        document.querySelectorAll('.a4-page').forEach(page => {
            page.classList.remove('active-page-spotlight');
        });
        activeA4Page.classList.add('active-page-spotlight');
    }

    // 6. Sync warning states on left page-tabs sidebar
    if (typeof renderTabsList === 'function') {
        renderTabsList();
    }

    // Restore scroll positions of the preview canvas scroll wrapper to prevent jumping
    if (canvasWrapper) {
        canvasWrapper.scrollTop = savedScrollTop;
        canvasWrapper.scrollLeft = savedScrollLeft;
    }

    // 7. Sync the textarea value only if changed, and restore cursor if editor was active
    if (activePageIndex > 0 && activePageIndex < pagesData.length) {
        if (pageContentInput.value !== pagesData[activePageIndex].text) {
            pageContentInput.value = pagesData[activePageIndex].text;
        }
        if (isEditorActive) {
            pageContentInput.focus();
            pageContentInput.setSelectionRange(cursorStart, cursorEnd);
            // Force trigger scroll sync immediately to highlight the active block in the preview panel without jumping
            if (typeof syncPreviewScroll === 'function') {
                syncPreviewScroll(false);
            }
        }
        activePageLabel.textContent = activePageIndex;
    }
}

// Dynamic cover page TOC renderer with drag-and-drop section reordering support
function populateCoverPageTOC(sections) {
    const tocPlaceholder = document.getElementById('toc-placeholder');
    if (!tocPlaceholder) return;

    tocPlaceholder.innerHTML = '';

    // Add class to cover content if there are many sections to make layout compact
    const coverContent = document.querySelector('.cover-page-content');
    if (coverContent) {
        if (sections.length > 8) {
            coverContent.classList.add('has-many-sections');
        } else {
            coverContent.classList.remove('has-many-sections');
        }
    }

    const tocTitle = document.createElement('div');
    tocTitle.className = 'toc-title';
    tocTitle.textContent = 'विषयवस्तु';
    tocPlaceholder.appendChild(tocTitle);

    const tocDivider = document.createElement('div');
    tocDivider.className = 'toc-title-divider';
    tocPlaceholder.appendChild(tocDivider);

    const tocHeader = document.createElement('div');
    tocHeader.className = 'toc-header';
    tocHeader.innerHTML = '<span>विषयसूची</span><span>पेज नं.</span>';
    tocPlaceholder.appendChild(tocHeader);

    const tocRows = document.createElement('div');
    tocRows.className = 'toc-rows';
    if (sections.length > 8) {
        tocRows.classList.add('two-columns');
    }

    for (let i = 0; i < sections.length; i++) {
        const currentSection = sections[i];
        const start = currentSection.startPage; // Already visual page number!
        
        let end = pagesData.length - 1; // Default to last visual page
        if (i < sections.length - 1) {
            end = sections[i + 1].startPage - 1;
        }

        let pageRangeString = `${start}`;
        if (end > start) {
            pageRangeString = `${start} - ${end}`;
        }

        // Map icon based on name
        let icon = '📂';
        for (const key in sectionIcons) {
            if (currentSection.name.includes(key)) {
                icon = sectionIcons[key];
                break;
            }
        }

        const row = document.createElement('div');
        row.className = 'toc-row';
        row.setAttribute('draggable', 'true');
        row.setAttribute('data-section-name', currentSection.name);
        row.innerHTML = `
            <div class="toc-row-left">
                <span>${icon}</span>
                <span>${currentSection.name}</span>
            </div>
            <div class="toc-row-page">${pageRangeString}</div>
        `;

        // Bind Drag and Drop event listeners on the TOC row
        row.addEventListener('dragstart', (e) => {
            draggedTOCSectionName = currentSection.name;
            row.classList.add('dragging-toc-row');
            e.dataTransfer.setData('text/plain', currentSection.name);
            e.dataTransfer.effectAllowed = 'move';
        });

        row.addEventListener('dragend', () => {
            row.classList.remove('dragging-toc-row');
            document.querySelectorAll('.toc-row').forEach(r => {
                r.classList.remove('drag-hover-before', 'drag-hover-after');
            });
            draggedTOCSectionName = null;
        });

        row.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!draggedTOCSectionName || draggedTOCSectionName === currentSection.name) return;

            const rect = row.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            e.dataTransfer.dropEffect = 'move';

            if (e.clientY < midpoint) {
                row.classList.add('drag-hover-before');
                row.classList.remove('drag-hover-after');
            } else {
                row.classList.add('drag-hover-after');
                row.classList.remove('drag-hover-before');
            }
        });

        row.addEventListener('dragleave', () => {
            row.classList.remove('drag-hover-before', 'drag-hover-after');
        });

        row.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedTOCSectionName || draggedTOCSectionName === currentSection.name) return;

            const isBefore = row.classList.contains('drag-hover-before');
            row.classList.remove('drag-hover-before', 'drag-hover-after');

            reorderDocumentSectionsByTOC(draggedTOCSectionName, currentSection.name, isBefore);
        });

        tocRows.appendChild(row);
    }

    tocPlaceholder.appendChild(tocRows);
}

// Helper to merge and reorder entire sections by dragging them in the cover page TOC
function reorderDocumentSectionsByTOC(draggedName, targetName, isBefore) {
    if (typeof saveCurrentInputState === 'function') {
        saveCurrentInputState(); // Capture latest text state of all inputs
    }

    function normalizeSecName(name) {
        if (!name) return '';
        return name.replace(/^#+\s*/, '')
                   .replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '')
                   .trim()
                   .toLowerCase();
    }

    const draggedNorm = normalizeSecName(draggedName);
    const targetNorm = normalizeSecName(targetName);
    if (draggedNorm === targetNorm) return;

    // 1. Get unified content markdown
    const fullContent = pagesData.slice(1).map(p => p.text).join('\n');
    const blocks = parseTextToBlocks(fullContent);

    // 2. Segment blocks into section arrays
    let sections = [];
    let currentSec = { nameNorm: '__intro__', nameOrig: '', blocks: [] };
    sections.push(currentSec);

    blocks.forEach(block => {
        if (block.type === 'section') {
            const origName = block.markdown.trim();
            const normName = normalizeSecName(origName);
            currentSec = { nameNorm: normName, nameOrig: origName, blocks: [] };
            sections.push(currentSec);
        } else {
            currentSec.blocks.push(block);
        }
    });

    // 3. Find target and source index, then splice and insert
    const draggedIndex = sections.findIndex(s => s.nameNorm === draggedNorm);
    const targetIndex = sections.findIndex(s => s.nameNorm === targetNorm);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedSec] = sections.splice(draggedIndex, 1);
    const newTargetIndex = sections.findIndex(s => s.nameNorm === targetNorm);
    const insertIndex = isBefore ? newTargetIndex : newTargetIndex + 1;
    sections.splice(insertIndex, 0, draggedSec);

    // 4. Stitch back to unified markdown
    let mergedMarkdownParts = [];
    sections.forEach(sec => {
        if (sec.nameNorm !== '__intro__' && sec.nameOrig) {
            mergedMarkdownParts.push(sec.nameOrig);
        }
        sec.blocks.forEach(b => {
            mergedMarkdownParts.push(b.markdown);
        });
        // Spacer between sections
        if (sec.blocks.length > 0 || (sec.nameNorm !== '__intro__' && sec.nameOrig)) {
            mergedMarkdownParts.push('');
        }
    });

    const unifiedMarkdown = mergedMarkdownParts.join('\n');

    // 5. Update content pages (keeping layout configs intact)
    const cover = pagesData[0];
    const layouts = pagesData.slice(1).map(p => p.layout || 'single');
    if (layouts.length === 0) layouts.push('single');
    const newPages = layouts.map((lay, idx) => ({
        type: 'content',
        text: (idx === 0) ? unifiedMarkdown : '',
        layout: lay
    }));
    pagesData = [cover, ...newPages];

    // 6. Invalidate height cache, re-render preview, and save
    cachedMaxContentHeight = null;
    renderPreview();
    if (typeof saveWorkspaceToLocalStorage === 'function') {
        saveWorkspaceToLocalStorage();
    }
    
    // Auto-switch back to cover page (index 0) so the user sees the reordered TOC
    if (typeof switchActivePage === 'function') {
        switchActivePage(0);
    }
}

// Apply theme helper
function applyTheme(themeName, isManualChange = false) {
    // Remove existing theme classes to preserve other classes like font styles
    const classesToRemove = Array.from(document.body.classList).filter(c => c.startsWith('theme-'));
    classesToRemove.forEach(c => document.body.classList.remove(c));

    if (themeName !== 'maroon-gold') {
        document.body.classList.add(`theme-${themeName}`);
    }

    // Intercept Coaching Brand Themes
    if (themeName && themeName.startsWith('coaching-')) {
        if (isManualChange) {
            const val = themeName.replace('coaching-', '');
            if (val === 'samyak') {
                customDesignSettings.sectionBg = '#850f0f';
                customDesignSettings.sectionAccent = '#c5a353';
                customDesignSettings.sectionText = '#ffffff';
                customDesignSettings.sectionAlignment = 'left';
                customDesignSettings.sectionShape = 'rectangle';
                customDesignSettings.topicText = '#850f0f';
                customDesignSettings.topicBorder = '#c5a353';
                customDesignSettings.topicBorderStyle = 'dashed';
                customDesignSettings.topicAlignment = 'flex-start';
                customDesignSettings.topicIcon = 'orange-diamond';
                customDesignSettings.bulletStyle = 'classic';
                customDesignSettings.innerBorderColor = '#c5a353';
                customDesignSettings.cornerColor = '#c5a353';
                customDesignSettings.borderThick = 1;
                customDesignSettings.cornerSize = 22;
                customDesignSettings.dividerColor = '#c5a353';
                customDesignSettings.dividerStyle = 'dashed';
                customDesignSettings.dividerThickness = 1.5;
                customDesignSettings.endStarColor = '#c5a353';
                customDesignSettings.endStarSymbol = '✦';
                customDesignSettings.pageNumColor = '#850f0f';
            } else if (val === 'springboard') {
                customDesignSettings.sectionBg = '#1d6ea5';
                customDesignSettings.sectionAccent = '#a0a0a0';
                customDesignSettings.sectionText = '#ffffff';
                customDesignSettings.sectionAlignment = 'left';
                customDesignSettings.sectionShape = 'pill';
                customDesignSettings.topicText = '#1d6ea5';
                customDesignSettings.topicBorder = '#a0a0a0';
                customDesignSettings.topicBorderStyle = 'solid';
                customDesignSettings.topicAlignment = 'flex-start';
                customDesignSettings.topicIcon = 'blue-diamond';
                customDesignSettings.bulletStyle = 'diamond';
                customDesignSettings.innerBorderColor = '#a0a0a0';
                customDesignSettings.cornerColor = '#a0a0a0';
                customDesignSettings.borderThick = 1.5;
                customDesignSettings.cornerSize = 16;
                customDesignSettings.dividerColor = '#a0a0a0';
                customDesignSettings.dividerStyle = 'solid';
                customDesignSettings.dividerThickness = 1.5;
                customDesignSettings.endStarColor = '#1d6ea5';
                customDesignSettings.endStarSymbol = '★';
                customDesignSettings.pageNumColor = '#1d6ea5';
            } else if (val === 'utkarsh') {
                customDesignSettings.sectionBg = '#0d7a5f';
                customDesignSettings.sectionAccent = '#f47c20';
                customDesignSettings.sectionText = '#ffffff';
                customDesignSettings.sectionAlignment = 'center';
                customDesignSettings.sectionShape = 'left-stripe';
                customDesignSettings.topicText = '#0d7a5f';
                customDesignSettings.topicBorder = '#f47c20';
                customDesignSettings.topicBorderStyle = 'dotted';
                customDesignSettings.topicAlignment = 'center';
                customDesignSettings.topicIcon = 'star';
                customDesignSettings.bulletStyle = 'square';
                customDesignSettings.innerBorderColor = '#0d7a5f';
                customDesignSettings.cornerColor = '#f47c20';
                customDesignSettings.borderThick = 2;
                customDesignSettings.cornerSize = 20;
                customDesignSettings.dividerColor = '#f47c20';
                customDesignSettings.dividerStyle = 'dotted';
                customDesignSettings.dividerThickness = 2;
                customDesignSettings.endStarColor = '#f47c20';
                customDesignSettings.endStarSymbol = '✿';
                customDesignSettings.pageNumColor = '#0d7a5f';
            } else if (val === 'vision') {
                customDesignSettings.sectionBg = '#2b2d42';
                customDesignSettings.sectionAccent = '#8d99ae';
                customDesignSettings.sectionText = '#ffffff';
                customDesignSettings.sectionAlignment = 'left';
                customDesignSettings.sectionShape = 'underline';
                customDesignSettings.topicText = '#2b2d42';
                customDesignSettings.topicBorder = '#8d99ae';
                customDesignSettings.topicBorderStyle = 'none';
                customDesignSettings.topicAlignment = 'flex-start';
                customDesignSettings.topicIcon = 'none';
                customDesignSettings.bulletStyle = 'arrow';
                customDesignSettings.innerBorderColor = '#8d99ae';
                customDesignSettings.cornerColor = '#8d99ae';
                customDesignSettings.borderThick = 0;
                customDesignSettings.cornerSize = 0;
                customDesignSettings.dividerColor = '#8d99ae';
                customDesignSettings.dividerStyle = 'none';
                customDesignSettings.dividerThickness = 0;
                customDesignSettings.endStarColor = '#2b2d42';
                customDesignSettings.endStarSymbol = '*';
                customDesignSettings.pageNumColor = '#2b2d42';
            } else if (val === 'drishti') {
                customDesignSettings.sectionBg = '#b83a14';
                customDesignSettings.sectionAccent = '#d4af37';
                customDesignSettings.sectionText = '#ffffff';
                customDesignSettings.sectionAlignment = 'center';
                customDesignSettings.sectionShape = 'ribbon-banner';
                customDesignSettings.topicText = '#b83a14';
                customDesignSettings.topicBorder = '#d4af37';
                customDesignSettings.topicBorderStyle = 'double';
                customDesignSettings.topicAlignment = 'flex-start';
                customDesignSettings.topicIcon = 'fleur-de-lis';
                customDesignSettings.bulletStyle = 'checkmark';
                customDesignSettings.innerBorderColor = '#d4af37';
                customDesignSettings.cornerColor = '#d4af37';
                customDesignSettings.borderThick = 2;
                customDesignSettings.cornerSize = 25;
                customDesignSettings.dividerColor = '#d4af37';
                customDesignSettings.dividerStyle = 'double';
                customDesignSettings.dividerThickness = 3;
                customDesignSettings.endStarColor = '#b83a14';
                customDesignSettings.endStarSymbol = '✦';
                customDesignSettings.pageNumColor = '#b83a14';
            }
            if (typeof applyCustomDesignSettingsToDOM === 'function') {
                applyCustomDesignSettingsToDOM();
            }
        }
    } else {
        // Instantly sync custom design panel values to match the theme color properties!
        if (isManualChange && typeof syncDesignControlsWithTheme === 'function') {
            syncDesignControlsWithTheme();
        }
    }
}

function updateZoom() {
    zoomLevelSpan.textContent = `${zoomLevel}%`;
    pagesContainer.style.zoom = zoomLevel / 100;
}

function updateStats() {
    if (activePageIndex === 0) {
        wordCountSpan.textContent = "0";
        return;
    }

    const text = pageContentInput.value;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    wordCountSpan.textContent = wordCount;
}

function saveWorkspaceToLocalStorage() {
    if (typeof saveCurrentInputState === 'function') {
        saveCurrentInputState(); // Capture latest text/input values first!
    }
    const state = {
        pagesData,
        lastPageData,
        activePageIndex,
        contentFontSize,
        watermarkSettings,
        customDesignSettings,
        socialSettings,
        // Notice: uploadedImages and imageCounter are excluded to avoid massive IndexedDB write lag during typing
        spacingSettings: {
            fontStyle: globalFontStyleSelect.value,
            fontWeight: globalFontWeightSelect.value,
            lineSpacing: globalLineSpacingSelect.value,
            letterSpacing: globalLetterSpacingSelect.value
        }
    };
    saveToDB('samyak_workspace_state', state)
        .catch(e => {
            console.error("Error saving to IndexedDB:", e);
        });
}

function applyCustomDesignSettingsToDOM() {
    cachedMaxContentHeight = null; // Clear height cache

    // Apply compact spacing toggle state to body class and sync checkbox UI
    if (compactSpacingToggle) {
        compactSpacingToggle.checked = !!customDesignSettings.compactMode;
    }
    document.body.classList.toggle('compact-mode', !!customDesignSettings.compactMode);

    if (coverTOCToggle) {
        coverTOCToggle.checked = customDesignSettings.showCoverTOC !== false;
    }

    // Apply chapter banner sizing custom variables
    document.documentElement.style.setProperty('--custom-chapter-num-size', `${customDesignSettings.chapterNumSize || 30}px`);
    document.documentElement.style.setProperty('--custom-chapter-title-size', `${customDesignSettings.chapterTitleSize || 20}px`);
    document.documentElement.style.setProperty('--custom-chapter-subtitle-size', `${customDesignSettings.chapterSubSize || 15}px`);

    // Dynamically fetch computed theme colors to act as fallbacks instead of hardcoding Maroon/Gold/Blue
    const styles = getComputedStyle(document.body);
    const primary = styles.getPropertyValue('--primary-color').trim() || '#850f0f';
    const secondary = styles.getPropertyValue('--secondary-color').trim() || '#c5a353';
    const accent = styles.getPropertyValue('--accent-color').trim() || '#1d6ea5';

    document.documentElement.style.setProperty('--custom-header-font-size', `${customDesignSettings.pageNumSize || 15}px`);
    // Direct CSS properties update
    document.documentElement.style.setProperty('--custom-section-bg', customDesignSettings.sectionBg || primary);
    document.documentElement.style.setProperty('--custom-section-border-left', customDesignSettings.sectionAccent || accent);
    document.documentElement.style.setProperty('--custom-section-text', customDesignSettings.sectionText || '#ffffff');
    document.documentElement.style.setProperty('--custom-section-size', `${customDesignSettings.sectionSize || 18}px`);

    const secAlign = customDesignSettings.sectionAlignment || 'left';
    document.documentElement.style.setProperty('--custom-section-align', secAlign);
    if (secAlign === 'center') {
        document.documentElement.style.setProperty('--custom-section-display', 'block');
        document.documentElement.style.setProperty('--custom-section-width', '100%');
        document.documentElement.style.setProperty('--custom-section-align-self', 'stretch');
        document.documentElement.style.setProperty('--custom-section-border-right', `6px solid ${customDesignSettings.sectionAccent || accent}`);
        document.documentElement.style.setProperty('--custom-section-border-radius', '4px');
    } else {
        document.documentElement.style.setProperty('--custom-section-display', 'inline-block');
        document.documentElement.style.setProperty('--custom-section-width', 'max-content');
        document.documentElement.style.setProperty('--custom-section-align-self', 'flex-start');
        document.documentElement.style.setProperty('--custom-section-border-right', 'none');
        document.documentElement.style.setProperty('--custom-section-border-radius', '0 4px 4px 0');
    }

    document.documentElement.style.setProperty('--custom-topic-text', customDesignSettings.topicText || accent);
    document.documentElement.style.setProperty('--custom-topic-border-color', customDesignSettings.topicBorder || secondary);
    document.documentElement.style.setProperty('--custom-topic-border-color-val', customDesignSettings.topicBorder || secondary);
    document.documentElement.style.setProperty('--custom-topic-border-style', customDesignSettings.topicBorderStyle || 'dashed');
    document.documentElement.style.setProperty('--custom-topic-margin-top', customDesignSettings.topicMarginTop || '4px');
    document.documentElement.style.setProperty('--custom-topic-margin-bottom', customDesignSettings.topicMarginBottom || '2px');
    document.documentElement.style.setProperty('--custom-topic-size', `${customDesignSettings.topicSize || 15}px`);
    document.documentElement.style.setProperty('--custom-topic-border-thickness', `${customDesignSettings.topicThick || 1.5}px`);
    document.documentElement.style.setProperty('--custom-topic-alignment', customDesignSettings.topicAlignment || 'flex-start');

    document.documentElement.style.setProperty('--custom-inner-border-color', customDesignSettings.innerBorderColor || secondary);
    document.documentElement.style.setProperty('--custom-corner-color', customDesignSettings.cornerColor || secondary);
    document.documentElement.style.setProperty('--custom-inner-border-thickness', `${customDesignSettings.borderThick !== undefined ? customDesignSettings.borderThick : 0}px`);
    document.documentElement.style.setProperty('--custom-corner-size', `${customDesignSettings.cornerSize !== undefined ? customDesignSettings.cornerSize : 10}px`);

    // Two-column divider variables update
    document.documentElement.style.setProperty('--custom-divider-color', customDesignSettings.dividerColor || secondary);
    document.documentElement.style.setProperty('--custom-divider-style', customDesignSettings.dividerStyle || 'dashed');
    document.documentElement.style.setProperty('--custom-divider-thickness', `${customDesignSettings.dividerThickness || 1.5}px`);

    // Page margins and paddings variables update
    document.documentElement.style.setProperty('--custom-page-margin-x', `${customDesignSettings.pageMarginX || 8}mm`);
    document.documentElement.style.setProperty('--custom-page-margin-y', `${customDesignSettings.pageMarginY || 6}mm`);
    document.documentElement.style.setProperty('--custom-page-padding-x', `${customDesignSettings.pagePaddingX || 6}mm`);
    document.documentElement.style.setProperty('--custom-page-padding-y', `${customDesignSettings.pagePaddingY || 4}mm`);

    // End star divider variables
    const esc = customDesignSettings.endStarColor || secondary;
    document.documentElement.style.setProperty('--custom-end-star-color', esc);
    document.documentElement.style.setProperty('--custom-end-star-size', `${customDesignSettings.endStarSize || 18}px`);
    document.documentElement.style.setProperty('--custom-end-star-animation', (customDesignSettings.endStarPulse !== false) ? 'pulseStar 3s ease-in-out infinite' : 'none');
    
    // Hex to RGBA for shadow
    if (esc.startsWith('#') && esc.length === 7) {
        const r = parseInt(esc.substring(1, 3), 16);
        const g = parseInt(esc.substring(3, 5), 16);
        const b = parseInt(esc.substring(5, 7), 16);
        document.documentElement.style.setProperty('--custom-end-star-shadow', `rgba(${r}, ${g}, ${b}, 0.35)`);
    } else {
        if (secondary.startsWith('#') && secondary.length === 7) {
            const r = parseInt(secondary.substring(1, 3), 16);
            const g = parseInt(secondary.substring(3, 5), 16);
            const b = parseInt(secondary.substring(5, 7), 16);
            document.documentElement.style.setProperty('--custom-end-star-shadow', `rgba(${r}, ${g}, ${b}, 0.35)`);
        } else {
            document.documentElement.style.setProperty('--custom-end-star-shadow', 'rgba(197, 162, 83, 0.35)');
        }
    }

    // Sync inputs UI
    designSectionBg.value = customDesignSettings.sectionBg || primary;
    designSectionAccent.value = customDesignSettings.sectionAccent || accent;
    designSectionText.value = customDesignSettings.sectionText || '#ffffff';
    designSectionSize.value = customDesignSettings.sectionSize || '18';
    designSectionSizeVal.textContent = `${customDesignSettings.sectionSize || 18}px`;
    designSectionAlign.value = secAlign;

    if (designChapterNumSize) {
        designChapterNumSize.value = customDesignSettings.chapterNumSize || '30';
        if (designChapterNumSizeVal) designChapterNumSizeVal.textContent = `${designChapterNumSize.value}px`;
    }
    if (designChapterTitleSize) {
        designChapterTitleSize.value = customDesignSettings.chapterTitleSize || '20';
        if (designChapterTitleSizeVal) designChapterTitleSizeVal.textContent = `${designChapterTitleSize.value}px`;
    }
    if (designChapterSubtitleSize) {
        designChapterSubtitleSize.value = customDesignSettings.chapterSubSize || '15';
        if (designChapterSubtitleSizeVal) designChapterSubtitleSizeVal.textContent = `${designChapterSubtitleSize.value}px`;
    }

    designTopicText.value = customDesignSettings.topicText || accent;
    designTopicBorder.value = customDesignSettings.topicBorder || secondary;
    designTopicBorderStyle.value = customDesignSettings.topicBorderStyle || 'dashed';
    designTopicMargin.value = `${customDesignSettings.topicMarginTop || '4px'} ${customDesignSettings.topicMarginBottom || '2px'}`;
    designTopicSize.value = customDesignSettings.topicSize || '15';
    designTopicSizeVal.textContent = `${customDesignSettings.topicSize || 15}px`;
    designTopicThick.value = customDesignSettings.topicThick || '1.5';
    designTopicThickVal.textContent = `${customDesignSettings.topicThick || 1.5}px`;
    designTopicAlign.value = customDesignSettings.topicAlignment || 'flex-start';

    designInnerBorder.value = customDesignSettings.innerBorderColor || secondary;
    designCornerColor.value = customDesignSettings.cornerColor || secondary;
    designBorderThick.value = customDesignSettings.borderThick !== undefined ? customDesignSettings.borderThick : '0';
    designBorderThickVal.textContent = `${customDesignSettings.borderThick !== undefined ? customDesignSettings.borderThick : 0}px`;
    designCornerSize.value = customDesignSettings.cornerSize !== undefined ? customDesignSettings.cornerSize : '10';
    designCornerSizeVal.textContent = `${customDesignSettings.cornerSize !== undefined ? customDesignSettings.cornerSize : 10}px`;

    // Sync two-column divider UI inputs
    designDividerColor.value = customDesignSettings.dividerColor || secondary;
    designDividerStyle.value = customDesignSettings.dividerStyle || 'dashed';
    designDividerThick.value = customDesignSettings.dividerThickness || '1.5';
    designDividerThickVal.textContent = `${customDesignSettings.dividerThickness || 1.5}px`;


    // Sync end star divider UI inputs
    designEndStarSymbol.value = customDesignSettings.endStarSymbol || '✦';
    designEndStarColor.value = customDesignSettings.endStarColor || secondary;
    designEndStarSize.value = customDesignSettings.endStarSize || '18';
    designEndStarSizeVal.textContent = `${customDesignSettings.endStarSize || 18}px`;
    designEndStarPulse.checked = (customDesignSettings.endStarPulse !== false);

    designPageNumColor.value = customDesignSettings.pageNumColor || primary;
    designPageNumPlace.value = customDesignSettings.pageNumPlacement || 'bottom-center';
    designPageNumPrefix.value = customDesignSettings.pageNumPrefix || 'पेज - ';
    designPageNumSize.value = customDesignSettings.pageNumSize || '15';
    designPageNumSizeVal.textContent = `${customDesignSettings.pageNumSize || 15}px`;

    // Sync page margins and paddings UI inputs
    if (pageMarginXInput) {
        pageMarginXInput.value = customDesignSettings.pageMarginX || '8';
        if (marginXValSpan) marginXValSpan.textContent = `${customDesignSettings.pageMarginX || 8}mm`;
    }
    if (pageMarginYInput) {
        pageMarginYInput.value = customDesignSettings.pageMarginY || '6';
        if (marginYValSpan) marginYValSpan.textContent = `${customDesignSettings.pageMarginY || 6}mm`;
    }
    if (pagePaddingXInput) {
        pagePaddingXInput.value = customDesignSettings.pagePaddingX || '6';
        if (paddingXValSpan) paddingXValSpan.textContent = `${customDesignSettings.pagePaddingX || 6}mm`;
    }
    if (pagePaddingYInput) {
        pagePaddingYInput.value = customDesignSettings.pagePaddingY || '4';
        if (paddingYValSpan) paddingYValSpan.textContent = `${customDesignSettings.pagePaddingY || 4}mm`;
    }

    if (designSectionShape) {
        designSectionShape.value = customDesignSettings.sectionShape || 'rectangle';
    }
    if (designTopicIcon) {
        designTopicIcon.value = customDesignSettings.topicIcon || 'orange-diamond';
    }
    if (designBulletStyle) {
        designBulletStyle.value = customDesignSettings.bulletStyle || 'classic';
    }

    if (customDesignSettings.headerLogoSrc) {
        headerLogoPreview.src = customDesignSettings.headerLogoSrc;
        headerLogoPreviewGroup.style.display = 'block';
    } else {
        headerLogoPreview.src = '';
        headerLogoPreviewGroup.style.display = 'none';
    }
}
