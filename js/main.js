/* ==========================================================================
   SAMYAK - PAGE-BY-PAGE WORKSPACE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM ELEMENTS
    pageTabsList = document.getElementById('page-tabs-list');
    addPageBtn = document.getElementById('quick-add-page-btn') || document.getElementById('add-page-btn');
    deletePageBtn = document.getElementById('quick-delete-page-btn') || document.getElementById('delete-page-btn');

    // A4 Visual Page Grid DOM Elements
    gridViewBtn = document.getElementById('quick-grid-view-btn') || document.getElementById('grid-view-btn');
    pageGridModal = document.getElementById('page-grid-modal');
    closeGridModalBtn = document.getElementById('close-grid-modal-btn');
    pageGridItemsContainer = document.getElementById('page-grid-items-container');
    gridTotalPagesLabel = document.getElementById('grid-total-pages-label');
    gridAddPageBtn = document.getElementById('grid-add-page-btn');

    // New Features DOM Elements
    themeToggleBtn = document.getElementById('theme-toggle-btn');
    toggleToolbarBtn = document.getElementById('toggle-toolbar-btn');
    importProjectBtn = document.getElementById('import-project-btn');
    exportProjectBtn = document.getElementById('export-project-btn');
    importProjectFile = document.getElementById('import-project-file');
    pageLayoutSelect = document.getElementById('page-layout-select');
    applyLayoutAllBtn = document.getElementById('apply-layout-all-btn');
    compactSpacingToggle = document.getElementById('compact-spacing-toggle');
    coverTOCToggle = document.getElementById('cover-toc-toggle');
    pageTemplateSelect = document.getElementById('page-template-select');
    btnSearchToggle = document.getElementById('btn-search-toggle');
    searchReplacePanel = document.getElementById('search-replace-panel');
    findInput = document.getElementById('find-input');
    replaceInput = document.getElementById('replace-input');
    findBtn = document.getElementById('find-btn');
    replaceBtn = document.getElementById('replace-btn');
    replaceAllBtn = document.getElementById('replace-all-btn');
    searchStatus = document.getElementById('search-status');
    
    // Compiler DOM Elements
    compileMagazinesBtn = document.getElementById('compile-magazines-btn');
    compilerModal = document.getElementById('compiler-modal');
    closeCompilerModalBtn = document.getElementById('close-compiler-modal-btn');
    cancelCompilerBtn = document.getElementById('cancel-compiler-btn');
    compileConfirmBtn = document.getElementById('compile-confirm-btn');
    compilerFile1 = document.getElementById('compiler-file-1');
    compilerFile2 = document.getElementById('compiler-file-2');
    compilerFile3 = document.getElementById('compiler-file-3');
    compiledTitleInput = document.getElementById('compiled-title');
    compiledTaglineInput = document.getElementById('compiled-tagline');
    compiledSubtitleInput = document.getElementById('compiled-subtitle');
    
    // Help Shortcuts DOM Elements
    helpModal = document.getElementById('help-modal');
    btnHelpShortcuts = document.getElementById('btn-help-shortcuts');
    closeHelpModalBtn = document.getElementById('close-help-modal-btn');
    closeHelpBtn = document.getElementById('close-help-btn');
    
    coverEditorZone = document.getElementById('cover-editor-zone');
    contentEditorZone = document.getElementById('content-editor-zone');
    pageContentInput = document.getElementById('page-content-input');
    
    // Cover metadata inputs
    docTitleInput = document.getElementById('doc-title');
    docTaglineInput = document.getElementById('doc-tagline');
    docSubtitleInput = document.getElementById('doc-subtitle');
    docThemeInput = document.getElementById('doc-theme');
    coverThemeSelect = document.getElementById('cover-theme-select');
    coverBorderPatternSelect = document.getElementById('cover-border-pattern-select');
    coverEmblemSelect = document.getElementById('cover-emblem-select');
    docClassificationInput = document.getElementById('doc-classification');
    coverTitleSizeSlider = document.getElementById('cover-title-size');
    coverTitleSizeVal = document.getElementById('cover-title-size-val');
    coverClassificationSizeSlider = document.getElementById('cover-classification-size');
    coverClassificationSizeVal = document.getElementById('cover-classification-size-val');
    coverTaglineSizeSlider = document.getElementById('cover-tagline-size');
    coverTaglineSizeVal = document.getElementById('cover-tagline-size-val');
    coverSubtitleSizeSlider = document.getElementById('cover-subtitle-size');
    coverSubtitleSizeVal = document.getElementById('cover-subtitle-size-val');

    // Last page inputs
    lastEditorZone = document.getElementById('last-editor-zone');
    lastTitleInput = document.getElementById('last-title');
    lastSubtitleInput = document.getElementById('last-subtitle');
    lastTaglineInput = document.getElementById('last-tagline');
    
    pagesContainer = document.getElementById('pages-container');
    wordCountSpan = document.getElementById('word-count');
    activePageLabel = document.getElementById('active-page-label');
    
    clearAllBtn = document.getElementById('clear-all-btn');
    printPdfBtn = document.getElementById('print-pdf-btn');
    smartShrinkBtn = document.getElementById('smart-shrink-btn');
    smartSpaceBtn = document.getElementById('smart-space-btn');
    loadingOverlay = document.getElementById('loading-overlay');
    
    zoomInBtn = document.getElementById('zoom-in');
    zoomOutBtn = document.getElementById('zoom-out');
    zoomLevelSpan = document.getElementById('zoom-level');
    
    // Mobile preview drawer elements
    mobilePreviewToggleBtn = document.getElementById('mobile-preview-toggle-btn');
    mobilePreviewCloseBtn = document.getElementById('mobile-preview-close-btn');
    previewPanel = document.querySelector('.preview-panel');
    
    fontDecreaseBtn = document.getElementById('font-decrease');
    fontIncreaseBtn = document.getElementById('font-increase');
    fontSizeValSpan = document.getElementById('font-size-val');
    globalFontStyleSelect = document.getElementById('global-font-style');
    globalFontWeightSelect = document.getElementById('global-font-weight');
    globalLineSpacingSelect = document.getElementById('global-line-spacing');
    globalLetterSpacingSelect = document.getElementById('global-letter-spacing');
    
    toolbarButtons = document.querySelectorAll('.tool-btn');
    toolbarTrayTrigger = document.getElementById('toolbar-tray-trigger');
    toolbarTrayDrawer = document.getElementById('toolbar-tray-drawer');
    toolbarCustomizeTrigger = document.getElementById('toolbar-customize-trigger');

    // Dynamic Toolbar Layout Configurations & Sanitization
    const defaultToolbarLayout = {
        main: ['btn-section', 'btn-topic', 'btn-bullet', 'btn-note', 'highlight-green-btn', 'highlight-pink-btn', 'btn-factbox', 'box-style-select'],
        tray: ['btn-pagebreak', 'btn-columnbreak', 'btn-chapter', 'insert-image-btn', 'insert-table-btn', 'btn-search-toggle', 'btn-help-shortcuts']
    };

    currentToolbarLayout = { ...defaultToolbarLayout };

    function sanitizeToolbarLayout(saved) {
        const allPossible = [...defaultToolbarLayout.main, ...defaultToolbarLayout.tray];
        const sanitized = { main: [], tray: [] };
        
        if (saved && Array.isArray(saved.main) && Array.isArray(saved.tray)) {
            saved.main.forEach(id => {
                if (allPossible.includes(id) && !sanitized.main.includes(id)) sanitized.main.push(id);
            });
            saved.tray.forEach(id => {
                if (allPossible.includes(id) && !sanitized.tray.includes(id)) sanitized.tray.push(id);
            });
        }
        
        allPossible.forEach(id => {
            if (!sanitized.main.includes(id) && !sanitized.tray.includes(id)) {
                if (defaultToolbarLayout.main.includes(id)) {
                    sanitized.main.push(id);
                } else {
                    sanitized.tray.push(id);
                }
            }
        });
        
        return sanitized;
    }

    const savedLayout = localStorage.getItem('samyak-toolbar-layout-v1');
    if (savedLayout) {
        try {
            currentToolbarLayout = sanitizeToolbarLayout(JSON.parse(savedLayout));
        } catch (e) {
            console.error('Error loading toolbar layout:', e);
        }
    }

    function renderToolbarLayout() {
        const toolbar = document.querySelector('.editor-toolbar');
        const trayDrawer = document.getElementById('toolbar-tray-drawer');
        const trayTrigger = document.getElementById('toolbar-tray-trigger');
        
        if (!toolbar || !trayDrawer || !trayTrigger) return;
        
        // Append main toolbar elements in order before the tray trigger button
        currentToolbarLayout.main.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                toolbar.insertBefore(btn, trayTrigger);
            }
        });
        
        // Append tray drawer elements in order inside the tray drawer
        currentToolbarLayout.tray.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                trayDrawer.appendChild(btn);
            }
        });
    }

    // Run layout arrangement immediately on load
    renderToolbarLayout();

    // Sidebar Horizontal Dynamic Navigation Tabs
    const sidebarTabButtons = document.querySelectorAll('.sidebar-tab-btn');
    const sidebarPanels = document.querySelectorAll('.sidebar-panel');

    // 1.2 SMART AI DOM ELEMENTS
    const phoneticTypingToggle = document.getElementById('phonetic-typing-toggle');
    if (phoneticTypingToggle) {
        const isPhonetic = localStorage.getItem('samyak_phonetic_typing_enabled');
        phoneticTypingToggle.checked = (isPhonetic !== null) ? (isPhonetic === 'true') : false;
        phoneticTypingToggle.addEventListener('change', () => {
            localStorage.setItem('samyak_phonetic_typing_enabled', phoneticTypingToggle.checked);
        });
    }
    const ocrDragDropZone = document.getElementById('ocr-drag-drop-zone');
    const ocrFileInput = document.getElementById('ocr-file-input');
    
    // NEW PREMIUM OCR DASHBOARD DOM ELEMENTS & STATE
    const openOcrDashBtn = document.getElementById('tab-ocr-btn');
    const ocrIntegratedWorkspace = document.getElementById('ocr-integrated-workspace');
    const ocrDashDragZone = document.getElementById('ocr-dash-drag-zone');
    const ocrDashFileInput = document.getElementById('ocr-dash-file-input');
    const ocrDashPreviewArea = document.getElementById('ocr-dash-preview-area');
    const ocrDashFileBadge = document.getElementById('ocr-dash-file-badge');
    const ocrDashFileName = document.getElementById('ocr-dash-file-name');
    const ocrDashFileSize = document.getElementById('ocr-dash-file-size');
    const ocrDashRemoveFileBtn = document.getElementById('ocr-dash-remove-file-btn');
    const ocrDashScanOverlay = document.getElementById('ocr-dash-scan-overlay');
    const ocrDashPreviewImg = document.getElementById('ocr-dash-preview-img');
    const ocrDashEngineSelect = document.getElementById('ocr-dash-engine-select');
    const ocrDashLayoutToggle = document.getElementById('ocr-dash-layout-toggle');
    const ocrDashStructToggle = document.getElementById('ocr-dash-struct-toggle');
    const ocrDashProcessBtn = document.getElementById('ocr-dash-process-btn');
    const ocrDashProcessingIndicator = document.getElementById('ocr-dash-processing-indicator');
    
    const ocrDashTabPreview = document.getElementById('ocr-dash-tab-preview');
    const ocrDashTabEditor = document.getElementById('ocr-dash-tab-editor');
    const ocrDashTabAlerts = document.getElementById('ocr-dash-tab-alerts');
    const ocrDashAlertBadgeCount = document.getElementById('ocr-dash-alert-badge-count');
    const ocrDashStatsBar = document.getElementById('ocr-dash-stats-bar');
    const ocrDashConfidenceVal = document.getElementById('ocr-dash-confidence-val');
    const ocrDashWordcountVal = document.getElementById('ocr-dash-wordcount-val');
    const ocrDashAlertsCountVal = document.getElementById('ocr-dash-alerts-count-val');
    
    const ocrDashIdleState = document.getElementById('ocr-dash-idle-state');
    const ocrDashViewStructured = document.getElementById('ocr-dash-view-structured');
    const ocrDashRenderedHtml = document.getElementById('ocr-dash-rendered-html');
    const ocrDashViewEditor = document.getElementById('ocr-dash-view-editor');
    const ocrDashRawTextarea = document.getElementById('ocr-dash-raw-textarea');
    const ocrDashViewAlerts = document.getElementById('ocr-dash-view-alerts');
    const ocrDashAlertsList = document.getElementById('ocr-dash-alerts-list');
    
    const ocrDashActionsBar = document.getElementById('ocr-dash-actions-bar');
    const ocrDashCopyBtn = document.getElementById('ocr-dash-copy-btn');
    const ocrDashDownloadBtn = document.getElementById('ocr-dash-download-btn');
    const ocrDashInsertBtn = document.getElementById('ocr-dash-insert-btn');

    // Page Selector Modal Elements
    const ocrPageSelectorModal = document.getElementById('ocr-page-selector-modal');
    const ocrPageSelectorClose = document.getElementById('ocr-page-selector-close');
    const ocrDestinationPageSelect = document.getElementById('ocr-destination-page-select');
    const ocrPageSelectorCancel = document.getElementById('ocr-page-selector-cancel');
    const ocrPageSelectorConfirm = document.getElementById('ocr-page-selector-confirm');

    let ocrDashUploadedFile = null;
    let ocrDashActiveTab = 'preview';
    let ocrDashLayoutAnalysis = (localStorage.getItem('samyak_ocr_layout_analysis') !== 'false');
    let ocrDashAutoStructuring = (localStorage.getItem('samyak_ocr_auto_structuring') !== 'false');
    const phoneticSuggestionsTooltip = document.getElementById('phonetic-suggestions-tooltip');

    // Phonetic suggestion state variables (Google Input Tools emulation)
    let suggestionsList = [];
    let activeSuggestionIndex = 0;
    let suggestionsActive = false;
    let currentEnglishWord = "";
    let currentWordStartIdx = -1;
    let ocrFileChangeCount = 0; // Tracks uploaded pages to change extracted text dynamically

    // 1.1 WATERMARK DOM ELEMENTS
    const watermarkTypeSelect = document.getElementById('watermark-type');
    const watermarkTextGroup = document.getElementById('watermark-text-group');
    const watermarkTextInput = document.getElementById('watermark-text');
    const watermarkImageGroup = document.getElementById('watermark-image-group');
    const watermarkImageFileInput = document.getElementById('watermark-image-file');
    const watermarkPositionSelect = document.getElementById('watermark-position');
    const watermarkRotationSelect = document.getElementById('watermark-rotation');
    const watermarkOpacitySlider = document.getElementById('watermark-opacity');
    const watermarkOpacityVal = document.getElementById('watermark-opacity-val');
    const watermarkSizeSlider = document.getElementById('watermark-size');
    const watermarkSizeVal = document.getElementById('watermark-size-val');
    const watermarkColorGroup = document.getElementById('watermark-color-group');
    const watermarkColorInput = document.getElementById('watermark-color');

    // 1.2 CUSTOM DESIGN DOM ELEMENTS
    const designSectionBg = document.getElementById('design-section-bg');
    const designSectionAccent = document.getElementById('design-section-accent');
    const designSectionText = document.getElementById('design-section-text');
    const designSectionSize = document.getElementById('design-section-size');
    const designSectionSizeVal = document.getElementById('design-section-size-val');
    const designSectionAlign = document.getElementById('design-section-align');

    const designChapterNumSize = document.getElementById('design-chapter-num-size');
    const designChapterNumSizeVal = document.getElementById('design-chapter-num-size-val');
    const designChapterTitleSize = document.getElementById('design-chapter-title-size');
    const designChapterTitleSizeVal = document.getElementById('design-chapter-title-size-val');
    const designChapterSubtitleSize = document.getElementById('design-chapter-subtitle-size');
    const designChapterSubtitleSizeVal = document.getElementById('design-chapter-subtitle-size-val');

    const designTopicText = document.getElementById('design-topic-text');
    const designTopicBorder = document.getElementById('design-topic-border');
    const designTopicBorderStyle = document.getElementById('design-topic-border-style');
    const designTopicMargin = document.getElementById('design-topic-margin');
    const designTopicSize = document.getElementById('design-topic-size');
    const designTopicSizeVal = document.getElementById('design-topic-size-val');
    const designTopicThick = document.getElementById('design-topic-thick');
    const designTopicThickVal = document.getElementById('design-topic-thick-val');
    const designTopicAlign = document.getElementById('design-topic-align');
    const designSectionShape = document.getElementById('design-section-shape');
    const designTopicIcon = document.getElementById('design-topic-icon');
    const designBulletStyle = document.getElementById('design-bullet-style');

    const designInnerBorder = document.getElementById('design-inner-border');
    const designCornerColor = document.getElementById('design-corner-color');
    const designBorderThick = document.getElementById('design-border-thick');
    const designBorderThickVal = document.getElementById('design-border-thick-val');
    const designCornerSize = document.getElementById('design-corner-size');
    const designCornerSizeVal = document.getElementById('design-corner-size-val');

    const designDividerColor = document.getElementById('design-divider-color');
    const designDividerStyle = document.getElementById('design-divider-style');
    const designDividerThick = document.getElementById('design-divider-thick');
    const designDividerThickVal = document.getElementById('design-divider-thick-val');


    const designEndStarSymbol = document.getElementById('design-end-star-symbol');
    const designEndStarColor = document.getElementById('design-end-star-color');
    const designEndStarSize = document.getElementById('design-end-star-size');
    const designEndStarSizeVal = document.getElementById('design-end-star-size-val');
    const designEndStarPulse = document.getElementById('design-end-star-pulse');

    const designPageNumColor = document.getElementById('design-page-num-color');
    const designPageNumPlace = document.getElementById('design-page-num-place');
    const designPageNumPrefix = document.getElementById('design-page-num-prefix');
    const designPageNumSize = document.getElementById('design-page-num-size');
    const designPageNumSizeVal = document.getElementById('design-page-num-size-val');

    // Page margins and paddings inputs
    const pageMarginXInput = document.getElementById('page-margin-x');
    const marginXValSpan = document.getElementById('margin-x-val');
    const pageMarginYInput = document.getElementById('page-margin-y');
    const marginYValSpan = document.getElementById('margin-y-val');
    const pagePaddingXInput = document.getElementById('page-padding-x');
    const paddingXValSpan = document.getElementById('padding-x-val');
    const pagePaddingYInput = document.getElementById('page-padding-y');
    const paddingYValSpan = document.getElementById('padding-y-val');

    const headerLogoFileInput = document.getElementById('header-logo-file');
    const headerLogoPreviewGroup = document.getElementById('header-logo-preview-group');
    const headerLogoPreview = document.getElementById('header-logo-preview');
    const removeHeaderLogoBtn = document.getElementById('remove-header-logo-btn');

    // 1.3 SOCIAL LINKS DOM ELEMENTS
    const footerTelegramInput = document.getElementById('footer-telegram');
    const footerYoutubeInput = document.getElementById('footer-youtube');
    const footerSocialSizeInput = document.getElementById('footer-social-size');
    const footerSocialSizeVal = document.getElementById('footer-social-size-val');
    const footerSocialPlacementSelect = document.getElementById('footer-social-placement');

    // 2. WORKSPACE STATE
    let pagesData = [];      // Array of page objects: [ {type: 'cover', title: '...'}, {type: 'content', text: '...'} ]
    let currentRenderedBlocks = []; // Array of currently rendered content blocks for scroll sync
    let activePageIndex = 0; // Current active page index
    let zoomLevel = 100;
    if (window.innerWidth <= 768) {
        let optimalZoom = Math.floor((window.innerWidth - 32) / 816 * 100);
        zoomLevel = Math.max(35, Math.min(optimalZoom, 60));
    } else if (window.innerWidth <= 1024) {
        zoomLevel = 60;
    }
    
    let contentFontSize = 13.5; // Default body text font size is 13.5px
    let MAX_CONTENT_HEIGHT = 910; // Measured dynamically inside renderPreview
    let cachedMaxContentHeight = null; // Cache to prevent layout thrashing
    let draggedTOCSectionName = null; // Store dragged section name for TOC reordering

    // Last Page State
    let lastPageData = {
        title: 'THANK YOU',
        subtitle: 'Samyak',
        tagline: 'कोचिंग नहीं क्रांति'
    };

    let uploadedImages = {}; // Map of image IDs to Base64 strings
    let imageCounter = 1;    // Counter for uploaded image IDs

    // Premium Watermark State
    let watermarkSettings = {
        type: 'none',       // 'none' | 'text' | 'image'
        text: 'Samyak',
        imageSrc: '',       // Base64 string of uploaded logo image
        position: 'center',  // 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
        rotation: '-45',     // Angle in degrees
        opacity: 0.15,      // Opacity value (0.0 to 1.0)
        size: 60,           // Text size in px or image scale %
        color: '#000000'    // Default black/dark watermark
    };

    // Premium Custom Design State (4th Control Section)
    let customDesignSettings = {
        compactMode: false,
        chapterNumSize: '30',
        chapterTitleSize: '20',
        chapterSubSize: '15',
        // Headings spacing & alignment
        topicMarginTop: '12px',
        topicMarginBottom: '4px',
        topicAlignment: 'flex-start',
        sectionAlignment: 'left',
        
        // Page numbers
        pageNumPlacement: 'bottom-center',
        pageNumPrefix: 'पेज - ',
        pageNumSize: '15',
        pageNumColor: '',
        
        // Header Logo
        headerLogoSrc: '',

        // Page Borders & Decor
        borderThick: '0',
        cornerSize: '10',
        innerBorderColor: '#c5a353',
        cornerColor: '#c5a353',

        // Two-column Divider
        dividerColor: '',
        dividerStyle: 'dashed',
        dividerThickness: '1.5',

        // End Star Divider
        endStarSymbol: '✦',
        endStarColor: '',
        endStarSize: '18',
        endStarPulse: true,
        sectionShape: 'rectangle',
        topicIcon: 'orange-diamond',
        bulletStyle: 'classic',
        
        // Page Spacings Customizations
        pageMarginX: '8',
        pageMarginY: '6',
        pagePaddingX: '6',
        pagePaddingY: '4'
    };


    // 2.1 Social Settings State
    let socialSettings = {
        telegramText: '',
        youtubeText: '',
        fontSize: 11,
        placement: 'split'
    };

    // Section Icon Mapping for Table of Contents
    const sectionIcons = {
        "योजनाएँ एवं नीतियाँ": "📚",
        "योजनाएँ एवं नीतियां": "📚",
        "महोत्सव/मेले/कार्यक्रम": "🎪",
        "महोत्सव, मेले व कार्यक्रम": "🎪",
        "आर्थिक विकास व समझौते": "💼",
        "आर्थिक विकास": "💼",
        "चर्चित व्यक्तित्व": "👤",
        "पुरस्कार": "🏆",
        "प्रमुख अभियान": "🚀",
        "खेल": "⚽",
        "खेल समाचार": "⚽",
        "विविध": "✨",
        "विविध घटनाक्रम": "✨"
    };

    // 3. CORE EVENT HANDLERS
    
    // Initialize premium UI sliders with manual keyboard numeric inputs
    function initPremiumSliders() {
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

        rangeInputs.forEach(slider => {
            const parent = slider.parentElement;
            if (!parent) return;

            // 1. Create the wrapper group
            const wrapper = document.createElement('div');
            wrapper.className = 'premium-slider-group';

            // Insert wrapper and move slider inside it
            parent.insertBefore(wrapper, slider);
            wrapper.appendChild(slider);

            // 2. Create the number input
            const numInput = document.createElement('input');
            numInput.type = 'number';
            numInput.className = 'premium-slider-number';
            numInput.min = slider.min || '0';
            numInput.max = slider.max || '100';
            numInput.step = slider.step || '1';
            numInput.value = slider.value;

            // Determine the unit based on label or slider ID
            let unit = 'px';
            if (slider.id === 'watermark-opacity') {
                unit = '%';
            } else if (slider.id === 'design-topic-thick' || slider.id === 'design-border-thick' || slider.id === 'design-divider-thick') {
                unit = 'px';
            } else {
                const label = parent.querySelector('label');
                if (label && (label.textContent.includes('%') || label.innerHTML.includes('%'))) {
                    unit = '%';
                }
            }

            // 3. Create the number wrapper and unit badge
            const numWrapper = document.createElement('div');
            numWrapper.className = 'premium-number-wrapper';
            numWrapper.appendChild(numInput);

            const badge = document.createElement('span');
            badge.className = 'premium-slider-unit';
            badge.textContent = unit;
            numWrapper.appendChild(badge);

            wrapper.appendChild(numWrapper);

            // 4. Clean up parentheses around the val span in the label
            const valSpan = parent.querySelector('span[id$="-val"]');
            if (valSpan) {
                valSpan.style.display = 'none'; // Hide the val span
                const label = parent.querySelector('label');
                if (label) {
                    label.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            // Remove opening parenthesis before hidden span
                            node.textContent = node.textContent.replace(/\s*\(\s*$/g, '');
                            // Remove closing parenthesis after hidden span
                            node.textContent = node.textContent.replace(/^\s*\)\s*/g, '');
                        }
                    });
                }
            }

            // 5. Two-way data binding
            // A. Slider input event (updates number input)
            slider.addEventListener('input', () => {
                numInput.value = slider.value;
            });

            // B. Number input event (updates slider while typing valid inputs)
            numInput.addEventListener('input', () => {
                let val = parseFloat(numInput.value);
                if (isNaN(val)) return;

                const min = parseFloat(slider.min || '0');
                const max = parseFloat(slider.max || '100');

                // Only update the slider if it's within the valid range
                if (val >= min && val <= max) {
                    descriptor.set.call(slider, val);
                    slider.dispatchEvent(new Event('input'));
                }
            });

            // C. Number input change/blur event (clamps value and updates slider)
            numInput.addEventListener('change', () => {
                let val = parseFloat(numInput.value);
                const min = parseFloat(slider.min || '0');
                const max = parseFloat(slider.max || '100');

                if (isNaN(val)) {
                    val = parseFloat(slider.value);
                } else if (val < min) {
                    val = min;
                } else if (val > max) {
                    val = max;
                }

                numInput.value = val;
                descriptor.set.call(slider, val);
                slider.dispatchEvent(new Event('input'));
            });

            // 6. Redefine value property on slider to keep number input in sync when set via code
            Object.defineProperty(slider, 'value', {
                get: function() {
                    return descriptor.get.call(this);
                },
                set: function(val) {
                    descriptor.set.call(this, val);
                    numInput.value = val;
                },
                configurable: true
            });
        });
    }

    // Call premium sliders initialization
    initPremiumSliders();

    // 3.0 SIDEBAR HORIZONTAL TAB CONTROLLERS
    sidebarTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            switchSidebarTab(targetId);
        });
    });

    function switchSidebarTab(targetPanelId) {
        // 1. Remove active state from all buttons
        sidebarTabButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-target') === targetPanelId) {
                button.classList.add('active');
            }
        });

        // 2. Toggle active panels visibility
        sidebarPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === targetPanelId) {
                panel.classList.add('active');
            }
        });

        // 3. Swap main preview with Integrated OCR Workspace if active panel is panel-ocr
        const previewHeader = document.querySelector('.preview-panel .preview-header');
        const canvasWrapper = document.querySelector('.preview-panel .canvas-wrapper');
        const mobileCloseBtn = document.getElementById('mobile-preview-close-btn');
        
        if (targetPanelId === 'panel-ocr') {
            if (previewHeader) previewHeader.style.display = 'none';
            if (canvasWrapper) canvasWrapper.style.display = 'none';
            if (mobileCloseBtn) mobileCloseBtn.style.display = 'none';
            if (ocrIntegratedWorkspace) ocrIntegratedWorkspace.style.display = 'flex';
            resetOcrDashProject(false);
        } else {
            if (previewHeader) previewHeader.style.display = 'flex';
            if (canvasWrapper) canvasWrapper.style.display = 'block';
            if (mobileCloseBtn) mobileCloseBtn.style.display = '';
            if (ocrIntegratedWorkspace) ocrIntegratedWorkspace.style.display = 'none';
        }
    }

    // Reusable image compression helper using Canvas (reduces 1MB+ images to ~50KB for insane performance)
    // Automatically preserves transparency for PNG/GIF/SVG/WebP to keep logos and watermarks crystal clear!
    function compressImage(base64Str, maxWidth, callback) {
        const img = new Image();
        img.src = base64Str;
        img.onload = function() {
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Auto-detect format to preserve transparent backgrounds (PNG/GIF/SVG/WebP), otherwise use JPEG
            let format = 'image/jpeg';
            let quality = 0.8;
            
            if (base64Str.startsWith('data:image/png') || 
                base64Str.startsWith('data:image/gif') || 
                base64Str.startsWith('data:image/svg') || 
                base64Str.startsWith('data:image/webp')) {
                format = 'image/png';
                quality = undefined; // PNG doesn't support quality parameter in toDataURL
            }
            
            const compressed = canvas.toDataURL(format, quality);
            callback(compressed);
        };
        img.onerror = function() {
            callback(base64Str); // Fallback to original
        };
    }

    // Debounce timers to avoid lagging when typing rapidly
    let renderTimeout = null;
    function debouncedRenderAndSave() {
        clearTimeout(renderTimeout);
        renderTimeout = setTimeout(() => {
            renderPreview();
            saveWorkspaceToLocalStorage();
        }, 200); // 200ms debounce for immediate action inputs (themes, sliders, toggles)
    }

    let typingRenderTimeout = null;
    let typingSaveTimeout = null;
    function debouncedRenderAndSaveTyping() {
        // 1. Snappy live preview render debounce (300ms) - Updates screen almost instantly when typing pauses
        clearTimeout(typingRenderTimeout);
        typingRenderTimeout = setTimeout(() => {
            renderPreview();
        }, 300);

        // 2. High-performance asynchronous persistence debounce (1500ms)
        // Avoids heavy JSON serialization and IndexedDB writes on every keystroke during active typing
        clearTimeout(typingSaveTimeout);
        typingSaveTimeout = setTimeout(() => {
            saveWorkspaceToLocalStorage();
        }, 1500);
    }

    let lastActiveBlockId = null;
    let scrollSyncPending = false;

    // Scroll preview to match the current line in the editor (Lag-free requestAnimationFrame backed performance version)
    function syncPreviewScroll(forceScroll = false) {
        if (scrollSyncPending && !forceScroll) return; // Throttled within frame rate limits to eliminate keystroke typing lag
        
        scrollSyncPending = true;
        requestAnimationFrame(() => {
            scrollSyncPending = false;
            
            if (activePageIndex <= 0 || activePageIndex >= pagesData.length || !currentRenderedBlocks || !currentRenderedBlocks.length) return;

            // Get active cursor line
            const textUpToCursor = pageContentInput.value.substring(0, pageContentInput.selectionStart);
            const cursorLine = textUpToCursor.split('\n').length - 1;

            // Calculate global line offset for the active page
            let globalLineOffset = 0;
            for (let idx = 1; idx < activePageIndex; idx++) {
                globalLineOffset += pagesData[idx].text.split('\n').length;
            }
            const globalLine = globalLineOffset + cursorLine;

            // Find the block corresponding to this global line
            const matchedBlock = currentRenderedBlocks.find(block => {
                return (typeof block.startLine !== 'undefined' && globalLine >= block.startLine && globalLine <= block.endLine);
            });

            if (matchedBlock) {
                // Find the preview element
                const previewElement = pagesContainer.querySelector(`[data-block-id="${matchedBlock.id}"]`);
                if (previewElement) {
                    const activeBlockChanged = (lastActiveBlockId !== matchedBlock.id);
                    lastActiveBlockId = matchedBlock.id;

                    // Optimize DOM writes: only write style classes if highlight block actually changed!
                    const activeHighlights = document.querySelectorAll('.active-block-highlight');
                    let alreadyHighlighted = false;
                    
                    activeHighlights.forEach(el => {
                        if (el === previewElement) {
                            alreadyHighlighted = true;
                        } else {
                            el.classList.remove('active-block-highlight');
                        }
                    });
                    
                    if (!alreadyHighlighted) {
                        previewElement.classList.add('active-block-highlight');
                    }

                    // Scroll the block into the center of the preview viewport only if forced or the block changed
                    if (forceScroll || activeBlockChanged) {
                        previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        });
    }

    // Live update when writing on content pages
    pageContentInput.addEventListener('input', () => {
        if (activePageIndex > 0) {
            pagesData[activePageIndex].text = pageContentInput.value;
            updateStats();
            debouncedRenderAndSaveTyping();
            
            // Sync scroll on input with a slight timeout to wait for DOM parsing
            setTimeout(() => syncPreviewScroll(false), 50);
        }
    });

    // Also sync scroll when cursor selection/click changes
    ['keyup', 'click', 'focus'].forEach(evtType => {
        pageContentInput.addEventListener(evtType, () => syncPreviewScroll(false));
    });

    // Live update when editing cover metadata (synchronous DOM preview update for instant feedback)
    function syncCoverPreviewMetadata() {
        const coverPage = pagesContainer.querySelector('.cover-page');
        if (!coverPage) return;
        
        const titleEl = coverPage.querySelector('.cover-title');
        if (titleEl) titleEl.textContent = docTitleInput.value;
        
        const taglineBoxEl = coverPage.querySelector('.cover-tagline-box');
        const taglineEl = coverPage.querySelector('.cover-tagline-box h3');
        const coverContentEl = coverPage.querySelector('.cover-page-content');
        
        const hasTagline = docTaglineInput.value && docTaglineInput.value.trim() !== '';
        if (taglineBoxEl) {
            if (hasTagline) {
                taglineBoxEl.style.display = '';
                if (taglineEl) taglineEl.textContent = docTaglineInput.value;
                if (coverContentEl) coverContentEl.classList.remove('tagline-empty');
            } else {
                taglineBoxEl.style.display = 'none';
                if (coverContentEl) coverContentEl.classList.add('tagline-empty');
            }
        }
        
        const subtitleEl = coverPage.querySelector('.cover-subtitle');
        if (subtitleEl) subtitleEl.textContent = docSubtitleInput.value;
        
        const classificationEl = coverPage.querySelector('.cover-classification');
        if (classificationEl) {
            classificationEl.textContent = docClassificationInput.value;
            if (!docClassificationInput.value) {
                classificationEl.style.minHeight = '30px';
            } else {
                classificationEl.style.minHeight = '';
            }
        }
        
        updateDocumentTitle();
    }

    [docTitleInput, docTaglineInput, docSubtitleInput, docClassificationInput].forEach(input => {
        input.addEventListener('input', () => {
            if (activePageIndex === 0) {
                pagesData[0].title = docTitleInput.value;
                pagesData[0].tagline = docTaglineInput.value;
                pagesData[0].subtitle = docSubtitleInput.value;
                pagesData[0].classification = docClassificationInput.value;
                syncCoverPreviewMetadata();
                debouncedRenderAndSaveTyping();
            }
        });
    });

    if (coverThemeSelect) {
        coverThemeSelect.addEventListener('change', () => {
            if (pagesData[0]) {
                pagesData[0].coverTheme = coverThemeSelect.value;
                debouncedRenderAndSaveTyping();
            }
        });
    }

    if (coverBorderPatternSelect) {
        coverBorderPatternSelect.addEventListener('change', () => {
            if (pagesData[0]) {
                pagesData[0].coverBorderPattern = coverBorderPatternSelect.value;
                debouncedRenderAndSave();
            }
        });
    }

    if (coverEmblemSelect) {
        coverEmblemSelect.addEventListener('change', () => {
            if (pagesData[0]) {
                pagesData[0].coverEmblem = coverEmblemSelect.value;
                debouncedRenderAndSave();
            }
        });
    }

    // Cover Typography Sizes change listeners (debounced rendering + synchronous DOM update for 60fps smoothness)
    if (coverTitleSizeSlider) {
        coverTitleSizeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            coverTitleSizeVal.textContent = `${val}px`;
            if (pagesData[0]) {
                pagesData[0].titleSize = val;
                const targetEl = pagesContainer.querySelector('.cover-page .cover-title');
                if (targetEl) {
                    targetEl.style.fontSize = `${val}px`;
                }
                debouncedRenderAndSave();
            }
        });
    }

    if (coverClassificationSizeSlider) {
        coverClassificationSizeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            coverClassificationSizeVal.textContent = `${val}px`;
            if (pagesData[0]) {
                pagesData[0].classificationSize = val;
                const targetEl = pagesContainer.querySelector('.cover-page .cover-classification');
                if (targetEl) {
                    targetEl.style.fontSize = `${val}px`;
                }
                debouncedRenderAndSave();
            }
        });
    }

    if (coverTaglineSizeSlider) {
        coverTaglineSizeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            coverTaglineSizeVal.textContent = `${val}px`;
            if (pagesData[0]) {
                pagesData[0].taglineSize = val;
                const targetEl = pagesContainer.querySelector('.cover-page .cover-tagline-box h3');
                if (targetEl) {
                    targetEl.style.fontSize = `${val}px`;
                }
                debouncedRenderAndSave();
            }
        });
    }

    if (coverSubtitleSizeSlider) {
        coverSubtitleSizeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            coverSubtitleSizeVal.textContent = `${val}px`;
            if (pagesData[0]) {
                pagesData[0].subtitleSize = val;
                const targetEl = pagesContainer.querySelector('.cover-page .cover-subtitle');
                if (targetEl) {
                    targetEl.style.fontSize = `${val}px`;
                }
                debouncedRenderAndSave();
            }
        });
    }

    // Live update when editing last page metadata
    [lastTitleInput, lastSubtitleInput, lastTaglineInput].forEach(input => {
        input.addEventListener('input', () => {
            if (activePageIndex === pagesData.length) {
                lastPageData.title = lastTitleInput.value;
                lastPageData.subtitle = lastSubtitleInput.value;
                lastPageData.tagline = lastTaglineInput.value;
                debouncedRenderAndSaveTyping();
            }
        });
    });

    docThemeInput.addEventListener('change', () => {
        if (pagesData[0]) {
            pagesData[0].theme = docThemeInput.value;
            localStorage.setItem('samyak-global-theme', docThemeInput.value);
            applyTheme(docThemeInput.value, true);
            renderPreview();
            saveWorkspaceToLocalStorage();
        }
    });

    // Image Insertion Modal Event Listeners
    const insertImageBtn = document.getElementById('insert-image-btn');
    const imageModal = document.getElementById('image-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelImageBtn = document.getElementById('cancel-image-btn');
    const insertConfirmBtn = document.getElementById('insert-confirm-btn');

    const modalTabUpload = document.getElementById('modal-tab-upload');
    const modalTabUrl = document.getElementById('modal-tab-url');
    const modalContentUpload = document.getElementById('modal-content-upload');
    const modalContentUrl = document.getElementById('modal-content-url');
    const modalUploadZone = document.getElementById('modal-upload-zone');
    const modalImageFile = document.getElementById('modal-image-file');
    const selectedFileName = document.getElementById('selected-file-name');
    const imageUrlInput = document.getElementById('image-url-input');

    const modalImagePreviewContainer = document.getElementById('modal-image-preview-container');
    const modalImagePreview = document.getElementById('modal-image-preview');
    const removePreviewBtn = document.getElementById('remove-preview-btn');

    const imageCaptionInput = document.getElementById('image-caption');
    const imageWidthSelect = document.getElementById('image-width');
    const imageAlignSelect = document.getElementById('image-align');

    let activeImageSource = 'upload'; // 'upload' | 'url'
    let currentUploadedBase64 = '';

    if (insertImageBtn && imageModal) {
        insertImageBtn.addEventListener('click', () => {
            if (activePageIndex > 0 && activePageIndex < pagesData.length) {
                // Reset inputs
                currentUploadedBase64 = '';
                selectedFileName.textContent = 'No file selected';
                imageUrlInput.value = '';
                imageCaptionInput.value = '';
                imageWidthSelect.value = '90%';
                imageAlignSelect.value = 'center';
                modalImagePreviewContainer.style.display = 'none';
                modalImagePreview.src = '';
                modalUploadZone.style.display = 'flex';
                insertConfirmBtn.disabled = true;

                // Reset Tab states
                activeImageSource = 'upload';
                modalTabUpload.classList.add('active');
                modalTabUpload.style.borderBottomColor = 'var(--ui-accent)';
                modalTabUpload.style.color = '#fff';
                modalTabUrl.classList.remove('active');
                modalTabUrl.style.borderBottomColor = 'transparent';
                modalTabUrl.style.color = 'var(--ui-text-muted)';
                modalContentUpload.style.display = 'block';
                modalContentUrl.style.display = 'none';

                // Show modal
                imageModal.classList.add('active');
            } else {
                alert('Photos can only be inserted into content pages!');
            }
        });

        // Close Modal handlers
        const hideImageModal = () => {
            imageModal.classList.remove('active');
        };
        closeModalBtn.addEventListener('click', hideImageModal);
        cancelImageBtn.addEventListener('click', hideImageModal);

        // Close when clicking outside content
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                hideImageModal();
            }
        });

        // Tab switches
        modalTabUpload.addEventListener('click', () => {
            activeImageSource = 'upload';
            modalTabUpload.classList.add('active');
            modalTabUpload.style.borderBottomColor = 'var(--ui-accent)';
            modalTabUpload.style.color = '#fff';
            modalTabUrl.classList.remove('active');
            modalTabUrl.style.borderBottomColor = 'transparent';
            modalTabUrl.style.color = 'var(--ui-text-muted)';
            modalContentUpload.style.display = 'block';
            modalContentUrl.style.display = 'none';
            validateConfirmButton();
        });

        modalTabUrl.addEventListener('click', () => {
            activeImageSource = 'url';
            modalTabUrl.classList.add('active');
            modalTabUrl.style.borderBottomColor = 'var(--ui-accent)';
            modalTabUrl.style.color = '#fff';
            modalTabUpload.classList.remove('active');
            modalTabUpload.style.borderBottomColor = 'transparent';
            modalTabUpload.style.color = 'var(--ui-text-muted)';
            modalContentUpload.style.display = 'none';
            modalContentUrl.style.display = 'block';
            validateConfirmButton();
        });

        // Upload zone click
        modalUploadZone.addEventListener('click', () => {
            modalImageFile.click();
        });

        modalImageFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                selectedFileName.textContent = file.name;
                const reader = new FileReader();
                reader.onload = function(event) {
                    const rawBase64 = event.target.result;
                    // Automatically compress to max width of 800px to keep file sizes tiny and rendering instant
                    compressImage(rawBase64, 800, (compressedBase64) => {
                        currentUploadedBase64 = compressedBase64;
                        modalImagePreview.src = currentUploadedBase64;
                        modalImagePreviewContainer.style.display = 'flex';
                        modalUploadZone.style.display = 'none';
                        validateConfirmButton();
                    });
                };
                reader.readAsDataURL(file);
            }
        });

        removePreviewBtn.addEventListener('click', () => {
            currentUploadedBase64 = '';
            selectedFileName.textContent = 'No file selected';
            modalImageFile.value = '';
            modalImagePreviewContainer.style.display = 'none';
            modalImagePreview.src = '';
            modalUploadZone.style.display = 'flex';
            validateConfirmButton();
        });

        imageUrlInput.addEventListener('input', validateConfirmButton);

        function validateConfirmButton() {
            if (activeImageSource === 'upload') {
                insertConfirmBtn.disabled = !currentUploadedBase64;
            } else {
                insertConfirmBtn.disabled = !imageUrlInput.value.trim();
            }
        }

        // Insert Action
        insertConfirmBtn.addEventListener('click', () => {
            let imgSource = '';
            if (activeImageSource === 'upload') {
                const imgId = `image_${imageCounter}`;
                uploadedImages[imgId] = currentUploadedBase64;
                imageCounter++;
                imgSource = imgId;
                
                // Snappy performance optimization: Save uploaded images to separate IndexedDB store immediately
                saveToDB('samyak_uploaded_images', uploadedImages);
                saveToDB('samyak_image_counter', imageCounter);
            } else {
                imgSource = imageUrlInput.value.trim();
            }

            const captionVal = imageCaptionInput.value.trim() || 'Photo';
            const widthVal = imageWidthSelect.value;
            const alignVal = imageAlignSelect.value;

            // Format markdown code: ![Caption|Width|Alignment](image_id)
            const markdownTag = `\n![${captionVal}|${widthVal}|${alignVal}](${imgSource})\n`;
            
            insertAtCursor(pageContentInput, markdownTag);
            pagesData[activePageIndex].text = pageContentInput.value;
            
            renderPreview();
            updateStats();
            saveWorkspaceToLocalStorage();
            hideImageModal();
        });
    }

    // Table Insertion Modal Event Listeners
    const insertTableBtn = document.getElementById('insert-table-btn');
    const tableModal = document.getElementById('table-modal');
    const closeTableModalBtn = document.getElementById('close-table-modal-btn');
    const cancelTableBtn = document.getElementById('cancel-table-btn');
    const insertTableConfirmBtn = document.getElementById('insert-table-confirm-btn');
    const tableColsInput = document.getElementById('table-cols');
    const tableRowsInput = document.getElementById('table-rows');
    const tableWidthSelect = document.getElementById('table-width-select');
    const tableAlignSelect = document.getElementById('table-align-select');

    if (insertTableBtn && tableModal) {
        insertTableBtn.addEventListener('click', () => {
            if (activePageIndex > 0 && activePageIndex < pagesData.length) {
                // Reset inputs to default
                tableColsInput.value = 3;
                tableRowsInput.value = 3;
                tableWidthSelect.value = '100%';
                tableAlignSelect.value = 'center';
                // Show modal
                tableModal.classList.add('active');
            } else {
                alert('Tables can only be inserted into content pages!');
            }
        });

        // Close Modal handlers
        const hideTableModal = () => {
            tableModal.classList.remove('active');
        };
        closeTableModalBtn.addEventListener('click', hideTableModal);
        cancelTableBtn.addEventListener('click', hideTableModal);

        // Close when clicking outside content
        tableModal.addEventListener('click', (e) => {
            if (e.target === tableModal) {
                hideTableModal();
            }
        });

        // Insert Table Action
        insertTableConfirmBtn.addEventListener('click', () => {
            const cols = parseInt(tableColsInput.value) || 3;
            const rows = parseInt(tableRowsInput.value) || 3;
            const width = tableWidthSelect.value;
            const align = tableAlignSelect.value;

            // Generate table markdown
            let md = `\n<!-- table|width=${width}|align=${align} -->\n`;
            
            // Header row
            let headers = [];
            for (let c = 1; c <= cols; c++) {
                headers.push(` Header ${c} `);
            }
            md += `|${headers.join('|')}|\n`;
            
            // Separator row
            let separators = [];
            for (let c = 1; c <= cols; c++) {
                separators.push(`---`);
            }
            md += `|${separators.join('|')}|\n`;
            
            // Data rows
            for (let r = 1; r <= rows; r++) {
                let rowCells = [];
                for (let c = 1; c <= cols; c++) {
                    rowCells.push(` Cell ${r}-${c} `);
                }
                md += `|${rowCells.join('|')}|\n`;
            }
            md += `\n`;

            insertAtCursor(pageContentInput, md);
            pagesData[activePageIndex].text = pageContentInput.value;
            
            renderPreview();
            updateStats();
            saveWorkspaceToLocalStorage();
            hideTableModal();
        });
    }

    // Magazine Compiler Modal Event Listeners
    if (compileMagazinesBtn && compilerModal) {
        compileMagazinesBtn.addEventListener('click', () => {
            // Reset files
            compilerFile1.value = '';
            compilerFile2.value = '';
            compilerFile3.value = '';
            compileConfirmBtn.disabled = true;

            // Pre-populate metadata fields from current cover page
            if (pagesData[0]) {
                compiledTitleInput.value = pagesData[0].title || 'Samyak';
                compiledTaglineInput.value = pagesData[0].tagline || 'कोचिंग नहीं क्रांति';
                compiledSubtitleInput.value = pagesData[0].subtitle || 'राजस्थान समसामयिकी';
            }

            // Show compiler modal
            compilerModal.classList.add('active');
        });

        const hideCompilerModal = () => {
            compilerModal.classList.remove('active');
        };
        closeCompilerModalBtn.addEventListener('click', hideCompilerModal);
        cancelCompilerBtn.addEventListener('click', hideCompilerModal);

        compilerModal.addEventListener('click', (e) => {
            if (e.target === compilerModal) {
                hideCompilerModal();
            }
        });

        // Function to validate files (must have at least File 1 and File 2)
        const validateCompilerFiles = () => {
            const file1 = compilerFile1.files[0];
            const file2 = compilerFile2.files[0];
            compileConfirmBtn.disabled = !(file1 && file2);
        };

        compilerFile1.addEventListener('change', validateCompilerFiles);
        compilerFile2.addEventListener('change', validateCompilerFiles);
        compilerFile3.addEventListener('change', validateCompilerFiles);

        // Merge confirm action
        compileConfirmBtn.addEventListener('click', () => {
            const file1 = compilerFile1.files[0];
            const file2 = compilerFile2.files[0];
            const file3 = compilerFile3.files[0];

            if (!file1 || !file2) {
                alert('Please select both Part 1 and Part 2 files to compile!');
                return;
            }

            // Read all files asynchronously
            const readState = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const state = JSON.parse(e.target.result);
                            resolve(state);
                        } catch (err) {
                            reject(new Error(`Error reading file "${file.name}": ${err.message}`));
                        }
                    };
                    reader.onerror = () => reject(new Error(`Issue loading file "${file.name}".`));
                    reader.readAsText(file);
                });
            };

            const promises = [readState(file1), readState(file2)];
            if (file3) {
                promises.push(readState(file3));
            }

            compileConfirmBtn.disabled = true;
            compileConfirmBtn.textContent = 'Compiling...';

            Promise.all(promises)
                .then((fileStates) => {
                    const newMeta = {
                        title: compiledTitleInput.value.trim() || 'Samyak',
                        tagline: compiledTaglineInput.value.trim() || 'कोचिंग नहीं क्रांति',
                        subtitle: compiledSubtitleInput.value.trim() || 'राजस्थान समसामयिकी'
                    };

                    compileAndMergeMagazines(fileStates, newMeta);
                    hideCompilerModal();
                    alert('Magazines have been smart-merged and the monthly edition is loaded successfully!');
                })
                .catch((err) => {
                    alert(err.message);
                })
                .finally(() => {
                    compileConfirmBtn.disabled = false;
                    compileConfirmBtn.textContent = 'Compile & Merge';
                });
        });
    }

    // Shortcuts & Formatting Help Modal Event Listeners
    if (btnHelpShortcuts && helpModal) {
        btnHelpShortcuts.addEventListener('click', () => {
            helpModal.classList.add('active');
        });

        const hideHelpModal = () => {
            helpModal.classList.remove('active');
        };

        closeHelpModalBtn.addEventListener('click', hideHelpModal);
        closeHelpBtn.addEventListener('click', hideHelpModal);

        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                hideHelpModal();
            }
        });
    }

    function compileAndMergeMagazines(fileStates, newMeta) {
        let mergedImages = {};
        let sectionOrder = [];
        // Map: normalizedSectionName -> { originalTitle: string, blocksByFile: [ [blocks from file 1], [blocks from file 2], [blocks from file 3] ] }
        let sectionsData = {}; 

        // 1. Merge images from all loaded file states
        fileStates.forEach(state => {
            if (state.uploadedImages) {
                Object.assign(mergedImages, state.uploadedImages);
            }
        });

        // Helper to normalize section titles for matching (e.g. "योजनाएँ एवं नीतियाँ" matches "योजनाएँ एवं नीतियां")
        function normalizeSecName(name) {
            if (!name) return '';
            return name.replace(/^#+\s*/, '')
                       .replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '')
                       .trim()
                       .toLowerCase();
        }

        // 2. Parse blocks from each file and group them by normalized section heading
        fileStates.forEach((state, fileIdx) => {
            // Join all content pages text
            const fullContent = (state.pagesData || []).slice(1).map(p => p.text).join('\n');
            const blocks = parseTextToBlocks(fullContent);

            let currentSectionNorm = '__intro__';
            let currentSectionOrig = '';

            // Ensure intro section structure exists
            if (!sectionsData[currentSectionNorm]) {
                sectionsData[currentSectionNorm] = {
                    originalTitle: '',
                    blocksByFile: [[], [], []]
                };
                sectionOrder.push(currentSectionNorm);
            }

            blocks.forEach(block => {
                if (block.type === 'section') {
                    const origTitle = block.markdown.trim();
                    currentSectionOrig = origTitle;
                    currentSectionNorm = normalizeSecName(origTitle);

                    if (!sectionsData[currentSectionNorm]) {
                        sectionsData[currentSectionNorm] = {
                            originalTitle: origTitle,
                            blocksByFile: [[], [], []]
                        };
                        sectionOrder.push(currentSectionNorm);
                    }
                } else {
                    sectionsData[currentSectionNorm].blocksByFile[fileIdx].push(block);
                }
            });
        });

        // 3. Reconstruct unified markdown by stitching sections chronologically
        let mergedMarkdownParts = [];

        sectionOrder.forEach(secNorm => {
            const secInfo = sectionsData[secNorm];
            const blocksFromFiles = secInfo.blocksByFile;

            // Check if there is any content in this section across all files
            const totalBlocks = blocksFromFiles[0].length + blocksFromFiles[1].length + blocksFromFiles[2].length;
            if (totalBlocks === 0) return;

            // Add section header (except for intro)
            if (secNorm !== '__intro__' && secInfo.originalTitle) {
                mergedMarkdownParts.push(secInfo.originalTitle);
            }

            // Append blocks from File 1, then File 2, then File 3
            for (let fileIdx = 0; fileIdx < fileStates.length; fileIdx++) {
                const fileBlocks = blocksFromFiles[fileIdx];
                fileBlocks.forEach(b => {
                    // Strip manual page breaks and column breaks inside sections to let content flow naturally
                    if (b.type !== 'pagebreak' && b.type !== 'columnbreak') {
                        mergedMarkdownParts.push(b.markdown);
                    }
                });
            }

            // Empty line spacer between sections
            mergedMarkdownParts.push('');
        });

        const unifiedMarkdown = mergedMarkdownParts.join('\n');

        // 4. Overwrite pagesData with cover page and the merged content markdown
        const firstFileLayout = (fileStates[0] && fileStates[0].pagesData && fileStates[0].pagesData[1]) ? (fileStates[0].pagesData[1].layout || 'single') : 'single';
        const compiledPages = [
            {
                type: 'cover',
                title: newMeta.title,
                tagline: newMeta.tagline,
                subtitle: newMeta.subtitle,
                theme: (fileStates[0] && fileStates[0].pagesData && fileStates[0].pagesData[0] && fileStates[0].pagesData[0].theme) || 'maroon-gold'
            },
            {
                type: 'content',
                text: unifiedMarkdown,
                layout: firstFileLayout
            }
        ];

        // Update application state variables
        pagesData = compiledPages;
        uploadedImages = mergedImages;
        // Save merged images to separate IndexedDB store
        saveToDB('samyak_uploaded_images', uploadedImages);
        activePageIndex = 0;

        // Sync cover inputs in the UI
        docTitleInput.value = newMeta.title;
        docTaglineInput.value = newMeta.tagline;
        docSubtitleInput.value = newMeta.subtitle;
        docThemeInput.value = compiledPages[0].theme;

        // Apply theme, clear content height cache, reflow preview and save
        applyTheme(compiledPages[0].theme);
        cachedMaxContentHeight = null; // Invalidate cache so it measures compiled height
        renderPreview();
        switchActivePage(0);
        saveWorkspaceToLocalStorage();
    }

    // Bind Social Settings inputs (Debounced for lag-free typing performance)
    if (footerTelegramInput) {
        footerTelegramInput.addEventListener('input', () => {
            socialSettings.telegramText = footerTelegramInput.value;
            cachedMaxContentHeight = null; // Clear height cache
            debouncedRenderAndSave();
        });
    }

    if (footerYoutubeInput) {
        footerYoutubeInput.addEventListener('input', () => {
            socialSettings.youtubeText = footerYoutubeInput.value;
            cachedMaxContentHeight = null; // Clear height cache
            debouncedRenderAndSave();
        });
    }

    if (footerSocialSizeInput) {
        footerSocialSizeInput.addEventListener('input', () => {
            const val = parseInt(footerSocialSizeInput.value) || 11;
            socialSettings.fontSize = val;
            if (footerSocialSizeVal) footerSocialSizeVal.textContent = `${val}px`;
            cachedMaxContentHeight = null; // Clear height cache
            debouncedRenderAndSave();
        });
    }

    if (footerSocialPlacementSelect) {
        footerSocialPlacementSelect.addEventListener('change', () => {
            socialSettings.placement = footerSocialPlacementSelect.value;
            cachedMaxContentHeight = null; // Clear height cache
            renderPreview();
            saveWorkspaceToLocalStorage();
        });
    }

    // Action buttons
    addPageBtn.addEventListener('click', addPage);
    deletePageBtn.addEventListener('click', deleteActivePage);

    // Event listener for Phonetic Typing (English to Hindi) - Google Input Tools Emulation
    if (pageContentInput) {
        // Keydown listener for controlling the floating suggestions dropdown
        pageContentInput.addEventListener('keydown', (e) => {
            if (!phoneticTypingToggle || !phoneticTypingToggle.checked) return;

            if (suggestionsActive) {
                // Direct selection via numbers 1 to 5
                if (e.key >= '1' && e.key <= '5') {
                    e.preventDefault();
                    const index = parseInt(e.key) - 1;
                    selectPhoneticSuggestion(index);
                    return;
                }

                // Scroll/Cycle selections
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    activeSuggestionIndex = (activeSuggestionIndex + 1) % suggestionsList.length;
                    renderPhoneticSuggestionsTooltip(suggestionsList);
                    return;
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    activeSuggestionIndex = (activeSuggestionIndex - 1 + suggestionsList.length) % suggestionsList.length;
                    renderPhoneticSuggestionsTooltip(suggestionsList);
                    return;
                }

                // Choose highlighted suggestions
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    selectPhoneticSuggestion(activeSuggestionIndex);
                    return;
                }

                // Close suggestions dropdown and keep literal English text
                if (e.key === 'Escape') {
                    e.preventDefault();
                    hidePhoneticSuggestionsTooltip();
                    return;
                }
            }
        });

        // Track caret position and generate suggestion lists in real-time
        pageContentInput.addEventListener('input', (e) => {
            if (!phoneticTypingToggle || !phoneticTypingToggle.checked) {
                hidePhoneticSuggestionsTooltip();
                return;
            }

            const text = pageContentInput.value;
            const selStart = pageContentInput.selectionStart;
            
            // Analyze the text right before the editing caret
            const textBeforeCursor = text.substring(0, selStart);
            
            // Match the trailing English word
            const lastWordMatch = textBeforeCursor.match(/([a-zA-Z]+)$/);
            
            if (lastWordMatch) {
                currentEnglishWord = lastWordMatch[1];
                currentWordStartIdx = selStart - currentEnglishWord.length;
                
                // Fetch suggestion lists
                suggestionsList = generatePhoneticSuggestions(currentEnglishWord);
                
                // Get exact absolute screen coordinates of the editing caret
                const coords = getCaretCoordinates(pageContentInput, selStart);
                if (phoneticSuggestionsTooltip) {
                    phoneticSuggestionsTooltip.style.top = (coords.top + 22) + 'px';
                    phoneticSuggestionsTooltip.style.left = coords.left + 'px';
                    
                    // Render suggestions dropdown
                    renderPhoneticSuggestionsTooltip(suggestionsList);
                }
            } else {
                hidePhoneticSuggestionsTooltip();
            }
        });

        // Hide dropdown when clicking elsewhere
        document.addEventListener('mousedown', (e) => {
            if (suggestionsActive && e.target !== pageContentInput && phoneticSuggestionsTooltip && !phoneticSuggestionsTooltip.contains(e.target)) {
                hidePhoneticSuggestionsTooltip();
            }
        });

        // Dismiss if user clicks inside the textarea (moves cursor manually)
        pageContentInput.addEventListener('click', () => {
            hidePhoneticSuggestionsTooltip();
        });
    }

    // ==========================================
    // PREMIUM INTEGRATED SIDEBAR & WORKSPACE OCR CONTROLLER
    // ==========================================

    function resetOcrDashProject(forceClear = false) {
        if (forceClear) {
            ocrDashUploadedFile = null;
            if (ocrDashFileInput) ocrDashFileInput.value = '';
            if (ocrDashPreviewImg) ocrDashPreviewImg.src = '';
            
            // Hide preview area, show dragzone
            if (ocrDashPreviewArea) ocrDashPreviewArea.style.display = 'none';
            if (ocrDashDragZone) ocrDashDragZone.style.display = 'flex';
            
            // Reset state views
            if (ocrDashRawTextarea) ocrDashRawTextarea.value = '';
            if (ocrDashRenderedHtml) ocrDashRenderedHtml.innerHTML = '';
            if (ocrDashAlertsList) ocrDashAlertsList.innerHTML = '';
            
            // Hide outputs
            if (ocrDashStatsBar) ocrDashStatsBar.style.display = 'none';
            if (ocrDashActionsBar) ocrDashActionsBar.style.display = 'none';
            if (ocrDashTabPreview) ocrDashTabPreview.style.display = 'none';
            if (ocrDashTabEditor) ocrDashTabEditor.style.display = 'none';
            if (ocrDashTabAlerts) ocrDashTabAlerts.style.display = 'none';
            if (ocrDashIdleState) ocrDashIdleState.style.display = 'flex';
            if (ocrDashViewStructured) ocrDashViewStructured.style.display = 'none';
            if (ocrDashViewEditor) ocrDashViewEditor.style.display = 'none';
            if (ocrDashViewAlerts) ocrDashViewAlerts.style.display = 'none';
            
            if (ocrDashProcessBtn) ocrDashProcessBtn.style.display = 'none';
            if (ocrDashProcessingIndicator) ocrDashProcessingIndicator.style.display = 'none';
        } else {
            // Keep current loaded or show idle
            if (!ocrDashUploadedFile) {
                resetOcrDashProject(true);
            }
        }
    }

    // Settings Toggle Handlers
    if (ocrDashLayoutToggle) {
        ocrDashLayoutToggle.classList.toggle('active', ocrDashLayoutAnalysis);
        ocrDashLayoutToggle.addEventListener('click', () => {
            ocrDashLayoutAnalysis = !ocrDashLayoutAnalysis;
            ocrDashLayoutToggle.classList.toggle('active', ocrDashLayoutAnalysis);
            localStorage.setItem('samyak_ocr_layout_analysis', ocrDashLayoutAnalysis);
        });
    }

    if (ocrDashStructToggle) {
        ocrDashStructToggle.classList.toggle('active', ocrDashAutoStructuring);
        ocrDashStructToggle.addEventListener('click', () => {
            ocrDashAutoStructuring = !ocrDashAutoStructuring;
            ocrDashStructToggle.classList.toggle('active', ocrDashAutoStructuring);
            localStorage.setItem('samyak_ocr_auto_structuring', ocrDashAutoStructuring);
        });
    }

    // Drag Zone Events
    if (ocrDashDragZone && ocrDashFileInput) {
        ocrDashDragZone.addEventListener('click', () => ocrDashFileInput.click());

        ocrDashFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            handleOcrDashFileSelection(file);
        });

        ocrDashDragZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            ocrDashDragZone.style.borderColor = 'var(--ui-accent, #c5a059)';
            ocrDashDragZone.style.background = 'rgba(197, 160, 89, 0.05)';
        });

        ocrDashDragZone.addEventListener('dragleave', () => {
            ocrDashDragZone.style.borderColor = 'rgba(197, 160, 89, 0.25)';
            ocrDashDragZone.style.background = 'rgba(197, 160, 89, 0.02)';
        });

        ocrDashDragZone.addEventListener('drop', (e) => {
            e.preventDefault();
            ocrDashDragZone.style.borderColor = 'rgba(197, 160, 89, 0.25)';
            ocrDashDragZone.style.background = 'rgba(197, 160, 89, 0.02)';
            const file = e.dataTransfer.files[0];
            handleOcrDashFileSelection(file);
        });
    }

    function handleOcrDashFileSelection(file) {
        if (!file) return;

        if (file.size > 15 * 1024 * 1024) {
            alert('File size limit is 15MB. Please choose a smaller document.');
            return;
        }

        const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
        const isImage = file.type.startsWith('image/');

        if (!isPdf && !isImage) {
            alert('Only images (PNG, JPG, JPEG) and PDF files are supported.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target.result;
            const cleanBase64 = base64String.split(',')[1];

            ocrDashUploadedFile = {
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                type: file.type || (isPdf ? 'application/pdf' : 'image/png'),
                base64: cleanBase64,
                previewUrl: isImage ? base64String : null
            };

            // Update UI elements
            ocrDashFileName.textContent = ocrDashUploadedFile.name;
            ocrDashFileSize.textContent = ocrDashUploadedFile.size;
            ocrDashFileBadge.textContent = isPdf ? 'PDF' : 'IMG';

            if (isImage) {
                ocrDashPreviewImg.src = ocrDashUploadedFile.previewUrl;
                ocrDashPreviewImg.style.display = 'block';
            } else {
                ocrDashPreviewImg.src = '';
                ocrDashPreviewImg.style.display = 'none';
            }

            // Reveal Preview area and hide Drag zone
            ocrDashDragZone.style.display = 'none';
            ocrDashPreviewArea.style.display = 'flex';
            ocrDashProcessBtn.style.display = 'block';
            ocrDashProcessingIndicator.style.display = 'none';

            // Reset Right panel view to idle state
            ocrDashIdleState.style.display = 'flex';
            ocrDashStatsBar.style.display = 'none';
            ocrDashActionsBar.style.display = 'none';
            ocrDashTabPreview.style.display = 'none';
            ocrDashTabEditor.style.display = 'none';
            ocrDashTabAlerts.style.display = 'none';
            ocrDashViewStructured.style.display = 'none';
            ocrDashViewEditor.style.display = 'none';
            ocrDashViewAlerts.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    // Remove File Listener
    if (ocrDashRemoveFileBtn) {
        ocrDashRemoveFileBtn.addEventListener('click', () => {
            resetOcrDashProject(true);
        });
    }

    // Tabs Controller Logic
    const ocrTabs = [
        { btn: ocrDashTabPreview, panel: ocrDashViewStructured, name: 'preview' },
        { btn: ocrDashTabEditor, panel: ocrDashViewEditor, name: 'editor' },
        { btn: ocrDashTabAlerts, panel: ocrDashViewAlerts, name: 'alerts' }
    ];

    ocrTabs.forEach(tab => {
        if (tab.btn) {
            tab.btn.addEventListener('click', () => {
                ocrTabs.forEach(t => {
                    t.btn.classList.remove('active');
                    t.panel.style.display = 'none';
                });
                tab.btn.classList.add('active');
                tab.panel.style.display = 'block';
                ocrDashActiveTab = tab.name;
            });
        }
    });

    // Realtime Sync Raw Text Area edits to Structured View HTML
    if (ocrDashRawTextarea && ocrDashRenderedHtml) {
        ocrDashRawTextarea.addEventListener('input', () => {
            const rawText = ocrDashRawTextarea.value;
            ocrDashRenderedHtml.innerHTML = renderOcrDashMarkdownToHtml(rawText);
        });
    }

    // Core scanning execution
    if (ocrDashProcessBtn) {
        ocrDashProcessBtn.addEventListener('click', async () => {
            if (!ocrDashUploadedFile) return;

            // Activate scanning visuals
            ocrDashProcessBtn.style.display = 'none';
            ocrDashProcessingIndicator.style.display = 'flex';
            ocrDashScanOverlay.style.display = 'block';
            
            // Trigger visual bounding boxes sweep animation
            triggerOcrDashBoundingBoxScan();

            try {
                const selectedEngine = ocrDashEngineSelect ? ocrDashEngineSelect.value : "Google Vision API (High Precision)";

                const response = await fetch('/api/ocr', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileBase64: ocrDashUploadedFile.base64,
                        mimeType: ocrDashUploadedFile.type,
                        fileName: ocrDashUploadedFile.name,
                        engine: selectedEngine,
                        enableLayoutAnalysis: ocrDashLayoutAnalysis,
                        enableStructuring: ocrDashAutoStructuring
                    })
                });

                if (!response.ok) {
                    const errorText = await response.json();
                    throw new Error(errorText.error || `Server error: ${response.status}`);
                }

                const result = await response.json();

                // Scanning succeeded! Populate components
                ocrDashRawTextarea.value = result.markdown;
                ocrDashRenderedHtml.innerHTML = renderOcrDashMarkdownToHtml(result.markdown);
                
                // Populate Legibility alerts
                populateOcrDashAlerts(result.alerts || []);
                ocrDashAlertBadgeCount.textContent = result.alerts ? result.alerts.length : 0;

                // Populate Stats Bar
                ocrDashConfidenceVal.textContent = (result.confidenceEstimate || 98.4) + '%';
                ocrDashWordcountVal.textContent = result.wordCount || result.markdown.split(/\s+/).filter(Boolean).length;
                ocrDashAlertsCountVal.textContent = result.alerts ? result.alerts.length : 0;

                // Toggle tabs visible and view structured active
                ocrDashIdleState.style.display = 'none';
                ocrDashStatsBar.style.display = 'grid';
                ocrDashActionsBar.style.display = 'flex';
                
                ocrDashTabPreview.style.display = 'block';
                ocrDashTabEditor.style.display = 'block';
                ocrDashTabAlerts.style.display = 'block';

                // Activate Structured tab
                ocrTabs.forEach(t => {
                    t.btn.classList.remove('active');
                    t.panel.style.display = 'none';
                });
                ocrDashTabPreview.classList.add('active');
                ocrDashViewStructured.style.display = 'block';
                ocrDashActiveTab = 'preview';

                if (result.alerts && result.alerts.length > 0) {
                    alert(`⚡ Scanning complete! Detected ${result.alerts.length} handwriting segments containing blurry or fuzzy content. Review them in the 'Legibility Alerts' tab.`);
                }

            } catch (err) {
                console.error('OCR Processing error:', err);
                alert(`❌ OCR Processing Error: ${err.message || 'Could not connect to the Gemini backend.'}`);
            } finally {
                // Remove animations
                ocrDashScanOverlay.style.display = 'none';
                ocrDashProcessingIndicator.style.display = 'none';
                ocrDashProcessBtn.style.display = 'block';
                ocrDashProcessBtn.textContent = 'Process Again';
            }
        });
    }

    // Populate Legibility Alerts lists
    function populateOcrDashAlerts(alerts) {
        if (!ocrDashAlertsList) return;

        if (alerts.length === 0) {
            ocrDashAlertsList.innerHTML = `<div style="padding: 30px; text-align: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; color: #94a3b8;">
                <span style="font-size: 24px; display: block; margin-bottom: 8px;">✨</span>
                <strong>All text is fully legible!</strong> No handwriting alerts raised.
            </div>`;
            return;
        }

        let alertCardsHtml = '';
        alerts.forEach((alertItem, idx) => {
            alertCardsHtml += `
                <div class="ocr-dash-alert-card">
                    <div class="ocr-dash-card-header">
                        <span class="ocr-dash-card-badge">⚠️ HIGH ALERT #${idx + 1}</span>
                        <span class="ocr-dash-card-reason">Reason: ${alertItem.reason || 'Blurry fragment'}</span>
                    </div>
                    <div>
                        <div class="ocr-dash-field-title">Fuzzy Fragment</div>
                        <p class="ocr-dash-field-val">${alertItem.fragment}</p>
                    </div>
                    <div>
                        <div class="ocr-dash-field-title">Sentence Context</div>
                        <p class="ocr-dash-field-val context">"...${alertItem.context}..."</p>
                    </div>
                </div>
            `;
        });
        ocrDashAlertsList.innerHTML = alertCardsHtml;
    }

    // Custom HTML markdown parser for preview rendering
    function renderOcrDashMarkdownToHtml(text) {
        if (!text) return '';
        const lines = text.split('\n');
        let htmlOutput = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const indentMatch = line.match(/^(\s+)/);
            const indentPadding = indentMatch ? indentMatch[1].length * 8 : 0;
            const cleanLine = line.trim();

            if (!cleanLine) {
                htmlOutput += `<p style="min-height: 1.5rem;"></p>`;
                continue;
            }

            // HTML Spacers rendering (skipped images)
            if (cleanLine.startsWith('<div style=') && cleanLine.endsWith('</div>')) {
                htmlOutput += cleanLine;
                continue;
            }

            // Heading 1
            if (cleanLine.startsWith('# ')) {
                htmlOutput += `<h1 style="padding-left: ${indentPadding}px">${parseInlineHighlightsToHtml(cleanLine.substring(2))}</h1>`;
                continue;
            }
            // Heading 2
            if (cleanLine.startsWith('## ')) {
                htmlOutput += `<h2 style="padding-left: ${indentPadding}px">${parseInlineHighlightsToHtml(cleanLine.substring(3))}</h2>`;
                continue;
            }
            // Heading 3
            if (cleanLine.startsWith('### ')) {
                htmlOutput += `<h3 style="padding-left: ${indentPadding}px">${parseInlineHighlightsToHtml(cleanLine.substring(4))}</h3>`;
                continue;
            }
            // List spacing & highlights
            if (cleanLine.startsWith('- ') || cleanLine.startsWith('• ')) {
                htmlOutput += `<div style="padding-left: ${indentPadding + 16}px; display: flex; items-start: gap-2.5; margin: 6px 0;">
                    <span style="color: #818cf8; font-weight: bold; margin-right: 8px;">•</span>
                    <div style="flex: 1;">${parseInlineHighlightsToHtml(cleanLine.substring(2))}</div>
                </div>`;
                continue;
            }

            // Default block
            htmlOutput += `<p style="padding-left: ${indentPadding}px">${parseInlineHighlightsToHtml(cleanLine)}</p>`;
        }
        return htmlOutput;
    }

    function parseInlineHighlightsToHtml(text) {
        if (!text) return "";
        let escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // 1. Process Fuzzy Alerts: ==⚠️ High Alert: [text]==
        escaped = escaped.replace(/==⚠️ High Alert: \[(.*?)\]==/g, (match, captured) => {
            return `<span class="high-alert-highlight" title="This handwriting segment is fuzzy or illegible. Please match with the original view.">⚠️ Fuzzy: ${captured}</span>`;
        });

        // 2. Process Bold: **text**
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 3. Process Italic: *text*
        escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // 4. Process Inline Code: `code`
        escaped = escaped.replace(/`(.*?)`/g, '<code style="font-family: monospace; font-size: 11px; background: rgba(0,0,0,0.4); padding: 2px 4px; border-radius: 3px; color: #818cf8;">$1</code>');

        // 5. Math Unicode Shorthand Replacements
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
            escaped = escaped.replace(new RegExp(key, 'g'), unicode);
        }

        // 6. Exponent / Superscript parsing: base^(exponent) or base^exponent
        escaped = escaped.replace(/([a-zA-Z0-9\u0900-\u097F\)\}\]]+)\s*\^\s*\((.*?)\)/g, '$1<sup>$2</sup>');
        escaped = escaped.replace(/([a-zA-Z0-9\u0900-\u097F\)\}\]]+)\s*\^\s*([0-9a-zA-Z\u0900-\u097F+\-/*=]+)/g, '$1<sup>$2</sup>');

        // 7. Subscript parsing: base_(subscript) or base_subscript
        escaped = escaped.replace(/([a-zA-Z0-9\u0900-\u097F\)\}\]]+)\s*_\s*\((.*?)\)/g, '$1<sub>$2</sub>');
        escaped = escaped.replace(/([a-zA-Z0-9\u0900-\u097F\)\}\]]+)\s*_\s*([0-9a-zA-Z\u0900-\u097F+\-/*=]+)/g, '$1<sub>$2</sub>');

        return escaped;
    }

    // Bounding Box visual scan overlays inside Dashboard Left Pane
    function triggerOcrDashBoundingBoxScan() {
        const previewContainer = ocrDashPreviewImg.parentElement;
        if (!previewContainer) return;

        // Clean out any past scans
        const oldBoxes = previewContainer.querySelectorAll('.ocr-word-highlight-box');
        oldBoxes.forEach(box => box.remove());

        const wordRows = 7;
        const wordsPerRow = 5;
        const totalScanTime = 1800; // synchronized with sweeping laser line

        for (let r = 0; r < wordRows; r++) {
            const topVal = 14 + (r * 11) + (Math.random() * 2 - 1);
            for (let c = 0; c < wordsPerRow; c++) {
                const leftVal = 12 + (c * 15) + (Math.random() * 4 - 2);
                const widthVal = 8 + (Math.random() * 6);
                const heightVal = 4.5 + (Math.random() * 1.5);

                const box = document.createElement('div');
                box.className = 'ocr-word-highlight-box';
                box.style.top = topVal + '%';
                box.style.left = leftVal + '%';
                box.style.width = widthVal + '%';
                box.style.height = heightVal + '%';

                previewContainer.appendChild(box);

                // Laser reach threshold calculation
                const laserReachTime = (topVal / 100) * totalScanTime;

                // Sync highlights with sweeping laser line position
                setTimeout(() => {
                    box.classList.add('active');
                }, laserReachTime);

                setTimeout(() => {
                    box.classList.remove('active');
                    box.classList.add('scanned-done');
                }, laserReachTime + 280);

                // Keep highlights visible to show 100% scanning coverage, and cleanup at the end
                setTimeout(() => {
                    box.style.opacity = '0';
                    setTimeout(() => box.remove(), 400);
                }, totalScanTime + 1800);
            }
        }
    }

    // Export Actions listeners
    if (ocrDashCopyBtn) {
        ocrDashCopyBtn.addEventListener('click', () => {
            const text = ocrDashRawTextarea.value;
            if (!text) return;
            navigator.clipboard.writeText(text);
            ocrDashCopyBtn.textContent = 'Copied! ✓';
            setTimeout(() => {
                ocrDashCopyBtn.textContent = 'Copy to Clipboard';
            }, 2500);
        });
    }

    if (ocrDashDownloadBtn) {
        ocrDashDownloadBtn.addEventListener('click', () => {
            const text = ocrDashRawTextarea.value;
            if (!text) return;
            const element = document.createElement("a");
            const file = new Blob([text], { type: "text/plain;charset=utf-8" });
            element.href = URL.createObjectURL(file);
            element.download = `${ocrDashUploadedFile?.name.split(".")[0] || "samyak-ocr-output"}.md`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        });
    }

    // POP UP DESTINATION PAGE SELECTOR ON INSERT
    if (ocrDashInsertBtn) {
        ocrDashInsertBtn.addEventListener('click', () => {
            try {
                const textToInsert = ocrDashRawTextarea.value;
                if (!textToInsert) {
                    alert("इन्सर्ट करने के लिए कोई टेक्स्ट नहीं मिला! पहले OCR स्कैन करें।\nNo digitized text found to insert! Please scan a document first.");
                    return;
                }

                // Populate the destination selector select dropdown dynamically
                if (ocrDestinationPageSelect) {
                    let optionsHtml = '';
                    // Content pages: index 1 to pagesData.length - 1
                    for (let i = 1; i < pagesData.length; i++) {
                        if (!pagesData[i]) continue;
                        const pageTextSnippet = pagesData[i].text ? pagesData[i].text.trim().substring(0, 30).replace(/[#*`>🔶•-]/g, '').trim() : '';
                        const displayTitle = pageTextSnippet ? ` - ${pageTextSnippet}...` : '';
                        optionsHtml += `<option value="${i}">Page ${i + 1}${displayTitle}</option>`;
                    }
                    optionsHtml += `<option value="create_new">➕ Create a New Page & Insert</option>`;
                    ocrDestinationPageSelect.innerHTML = optionsHtml;
                }

                // Open destination page selector modal
                if (ocrPageSelectorModal) {
                    ocrPageSelectorModal.classList.add('active');
                }
            } catch (err) {
                console.error("Error opening page selector modal:", err);
                alert("Error: " + err.message);
            }
        });
    }

    // Page Selector Modal Close Buttons & Backdrops
    if (ocrPageSelectorClose) {
        ocrPageSelectorClose.addEventListener('click', () => {
            ocrPageSelectorModal.classList.remove('active');
        });
    }
    if (ocrPageSelectorCancel) {
        ocrPageSelectorCancel.addEventListener('click', () => {
            ocrPageSelectorModal.classList.remove('active');
        });
    }
    if (ocrPageSelectorModal) {
        ocrPageSelectorModal.addEventListener('click', (e) => {
            if (e.target === ocrPageSelectorModal) {
                ocrPageSelectorModal.classList.remove('active');
            }
        });
    }

    // Confirm Page Selection & Insert Logic
    if (ocrPageSelectorConfirm) {
        ocrPageSelectorConfirm.addEventListener('click', () => {
            try {
                const selectedVal = ocrDestinationPageSelect ? ocrDestinationPageSelect.value : 'create_new';
                const textToInsert = ocrDashRawTextarea.value;
                if (!textToInsert) {
                    alert("No text to insert!");
                    return;
                }

                let targetIndex;
                if (selectedVal === 'create_new') {
                    // Call addPage to append a new page at pagesData.length - 1
                    addPage();
                    targetIndex = pagesData.length - 1;
                } else {
                    targetIndex = parseInt(selectedVal);
                }

                if (isNaN(targetIndex) || targetIndex < 0 || !pagesData[targetIndex]) {
                    alert("Invalid target page index selected.");
                    return;
                }

                // Switch to the target page index (which also updates activePageIndex and switchSidebarTab('panel-editor'))
                switchActivePage(targetIndex, true);

                // Insert text at caret of textarea or append it if caret is not set
                const currentText = pageContentInput.value || '';
                const selStart = pageContentInput.selectionStart || 0;
                const selEnd = pageContentInput.selectionEnd || 0;
                
                const newText = currentText.substring(0, selStart) + '\n' + textToInsert + '\n' + currentText.substring(selEnd);
                pageContentInput.value = newText;
                pagesData[targetIndex].text = newText;

                // Re-render and save
                renderPreview();
                saveWorkspaceToLocalStorage();
                updateStats();

                // Auto switch sidebar tab to panel-editor
                switchSidebarTab('panel-editor');

                // Hide the page selector modal
                ocrPageSelectorModal.classList.remove('active');

                // Focus on editor
                setTimeout(() => {
                    if (pageContentInput) pageContentInput.focus();
                }, 100);

                alert('OCR text successfully inserted into the page editor!');
            } catch (err) {
                console.error("Error confirming page insertion:", err);
                alert("Error inserting text into page: " + err.message);
            }
        });
    }

    // A4 Visual Page Grid event listeners
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            saveCurrentInputState();
            pageGridModal.classList.add('active');
            pageGridModal.style.display = 'flex';
            renderGridPages();
        });
    }
    if (closeGridModalBtn) {
        closeGridModalBtn.addEventListener('click', () => {
            pageGridModal.classList.remove('active');
            setTimeout(() => {
                pageGridModal.style.display = 'none';
            }, 300);
        });
    }
    // Clicking backdrop closes modal
    if (pageGridModal) {
        pageGridModal.addEventListener('click', (e) => {
            if (e.target === pageGridModal) {
                pageGridModal.classList.remove('active');
                setTimeout(() => {
                    pageGridModal.style.display = 'none';
                }, 300);
            }
        });
    }
    if (gridAddPageBtn) {
        gridAddPageBtn.addEventListener('click', () => {
            addPage();
            renderGridPages();
        });
    }

    // ==========================================
    // 3.3 THEME TOGGLE, IMPORT/EXPORT, SEARCH-REPLACE & LAYOUT EVENT LISTENERS
    // ==========================================

    // Initialize Theme on Load
    let editorTheme = localStorage.getItem('editor-theme') || 'dark';
    if (editorTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('light-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            themeToggleBtn.textContent = isLight ? '☀️' : '🌙';
            localStorage.setItem('editor-theme', isLight ? 'light' : 'dark');
        });
    }



    // Floating Action Button (FAB) Menu logic
    const editorFabContainer = document.getElementById('editor-fab-container');
    const editorFabTrigger = document.getElementById('editor-fab-trigger');

    if (editorFabTrigger && editorFabContainer) {
        editorFabTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            editorFabContainer.classList.toggle('open');
            const isOpen = editorFabContainer.classList.contains('open');
            editorFabTrigger.textContent = isOpen ? '✕' : '⚡';
            editorFabTrigger.setAttribute('title', isOpen ? 'Close Menu' : 'Quick Actions');
        });
        
        // Auto-close menu on clicking elsewhere
        document.addEventListener('click', () => {
            if (editorFabContainer.classList.contains('open')) {
                editorFabContainer.classList.remove('open');
                editorFabTrigger.textContent = '⚡';
                editorFabTrigger.setAttribute('title', 'Quick Actions');
            }
        });
    }
    // Page Layout binding
    if (pageLayoutSelect) {
        pageLayoutSelect.addEventListener('change', () => {
            if (activePageIndex > 0 && activePageIndex < pagesData.length) {
                pagesData[activePageIndex].layout = pageLayoutSelect.value;
                renderPreview();
                saveWorkspaceToLocalStorage();
            }
        });
    }

    // Compact Spacing Toggle binding
    if (compactSpacingToggle) {
        compactSpacingToggle.addEventListener('change', () => {
            customDesignSettings.compactMode = compactSpacingToggle.checked;
            document.body.classList.toggle('compact-mode', customDesignSettings.compactMode);
            cachedMaxContentHeight = null;
            renderPreview();
            saveWorkspaceToLocalStorage();
        });
    }

    // Cover TOC Toggle binding
    if (coverTOCToggle) {
        coverTOCToggle.addEventListener('change', () => {
            customDesignSettings.showCoverTOC = coverTOCToggle.checked;
            renderPreview();
            saveWorkspaceToLocalStorage();
        });
    }

    // Page Template binding
    if (pageTemplateSelect) {
        pageTemplateSelect.addEventListener('change', () => {
            if (activePageIndex === 0 || activePageIndex === pagesData.length) {
                alert('Templates can only be applied to content pages (Page 2, Page 3...)!');
                pageTemplateSelect.value = '';
                return;
            }
            
            const selectedTemplate = pageTemplateSelect.value;
            if (!selectedTemplate) return;
            
            if (confirm("Are you sure you want to replace this page's content with the selected template? (This will overwrite your existing text)")) {
                let templateText = "";
                switch(selectedTemplate) {
                    case "standard":
                        templateText = `# योजनाएँ एवं नीतियाँ\n\n## 🔶 प्रधानमंत्री फसल बीमा योजना\n• **प्रधानमंत्री फसल बीमा योजना** के तहत पॉलिसी जारी करने में राजस्थान देश में प्रथम स्थान पर।\n• प्रधानमंत्री फसल बीमा योजना के तहत राजस्थान में देश में सबसे ज्यादा **2 करोड़ 19 लाख पॉलिसी** जारी की गई।\n\n## 🔶 लाडो प्रोत्साहन योजना\n• **मुख्य उद्देश्य**:- बालिकाओं के प्रति सकारात्मक सोच विकसित करना और उनके स्वास्थ्य एवं शिक्षा के स्तर in सुधार लाना।\n• बालिका के जन्म पर **₹1.50 लाख** की राशि का संकल्प पत्र प्रदान किया जाता है।\n• माता का राजस्थान का मूल निवासी होना आवश्यक है।`;
                        break;
                    case "personality":
                        templateText = `# चर्चित व्यक्तित्व\n\n<!-- personality|name=ऋषभ पारेख|title=संस्कृत व्याकरण विशेषज्ञ|desc=जयपुर के ऋषभ पारेख को गुजरात के शंखेश्वर जैन तीर्थ में 'सिद्धहेमव्याकरण रत्न' से सम्मानित किया गया है। उन्हें स्वर्ण मुद्रिका और 1 लाख रुपये का नकद पुरस्कार मिला।|avatar=👤 -->\n\n## 🔶 डॉ. राजानन्द शास्त्री\n• प्रसिद्ध ज्योतिषाचार्य और उनके अद्भुत शोध कार्य।\n• ज्योतिष के क्षेत्र में 'पितृ दोष निवारण अभियान' के उल्लेखनीय कार्यों के लिए इनका नाम **'WORLD BOOK OF RECORDS'** में दर्ज किया गया है।`;
                        break;
                    case "stats-table":
                        templateText = `# तुलना व आँकड़े\n\n<!-- stats|num1=15.5 Lakh|lbl1=Total Beneficiaries|desc1=Active under Lado Protsahan|num2=₹200 Crore|lbl2=MoU Signed|desc2=For Agritech expansion in Jaipur -->\n\n## 🔶 ग्राम-2026 की इन्वेस्टर मीट\n• मुख्यमंत्री ने मीट के दौरान राजस्थान फाउंडेशन के अहमदाबाद चैप्टर का शुभारंभ किया।\n• इन्वेस्टर मीट में राजस्थान के कई स्थानों पर फूड पार्क, सीड प्रोसेसिंग, फूड प्रोसेसिंग के विकास के लिए **200 करोड़ रुपए** से अधिक के एमओयू का आदान प्रदान किया गया।`;
                        break;
                    case "facts-grid":
                        templateText = `# त्वरित तथ्य ग्रिड\n\n<!-- facts-grid|t1=फसल बीमा|d1=राजस्थान फसल बीमा में पहले स्थान पर है।|t2=पोषण पखवाड़ा|d2=राजस्थान गतिविधियों में देश में प्रथम स्थान पर।|t3=परमाणु संयंत्र|d3=रावतभाटा 700 MW क्षमता की इकाइयां शुरू।|t4=विदेशी भाषा|d4=पांच भाषाएं सिखाने के लिए 41 कॉलेज में केंद्र। -->\n\n## 🔶 रावतभाटा परमाणु संयंत्र: ईंधन में आत्मनिर्भरता\n• एशिया के सबसे बड़े न्यूक्लियर फ्यूल कॉम्प्लेक्स (NFC) ने 140 यूरेनियम बंडल रावतभाटा बिजलीघर को सौंपे हैं।\n• अब रावतभाटा को ईंधन के लिए हैदराबाद पर निर्भर नहीं निर्भर रहना पड़ेगा।`;
                        break;
                    case "announcement":
                        templateText = `# विशेष घोषणा\n\n<!-- announcement|title=विशेष सूचना / Alert|content=राजस्थान सरकार द्वारा युवाओं को पांच विदेशी भाषाएं (जर्मन, फ्रेंच, कोरियन, जापानी, स्पेनिश) सिखाई जाएंगी। इसके लिए 41 राजकीय कॉलेजों में सेंटर्स बनाए जाएंगे। नोडल विभाग उच्च एवं तकनीकी शिक्षा विभाग होगा। -->\n\n## 🔶 विदेशी भाषा संचार कौशल कार्यक्रम\n• **समझौता** :- राजस्थान सरकार का इंग्लिश एंड फॉरेन लैंग्वेज यूनिवर्सिटी, हैदराबाद और नेशनल स्किल डेवलपमेंट कॉरपोरेशन के साथ MoU।\n• ये कोर्स 16 सप्ताह के होंगे। सरकारी और प्राइवेट कॉलेज के साथ 12 वीं पास कोई भी विद्यार्थी प्रवेश ले सकेगा।`;
                        break;
                    case "blank":
                        templateText = `# नया खाली पेज\n\n• यहाँ लिखना शुरू करें...`;
                        break;
                }
                
                pageContentInput.value = templateText;
                pagesData[activePageIndex].text = templateText;
                
                // Reset select dropdown
                pageTemplateSelect.value = "";
                
                // Clear content height cache & update
                cachedMaxContentHeight = null;
                renderPreview();
                updateStats();
                saveWorkspaceToLocalStorage();
            } else {
                pageTemplateSelect.value = "";
            }
        });
    }


    if (applyLayoutAllBtn) {
        applyLayoutAllBtn.addEventListener('click', () => {
            const activeLayout = pageLayoutSelect.value;
            if (confirm(`Are you sure you want to set the layout for all pages to "${activeLayout === 'two-column' ? 'Two Columns' : 'Single Column'}"?`)) {
                pagesData.forEach((page, index) => {
                    if (index > 0) { // Skip Cover page
                        page.layout = activeLayout;
                    }
                });
                renderPreview();
                saveWorkspaceToLocalStorage();
                alert(`Layout applied to all pages successfully!`);
            }
        });
    }

    // Project Export
    if (exportProjectBtn) {
        exportProjectBtn.addEventListener('click', exportProject);
    }

    function exportProject() {
        saveCurrentInputState(); // capture latest values
        const state = {
            pagesData,
            lastPageData,
            activePageIndex,
            contentFontSize,
            watermarkSettings,
            customDesignSettings,
            socialSettings,
            uploadedImages,
            imageCounter,
            spacingSettings: {
                fontStyle: globalFontStyleSelect.value,
                fontWeight: globalFontWeightSelect.value,
                lineSpacing: globalLineSpacingSelect.value,
                letterSpacing: globalLetterSpacingSelect.value
            }
        };

        const jsonStr = JSON.stringify(state, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        
        let subtitleText = (pagesData[0] && pagesData[0].subtitle) ? pagesData[0].subtitle.trim() : '';
        if (!subtitleText) {
            subtitleText = (pagesData[0] && pagesData[0].title) ? pagesData[0].title.trim() : 'Samyak';
        }
        
        // Clean special characters to make it filesystem-safe, preserving Hindi characters (Devanagari \u0900-\u097F)
        const fileNameClean = subtitleText.replace(/[^a-zA-Z0-9\u0900-\u097F\s\-]/g, '').trim().replace(/[\s\-]+/g, '_');
        const fileName = `${fileNameClean || 'Samyak'}.raaz`;

        // Try Web Share API first (works on mobile — allows saving to Google Drive, WhatsApp, etc.)
        if (navigator.canShare) {
            const shareFileName = `${fileNameClean || 'Samyak'}.raaz`;
            const file = new File([blob], shareFileName, { type: 'application/octet-stream' });
            const shareData = { files: [file], title: shareFileName, text: `Samyak Project: ${subtitleText}` };
            
            if (navigator.canShare(shareData)) {
                navigator.share(shareData)
                    .then(() => console.log('Project shared successfully'))
                    .catch((err) => {
                        // User cancelled share or error — fallback to download
                        if (err.name !== 'AbortError') {
                            downloadFallback(blob, fileName);
                        }
                    });
                return;
            }
        }

        // Fallback: regular file download (Desktop browsers)
        downloadFallback(blob, fileName);
    }

    function downloadFallback(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Project Import
    if (importProjectBtn && importProjectFile) {
        importProjectBtn.addEventListener('click', () => {
            importProjectFile.click();
        });

        importProjectFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    try {
                        const state = JSON.parse(event.target.result);
                        
                        // Validate basic shape
                        if (!state.pagesData || !Array.isArray(state.pagesData) || state.pagesData.length === 0) {
                            alert("Invalid file! This is not a valid Samyak project file (.raaz).");
                            return;
                        }

                        // Apply states
                        pagesData = state.pagesData;
                        pagesData.forEach(page => {
                            if (page.type === 'content' && page.text) {
                                page.text = cleanDuplicatedTableHeaders(page.text);
                            }
                        });
                        lastPageData = state.lastPageData || { title: 'THANK YOU', subtitle: 'Samyak', tagline: 'कोचिंग नहीं क्रांति' };
                        activePageIndex = state.activePageIndex || 0;
                        contentFontSize = state.contentFontSize || 13.5;
                        watermarkSettings = state.watermarkSettings || watermarkSettings;
                        customDesignSettings = state.customDesignSettings || customDesignSettings;
                        if (customDesignSettings.compactMode === undefined) {
                            customDesignSettings.compactMode = false;
                        }
                        if (customDesignSettings.chapterNumSize === undefined) {
                            customDesignSettings.chapterNumSize = '30';
                        }
                        if (customDesignSettings.chapterTitleSize === undefined) {
                            customDesignSettings.chapterTitleSize = '20';
                        }
                        if (customDesignSettings.chapterSubSize === undefined) {
                            customDesignSettings.chapterSubSize = '15';
                        }
                        socialSettings = state.socialSettings || { telegramText: '@samyak', youtubeText: 'Samyak Coaching' };
                        if (socialSettings.fontSize === undefined) socialSettings.fontSize = 11;
                        if (socialSettings.placement === undefined) socialSettings.placement = 'split';
                        uploadedImages = state.uploadedImages || {};
                        imageCounter = state.imageCounter || 1;
                        // Save imported images to separate IndexedDB store
                        saveToDB('samyak_uploaded_images', uploadedImages);
                        saveToDB('samyak_image_counter', imageCounter);

                        // Sync all UI inputs with the loaded data to prevent old UI values from corrupting new data
                        if (pagesData[0]) {
                            docTitleInput.value = pagesData[0].title || '';
                            docTaglineInput.value = pagesData[0].tagline || '';
                            docSubtitleInput.value = pagesData[0].subtitle || '';
                            const restoredTheme = pagesData[0].theme || 'maroon-gold';
                            if (docThemeInput) {
                                docThemeInput.value = restoredTheme;
                            }
                            localStorage.setItem('samyak-global-theme', restoredTheme);
                            applyTheme(restoredTheme, false);
                            if (coverThemeSelect) {
                                coverThemeSelect.value = pagesData[0].coverTheme || 'default';
                            }
                            if (coverBorderPatternSelect) {
                                coverBorderPatternSelect.value = pagesData[0].coverBorderPattern || 'solid';
                            }
                            if (coverEmblemSelect) {
                                coverEmblemSelect.value = pagesData[0].coverEmblem || 'none';
                            }
                            if (pagesData[0].classification === undefined) pagesData[0].classification = '';
                            if (pagesData[0].titleSize === undefined) pagesData[0].titleSize = 52;
                            if (pagesData[0].classificationSize === undefined) pagesData[0].classificationSize = 24;
                            if (pagesData[0].taglineSize === undefined) pagesData[0].taglineSize = 20;
                            if (pagesData[0].subtitleSize === undefined) pagesData[0].subtitleSize = 21;

                            if (docClassificationInput) {
                                docClassificationInput.value = pagesData[0].classification || '';
                            }
                            if (coverTitleSizeSlider) {
                                coverTitleSizeSlider.value = pagesData[0].titleSize || 52;
                                coverTitleSizeVal.textContent = `${coverTitleSizeSlider.value}px`;
                            }
                            if (coverClassificationSizeSlider) {
                                coverClassificationSizeSlider.value = pagesData[0].classificationSize || 24;
                                coverClassificationSizeVal.textContent = `${coverClassificationSizeSlider.value}px`;
                            }
                            if (coverTaglineSizeSlider) {
                                coverTaglineSizeSlider.value = pagesData[0].taglineSize || 20;
                                coverTaglineSizeVal.textContent = `${coverTaglineSizeSlider.value}px`;
                            }
                            if (coverSubtitleSizeSlider) {
                                coverSubtitleSizeSlider.value = pagesData[0].subtitleSize || 21;
                                coverSubtitleSizeVal.textContent = `${coverSubtitleSizeSlider.value}px`;
                            }
                        }
                        if (lastPageData) {
                            lastTitleInput.value = lastPageData.title || 'THANK YOU';
                            lastSubtitleInput.value = lastPageData.subtitle || 'Samyak';
                            lastTaglineInput.value = lastPageData.tagline || 'कोचिंग नहीं क्रांति';
                        }

                        // Sync footer social inputs
                        if (footerTelegramInput) footerTelegramInput.value = socialSettings.telegramText || '';
                        if (footerYoutubeInput) footerYoutubeInput.value = socialSettings.youtubeText || '';
                        if (footerSocialSizeInput) {
                            const fsVal = socialSettings.fontSize || 11;
                            footerSocialSizeInput.value = fsVal;
                            if (footerSocialSizeVal) footerSocialSizeVal.textContent = `${fsVal}px`;
                        }
                        if (footerSocialPlacementSelect) footerSocialPlacementSelect.value = socialSettings.placement || 'split';

                        // Restore font/spacing inputs
                        if (state.spacingSettings) {
                            globalFontStyleSelect.value = state.spacingSettings.fontStyle || 'modern-sans';
                            globalFontWeightSelect.value = state.spacingSettings.fontWeight || '700';
                            globalLineSpacingSelect.value = state.spacingSettings.lineSpacing || '1.45';
                            globalLetterSpacingSelect.value = state.spacingSettings.letterSpacing || '0px';
                        }

                        // Apply Spacings to DOM
                        fontSizeValSpan.textContent = `${contentFontSize}px`;
                        document.documentElement.style.setProperty('--content-font-size', `${contentFontSize}px`);
                        document.documentElement.style.setProperty('--content-font-weight', globalFontWeightSelect.value);
                        document.documentElement.style.setProperty('--content-line-height', globalLineSpacingSelect.value);
                        document.documentElement.style.setProperty('--content-letter-spacing', globalLetterSpacingSelect.value);

                        // Apply Font Style
                        document.body.classList.remove('font-poppins-sans', 'font-traditional-serif', 'font-hybrid-style');
                        if (globalFontStyleSelect.value !== 'modern-sans') {
                            document.body.classList.add(`font-${globalFontStyleSelect.value}`);
                        }

                        // Restore Watermark UI inputs
                        watermarkTypeSelect.value = watermarkSettings.type;
                        watermarkTextInput.value = watermarkSettings.text;
                        watermarkPositionSelect.value = watermarkSettings.position;
                        watermarkRotationSelect.value = watermarkSettings.rotation;
                        watermarkOpacitySlider.value = watermarkSettings.opacity * 100;
                        watermarkOpacityVal.textContent = `${watermarkSettings.opacity * 100}%`;
                        watermarkSizeSlider.value = watermarkSettings.size;
                        updateWatermarkSizeLabel();
                        watermarkColorInput.value = watermarkSettings.color;

                        watermarkTextGroup.style.display = (watermarkSettings.type === 'text') ? 'flex' : 'none';
                        watermarkColorGroup.style.display = (watermarkSettings.type === 'text') ? 'flex' : 'none';
                        watermarkImageGroup.style.display = (watermarkSettings.type === 'image') ? 'flex' : 'none';

                        // Apply customDesignSettings to DOM and UI inputs
                        applyCustomDesignSettingsToDOM();

                        // Sync UI inputs first without saving state to prevent overwriting new data with old UI values
                        switchActivePage(activePageIndex, false);
                        saveWorkspaceToLocalStorage();
                        renderPreview();
                        updateDocumentTitle();
                        
                        alert("Project successfully loaded!");
                    } catch (err) {
                        console.error("Import error:", err);
                        alert("Error reading project file. Code: " + err.message);
                    }
                };
                reader.readAsText(file);
                // Reset file input so same file can be imported again
                importProjectFile.value = '';
            }
        });
    }

    // Find & Replace
    if (btnSearchToggle && searchReplacePanel) {
        btnSearchToggle.addEventListener('click', () => {
            const isHidden = searchReplacePanel.style.display === 'none';
            searchReplacePanel.style.display = isHidden ? 'flex' : 'none';
            if (isHidden && findInput) {
                findInput.focus();
            }
            if (!isHidden) {
                if (searchStatus) searchStatus.textContent = '';
            }
        });
    }

    let lastSearchTerm = '';
    let lastMatchIndex = -1;

    if (findBtn) {
        findBtn.addEventListener('click', () => {
            const term = findInput.value;
            if (!term) {
                if (searchStatus) searchStatus.textContent = 'Enter search term';
                return;
            }

            const text = pageContentInput.value;
            let startIndex = pageContentInput.selectionEnd;

            // If term changed, reset match tracking
            if (term !== lastSearchTerm) {
                lastSearchTerm = term;
                startIndex = 0;
            }

            let matchIndex = text.toLowerCase().indexOf(term.toLowerCase(), startIndex);
            
            // Wrap around
            if (matchIndex === -1 && startIndex > 0) {
                matchIndex = text.toLowerCase().indexOf(term.toLowerCase(), 0);
            }

            if (matchIndex !== -1) {
                pageContentInput.focus();
                pageContentInput.setSelectionRange(matchIndex, matchIndex + term.length);
                
                // Scroll selection into view
                const textBefore = text.substring(0, matchIndex);
                const linesCount = textBefore.split('\n').length;
                const lineHeight = 20; // Estimated line height in px
                pageContentInput.scrollTop = (linesCount - 3) * lineHeight;

                lastMatchIndex = matchIndex;
                if (searchStatus) searchStatus.textContent = 'Match found!';
            } else {
                if (searchStatus) searchStatus.textContent = 'No match found';
            }
        });
    }

    if (replaceBtn) {
        replaceBtn.addEventListener('click', () => {
            const term = findInput.value;
            const replacement = replaceInput.value;
            if (!term) return;

            const text = pageContentInput.value;
            const startSel = pageContentInput.selectionStart;
            const endSel = pageContentInput.selectionEnd;
            const selectedText = text.substring(startSel, endSel);

            if (selectedText.toLowerCase() === term.toLowerCase()) {
                const newText = text.substring(0, startSel) + replacement + text.substring(endSel);
                pageContentInput.value = newText;
                pageContentInput.focus();
                pageContentInput.setSelectionRange(startSel, startSel + replacement.length);

                // Trigger render & save
                pagesData[activePageIndex].text = newText;
                updateStats();
                debouncedRenderAndSave();

                if (searchStatus) searchStatus.textContent = 'Replaced!';
            } else {
                // Try finding next match first
                if (findBtn) findBtn.click();
            }
        });
    }

    if (replaceAllBtn) {
        replaceAllBtn.addEventListener('click', () => {
            const term = findInput.value;
            const replacement = replaceInput.value;
            if (!term) return;

            const text = pageContentInput.value;
            const regex = new RegExp(term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
            const matches = text.match(regex);
            
            if (matches && matches.length > 0) {
                const count = matches.length;
                const newText = text.replace(regex, replacement);
                pageContentInput.value = newText;
                
                pagesData[activePageIndex].text = newText;
                updateStats();
                debouncedRenderAndSave();

                if (searchStatus) searchStatus.textContent = `Replaced ${count} occurrences!`;
            } else {
                if (searchStatus) searchStatus.textContent = 'Nothing to replace';
            }
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all content pages, text, and settings? This cannot be undone.")) {
                clearWorkspaceContent();
            }
        });
    }

    // Smart Shrink (Overflow Fixer) Click Listener
    if (smartShrinkBtn) {
        smartShrinkBtn.addEventListener('click', () => {
            const originalPageCount = pagesData.length;
            
            if (originalPageCount <= 2) {
                alert("Smart Shrink only works when you have multiple pages!");
                return;
            }

            const originalFontSize = contentFontSize;
            const originalLineSpacing = parseFloat(globalLineSpacingSelect.value || '1.45');
            
            const lastPageText = pagesData[originalPageCount - 1].text.trim();
            const characterCount = lastPageText.length;
            const lineCount = lastPageText.split('\n').filter(l => l.trim()).length;

            if (characterCount > 600 || lineCount > 6) {
                const proceed = confirm(`The last page contains a lot of content (${lineCount} lines, ${characterCount} chars). Fitting this on previous pages might require making the text size significantly smaller. Do you still want to proceed?`);
                if (!proceed) return;
            }

            // Show premium loading overlay
            if (loadingOverlay) {
                loadingOverlay.classList.add('active');
            }

            // Defer calculations slightly so browser has time to render/paint the loading screen first!
            setTimeout(() => {
                // Search candidates: subtle line-height adjustments first, then font-size decrements
                const candidates = [];
                
                // 1. Try subtle line-height reductions on original font-size
                for (let ls = originalLineSpacing - 0.03; ls >= 1.3; ls -= 0.03) {
                    candidates.push({ fs: originalFontSize, ls: Math.round(ls * 100) / 100 });
                }

                // 2. Try smaller font-sizes in steps of 0.2px down to 13px
                for (let fs = originalFontSize - 0.2; fs >= 13; fs -= 0.2) {
                    const roundedFs = Math.round(fs * 100) / 100;
                    candidates.push({ fs: roundedFs, ls: originalLineSpacing });
                    
                    if (originalLineSpacing > 1.4) {
                        candidates.push({ fs: roundedFs, ls: 1.4 });
                    }
                    candidates.push({ fs: roundedFs, ls: 1.35 });
                    candidates.push({ fs: roundedFs, ls: 1.3 });
                }

                let success = false;
                let bestFs = originalFontSize;
                let bestLs = originalLineSpacing;

                // Helper function to safely set spacing value in select control
                const setSelectValue = (selectEl, val) => {
                    let optionExists = Array.from(selectEl.options).some(opt => parseFloat(opt.value) === val);
                    if (!optionExists) {
                        const tempOpt = document.createElement('option');
                        tempOpt.value = val.toString();
                        tempOpt.textContent = `Custom (${val})`;
                        tempOpt.id = 'temp-spacing-option';
                        selectEl.appendChild(tempOpt);
                    }
                    selectEl.value = val.toString();
                };

                // Run iterations
                for (const candidate of candidates) {
                    contentFontSize = candidate.fs;
                    setSelectValue(globalLineSpacingSelect, candidate.ls);
                    
                    document.documentElement.style.setProperty('--content-font-size', `${contentFontSize}px`);
                    document.documentElement.style.setProperty('--content-line-height', candidate.ls.toString());
                    cachedMaxContentHeight = null; // force recalculate heights
                    
                    renderPreview();

                    if (pagesData.length < originalPageCount) {
                        success = true;
                        bestFs = candidate.fs;
                        bestLs = candidate.ls;
                        break;
                    }
                }

                // Clear any unused temporary options from select dropdown
                const cleanTempOptions = (selectEl, activeVal) => {
                    Array.from(selectEl.options).forEach(opt => {
                        if (opt.id === 'temp-spacing-option' && parseFloat(opt.value) !== activeVal) {
                            selectEl.removeChild(opt);
                        }
                    });
                };

                // Hide loading overlay
                if (loadingOverlay) {
                    loadingOverlay.classList.remove('active');
                }

                // Delay alert slightly to let DOM hide the loading screen and repaint first
                setTimeout(() => {
                    if (success) {
                        fontSizeValSpan.textContent = `${bestFs}px`;
                        cleanTempOptions(globalLineSpacingSelect, bestLs);
                        renderPreview();
                        saveWorkspaceToLocalStorage();
                        alert(`🪄 Smart Shrink was successful!\n\nPages: ${originalPageCount} -> ${pagesData.length}\nFont Size: ${bestFs}px\nLine Spacing: ${bestLs}`);
                    } else {
                        // Restore original settings
                        contentFontSize = originalFontSize;
                        setSelectValue(globalLineSpacingSelect, originalLineSpacing);
                        cleanTempOptions(globalLineSpacingSelect, originalLineSpacing);
                        
                        document.documentElement.style.setProperty('--content-font-size', `${originalFontSize}px`);
                        document.documentElement.style.setProperty('--content-line-height', originalLineSpacing.toString());
                        fontSizeValSpan.textContent = `${originalFontSize}px`;
                        cachedMaxContentHeight = null;
                        
                        renderPreview();
                        alert("Attempted, but could not fit the content onto the previous pages without shrinking the font size below 13px.");
                    }
                }, 60);
            }, 80);
        });
    }

    // Smart Space (Blank Line & Space Cleaner) Click Listener
    if (smartSpaceBtn) {
        smartSpaceBtn.addEventListener('click', () => {
            // First, save the current editor text if active page is a content page
            if (activePageIndex > 0 && activePageIndex < pagesData.length) {
                pagesData[activePageIndex].text = pageContentInput.value;
            }

            let spacesCleaned = 0;
            let doubleNewlinesFixed = 0;
            let totalFixedCount = 0;

            // Iterate over all content pages and clean their text content
            for (let idx = 1; idx < pagesData.length; idx++) {
                if (pagesData[idx] && pagesData[idx].type === 'content' && pagesData[idx].text) {
                    const originalText = pagesData[idx].text;
                    let cleanedText = originalText;

                    // 1. Remove trailing spaces or tabs from all lines
                    cleanedText = cleanedText.replace(/[ \t]+$/gm, '');

                    // 2. Reduce 3 or more consecutive newlines to exactly 2 newlines (standard double newline spacing)
                    const consecutiveNewlinesRegex = /\n{3,}/g;
                    const newlineMatches = cleanedText.match(consecutiveNewlinesRegex);
                    if (newlineMatches) {
                        doubleNewlinesFixed += newlineMatches.length;
                    }
                    cleanedText = cleanedText.replace(consecutiveNewlinesRegex, '\n\n');

                    // 3. Trim leading/trailing blank lines/spaces per page to guarantee clean starts/ends
                    cleanedText = cleanedText.trim();

                    // 4. Clean consecutive horizontal spaces between words (2 or more spaces) to a single space
                    // We use [^\n ] to ensure it is bounded by non-spaces, preserving starting indent spaces!
                    const multiSpaceRegex = /([^\n ]) {2,}([^\n ])/g;
                    const spaceMatches = cleanedText.match(multiSpaceRegex);
                    if (spaceMatches) {
                        spacesCleaned += spaceMatches.length;
                    }
                    cleanedText = cleanedText.replace(multiSpaceRegex, '$1 $2');

                    // Update pagesData
                    if (cleanedText !== originalText) {
                        pagesData[idx].text = cleanedText;
                        totalFixedCount++;
                    }
                }
            }

            if (totalFixedCount > 0) {
                // If the active page was updated, update the textarea value instantly
                if (activePageIndex > 0 && activePageIndex < pagesData.length) {
                    pageContentInput.value = pagesData[activePageIndex].text;
                }

                // Show visual feedback or toast
                alert(`Smart Space Completed successfully! ✨\n- Cleaned up double spaces in ${spacesCleaned} places.\n- Normalized excessive blank lines in ${doubleNewlinesFixed} places.\n- Optimized ${totalFixedCount} page layout streams.`);
                
                // Re-render and save
                renderPreview();
                saveWorkspaceToLocalStorage();
            } else {
                alert("Your document layout is already perfectly optimized! No extra blank lines or redundant spaces were found. ✨");
            }
        });
    }

    // Highly robust PDF print button action
    if (printPdfBtn) {
        printPdfBtn.addEventListener('click', () => {
            // 1. Save current state of inputs
            saveCurrentInputState();
            // 2. Re-render standard layouts to ensure perfect content alignment
            renderPreview();
            // 3. Wait for browser to fully paint ALL pages before opening print dialog
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        window.print();
                    }, 350);
                });
            });
        });
    }


    // Toggle Toolbar Button Listener
    if (toggleToolbarBtn) {
        toggleToolbarBtn.addEventListener('click', () => {
            const toolbar = document.querySelector('.editor-toolbar');
            const editorZone = document.getElementById('content-editor-zone');
            if (toolbar && editorZone) {
                toolbar.classList.toggle('collapsed');
                editorZone.classList.toggle('toolbar-collapsed');
                
                const isCollapsed = toolbar.classList.contains('collapsed');
                toggleToolbarBtn.setAttribute('title', isCollapsed ? 'Show Toolbar (Ctrl+/)' : 'Hide Toolbar (Ctrl+/)');
                
                // Save preference in localStorage
                localStorage.setItem('samyak-toolbar-collapsed', isCollapsed ? 'true' : 'false');
            }
        });

        // Load saved toolbar collapse state
        const savedToolbarState = localStorage.getItem('samyak-toolbar-collapsed');
        if (savedToolbarState === 'true') {
            const toolbar = document.querySelector('.editor-toolbar');
            const editorZone = document.getElementById('content-editor-zone');
            if (toolbar && editorZone) {
                toolbar.classList.add('collapsed');
                editorZone.classList.add('toolbar-collapsed');
                toggleToolbarBtn.setAttribute('title', 'Show Toolbar (Ctrl+/)');
            }
        }
    }

    window.addEventListener('keydown', (e) => {
        // Intercept Ctrl+P for print
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            printPdfBtn.click();
        }
        // Intercept Ctrl+/ for toggling toolbar
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            if (toggleToolbarBtn) toggleToolbarBtn.click();
        }
    });

    // Font size dynamic bindings
    fontIncreaseBtn.addEventListener('click', () => {
        if (contentFontSize < 20) {
            contentFontSize += 0.5;
            updateFontSize();
            saveWorkspaceToLocalStorage();
        }
    });

    fontDecreaseBtn.addEventListener('click', () => {
        if (contentFontSize > 10) {
            contentFontSize -= 0.5;
            updateFontSize();
            saveWorkspaceToLocalStorage();
        }
    });

    function updateFontSize() {
        cachedMaxContentHeight = null; // Clear height cache
        fontSizeValSpan.textContent = `${contentFontSize}px`;
        document.documentElement.style.setProperty('--content-font-size', `${contentFontSize}px`);
        renderPreview(); // Re-render preview to recalculate page height and overflows!
    }

    // Font style dynamic binding (Modern Sans, Traditional Serif, etc.)
    globalFontStyleSelect.addEventListener('change', () => {
        cachedMaxContentHeight = null; // Clear height cache
        document.body.classList.remove('font-poppins-sans', 'font-traditional-serif', 'font-hybrid-style');
        
        const selectedStyle = globalFontStyleSelect.value;
        if (selectedStyle !== 'modern-sans') {
            document.body.classList.add(`font-${selectedStyle}`);
        }
        
        // Re-render preview because switching fonts will alter layout text heights and could impact overflow detection
        renderPreview();
        saveWorkspaceToLocalStorage();
    });

    // Font weight dynamic binding
    globalFontWeightSelect.addEventListener('change', () => {
        cachedMaxContentHeight = null; // Clear height cache
        document.documentElement.style.setProperty('--content-font-weight', globalFontWeightSelect.value);
        renderPreview();
        saveWorkspaceToLocalStorage();
    });

    // Line spacing dynamic binding
    // Line spacing dynamic binding
    globalLineSpacingSelect.addEventListener('change', () => {
        cachedMaxContentHeight = null; // Clear height cache
        document.documentElement.style.setProperty('--content-line-height', globalLineSpacingSelect.value);
        renderPreview();
        saveWorkspaceToLocalStorage();
    });

    // Letter spacing dynamic binding
    globalLetterSpacingSelect.addEventListener('change', () => {
        cachedMaxContentHeight = null; // Clear height cache
        document.documentElement.style.setProperty('--content-letter-spacing', globalLetterSpacingSelect.value);
        renderPreview();
        saveWorkspaceToLocalStorage();
    });

    // Zoom bindings
    zoomInBtn.addEventListener('click', () => {
        if (zoomLevel < 120) {
            zoomLevel += 5;
            updateZoom();
        }
    });
    zoomOutBtn.addEventListener('click', () => {
        if (zoomLevel > 40) {
            zoomLevel -= 5;
            updateZoom();
        }
    });

    // Mobile Preview Drawer Toggle Listeners
    if (mobilePreviewToggleBtn) {
        mobilePreviewToggleBtn.addEventListener('click', () => {
            if (previewPanel) {
                previewPanel.classList.add('drawer-open');
                document.body.classList.add('mobile-drawer-active');
            }
        });
    }

    if (mobilePreviewCloseBtn) {
        mobilePreviewCloseBtn.addEventListener('click', () => {
            if (previewPanel) {
                previewPanel.classList.remove('drawer-open');
                document.body.classList.remove('mobile-drawer-active');
            }
        });
    }

    // Auto-fit page zoom when rotating or resizing on mobile
    function handleAutoZoom() {
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        if (window.innerWidth <= 950) {
            let widthToFit = window.innerWidth;
            if (isLandscape) {
                // In landscape side-by-side, the preview panel gets 55vw of width
                widthToFit = window.innerWidth * 0.55;
            }
            let optimalZoom = Math.floor((widthToFit - 32) / 816 * 100);
            zoomLevel = Math.max(30, Math.min(optimalZoom, 60));
            updateZoom();
        }
    }

    let resizeScheduled = false;
    window.addEventListener('resize', () => {
        if (!resizeScheduled) {
            resizeScheduled = true;
            requestAnimationFrame(() => {
                handleAutoZoom();
                resizeScheduled = false;
            });
        }
    });
    window.addEventListener('orientationchange', () => {
        setTimeout(handleAutoZoom, 200);
    });

    // Toolbar Customize Edit Mode (Option B: Clicking swaps buttons)
    let isCustomizeMode = false;

    // Markdown tool prefix insertion (and wrapping selection if data-suffix is present)
    toolbarButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.id === 'toolbar-tray-trigger' || btn.id === 'toolbar-customize-trigger') return; // Skip trigger buttons
            
            if (isCustomizeMode) {
                // Intercept click in customize mode to move the icon
                e.preventDefault();
                e.stopPropagation();
                
                const btnId = btn.id;
                const inMainIndex = currentToolbarLayout.main.indexOf(btnId);
                const inTrayIndex = currentToolbarLayout.tray.indexOf(btnId);
                
                if (inMainIndex > -1) {
                    // Move from main toolbar to tray drawer
                    currentToolbarLayout.main.splice(inMainIndex, 1);
                    currentToolbarLayout.tray.push(btnId);
                } else if (inTrayIndex > -1) {
                    // Move from tray drawer to main toolbar
                    currentToolbarLayout.tray.splice(inTrayIndex, 1);
                    currentToolbarLayout.main.push(btnId);
                }
                
                localStorage.setItem('samyak-toolbar-layout-v1', JSON.stringify(currentToolbarLayout));
                renderToolbarLayout();
                
                // Update title tooltip dynamically
                const inMain = currentToolbarLayout.main.includes(btnId);
                btn.setAttribute('title', inMain ? 'Move to Tray (ट्रे में डालें)' : 'Move to Toolbar (टूलबार में निकालें)');
                return;
            }

            if (activePageIndex > 0) {
                const prefix = btn.getAttribute('data-prefix') || '';
                const suffix = btn.getAttribute('data-suffix') || '';
                
                insertWrappedAtCursor(pageContentInput, prefix, suffix);
                pagesData[activePageIndex].text = pageContentInput.value;
                renderPreview(); // Ensure live preview is instantly updated!
                updateStats();
                saveWorkspaceToLocalStorage();
            }
        });
    });

    if (toolbarCustomizeTrigger) {
        toolbarCustomizeTrigger.addEventListener('click', () => {
            isCustomizeMode = !isCustomizeMode;
            const toolbar = document.querySelector('.editor-toolbar');
            
            if (isCustomizeMode) {
                toolbar.classList.add('customize-mode');
                toolbarCustomizeTrigger.classList.add('active');
                toolbarCustomizeTrigger.innerHTML = '✅';
                toolbarCustomizeTrigger.setAttribute('title', 'Done Customizing (कस्टमाइज़ेशन पूरा हुआ)');
                
                // Keep tray open automatically so they can see items inside
                if (toolbarTrayDrawer && !toolbarTrayDrawer.classList.contains('open')) {
                    toolbarTrayDrawer.classList.add('open');
                    toolbarTrayTrigger.classList.add('open');
                }
                
                // Set hover tooltips to guide user
                toolbarButtons.forEach(btn => {
                    if (btn.id === 'toolbar-tray-trigger' || btn.id === 'toolbar-customize-trigger') return;
                    const inMain = currentToolbarLayout.main.includes(btn.id);
                    btn.setAttribute('data-orig-title', btn.getAttribute('title') || '');
                    btn.setAttribute('title', inMain ? 'Move to Tray (ट्रे में डालें)' : 'Move to Toolbar (टूलबार में निकालें)');
                });
                
                if (boxStyleSelect) {
                    boxStyleSelect.setAttribute('data-orig-title', boxStyleSelect.getAttribute('title') || '');
                    const inMain = currentToolbarLayout.main.includes('box-style-select');
                    boxStyleSelect.setAttribute('title', inMain ? 'Move to Tray (ट्रे में डालें)' : 'Move to Toolbar (टूलबार में निकालें)');
                }
            } else {
                toolbar.classList.remove('customize-mode');
                toolbarCustomizeTrigger.classList.remove('active');
                toolbarCustomizeTrigger.innerHTML = '⚙️';
                toolbarCustomizeTrigger.setAttribute('title', 'Customize Toolbar (टूलबार कस्टमाइज़ करें)');
                
                // Restore original tray state
                const savedTrayState = localStorage.getItem('samyak-toolbar-tray-open');
                if (savedTrayState !== 'true' && toolbarTrayDrawer) {
                    toolbarTrayDrawer.classList.remove('open');
                    toolbarTrayTrigger.classList.remove('open');
                }
                
                // Restore original tooltips
                toolbarButtons.forEach(btn => {
                    if (btn.id === 'toolbar-tray-trigger' || btn.id === 'toolbar-customize-trigger') return;
                    const orig = btn.getAttribute('data-orig-title');
                    if (orig !== null && orig !== undefined) btn.setAttribute('title', orig);
                });
                
                if (boxStyleSelect) {
                    const orig = boxStyleSelect.getAttribute('data-orig-title');
                    if (orig !== null && orig !== undefined) boxStyleSelect.setAttribute('title', orig);
                }
            }
        });
    }

    // Toolbar collapsible drawer (System Tray) logic
    if (toolbarTrayTrigger && toolbarTrayDrawer) {
        // Retrieve last tray state from localStorage so it persists across refreshes
        const savedTrayState = localStorage.getItem('samyak-toolbar-tray-open');
        if (savedTrayState === 'true') {
            toolbarTrayDrawer.classList.add('open');
            toolbarTrayTrigger.classList.add('open');
            toolbarTrayTrigger.setAttribute('title', 'Hide Advanced Tools (एडवांस्ड टूल्स छुपाएं)');
        }

        toolbarTrayTrigger.addEventListener('click', () => {
            const isOpen = toolbarTrayDrawer.classList.toggle('open');
            toolbarTrayTrigger.classList.toggle('open', isOpen);
            
            if (isOpen) {
                toolbarTrayTrigger.setAttribute('title', 'Hide Advanced Tools (एडवांस्ड टूल्स छुपाएं)');
                localStorage.setItem('samyak-toolbar-tray-open', 'true');
            } else {
                toolbarTrayTrigger.setAttribute('title', 'Show Advanced Tools (एडवांस्ड टूल्स दिखाएं)');
                localStorage.setItem('samyak-toolbar-tray-open', 'false');
            }
        });
    }

    // Box style select dropdown handler
    const boxStyleSelect = document.getElementById('box-style-select');
    if (boxStyleSelect) {
        // Prevent opening dropdown and move it in customize mode
        boxStyleSelect.addEventListener('mousedown', (e) => {
            if (isCustomizeMode) {
                e.preventDefault();
                e.stopPropagation();
                
                const btnId = 'box-style-select';
                const inMainIndex = currentToolbarLayout.main.indexOf(btnId);
                const inTrayIndex = currentToolbarLayout.tray.indexOf(btnId);
                
                if (inMainIndex > -1) {
                    currentToolbarLayout.main.splice(inMainIndex, 1);
                    currentToolbarLayout.tray.push(btnId);
                } else if (inTrayIndex > -1) {
                    currentToolbarLayout.tray.splice(inTrayIndex, 1);
                    currentToolbarLayout.main.push(btnId);
                }
                
                localStorage.setItem('samyak-toolbar-layout-v1', JSON.stringify(currentToolbarLayout));
                renderToolbarLayout();
                
                // Update title tooltip dynamically
                const inMain = currentToolbarLayout.main.includes(btnId);
                boxStyleSelect.setAttribute('title', inMain ? 'Move to Tray (ट्रे में डालें)' : 'Move to Toolbar (टूलबार में निकालें)');
            }
        });

        boxStyleSelect.addEventListener('change', () => {
            if (isCustomizeMode) {
                boxStyleSelect.value = "";
                return;
            }
            const selectedStyle = boxStyleSelect.value;
            if (selectedStyle && activePageIndex > 0) {
                let prefix = `[${selectedStyle}]\n`;
                let suffix = '\n[/box]';
                
                // UPSC Premium Note-Taking Templates
                if (selectedStyle === 'box-upsc-mains') {
                    prefix = `[box-upsc-mains]\n**प्रश्न (Mains Question):** \n- **परिचय (Introduction):** \n- **मुख्य भाग (Core Arguments):** \n  - **पक्ष में तर्क (Arguments For):** \n    1. \n    2. \n  - **विपक्ष में तर्क (Arguments Against):** \n    1. \n    2. \n- **निष्कर्ष/आगे की राह (Conclusion / Way Forward):** \n`;
                } else if (selectedStyle === 'box-upsc-editorial') {
                    prefix = `[box-upsc-editorial]\n**संपादकीय मत (Editorial Opinion):** \n"यहाँ समिति (e.g. 2nd ARC, Sarkaria Commission), राष्ट्रीय रिपोर्ट, या विशेषज्ञ का मत दर्ज करें।"\n— (स्रोत/नाम)\n`;
                } else if (selectedStyle === 'box-upsc-syllabus') {
                    prefix = `[box-upsc-syllabus]\n🎯 **GS PAPER:** GS-III | **TOPIC:** Inclusive Growth, Agricultural Reforms & Food Security\n`;
                } else if (selectedStyle === 'box-upsc-marginal') {
                    prefix = `[box-upsc-marginal]\n💡 **महत्वपूर्ण अवधारणा (Key Concept):**\n- \n`;
                }
                
                insertWrappedAtCursor(pageContentInput, prefix, suffix);
                pagesData[activePageIndex].text = pageContentInput.value;
                renderPreview();
                updateStats();
                saveWorkspaceToLocalStorage();
            }
            // Reset to show default "Box" placeholder option
            boxStyleSelect.value = "";
        });
    }



    // 3.1 WATERMARK EVENT BINDINGS
    watermarkTypeSelect.addEventListener('change', () => {
        const type = watermarkTypeSelect.value;
        watermarkSettings.type = type;
        
        watermarkTextGroup.style.display = (type === 'text') ? 'flex' : 'none';
        watermarkColorGroup.style.display = (type === 'text') ? 'flex' : 'none';
        watermarkImageGroup.style.display = (type === 'image') ? 'flex' : 'none';
        
        // Update size/opacity helper labels
        updateWatermarkSizeLabel();
        renderPreview();
        saveWorkspaceToLocalStorage();
    });

    watermarkTextInput.addEventListener('input', () => {
        watermarkSettings.text = watermarkTextInput.value;
        debouncedRenderAndSave();
    });

    watermarkColorInput.addEventListener('input', () => {
        watermarkSettings.color = watermarkColorInput.value;
        debouncedRenderAndSave();
    });

    watermarkPositionSelect.addEventListener('change', () => {
        watermarkSettings.position = watermarkPositionSelect.value;
        renderPreview();
        saveWorkspaceToLocalStorage();
    });

    watermarkRotationSelect.addEventListener('change', () => {
        watermarkSettings.rotation = watermarkRotationSelect.value;
        renderPreview();
        saveWorkspaceToLocalStorage();
    });

    watermarkOpacitySlider.addEventListener('input', () => {
        const val = watermarkOpacitySlider.value;
        watermarkOpacityVal.textContent = `${val}%`;
        watermarkSettings.opacity = val / 100;
        debouncedRenderAndSave();
    });

    watermarkSizeSlider.addEventListener('input', () => {
        const val = watermarkSizeSlider.value;
        watermarkSettings.size = parseInt(val);
        updateWatermarkSizeLabel();
        debouncedRenderAndSave();
    });

    watermarkImageFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const rawBase64 = event.target.result;
                // Watermarks do not need full resolution, 600px max width is perfect and high performance
                compressImage(rawBase64, 600, (compressedBase64) => {
                    watermarkSettings.imageSrc = compressedBase64;
                    renderPreview();
                    saveWorkspaceToLocalStorage();
                });
            };
            reader.readAsDataURL(file);
        }
    });

    function updateWatermarkSizeLabel() {
        if (watermarkSettings.type === 'image') {
            watermarkSizeVal.textContent = `${watermarkSettings.size}%`;
        } else {
            watermarkSizeVal.textContent = `${watermarkSettings.size}px`;
        }
    }

    // 3.2 CUSTOM DESIGN EVENT BINDINGS (INSTANT CSS VARIABLE SYNCING)
    
    // Group 1: Main Heading (Section Bar)
    designSectionBg.addEventListener('input', (e) => {
        customDesignSettings.sectionBg = e.target.value;
        document.documentElement.style.setProperty('--custom-section-bg', e.target.value);
        saveWorkspaceToLocalStorage();
    });
    designSectionAccent.addEventListener('input', (e) => {
        customDesignSettings.sectionAccent = e.target.value;
        document.documentElement.style.setProperty('--custom-section-border-left', e.target.value);
        saveWorkspaceToLocalStorage();
    });
    designSectionText.addEventListener('input', (e) => {
        customDesignSettings.sectionText = e.target.value;
        document.documentElement.style.setProperty('--custom-section-text', e.target.value);
        saveWorkspaceToLocalStorage();
    });
    designSectionSize.addEventListener('input', (e) => {
        customDesignSettings.sectionSize = e.target.value;
        designSectionSizeVal.textContent = `${e.target.value}px`;
        document.documentElement.style.setProperty('--custom-section-size', `${e.target.value}px`);
        saveWorkspaceToLocalStorage();
    });

    if (designChapterNumSize) {
        designChapterNumSize.addEventListener('input', (e) => {
            customDesignSettings.chapterNumSize = e.target.value;
            if (designChapterNumSizeVal) designChapterNumSizeVal.textContent = `${e.target.value}px`;
            document.documentElement.style.setProperty('--custom-chapter-num-size', `${e.target.value}px`);
            saveWorkspaceToLocalStorage();
        });
    }
    if (designChapterTitleSize) {
        designChapterTitleSize.addEventListener('input', (e) => {
            customDesignSettings.chapterTitleSize = e.target.value;
            if (designChapterTitleSizeVal) designChapterTitleSizeVal.textContent = `${e.target.value}px`;
            document.documentElement.style.setProperty('--custom-chapter-title-size', `${e.target.value}px`);
            saveWorkspaceToLocalStorage();
        });
    }
    if (designChapterSubtitleSize) {
        designChapterSubtitleSize.addEventListener('input', (e) => {
            customDesignSettings.chapterSubSize = e.target.value;
            if (designChapterSubtitleSizeVal) designChapterSubtitleSizeVal.textContent = `${e.target.value}px`;
            document.documentElement.style.setProperty('--custom-chapter-subtitle-size', `${e.target.value}px`);
            saveWorkspaceToLocalStorage();
        });
    }
    designSectionAlign.addEventListener('change', (e) => {
        customDesignSettings.sectionAlignment = e.target.value;
        applyCustomDesignSettingsToDOM();
        saveWorkspaceToLocalStorage();
    });

    if (designSectionShape) {
        designSectionShape.addEventListener('change', (e) => {
            customDesignSettings.sectionShape = e.target.value;
            renderPreview();
            saveWorkspaceToLocalStorage();
        });
    }
    if (designTopicIcon) {
        designTopicIcon.addEventListener('change', (e) => {
            customDesignSettings.topicIcon = e.target.value;
            renderPreview();
            saveWorkspaceToLocalStorage();
        });
    }
    if (designBulletStyle) {
        designBulletStyle.addEventListener('change', (e) => {
            customDesignSettings.bulletStyle = e.target.value;
            renderPreview();
            saveWorkspaceToLocalStorage();
        });
    }

    // Group 2: Topic Heading
    designTopicText.addEventListener('input', (e) => {
        customDesignSettings.topicText = e.target.value;
        document.documentElement.style.setProperty('--custom-topic-text', e.target.value);
        saveWorkspaceToLocalStorage();
    });
    designTopicBorder.addEventListener('input', (e) => {
        customDesignSettings.topicBorder = e.target.value;
        document.documentElement.style.setProperty('--custom-topic-border-color', e.target.value);
        document.documentElement.style.setProperty('--custom-topic-border-color-val', e.target.value);
        saveWorkspaceToLocalStorage();
    });
    designTopicBorderStyle.addEventListener('change', (e) => {
        customDesignSettings.topicBorderStyle = e.target.value;
        document.documentElement.style.setProperty('--custom-topic-border-style', e.target.value);
        saveWorkspaceToLocalStorage();
    });
    designTopicMargin.addEventListener('change', (e) => {
        const parts = e.target.value.split(' ');
        customDesignSettings.topicMarginTop = parts[0];
        customDesignSettings.topicMarginBottom = parts[1];
        document.documentElement.style.setProperty('--custom-topic-margin-top', parts[0]);
        document.documentElement.style.setProperty('--custom-topic-margin-bottom', parts[1]);
        saveWorkspaceToLocalStorage();
    });
    designTopicSize.addEventListener('input', (e) => {
        customDesignSettings.topicSize = e.target.value;
        designTopicSizeVal.textContent = `${e.target.value}px`;
        document.documentElement.style.setProperty('--custom-topic-size', `${e.target.value}px`);
        saveWorkspaceToLocalStorage();
    });
    designTopicThick.addEventListener('input', (e) => {
        customDesignSettings.topicThick = e.target.value;
        designTopicThickVal.textContent = `${e.target.value}px`;
        document.documentElement.style.setProperty('--custom-topic-border-thickness', `${e.target.value}px`);
        saveWorkspaceToLocalStorage();
    });
    designTopicAlign.addEventListener('change', (e) => {
        customDesignSettings.topicAlignment = e.target.value;
        document.documentElement.style.setProperty('--custom-topic-alignment', e.target.value);
        saveWorkspaceToLocalStorage();
    });

    // Group 3: Page Borders
    designInnerBorder.addEventListener('input', (e) => {
        customDesignSettings.innerBorderColor = e.target.value;
        document.documentElement.style.setProperty('--custom-inner-border-color', e.target.value);
        saveWorkspaceToLocalStorage();
    });
    designCornerColor.addEventListener('input', (e) => {
        customDesignSettings.cornerColor = e.target.value;
        document.documentElement.style.setProperty('--custom-corner-color', e.target.value);
        saveWorkspaceToLocalStorage();
    });
    designBorderThick.addEventListener('input', (e) => {
        customDesignSettings.borderThick = e.target.value;
        designBorderThickVal.textContent = `${e.target.value}px`;
        document.documentElement.style.setProperty('--custom-inner-border-thickness', `${e.target.value}px`);
        saveWorkspaceToLocalStorage();
    });
    designCornerSize.addEventListener('input', (e) => {
        customDesignSettings.cornerSize = e.target.value;
        designCornerSizeVal.textContent = `${e.target.value}px`;
        document.documentElement.style.setProperty('--custom-corner-size', `${e.target.value}px`);
        saveWorkspaceToLocalStorage();
    });

    // Page Spacing Customizers (Margins & Padding)
    if (pageMarginXInput) {
        pageMarginXInput.addEventListener('input', (e) => {
            customDesignSettings.pageMarginX = e.target.value;
            if (marginXValSpan) marginXValSpan.textContent = `${e.target.value}mm`;
            document.documentElement.style.setProperty('--custom-page-margin-x', `${e.target.value}mm`);
            cachedMaxContentHeight = null; // Clear height cache to trigger re-measurement
            debouncedRenderAndSave();
        });
    }
    if (pageMarginYInput) {
        pageMarginYInput.addEventListener('input', (e) => {
            customDesignSettings.pageMarginY = e.target.value;
            if (marginYValSpan) marginYValSpan.textContent = `${e.target.value}mm`;
            document.documentElement.style.setProperty('--custom-page-margin-y', `${e.target.value}mm`);
            cachedMaxContentHeight = null; // Clear height cache to trigger re-measurement
            debouncedRenderAndSave();
        });
    }
    if (pagePaddingXInput) {
        pagePaddingXInput.addEventListener('input', (e) => {
            customDesignSettings.pagePaddingX = e.target.value;
            if (paddingXValSpan) paddingXValSpan.textContent = `${e.target.value}mm`;
            document.documentElement.style.setProperty('--custom-page-padding-x', `${e.target.value}mm`);
            cachedMaxContentHeight = null; // Clear height cache to trigger re-measurement
            debouncedRenderAndSave();
        });
    }
    if (pagePaddingYInput) {
        pagePaddingYInput.addEventListener('input', (e) => {
            customDesignSettings.pagePaddingY = e.target.value;
            if (paddingYValSpan) paddingYValSpan.textContent = `${e.target.value}mm`;
            document.documentElement.style.setProperty('--custom-page-padding-y', `${e.target.value}mm`);
            cachedMaxContentHeight = null; // Clear height cache to trigger re-measurement
            debouncedRenderAndSave();
        });
    }

    // Group 3.5: Two-Column Divider Customizer
    designDividerColor.addEventListener('input', (e) => {
        customDesignSettings.dividerColor = e.target.value;
        document.documentElement.style.setProperty('--custom-divider-color', e.target.value);
        saveWorkspaceToLocalStorage();
    });
    designDividerStyle.addEventListener('change', (e) => {
        customDesignSettings.dividerStyle = e.target.value;
        document.documentElement.style.setProperty('--custom-divider-style', e.target.value);
        saveWorkspaceToLocalStorage();
    });
    designDividerThick.addEventListener('input', (e) => {
        customDesignSettings.dividerThickness = e.target.value;
        designDividerThickVal.textContent = `${e.target.value}px`;
        document.documentElement.style.setProperty('--custom-divider-thickness', `${e.target.value}px`);
        saveWorkspaceToLocalStorage();
    });



    // Group 3.6: End Star Divider Customizer
    designEndStarSymbol.addEventListener('change', (e) => {
        customDesignSettings.endStarSymbol = e.target.value;
        renderPreview();
        saveWorkspaceToLocalStorage();
    });
    designEndStarColor.addEventListener('input', (e) => {
        customDesignSettings.endStarColor = e.target.value;
        document.documentElement.style.setProperty('--custom-end-star-color', e.target.value);
        const r = parseInt(e.target.value.substring(1, 3), 16);
        const g = parseInt(e.target.value.substring(3, 5), 16);
        const b = parseInt(e.target.value.substring(5, 7), 16);
        document.documentElement.style.setProperty('--custom-end-star-shadow', `rgba(${r}, ${g}, ${b}, 0.35)`);
        saveWorkspaceToLocalStorage();
    });
    designEndStarSize.addEventListener('input', (e) => {
        customDesignSettings.endStarSize = e.target.value;
        designEndStarSizeVal.textContent = `${e.target.value}px`;
        document.documentElement.style.setProperty('--custom-end-star-size', `${e.target.value}px`);
        saveWorkspaceToLocalStorage();
    });
    designEndStarPulse.addEventListener('change', (e) => {
        customDesignSettings.endStarPulse = e.target.checked;
        document.documentElement.style.setProperty('--custom-end-star-animation', e.target.checked ? 'pulseStar 3s ease-in-out infinite' : 'none');
        saveWorkspaceToLocalStorage();
    });

    // Group 4: Pagination (Requires live re-render for layout prefix/positioning changes)
    designPageNumColor.addEventListener('input', (e) => {
        customDesignSettings.pageNumColor = e.target.value;
        cachedMaxContentHeight = null; // Clear height cache
        debouncedRenderAndSave();
    });
    designPageNumPlace.addEventListener('change', (e) => {
        customDesignSettings.pageNumPlacement = e.target.value;
        cachedMaxContentHeight = null; // Clear height cache
        renderPreview();
        saveWorkspaceToLocalStorage();
    });
    designPageNumPrefix.addEventListener('input', (e) => {
        customDesignSettings.pageNumPrefix = e.target.value;
        cachedMaxContentHeight = null; // Clear height cache
        debouncedRenderAndSave();
    });
    designPageNumSize.addEventListener('input', (e) => {
        designPageNumSizeVal.textContent = `${e.target.value}px`;
        customDesignSettings.pageNumSize = e.target.value;
        cachedMaxContentHeight = null; // Clear height cache
        debouncedRenderAndSave();
    });

    headerLogoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const rawBase64 = event.target.result;
                // Header logos are rendered very small, so 400px is incredibly sharp yet ultra lightweight
                compressImage(rawBase64, 400, (compressedBase64) => {
                    customDesignSettings.headerLogoSrc = compressedBase64;
                    headerLogoPreview.src = compressedBase64;
                    headerLogoPreviewGroup.style.display = 'block';
                    cachedMaxContentHeight = null; // Clear height cache
                    renderPreview();
                    saveWorkspaceToLocalStorage();
                });
            };
            reader.readAsDataURL(file);
        }
    });

    removeHeaderLogoBtn.addEventListener('click', () => {
        customDesignSettings.headerLogoSrc = '';
        headerLogoFileInput.value = '';
        headerLogoPreview.src = '';
        headerLogoPreviewGroup.style.display = 'none';
        cachedMaxContentHeight = null; // Clear height cache
        renderPreview();
        saveWorkspaceToLocalStorage();
    });

    // Sync design control panel fields with current active theme colors
    function syncDesignControlsWithTheme() {
        const styles = getComputedStyle(document.body);
        const primary = styles.getPropertyValue('--primary-color').trim() || '#850f0f';
        const secondary = styles.getPropertyValue('--secondary-color').trim() || '#c5a353';
        const accent = styles.getPropertyValue('--accent-color').trim() || '#1d6ea5';

        // Direct variables update
        document.documentElement.style.setProperty('--custom-section-bg', primary);
        document.documentElement.style.setProperty('--custom-section-border-left', accent);
        document.documentElement.style.setProperty('--custom-topic-text', accent);
        document.documentElement.style.setProperty('--custom-topic-border-color', secondary);
        document.documentElement.style.setProperty('--custom-inner-border-color', secondary);
        document.documentElement.style.setProperty('--custom-corner-color', secondary);
        document.documentElement.style.setProperty('--custom-divider-color', secondary);
        document.documentElement.style.setProperty('--custom-end-star-color', secondary);

        // Inputs update
        designSectionBg.value = primary;
        designSectionAccent.value = accent;
        designTopicText.value = accent;
        designTopicBorder.value = secondary;
        designInnerBorder.value = secondary;
        designCornerColor.value = secondary;
        designDividerColor.value = secondary;
        designEndStarColor.value = secondary;
        designPageNumColor.value = primary;

        customDesignSettings.pageNumColor = primary;
    }



    // 4. WORKSPACE CONTROLLERS & ACTIONS

    function updateDocumentTitle() {
        let subtitleText = (pagesData[0] && pagesData[0].subtitle) ? pagesData[0].subtitle.trim() : '';
        if (!subtitleText) {
            subtitleText = (pagesData[0] && pagesData[0].title) ? pagesData[0].title.trim() : '';
        }
        if (subtitleText) {
            const cleanTitle = subtitleText.replace(/[^a-zA-Z0-9\u0900-\u097F\s\-]/g, '').trim();
            document.title = cleanTitle || "Samyak";
        } else {
            document.title = "Samyak";
        }
    }

    // Save current user interface input values into pagesData array before switching
    function saveCurrentInputState() {
        if (pagesData[0]) {
            pagesData[0].theme = docThemeInput.value;
        }
        if (activePageIndex === 0) {
            pagesData[0].title = docTitleInput.value;
            pagesData[0].tagline = docTaglineInput.value;
            pagesData[0].subtitle = docSubtitleInput.value;
            if (docClassificationInput) {
                pagesData[0].classification = docClassificationInput.value;
            }
            if (coverTitleSizeSlider) {
                pagesData[0].titleSize = parseInt(coverTitleSizeSlider.value) || 52;
            }
            if (coverClassificationSizeSlider) {
                pagesData[0].classificationSize = parseInt(coverClassificationSizeSlider.value) || 24;
            }
            if (coverTaglineSizeSlider) {
                pagesData[0].taglineSize = parseInt(coverTaglineSizeSlider.value) || 20;
            }
            if (coverSubtitleSizeSlider) {
                pagesData[0].subtitleSize = parseInt(coverSubtitleSizeSlider.value) || 21;
            }
        } else if (activePageIndex === pagesData.length) {
            lastPageData.title = lastTitleInput.value;
            lastPageData.subtitle = lastSubtitleInput.value;
            lastPageData.tagline = lastTaglineInput.value;
        } else {
            if (pagesData[activePageIndex]) {
                pagesData[activePageIndex].text = pageContentInput.value;
            }
        }
    }

    // Switch active page editor view
    function switchActivePage(index, saveState = true) {
        // 1. Save current active page state if requested
        if (saveState) {
            saveCurrentInputState();
        }

        // 2. Shift active index
        activePageIndex = index;

        // 2.5 Sync global theme dropdown
        if (pagesData[0]) {
            docThemeInput.value = pagesData[0].theme;
        }

        // 3. Render and sync active panel
        renderTabsList();
        
        // Auto-switch dynamic horizontal sidebar tabs to editor panel
        switchSidebarTab('panel-editor');

        const lastTabIdx = pagesData.length;
        const totalPages = pagesData.length + 1;
        
        // Dynamically show the current page inside the tab button itself
        const tabEditorBtn = document.getElementById('tab-editor-btn');
        if (tabEditorBtn) {
            if (index === 0) {
                tabEditorBtn.innerHTML = '<span class="tab-icon">✍️</span> Ed. (Cover)';
            } else if (index === lastTabIdx) {
                tabEditorBtn.innerHTML = '<span class="tab-icon">✍️</span> Ed. (End)';
            } else {
                tabEditorBtn.innerHTML = `<span class="tab-icon">✍️</span> Ed. (P. ${index + 1})`;
            }
        }

        if (index === 0) {
            // Display Cover controls
            coverEditorZone.classList.add('active');
            contentEditorZone.classList.remove('active');
            lastEditorZone.classList.remove('active');
            activePageLabel.textContent = "Cover";
            
            if (pageTemplateSelect) pageTemplateSelect.disabled = true;
            if (pageLayoutSelect) pageLayoutSelect.disabled = true;
            if (applyLayoutAllBtn) applyLayoutAllBtn.disabled = true;
            
            // Sync values to cover fields
            docTitleInput.value = pagesData[0].title;
            docTaglineInput.value = pagesData[0].tagline;
            docSubtitleInput.value = pagesData[0].subtitle;
            if (coverThemeSelect) {
                coverThemeSelect.value = pagesData[0].coverTheme || 'default';
            }
            if (coverBorderPatternSelect) {
                coverBorderPatternSelect.value = pagesData[0].coverBorderPattern || 'solid';
            }
            if (coverEmblemSelect) {
                coverEmblemSelect.value = pagesData[0].coverEmblem || 'none';
            }
            if (docClassificationInput) {
                docClassificationInput.value = pagesData[0].classification || '';
            }
            if (coverTitleSizeSlider) {
                coverTitleSizeSlider.value = pagesData[0].titleSize || 52;
                coverTitleSizeVal.textContent = `${coverTitleSizeSlider.value}px`;
            }
            if (coverClassificationSizeSlider) {
                coverClassificationSizeSlider.value = pagesData[0].classificationSize || 24;
                coverClassificationSizeVal.textContent = `${coverClassificationSizeSlider.value}px`;
            }
            if (coverTaglineSizeSlider) {
                coverTaglineSizeSlider.value = pagesData[0].taglineSize || 20;
                coverTaglineSizeVal.textContent = `${coverTaglineSizeSlider.value}px`;
            }
            if (coverSubtitleSizeSlider) {
                coverSubtitleSizeSlider.value = pagesData[0].subtitleSize || 21;
                coverSubtitleSizeVal.textContent = `${coverSubtitleSizeSlider.value}px`;
            }
            applyTheme(pagesData[0].theme);
        } else if (index === lastTabIdx) {
            // Display Last Page controls
            coverEditorZone.classList.remove('active');
            contentEditorZone.classList.remove('active');
            lastEditorZone.classList.add('active');
            activePageLabel.textContent = "End";

            if (pageTemplateSelect) pageTemplateSelect.disabled = true;
            if (pageLayoutSelect) pageLayoutSelect.disabled = true;
            if (applyLayoutAllBtn) applyLayoutAllBtn.disabled = true;

            // Sync values to last page fields
            lastTitleInput.value = lastPageData.title;
            lastSubtitleInput.value = lastPageData.subtitle;
            lastTaglineInput.value = lastPageData.tagline;
        } else {
            // Display Content Text Area controls
            coverEditorZone.classList.remove('active');
            contentEditorZone.classList.add('active');
            lastEditorZone.classList.remove('active');
            activePageLabel.textContent = index;
            
            if (pageTemplateSelect) pageTemplateSelect.disabled = false;
            if (pageLayoutSelect) pageLayoutSelect.disabled = false;
            if (applyLayoutAllBtn) applyLayoutAllBtn.disabled = false;
            
            // Sync page layout selector
            if (pageLayoutSelect && pagesData[index]) {
                pageLayoutSelect.value = pagesData[index].layout || 'single';
            }
            
            // Populate textarea specifically for this page
            pageContentInput.value = pagesData[index].text;
            pageContentInput.focus();
        }

        // 4. Scroll A4 preview smoothly to corresponding page and spotlight it
        const targetPageElement = document.querySelector(`.a4-page[data-page="${index + 1}"]`);
        if (targetPageElement) {
            // Remove previous active highlights
            document.querySelectorAll('.a4-page').forEach(page => {
                page.classList.remove('active-page-spotlight');
            });
            // Add active highlight
            targetPageElement.classList.add('active-page-spotlight');
            
            // Scroll to element center or block center
            if (index === 0 || index === lastTabIdx) {
                targetPageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Let syncPreviewScroll align smoothly to the active editing block
                setTimeout(() => syncPreviewScroll(true), 80);
            }
        }

        updateStats();
    }

    // Add a new page
    function addPage() {
        saveCurrentInputState();
        
        pagesData.push({
            type: 'content',
            text: '',
            layout: 'single'
        });

        const newIndex = pagesData.length - 1;
        renderPreview();
        switchActivePage(newIndex);
        saveWorkspaceToLocalStorage();
    }

    // Delete active page
    function deleteActivePage() {
        if (activePageIndex === 0) {
            alert('The Cover Page cannot be deleted!');
            return;
        }

        if (activePageIndex === pagesData.length) {
            alert('The End Page cannot be deleted!');
            return;
        }

        if (pagesData.length <= 2) {
            alert('At least one Content Page is required!');
            return;
        }

        if (confirm(`Are you sure you want to delete Page ${activePageIndex}?`)) {
            // Remove page
            pagesData.splice(activePageIndex, 1);
            
            // Re-adjust active index
            const newIndex = Math.min(activePageIndex - 1, pagesData.length - 1);
            renderPreview();
            switchActivePage(newIndex);
            saveWorkspaceToLocalStorage();
        }
    }

    // Render left panel navigation tabs list
    function renderTabsList() {
        if (pageTabsList) {
            pageTabsList.innerHTML = '';
        }
        
        pagesData.forEach((page, idx) => {
            if (pageTabsList) {
                const tab = document.createElement('div');
                tab.className = 'page-tab';
                if (idx === activePageIndex) {
                    tab.classList.add('active');
                }

                if (idx === 0) {
                    tab.textContent = 'Cover';
                } else {
                    tab.textContent = `Page ${idx}`;
                }

                // Sync overflow warning style from A4 page to tab button
                const previewPage = document.querySelector(`.a4-page[data-page="${idx + 1}"]`);
                if (previewPage && previewPage.classList.contains('overflow-detected')) {
                    tab.classList.add('overflow');
                    tab.title = "Page overflow detected! Click to reduce text.";
                }

                tab.addEventListener('click', () => switchActivePage(idx));
                pageTabsList.appendChild(tab);
            }
        });

        // Sync our new Quick Page switcher header dropdown
        syncQuickPageSwitcher();
    }

    function syncQuickPageSwitcher() {
        const quickPageSelect = document.getElementById('quick-page-select');
        if (!quickPageSelect) return;

        quickPageSelect.innerHTML = '';
        const lastTabIdx = pagesData.length;

        for (let idx = 0; idx <= lastTabIdx; idx++) {
            const opt = document.createElement('option');
            opt.value = idx.toString();
            if (idx === 0) {
                opt.textContent = '👑 Cover Page';
            } else if (idx === lastTabIdx) {
                opt.textContent = '🏁 End Page';
            } else {
                opt.textContent = `📄 Page ${idx}`;
            }
            
            if (idx === activePageIndex) {
                opt.selected = true;
            }

            const previewPage = document.querySelector(`.a4-page[data-page="${idx + 1}"]`);
            if (previewPage && previewPage.classList.contains('overflow-detected')) {
                opt.textContent += ' ⚠️ (Overflow)';
            }

            quickPageSelect.appendChild(opt);
        }

        const quickPrevPageBtn = document.getElementById('quick-prev-page-btn');
        const quickNextPageBtn = document.getElementById('quick-next-page-btn');
        if (quickPrevPageBtn) {
            quickPrevPageBtn.disabled = (activePageIndex === 0);
            quickPrevPageBtn.style.opacity = (activePageIndex === 0) ? '0.4' : '1';
            quickPrevPageBtn.style.pointerEvents = (activePageIndex === 0) ? 'none' : 'auto';
        }
        if (quickNextPageBtn) {
            quickNextPageBtn.disabled = (activePageIndex === lastTabIdx);
            quickNextPageBtn.style.opacity = (activePageIndex === lastTabIdx) ? '0.4' : '1';
            quickNextPageBtn.style.pointerEvents = (activePageIndex === lastTabIdx) ? 'none' : 'auto';
        }
    }

    // Initialize quick page switcher event bindings
    const quickPageSelectEl = document.getElementById('quick-page-select');
    const quickPrevPageBtnEl = document.getElementById('quick-prev-page-btn');
    const quickNextPageBtnEl = document.getElementById('quick-next-page-btn');

    if (quickPageSelectEl) {
        quickPageSelectEl.addEventListener('change', () => {
            const selectedIdx = parseInt(quickPageSelectEl.value, 10);
            if (!isNaN(selectedIdx)) {
                switchActivePage(selectedIdx);
            }
        });
    }

    if (quickPrevPageBtnEl) {
        quickPrevPageBtnEl.addEventListener('click', () => {
            if (activePageIndex > 0) {
                switchActivePage(activePageIndex - 1);
            }
        });
    }

    if (quickNextPageBtnEl) {
        quickNextPageBtnEl.addEventListener('click', () => {
            if (activePageIndex < pagesData.length) {
                switchActivePage(activePageIndex + 1);
            }
        });
    }

    // ==========================================
    // 4.5 A4 VISUAL PAGE GRID CONTROLLERS
    // ==========================================
    function duplicatePageAt(idx) {
        if (idx === 0) return; // Cannot duplicate Cover
        saveCurrentInputState();
        const pageToClone = pagesData[idx];
        const clonedPage = {
            type: 'content',
            text: pageToClone.text || '',
            layout: pageToClone.layout || 'single'
        };
        // Insert after idx
        pagesData.splice(idx + 1, 0, clonedPage);
        renderPreview();
        switchActivePage(idx + 1);
        saveWorkspaceToLocalStorage();
        renderGridPages();
    }

    function deletePageAt(idx) {
        if (idx === 0) {
            alert('The Cover Page cannot be deleted!');
            return;
        }
        if (pagesData.length <= 2) {
            alert('At least one Content Page is required!');
            return;
        }
        if (confirm(`Are you sure you want to delete Page ${idx}?`)) {
            pagesData.splice(idx, 1);
            const newIndex = Math.min(activePageIndex, pagesData.length - 1);
            renderPreview();
            switchActivePage(newIndex);
            saveWorkspaceToLocalStorage();
            renderGridPages();
        }
    }

    function renderGridPages() {
        if (!pageGridItemsContainer) return;
        pageGridItemsContainer.innerHTML = '';

        // Total content pages count (excluding Cover page)
        const totalContentCount = pagesData.length - 1;
        if (gridTotalPagesLabel) {
            gridTotalPagesLabel.textContent = `Total Content Pages: ${totalContentCount}`;
        }

        // 1. Render Cover Page card (always index 0)
        const coverCard = createGridCardDOM(0, 'cover');
        pageGridItemsContainer.appendChild(coverCard);

        // 2. Render Content Page cards (indices 1 to pagesData.length - 1)
        for (let idx = 1; idx < pagesData.length; idx++) {
            const contentCard = createGridCardDOM(idx, 'content');
            pageGridItemsContainer.appendChild(contentCard);
        }

        // 3. Render Add Page Card placeholder
        const addCardPlaceholder = document.createElement('div');
        addCardPlaceholder.className = 'page-grid-add-placeholder';
        addCardPlaceholder.title = 'Add a new page';
        addCardPlaceholder.innerHTML = `
            <div class="add-placeholder-icon">➕</div>
            <div class="add-placeholder-text">Add Page</div>
        `;
        addCardPlaceholder.addEventListener('click', () => {
            addPage();
            renderGridPages();
        });
        pageGridItemsContainer.appendChild(addCardPlaceholder);

        // 4. Render End Page card (Index pagesData.length)
        const endCard = createGridCardDOM(pagesData.length, 'end');
        pageGridItemsContainer.appendChild(endCard);

        // Setup Drag & Drop handlers on items
        setupGridDragAndDrop();
    }

    function createGridCardDOM(idx, type) {
        const card = document.createElement('div');
        card.className = 'page-grid-card';
        if (idx === activePageIndex) {
            card.classList.add('active-card');
        }

        // Setup dragging for content cards only
        if (type === 'content') {
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-index', idx);
        }

        const thumbWrapper = document.createElement('div');
        thumbWrapper.className = 'page-thumbnail-wrapper';

        // Miniature scaling content
        const miniContent = document.createElement('div');
        miniContent.className = `mini-page-content mini-${type}`;

        if (type === 'cover') {
            const border = document.createElement('div');
            border.className = 'mini-cover-border';
            const innerBorder = document.createElement('div');
            innerBorder.className = 'mini-cover-inner-border';
            
            const emblem = document.createElement('div');
            emblem.className = 'mini-cover-emblem';
            emblem.textContent = '⚜️';

            const title = document.createElement('div');
            title.className = 'mini-cover-title';
            title.textContent = (pagesData[0] && pagesData[0].title) ? pagesData[0].title : 'सम्यक्';

            const tagline = document.createElement('div');
            tagline.className = 'mini-cover-tagline';
            tagline.textContent = (pagesData[0] && pagesData[0].tagline) ? pagesData[0].tagline : 'कोचिंग नहीं क्रांति';

            const subtitle = document.createElement('div');
            subtitle.className = 'mini-cover-subtitle';
            subtitle.textContent = (pagesData[0] && pagesData[0].subtitle) ? pagesData[0].subtitle : 'राजस्थान समसामयिकी';

            const tocBox = document.createElement('div');
            tocBox.className = 'mini-cover-toc-box';
            for (let i = 0; i < 4; i++) {
                const line = document.createElement('div');
                line.className = 'mini-toc-line';
                tocBox.appendChild(line);
            }

            miniContent.appendChild(border);
            miniContent.appendChild(innerBorder);
            miniContent.appendChild(emblem);
            miniContent.appendChild(title);
            miniContent.appendChild(tagline);
            miniContent.appendChild(subtitle);
            miniContent.appendChild(tocBox);

        } else if (type === 'end') {
            const endCardBox = document.createElement('div');
            endCardBox.className = 'mini-end-card';

            const endTitle = document.createElement('div');
            endTitle.className = 'mini-end-title';
            endTitle.textContent = (lastPageData && lastPageData.title) ? lastPageData.title : 'THANK YOU';

            const endBrand = document.createElement('div');
            endBrand.className = 'mini-end-brand';
            endBrand.textContent = (lastPageData && lastPageData.subtitle) ? lastPageData.subtitle : 'Samyak';

            const endFooter = document.createElement('div');
            endFooter.className = 'mini-page-footer';
            endFooter.textContent = 'पेज - End';

            endCardBox.appendChild(endTitle);
            endCardBox.appendChild(endBrand);
            miniContent.appendChild(endCardBox);
            miniContent.appendChild(endFooter);

        } else {
            // Content page
            const pageData = pagesData[idx];
            const isTwoColumn = pageData.layout === 'two-column';

            const header = document.createElement('div');
            header.className = 'mini-page-header';
            header.innerHTML = `
                <div class="mini-header-text">लोकबंधु | राजस्थान समसामयिकी</div>
                <div class="mini-header-text" style="font-size:3px;">क्रांति</div>
            `;

            const bodyContent = document.createElement('div');
            bodyContent.className = 'mini-body-content';

            // Parse text to find if there are section headers or topic headers
            const pageText = pageData.text || '';
            const lines = pageText.split('\n');
            let hasSection = false;
            let hasTopic = false;

            lines.forEach(l => {
                const tr = l.trim();
                if (tr.startsWith('# ')) hasSection = true;
                if (tr.startsWith('##') || tr.includes('🔶')) hasTopic = true;
            });

            const drawContentInsideColumn = (container) => {
                if (hasSection) {
                    const sec = document.createElement('div');
                    sec.className = 'mini-title-bar';
                    container.appendChild(sec);
                }
                if (hasTopic) {
                    const top = document.createElement('div');
                    top.className = 'mini-topic-header';
                    container.appendChild(top);
                }
                // Draw some text lines
                for (let k = 0; k < 3; k++) {
                    const line = document.createElement('div');
                    line.className = 'mini-text-line';
                    if (k === 2) line.classList.add('short');
                    container.appendChild(line);
                }
                // Draw a simulated bullet
                const bullet = document.createElement('div');
                bullet.className = 'mini-bullet-line';
                bullet.innerHTML = `<div class="mini-bullet-dot"></div><div class="mini-bullet-text"></div>`;
                container.appendChild(bullet);
            };

            if (isTwoColumn) {
                const cols = document.createElement('div');
                cols.className = 'mini-body-columns';

                const leftCol = document.createElement('div');
                leftCol.className = 'mini-column-flow';
                drawContentInsideColumn(leftCol);

                const divider = document.createElement('div');
                divider.className = 'mini-col-divider';

                const rightCol = document.createElement('div');
                rightCol.className = 'mini-column-flow';
                // Draw some text in right column too
                for (let k = 0; k < 4; k++) {
                    const line = document.createElement('div');
                    line.className = 'mini-text-line';
                    if (k === 3) line.classList.add('short');
                    rightCol.appendChild(line);
                }

                cols.appendChild(leftCol);
                cols.appendChild(divider);
                cols.appendChild(rightCol);
                bodyContent.appendChild(cols);
            } else {
                drawContentInsideColumn(bodyContent);
            }

            const footer = document.createElement('div');
            footer.className = 'mini-page-footer';
            footer.textContent = `पेज - ${idx + 1}`;

            miniContent.appendChild(header);
            miniContent.appendChild(bodyContent);
            miniContent.appendChild(footer);
        }

        thumbWrapper.appendChild(miniContent);

        // Thumbnail actions overlay (for Content pages only)
        if (type === 'content') {
            const actionsOverlay = document.createElement('div');
            actionsOverlay.className = 'thumbnail-action-overlay';

            const cloneBtn = document.createElement('button');
            cloneBtn.className = 'thumb-action-btn btn-clone';
            cloneBtn.title = 'Duplicate Page';
            cloneBtn.innerHTML = '👥';
            cloneBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                duplicatePageAt(idx);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'thumb-action-btn btn-delete-card';
            deleteBtn.title = 'Delete Page';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deletePageAt(idx);
            });

            actionsOverlay.appendChild(cloneBtn);
            actionsOverlay.appendChild(deleteBtn);
            thumbWrapper.appendChild(actionsOverlay);
        }

        card.appendChild(thumbWrapper);

        // Card Labels (under thumbnail)
        const labelRow = document.createElement('div');
        labelRow.className = 'page-label-row';

        const labelNum = document.createElement('span');
        labelNum.className = 'page-label-num';
        if (type === 'cover') {
            labelNum.textContent = 'Page 1';
        } else if (type === 'end') {
            labelNum.textContent = `Page ${pagesData.length + 1}`;
        } else {
            labelNum.textContent = `Page ${idx + 1}`;
        }

        const labelType = document.createElement('span');
        labelType.className = 'page-label-type';
        if (type === 'cover') {
            labelType.textContent = 'Cover';
        } else if (type === 'end') {
            labelType.textContent = 'End Page';
        } else {
            labelType.textContent = pagesData[idx].layout === 'two-column' ? '2 Cols' : '1 Col';
        }

        labelRow.appendChild(labelNum);
        labelRow.appendChild(labelType);
        card.appendChild(labelRow);

        // Click on page card to switch and close modal
        card.addEventListener('click', () => {
            if (type === 'end') {
                switchActivePage(pagesData.length);
            } else {
                switchActivePage(idx);
            }
            if (pageGridModal) {
                pageGridModal.classList.remove('active');
                setTimeout(() => {
                    pageGridModal.style.display = 'none';
                }, 300);
            }
        });

        return card;
    }

    function setupGridDragAndDrop() {
        const cards = pageGridItemsContainer.querySelectorAll('.page-grid-card[draggable="true"]');
        let draggedIndex = null;

        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                draggedIndex = parseInt(card.getAttribute('data-index'), 10);
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', draggedIndex);
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                cards.forEach(c => c.style.border = '');
            });

            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            card.addEventListener('dragenter', (e) => {
                e.preventDefault();
                const targetIndex = parseInt(card.getAttribute('data-index'), 10);
                if (targetIndex !== draggedIndex) {
                    card.style.border = '2px dashed var(--ui-accent, #c5a059)';
                }
            });

            card.addEventListener('dragleave', () => {
                card.style.border = '';
            });

            card.addEventListener('drop', (e) => {
                e.preventDefault();
                card.style.border = '';
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                const toIndex = parseInt(card.getAttribute('data-index'), 10);

                if (isNaN(fromIndex) || isNaN(toIndex) || fromIndex === toIndex) return;
                if (fromIndex === 0 || toIndex === 0) return; // Protect cover

                saveCurrentInputState();

                // Move the page in pagesData array
                const draggedPage = pagesData[fromIndex];
                pagesData.splice(fromIndex, 1);
                pagesData.splice(toIndex, 0, draggedPage);

                // Update active index to track the moved page
                if (activePageIndex === fromIndex) {
                    activePageIndex = toIndex;
                } else if (activePageIndex > fromIndex && activePageIndex <= toIndex) {
                    activePageIndex--;
                } else if (activePageIndex < fromIndex && activePageIndex >= toIndex) {
                    activePageIndex++;
                }

                // Complete state update and save
                renderPreview();
                switchActivePage(activePageIndex);
                saveWorkspaceToLocalStorage();
                renderGridPages();
            });
        });
    }

    // ==========================================
    // 4.6 SMART AI ASSISTANT CONVERTERS
    // ==========================================
    const hindiDictionary = {
        "hai": "है",
        "hain": "हैं",
        "ko": "को",
        "ki": "की",
        "kee": "की",
        "ka": "का",
        "ke": "के",
        "se": "से",
        "ne": "ने",
        "bhi": "भी",
        "bhee": "भी",
        "me": "में",
        "mein": "में",
        "par": "पर",
        "ek": "एक",
        "aur": "और",
        "ye": "ये",
        "yeh": "यह",
        "wo": "वो",
        "woh": "वह",
        "jo": "जो",
        "kar": "कर",
        "karta": "करता",
        "karte": "करते",
        "karti": "करती",
        "karna": "करना",
        "kya": "क्या",
        "kyun": "क्यों",
        "kab": "कब",
        "kahan": "कहाँ",
        "kaise": "कैसे",
        "kitna": "कितना",
        "aaj": "आज",
        "kal": "कल",
        "parso": "परसों",
        "ab": "अब",
        "tab": "तब",
        "jab": "जब",
        "sab": "सब",
        "hi": "ही",
        "hee": "ही",
        "toh": "तो",
        "to": "तो",
        "is": "इस",
        "us": "उस",
        "kis": "किस",
        "jis": "जिस",
        "apna": "अपना",
        "apne": "अपने",
        "apni": "अपनी",
        "mera": "मेरा",
        "mere": "मेरे",
        "meri": "मेरी",
        "tumhara": "तुम्हारा",
        "aap": "आप",
        "hum": "हम",
        "humein": "हमें",
        "hamaara": "हमारा",
        "main": "मैं",
        "mujhe": "मुझे",
        "mujhh": "मुझ",
        "tujhe": "तुझे",
        "ise": "इसे",
        "use": "उसे",
        "jise": "जिसे",
        "kise": "किसे",
        "liye": "लिए",
        "diya": "दिया",
        "liya": "लिया",
        "kiya": "किया",
        "kaha": "कहा",
        "raha": "रहा",
        "rahe": "रहे",
        "rahi": "रही",
        "tha": "था",
        "the": "थे",
        "thi": "थी",
        "ho": "हो",
        "hona": "होना",
        "hota": "होता",
        "hote": "होते",
        "hoti": "होती",
        "gaya": "गया",
        "gaye": "गये",
        "gayi": "गयी",
        "bad": "बाद",
        "pehle": "पहले",
        "saath": "साथ",
        "sath": "साथ",
        "baat": "बात",
        "kaam": "काम",
        "naam": "नाम",
        "log": "लोग",
        "kuch": "कुछ",
        "koi": "कोई",
        "nhi": "नहीं",
        "nahin": "नहीं",
        "nahi": "नहीं",
        "accha": "अच्छा",
        "acha": "अच्छा",
        "bohot": "बहुत",
        "bahut": "बहुत",
        "kam": "कम",
        "jyada": "ज्यादा",
        "ziyada": "ज्यादा",
        "samay": "समय",
        "shyam": "श्याम",
        "ram": "राम",
        "hari": "हरि",
        "om": "ॐ",
        "namo": "नमो",
        "shree": "श्री",
        "shri": "श्री",
        "guru": "गुरु",
        "baba": "बाबा",
        "mandir": "मंदिर",
        "vidyalay": "विद्यालय",
        "shiksha": "शिक्षा",
        "pariksha": "परीक्षा",
        "gyan": "ज्ञान",
        "vigyan": "विज्ञान",
        "videsh": "विदेश",
        "bhasha": "भाषा",
        "hindi": "हिंदी",
        "english": "अंग्रेजी",
        "samvidhan": "संविधान",
        "adhikar": "अधिकार",
        "kartavya": "कर्तव्य",
        "nagrik": "नागरिक",
        "sansad": "संसद",
        "sabha": "सभा",
        "nyayalay": "न्यायालय",
        "kanoon": "कानून",
        "police": "पुलिस",
        "sena": "सेना",
        "raksha": "रक्षा",
        "yudh": "युद्ध",
        "shanti": "शांति",
        "rajasthan": "राजस्थान",
        "samayik": "सामयिकी",
        "samayiki": "सामयिकी",
        "coaching": "कोचिंग",
        "kranti": "क्रांति",
        "yojana": "योजना",
        "yojanae": "योजनाएँ",
        "neetiyan": "नीतियाँ",
        "mela": "मेला",
        "mele": "मेले",
        "utsav": "उत्सव",
        "mahotsav": "महोत्सव",
        "vividh": "विविध",
        "khel": "खेल",
        "puraskar": "पुरस्कार",
        "abhiyan": "अभियान",
        "samiti": "समिति",
        "pratham": "प्रथम",
        "dvititya": "द्वितीय",
        "tritiya": "तृतीय",
        "bharat": "भारत",
        "rajya": "राज्य",
        "desh": "देश",
        "jaipur": "जयपुर",
        "jodhpur": "जोधपुर",
        "udaipur": "उदयपुर",
        "kota": "कोटा",
        "bikaner": "बीकानेर",
        "ajmer": "अजमेर",
        "samyak": "सम्यक",
        "lokbandhu": "लोकबंधु",
        "rajwada": "रजवाड़ा",
        "shasan": "शासन",
        "sarkar": "सरकार",
        "mantri": "मंत्री",
        "mukhyamantri": "मुख्यमंत्री",
        "kalyan": "कल्याण",
        "vikas": "विकास",
        "aarthik": "आर्थिक",
        "samjhauta": "समझौता",
        "charitra": "चरित्र",
        "vyaktitvap": "व्यक्तित्व",
        "charchit": "चर्चित",
        "pramukh": "प्रमुख",
        "namaste": "नमस्ते",
        "namaskar": "नमस्कार",
        "shuru": "शुरू",
        "ant": "अंत",
        "a4": "A4",
        "upsc": "UPSC",
        "ias": "IAS",
        "pcs": "PCS",
        "update": "UPDATE",
        "nfc": "NFC",
        "jkk": "JKK"
    };

    function transliterateWord(word) {
        const lower = word.toLowerCase();
        if (hindiDictionary[lower]) {
            return hindiDictionary[lower];
        }

        // Syllable transliteration rules
        let res = "";
        let i = 0;
        const len = lower.length;
        
        while (i < len) {
            // Match multi-character consonants
            if (i + 2 < len && lower.substr(i, 3) === "ksh") { res += "क्ष"; i += 3; continue; }
            if (i + 2 < len && lower.substr(i, 3) === "chh") { res += "छ"; i += 3; continue; }
            
            if (i + 1 < len && lower.substr(i, 2) === "kh") { res += "ख"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "gh") { res += "घ"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "ch") { res += "च"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "jh") { res += "झ"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "th") { res += "थ"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "dh") { res += "ध"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "ph") { res += "फ"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "bh") { res += "भ"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "sh") { res += "श"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "Th") { res += "ठ"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "Dh") { res += "ढ"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "tr") { res += "त्र"; i += 2; continue; }
            if (i + 1 < len && lower.substr(i, 2) === "gy") { res += "ज्ञ"; i += 2; continue; }
            
            // Match single vowels and consonants
            const char = lower[i];
            
            // Basic vowels mapping
            if (char === "a") {
                if (i + 1 < len && lower[i + 1] === "a") {
                    res += (res === "") ? "आ" : "ा";
                    i += 2;
                    continue;
                }
                // Single short 'a' inside Hindi consonants is implicit, so it adds nothing.
                // At the start of a word, it should map to 'अ'.
                if (res === "") {
                    res += "अ";
                }
                i++;
                continue;
            }
            if (char === "i") {
                res += (res === "") ? "इ" : "ि";
                i++;
                continue;
            }
            if (char === "u") {
                res += (res === "") ? "उ" : "ु";
                i++;
                continue;
            }
            if (char === "e") {
                res += (res === "") ? "ए" : "े";
                i++;
                continue;
            }
            if (char === "o") {
                res += (res === "") ? "ओ" : "ो";
                i++;
                continue;
            }
            
            // Consonants mapping
            const consMap = {
                "k": "क", "g": "ग", "j": "ज", "t": "त", "d": "द", "n": "न",
                "p": "प", "b": "ब", "m": "म", "y": "य", "r": "र", "l": "ल",
                "v": "व", "w": "व", "s": "स", "h": "ह", "f": "फ़",
                "T": "ट", "D": "ड", "N": "ण"
            };
            
            if (consMap[char]) {
                res += consMap[char];
                
                // Halant check
                if (i + 1 < len) {
                    const next = lower[i + 1];
                    const isNextVowel = ["a", "i", "u", "e", "o"].includes(next);
                    if (!isNextVowel) {
                        res += "्";
                    }
                }
                i++;
                continue;
            }
            
            // If unknown character, just append it
            res += char;
            i++;
        }
        
        return res;
    }

    // ==========================================
    // GOOGLE INPUT TOOLS EMULATION HELPERS & WORD SCANNER
    // ==========================================

    // Calculate absolute screen coordinates of caret inside textarea
    function getCaretCoordinates(element, position) {
        let div = document.getElementById('textarea-caret-position-mirror-div');
        if (!div) {
            div = document.createElement('div');
            div.id = 'textarea-caret-position-mirror-div';
            document.body.appendChild(div);
        }

        const style = window.getComputedStyle(element);
        
        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordWrap = 'break-word';
        div.style.overflow = 'hidden';

        const properties = [
            'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontVariant', 'fontStretch',
            'lineHeight', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
            'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
            'borderStyle', 'boxSizing', 'width', 'height', 'textTransform', 'textAlign'
        ];
        
        properties.forEach(prop => {
            div.style[prop] = style[prop];
        });

        div.style.width = element.clientWidth + 'px';
        div.style.height = element.clientHeight + 'px';
        div.scrollTop = element.scrollTop;

        const textContent = element.value.substring(0, position);
        div.textContent = textContent;

        const span = document.createElement('span');
        span.textContent = ' ';
        div.appendChild(span);

        const rect = element.getBoundingClientRect();
        const spanOffsetTop = span.offsetTop;
        const spanOffsetLeft = span.offsetLeft;

        // Calculate final absolute coordinates including page scroll
        const top = rect.top + window.scrollY + spanOffsetTop - element.scrollTop;
        const left = rect.left + window.scrollX + spanOffsetLeft - element.scrollLeft;

        return { top, left };
    }

    // Generate up to 5 smart candidates, prioritizing dictionary & phonetic patterns
    function generatePhoneticSuggestions(word) {
        if (!word) return [];
        const lower = word.toLowerCase();
        let suggestions = [];

        // 1. Exact match from the pre-populated dictionary
        if (hindiDictionary[lower]) {
            suggestions.push(hindiDictionary[lower]);
        }

        // 2. Exact translit using custom rules transliterator
        const exactTranslit = transliterateWord(lower);
        if (exactTranslit && !suggestions.includes(exactTranslit)) {
            suggestions.push(exactTranslit);
        }

        // 3. Prefix matched completions from dictionary
        for (const [key, val] of Object.entries(hindiDictionary)) {
            if (key.startsWith(lower) && !suggestions.includes(val)) {
                suggestions.push(val);
                if (suggestions.length >= 4) break;
            }
        }

        // 4. Syllable vowel endings fallback variations
        const endings = ["ा", "ी", "ु", "े", "ो"];
        let base = exactTranslit;
        if (base.endsWith("्")) {
            base = base.substring(0, base.length - 1);
        }
        for (const end of endings) {
            if (suggestions.length >= 4) break;
            const variant = base + end;
            if (!suggestions.includes(variant)) {
                suggestions.push(variant);
            }
        }

        // 5. Hardcoded backup candidates to fill slot 4
        const fallbackWords = ["राज", "राम", "कुमार", "सिंह", "वर्मा", "शर्मा", "यादव", "पटेल", "चौधरी"];
        for (const fallback of fallbackWords) {
            if (suggestions.length >= 4) break;
            if (!suggestions.includes(fallback)) {
                suggestions.push(fallback);
            }
        }

        // Clip to top 4 options
        suggestions = suggestions.slice(0, 4);

        // 5th option is ALWAYS the literal English word (essential for Google Input Tools style bypass)
        suggestions.push(word);

        return suggestions;
    }

    // Render suggestions list into our floating DOM tooltip container
    function renderPhoneticSuggestionsTooltip(suggestions) {
        if (!phoneticSuggestionsTooltip) return;

        if (!suggestions || suggestions.length === 0) {
            phoneticSuggestionsTooltip.style.display = 'none';
            suggestionsActive = false;
            return;
        }

        phoneticSuggestionsTooltip.innerHTML = '';
        suggestions.forEach((sug, idx) => {
            const item = document.createElement('div');
            item.className = 'phonetic-suggestion-item' + (idx === activeSuggestionIndex ? ' highlighted' : '');
            
            const textSpan = document.createElement('span');
            textSpan.textContent = sug;
            item.appendChild(textSpan);

            const badge = document.createElement('span');
            badge.className = 'suggestion-num-badge';
            badge.textContent = idx + 1;
            item.appendChild(badge);

            // Item clicks trigger direct choice insertion
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectPhoneticSuggestion(idx);
            });

            phoneticSuggestionsTooltip.appendChild(item);
        });

        phoneticSuggestionsTooltip.style.display = 'flex';
        suggestionsActive = true;
    }

    // Select suggestion and insert into text editor replacing the english typing
    function selectPhoneticSuggestion(index) {
        if (index < 0 || index >= suggestionsList.length) return;
        const chosenWord = suggestionsList[index];
        
        const text = pageContentInput.value;
        const selStart = pageContentInput.selectionStart;
        
        const wordStart = currentWordStartIdx;
        const wordEnd = selStart;
        
        // Form replacement
        const newText = text.substring(0, wordStart) + chosenWord + ' ' + text.substring(wordEnd);
        pageContentInput.value = newText;
        
        // Put cursor exactly after inserted suggestion word and space
        const newCursorPos = wordStart + chosenWord.length + 1;
        pageContentInput.setSelectionRange(newCursorPos, newCursorPos);
        
        // Dispatch event to save state and render Live PDF Previews
        const inputEvent = new Event('input', { bubbles: true });
        pageContentInput.dispatchEvent(inputEvent);
        
        // Reset state
        hidePhoneticSuggestionsTooltip();
        pageContentInput.focus();
    }

    // Reset autocomplete tooltip state and hide from screen
    function hidePhoneticSuggestionsTooltip() {
        if (phoneticSuggestionsTooltip) {
            phoneticSuggestionsTooltip.style.display = 'none';
        }
        suggestionsActive = false;
        suggestionsList = [];
        activeSuggestionIndex = 0;
        currentEnglishWord = "";
        currentWordStartIdx = -1;
    }

    // OCR Progressive cascade of bounding boxes perfectly overlaying preview image
    function triggerOcrBoundingBoxScan() {
        const previewContainer = ocrPreviewImg.parentElement;
        if (!previewContainer) return;

        // Clean out any past scans
        const oldBoxes = previewContainer.querySelectorAll('.ocr-word-highlight-box');
        oldBoxes.forEach(box => box.remove());

        const wordRows = 7;
        const wordsPerRow = 5;
        const totalScanTime = 1800; // synchronized with sweeping laser line

        for (let r = 0; r < wordRows; r++) {
            const topVal = 14 + (r * 11) + (Math.random() * 2 - 1);
            for (let c = 0; c < wordsPerRow; c++) {
                const leftVal = 12 + (c * 15) + (Math.random() * 4 - 2);
                const widthVal = 8 + (Math.random() * 6);
                const heightVal = 4.5 + (Math.random() * 1.5);

                const box = document.createElement('div');
                box.className = 'ocr-word-highlight-box';
                box.style.top = topVal + '%';
                box.style.left = leftVal + '%';
                box.style.width = widthVal + '%';
                box.style.height = heightVal + '%';

                previewContainer.appendChild(box);

                // Laser reach threshold calculation
                const laserReachTime = (topVal / 100) * totalScanTime;

                // Sync highlights with sweeping laser line position
                setTimeout(() => {
                    box.classList.add('active');
                }, laserReachTime);

                setTimeout(() => {
                    box.classList.remove('active');
                    box.classList.add('scanned-done');
                }, laserReachTime + 280);

                // Keep highlights visible to show 100% scanning coverage, and cleanup at the end
                setTimeout(() => {
                    box.style.opacity = '0';
                    setTimeout(() => box.remove(), 400);
                }, totalScanTime + 1800);
            }
        }
    }

    function formatOcrToSamyakMarkdown(text) {
        if (!text) return '';
        let lines = text.split('\n');
        let formattedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) {
                formattedLines.push('');
                continue;
            }
            
            // 1. Detect metadata at the start
            if (i === 0 && (line.includes('समसामयिकी') || line.includes('मैगजीन') || line.includes('राजस्थान'))) {
                formattedLines.push('---');
                formattedLines.push('title: लोकबंधु');
                formattedLines.push('tagline: कोचिंग नहीं क्रांति');
                formattedLines.push(`subtitle: ${line}`);
                formattedLines.push('---');
                formattedLines.push('');
                continue;
            }
            
            // 2. Format section headers
            const isSection = line.includes('योजनाएँ') || line.includes('योजनाएं') || line.includes('महोत्सव') || line.includes('मेले') || line.includes('कार्यक्रम') || line.includes('विविध') || line.includes('पुरस्कार') || line.includes('खेल');
            if (isSection && !line.startsWith('#')) {
                formattedLines.push(`# ${line}`);
                continue;
            }
            
            // 3. Format topic headers
            const isTopic = line.includes('योजना UPDATE') || line.includes('मिशन') || line.includes('सम्मेलन') || line.includes('समारोह') || line.includes('रिपोर्ट');
            if (isTopic && !line.startsWith('##')) {
                formattedLines.push(`## 🔶 ${line}`);
                continue;
            }
            
            // 4. Format key-value pairs
            if (line.includes(':-') || line.includes('के तहत') || line.includes('का विषय') || line.includes('आयोजन')) {
                if (!line.startsWith('•')) {
                    let parts = line.split(/(:-\s*)/);
                    if (parts.length >= 3) {
                        let label = parts[0].trim();
                        let rest = parts.slice(2).join('').trim();
                        formattedLines.push(`• **${label}** :- ${rest}`);
                    } else {
                        formattedLines.push(`• ${line}`);
                    }
                } else {
                    formattedLines.push(line);
                }
                continue;
            }
            
            // 5. General bullets
            if (!line.startsWith('•') && !line.startsWith('#') && !line.startsWith('>')) {
                formattedLines.push(`• ${line}`);
            } else {
                formattedLines.push(line);
            }
        }
        
        return formattedLines.join('\n');
    }


    function loadWorkspaceFromLocalStorage() {
        return Promise.all([
            getFromDB('samyak_workspace_state'),
            getFromDB('samyak_uploaded_images'),
            getFromDB('samyak_image_counter')
        ])
        .then(([state, savedImages, savedCounter]) => {
            heightEstimationCache.clear();
            if (!state) return false;
            
            try {
                pagesData = state.pagesData || [];
                pagesData.forEach(page => {
                    if (page.type === 'content' && page.text) {
                        page.text = cleanDuplicatedTableHeaders(page.text);
                    }
                });
                lastPageData = state.lastPageData || { title: 'THANK YOU', subtitle: 'Samyak', tagline: 'कोचिंग नहीं क्रांति' };
                activePageIndex = state.activePageIndex || 0;
                contentFontSize = state.contentFontSize || 13.5;
                watermarkSettings = state.watermarkSettings || watermarkSettings;
                customDesignSettings = state.customDesignSettings || customDesignSettings;
                if (customDesignSettings.compactMode === undefined) {
                    customDesignSettings.compactMode = false;
                }
                if (customDesignSettings.showCoverTOC === undefined) {
                    customDesignSettings.showCoverTOC = true;
                }
                if (customDesignSettings.chapterNumSize === undefined) {
                    customDesignSettings.chapterNumSize = '30';
                }
                if (customDesignSettings.chapterTitleSize === undefined) {
                    customDesignSettings.chapterTitleSize = '20';
                }
                if (customDesignSettings.chapterSubSize === undefined) {
                    customDesignSettings.chapterSubSize = '15';
                }
                if (customDesignSettings.sectionAlignment === undefined) {
                    customDesignSettings.sectionAlignment = 'left';
                }
                if (customDesignSettings.dividerColor === undefined) {
                    customDesignSettings.dividerColor = '';
                }
                if (customDesignSettings.dividerStyle === undefined) {
                    customDesignSettings.dividerStyle = 'dashed';
                }
                if (customDesignSettings.dividerThickness === undefined) {
                    customDesignSettings.dividerThickness = '1.5';
                }
                if (customDesignSettings.endStarSymbol === undefined) {
                    customDesignSettings.endStarSymbol = '✦';
                }
                if (customDesignSettings.endStarColor === undefined) {
                    customDesignSettings.endStarColor = '';
                }
                if (customDesignSettings.endStarSize === undefined) {
                    customDesignSettings.endStarSize = '18';
                }
                if (customDesignSettings.endStarPulse === undefined) {
                    customDesignSettings.endStarPulse = true;
                }
                if (customDesignSettings.sectionShape === undefined) {
                    customDesignSettings.sectionShape = 'rectangle';
                }
                if (customDesignSettings.topicIcon === undefined) {
                    customDesignSettings.topicIcon = 'orange-diamond';
                }
                if (customDesignSettings.bulletStyle === undefined) {
                    customDesignSettings.bulletStyle = 'classic';
                }
                if (customDesignSettings.pageMarginX === undefined) {
                    customDesignSettings.pageMarginX = '8';
                }
                if (customDesignSettings.pageMarginY === undefined) {
                    customDesignSettings.pageMarginY = '6';
                }
                if (customDesignSettings.pagePaddingX === undefined) {
                    customDesignSettings.pagePaddingX = '6';
                }
                if (customDesignSettings.pagePaddingY === undefined) {
                    customDesignSettings.pagePaddingY = '4';
                }
                socialSettings = state.socialSettings || { telegramText: '', youtubeText: '' };
                if (socialSettings.telegramText === '@samyak') socialSettings.telegramText = '';
                if (socialSettings.youtubeText === 'Samyak Coaching') socialSettings.youtubeText = '';
                if (socialSettings.fontSize === undefined) socialSettings.fontSize = 11;
                if (socialSettings.placement === undefined) socialSettings.placement = 'split';
                
                // Read from separate image store or fallback to the embedded state properties for backward compatibility
                uploadedImages = savedImages || state.slateImages || state.uploadedImages || {};
                imageCounter = savedCounter || state.imageCounter || 1;

                    // Sync all UI inputs with the loaded data to prevent old UI values from corrupting new data
                    if (pagesData[0]) {
                        if (pagesData[0].title === 'सम्यक्' || pagesData[0].title === 'Samyak') pagesData[0].title = '';
                        if (pagesData[0].tagline === 'कोचिंग नहीं क्रांति') pagesData[0].tagline = '';
                        if (pagesData[0].subtitle === 'राजस्थान समसामयिकी : 1-10 मई' || pagesData[0].subtitle === 'राजस्थान समसामयिकी') pagesData[0].subtitle = '';
                        
                        docTitleInput.value = pagesData[0].title || '';
                        docTaglineInput.value = pagesData[0].tagline || '';
                        docSubtitleInput.value = pagesData[0].subtitle || '';
                        docThemeInput.value = pagesData[0].theme || 'maroon-gold';
                        if (coverThemeSelect) {
                            coverThemeSelect.value = pagesData[0].coverTheme || 'default';
                        }
                        if (coverBorderPatternSelect) {
                            coverBorderPatternSelect.value = pagesData[0].coverBorderPattern || 'solid';
                        }
                        if (coverEmblemSelect) {
                            coverEmblemSelect.value = pagesData[0].coverEmblem || 'none';
                        }
                        if (pagesData[0].classification === undefined) pagesData[0].classification = '';
                        if (pagesData[0].titleSize === undefined) pagesData[0].titleSize = 52;
                        if (pagesData[0].classificationSize === undefined) pagesData[0].classificationSize = 24;
                        if (pagesData[0].taglineSize === undefined) pagesData[0].taglineSize = 20;
                        if (pagesData[0].subtitleSize === undefined) pagesData[0].subtitleSize = 21;

                        if (docClassificationInput) {
                            docClassificationInput.value = pagesData[0].classification || '';
                        }
                        if (coverTitleSizeSlider) {
                            coverTitleSizeSlider.value = pagesData[0].titleSize || 52;
                            coverTitleSizeVal.textContent = `${coverTitleSizeSlider.value}px`;
                        }
                        if (coverClassificationSizeSlider) {
                            coverClassificationSizeSlider.value = pagesData[0].classificationSize || 24;
                            coverClassificationSizeVal.textContent = `${coverClassificationSizeSlider.value}px`;
                        }
                        if (coverTaglineSizeSlider) {
                            coverTaglineSizeSlider.value = pagesData[0].taglineSize || 20;
                            coverTaglineSizeVal.textContent = `${coverTaglineSizeSlider.value}px`;
                        }
                        if (coverSubtitleSizeSlider) {
                            coverSubtitleSizeSlider.value = pagesData[0].subtitleSize || 21;
                            coverSubtitleSizeVal.textContent = `${coverSubtitleSizeSlider.value}px`;
                        }
                    }
                    if (lastPageData) {
                        lastTitleInput.value = lastPageData.title || 'THANK YOU';
                        lastSubtitleInput.value = lastPageData.subtitle || 'Samyak';
                        lastTaglineInput.value = lastPageData.tagline || 'कोचिंग नहीं क्रांति';
                    }

                    if (footerTelegramInput) footerTelegramInput.value = socialSettings.telegramText || '';
                    if (footerYoutubeInput) footerYoutubeInput.value = socialSettings.youtubeText || '';
                    if (footerSocialSizeInput) {
                        const fsVal = socialSettings.fontSize || 11;
                        footerSocialSizeInput.value = fsVal;
                        if (footerSocialSizeVal) footerSocialSizeVal.textContent = `${fsVal}px`;
                    }
                    if (footerSocialPlacementSelect) footerSocialPlacementSelect.value = socialSettings.placement || 'split';
                    
                    // Restore font/spacing inputs
                    if (state.spacingSettings) {
                        globalFontStyleSelect.value = state.spacingSettings.fontStyle || 'modern-sans';
                        globalFontWeightSelect.value = state.spacingSettings.fontWeight || '700';
                        globalLineSpacingSelect.value = state.spacingSettings.lineSpacing || '1.45';
                        globalLetterSpacingSelect.value = state.spacingSettings.letterSpacing || '0px';
                    }
                    
                    // Apply Spacings to DOM
                    fontSizeValSpan.textContent = `${contentFontSize}px`;
                    document.documentElement.style.setProperty('--content-font-size', `${contentFontSize}px`);
                    document.documentElement.style.setProperty('--content-font-weight', globalFontWeightSelect.value);
                    document.documentElement.style.setProperty('--content-line-height', globalLineSpacingSelect.value);
                    document.documentElement.style.setProperty('--content-letter-spacing', globalLetterSpacingSelect.value);
                    
                    // Apply Font Style
                    document.body.classList.remove('font-poppins-sans', 'font-traditional-serif', 'font-hybrid-style');
                    if (globalFontStyleSelect.value !== 'modern-sans') {
                        document.body.classList.add(`font-${globalFontStyleSelect.value}`);
                    }

                    // Restore Watermark UI inputs
                    watermarkTypeSelect.value = watermarkSettings.type;
                    watermarkTextInput.value = watermarkSettings.text;
                    watermarkPositionSelect.value = watermarkSettings.position;
                    watermarkRotationSelect.value = watermarkSettings.rotation;
                    watermarkOpacitySlider.value = watermarkSettings.opacity * 100;
                    watermarkOpacityVal.textContent = `${watermarkSettings.opacity * 100}%`;
                    watermarkSizeSlider.value = watermarkSettings.size;
                    updateWatermarkSizeLabel();
                    watermarkColorInput.value = watermarkSettings.color;
                    
                    watermarkTextGroup.style.display = (watermarkSettings.type === 'text') ? 'flex' : 'none';
                    watermarkColorGroup.style.display = (watermarkSettings.type === 'text') ? 'flex' : 'none';
                    watermarkImageGroup.style.display = (watermarkSettings.type === 'image') ? 'flex' : 'none';

                    // Apply saved visual theme first (programmatic theme application)
                    const restoredTheme = (pagesData[0] && pagesData[0].theme) || 'maroon-gold';
                    if (docThemeInput) {
                        docThemeInput.value = restoredTheme;
                    }
                    localStorage.setItem('samyak-global-theme', restoredTheme);
                    applyTheme(restoredTheme, false);

                    // Apply customDesignSettings to DOM and UI inputs second (restoring custom settings/colors)
                    applyCustomDesignSettingsToDOM();

                    // Sync UI inputs first without saving state to prevent overwriting new data with old UI values
                    switchActivePage(activePageIndex, false);
                    renderPreview();
                    
                    updateDocumentTitle();
                    return true;
                } catch (e) {
                    console.error("Error setting state from IndexedDB:", e);
                    return false;
                }
            })
            .catch(e => {
                console.error("Error loading IndexedDB state:", e);
                return false;
            });
    }

    function clearWorkspaceContent() {
        // Capture currently selected active theme so it acts as a persistent global setting
        const activeTheme = localStorage.getItem('samyak-global-theme') || docThemeInput.value || 'maroon-gold';

        // Keep the cover page metadata as is, enforcing the active theme
        const currentCover = {
            type: 'cover',
            title: '',
            tagline: '',
            subtitle: '',
            theme: activeTheme,
            coverTheme: 'default',
            coverBorderPattern: 'solid',
            coverEmblem: 'none',
            classification: '',
            titleSize: 52,
            classificationSize: 24,
            taglineSize: 20,
            subtitleSize: 21
        };
        currentCover.theme = activeTheme;

        pagesData = [
            currentCover,
            // Exactly one empty Content Page
            {
                type: 'content',
                text: '',
                layout: 'single'
            }
        ];
        
        // Reset active index to cover page
        activePageIndex = 0;
        
        // Sync values to cover fields in the UI
        docTitleInput.value = pagesData[0].title;
        docTaglineInput.value = pagesData[0].tagline;
        docSubtitleInput.value = pagesData[0].subtitle;
        if (docClassificationInput) {
            docClassificationInput.value = '';
        }
        if (coverTitleSizeSlider) {
            coverTitleSizeSlider.value = 52;
            coverTitleSizeVal.textContent = '52px';
        }
        if (coverClassificationSizeSlider) {
            coverClassificationSizeSlider.value = 24;
            coverClassificationSizeVal.textContent = '24px';
        }
        if (coverTaglineSizeSlider) {
            coverTaglineSizeSlider.value = 20;
            coverTaglineSizeVal.textContent = '20px';
        }
        if (coverSubtitleSizeSlider) {
            coverSubtitleSizeSlider.value = 21;
            coverSubtitleSizeVal.textContent = '21px';
        }
        
        // Keep user's active theme preserved and trigger change event to sync searchable custom select & save
        docThemeInput.value = activeTheme;
        docThemeInput.dispatchEvent(new Event('change'));
        
        // Clear uploaded images
        uploadedImages = {};
        imageCounter = 1;
        saveToDB('samyak_uploaded_images', {});
        saveToDB('samyak_image_counter', 1);
        heightEstimationCache.clear();
        
        // Switch to Cover Tab
        switchActivePage(0);
        switchSidebarTab('panel-pages');
    }

    // 7. INITIAL WORKSPACE POPULATION (10-PAGE DEMONSTRATION CONTENT)
    function loadDefaultSampleWorkspace() {
        pagesData = [
            // Cover Page Meta (Idx 0)
            {
                type: 'cover',
                title: '',
                tagline: '',
                subtitle: '',
                theme: 'maroon-gold',
                coverTheme: 'default',
                coverBorderPattern: 'solid',
                coverEmblem: 'none',
                classification: '',
                titleSize: 52,
                classificationSize: 24,
                taglineSize: 20,
                subtitleSize: 21
            },
            
            // Page 2 (Idx 1)
            {
                type: 'content',
                text: `# योजनाएँ एवं नीतियाँ

## 🔶 प्रधानमंत्री फसल बीमा योजना UPDATE
• **प्रधानमंत्री फसल बीमा योजना** के तहत पॉलिसी जारी करने में राजस्थान देश में प्रथम स्थान पर।
• प्रधानमंत्री फसल बीमा योजना के तहत राजस्थान में देश में सबसे ज्यादा **2 करोड़ 19 लाख पॉलिसी** जारी की गई।

## 🔶 कपास उत्पादकता मिशन
• **केंद्रीय कैबिनेट की मंजूरी** :- 5 मई 2026
• **अवधि** :- 2026-27 से 2030-31 तक
• **कुल राशि** :- 5,669.22 करोड़ रुपए।
• यह mission भारत के **5F** यानी खेत से रेशा से कारखाने से फैशन से विदेश तक (फार्म टू फाइबर टू फैक्ट्री टू फैशन टू फॉरेन) विजन के अनुरूप है।
• **मिशन का उद्देश्य** :- रोग और कीट प्रतिरोधी उच्च उपज वाली किस्म के बीजों के विकास पर बल पर कपास की उत्पादकता बढ़ाना।
• कृषि एवं किसान कल्याण मंत्रालय और वस्त्र मंत्रालय द्वारा इस मिशन का क्रियान्वयन किया जाएगा।
• इस मिशन का उद्देश्य 2031 तक कपास की उत्पादकता को 440 किलोग्राम हेक्टेयर से बढ़ाकर **755 किलोग्राम हेक्टेयर** करके 498 lakh गांठ का उत्पादन करना है।`
            },

            // Page 3 (Idx 2)
            {
                type: 'content',
                text: `## 🔶 अष्टम पोषण पखवाड़ा
• **आयोजन** :- 9 अप्रैल से 23 अप्रैल 2026 तक भारत सरकार के महिला एवं बाल विकास मंत्रालय द्वारा।
• **शुभारंभ** :- 9 अप्रैल 2026 को केंद्रीय महिला एवं बाल विकास मंत्री अन्नपूर्णा देवी द्वारा।
• **थीम** :- "जीवन के प्रथम 6 वर्षों में अधिकतम मस्तिष्क विकास"
• राजस्थान ने सर्वाधिक गतिविधियां आयोजित कर पोषण पखवाड़े में देश में **प्रथम स्थान** प्राप्त किया।
• इस अभियान के तहत प्रदेश के 41 जिलों के 62,139 आंगनबाड़ी केंद्रों पर कुल 45,37,229 गतिविधियां संपन्न हुईं।

## 🔶 लाडो प्रोत्साहन योजना
• **योजना प्रारंभ**:- 1 अगस्त, 2024 से
• **मुख्य उद्देश्य**:- बालिकाओं के प्रति सकारात्मक सोच विकसित करना और उनके स्वास्थ्य एवं शिक्षा के स्तर में सुधार लाना।
• **कुल लाभ**:- बालिका के जन्म पर **₹1.50 lakh** की राशि का संकल्प पत्र प्रदान किया जाता है।
• **पात्रता**:- बालिका का जन्म राजकीय चिकित्सा संस्थान या जननी सुरक्षा योजना (JSY) के लिए मान्यता प्राप्त निजी अस्पताल में होना अनिवार्य है।`
            },

            // Page 4 (Idx 3)
            {
                type: 'content',
                text: `## 🔶 लाडो प्रोत्साहन योजना (आगे का भाग)
• **माता का राजस्थान का मूल निवासी** होना आवश्यक है।
• **दस्तावेज**:- मूल निवास प्रमाण-पत्र या विवाह पंजीयन प्रमाण-पत्र, बैंक खाते का विवरण और गर्भावस्था के दौरान की गई ANC जांच के दस्तावेज।
• **पंजीकरण**:- यह प्रक्रिया PCTS पोर्टल के माध्यम से संचालित होती है, जहाँ प्रत्येक बालिका को एक यूनिक आईडी प्रदान की जाती है।

## 🔶 किश्त अवसर/स्तर राशि :-
• (1) बालिका के जन्म होने पर : **2,500 रुपये**
• (2) 1 वर्ष की आयु एवं पूर्ण टीकाकरण होने पर :- **2,500 रूपये**
• (3) पहली कक्षा में प्रवेश पर :- **4,000 रूपये**
• (4) छठी कक्षा में प्रवेश पर :- **5,000**
• (5) दसवीं कक्षा में प्रवेश पर : **11,000 रूपये**
• (6) छठी बारहवीं कक्षा में प्रवेश पर:- **25,000 रूपये**
• (7) स्नातक उत्तीर्ण करने एवं 21 वर्ष की आयु होने पर :- **1,000,000 रूपये**`
            },

            // Page 5 (Idx 4)
            {
                type: 'content',
                text: `# महोत्सव/मेले/कार्यक्रम

## 🔶 संयुक्त कमांडरों का दूसरा सम्मेलन
• **आयोजन** :- 7 और 8 मई 2026, जयपुर (राजस्थान)
• **सम्मेलन का विषय** :- "नए क्षेत्र में सैन्य क्षमता" है।
• रक्षा मंत्री राजनाथ सिंह और चीफ ऑफ डिफेंस स्टाफ जनरल अनिल चौहान ने इस सम्मेलन में हिस्सा लिया।
• जयपुर समेत देश के कई सैन्य बेस पर ड्रोन रिपेयर और कस्टमाइजेशन केंद्र विकसित किए जाएंगे।
• इस सम्मेलन का आयोजन **ऑपरेशन सिंधु** की एक वर्ष पूरे होने के अवसर पर किया गया।
• सम्मेलन में सेवा की स्वदेशी ताकत बढ़ाने के लिए रक्षा मंत्री ने "विजन 2047" का हिंदी संस्करण और जॉइंट डॉक्ट्रिन फॉर इंटीग्रेटेड कम्युनिकेशंस आर्किटेक्चर भी जारी किया।`
            },

            // Page 6 (Idx 5)
            {
                type: 'content',
                text: `## 🔶 पीठासीन अधिकारियों की समिति की दूसरी बैठक
• **आयोजन** :- 5 मई 2026 को, राजस्थान विधानसभा, जयपुर
• समिति में राजस्थान सहित 6 राज्यों (मध्यप्रदेश, उत्तरप्रदेश, हिमाचल प्रदेश, ओडिशा, सिक्किम) विधानसभा के अध्यक्ष शामिल हुए।
• **समिति के सभापति** : मध्य प्रदेश विधानसभा अध्यक्ष नरेंद्र सिंह तोमर।

## 🔶 ग्राम-2026 की इन्वेस्टर मीट
• **आयोजन** :- 30 अप्रैल 2026, अहमदाबाद (गुजरात)
• मुख्यमंत्री ने मीट के दौरान राजस्थान फाउंडेशन के अहमदाबाद चैप्टर का शुभारंभ किया।

## 🔶 ग्लोबल राजस्थान एग्रीटेक मीट (ग्राम)- 2026 के तहत इनवेस्टर मीट
• **आयोजन** :- 8 मई 2026, हैदराबाद (तेलंगाना)
• इसका आयोजन कृषि विभाग की ओर से फिक्की और राजस्थान फाउंडेशन के सहयोग से किया गया।
• इन्वेस्टर मीट में राजस्थान के कई स्थानों पर फूड पार्क, सीड प्रोसेसिंग, फूड प्रोसेसिंग के विकास के लिए **200 करोड़ रुपए** से अधिक के एमओयू का आदान प्रदान किया गया।`
            },

            // Page 7 (Idx 6)
            {
                type: 'content',
                text: `## 🔶 विदेशी भाषा संचार कौशल कार्यक्रम
• **आयोजन**: 1 मई 2026, बिड़ला ऑडिटोरियम, जयपुर
• **कार्यक्रम के मुख्य अतिथि** :- धर्मेंद्र प्रधान (शिक्षा मंत्री, भारत सरकार)
• **समझौता** :- राजस्थान सरकार का इंग्लिश एंड फॉरेन लैंग्वेज यूनिवर्सिटी, हैदराबाद और नेशनल स्किल डेवलपमेंट कॉरपोरेशन के साथ MoU।
• इसके तहत राजस्थानी युवाओं को पांच विदेशी (जर्मन, फ्रेंच, कोरियन, जापानी, स्पेनिश) भाषा सिखाई जाएगी।
• **नोडल विभाग** :- उच्च एवं तकनीकी शिक्षा विभाग तथा कौशल रोजगार एवं उद्यमिता विभाग।
• ये कोर्स 16 सप्ताह के होंगे। प्रदेश के चयनित 41 सरकारी कॉलेज में सेंटर बनाए जाएंगे।
• सरकारी और प्राइवेट कॉलेज के साथ 12 वीं पास कोई भी विद्यार्थी प्रवेश ले सकेगा।`
            },

            // Page 8 (Idx 7)
            {
                type: 'content',
                text: `# आर्थिक विकास व समझौते

## 🔶 राजस्थान का पहला "आर्बिट्रेशन एवं मेडिएशन सेंटर"
• **स्थान** :- विधिक सेवा सदन, जयपुर
• **उद्घाटन** :- सुप्रीम कोर्ट के न्यायाधीश संदीप मेहता, राजस्थान हाई कोर्ट के कार्यवाहक मुख्य न्यायाधीश संजीव प्रकाश शर्मा ने किया।

## 🔶 नक्षत्र वाटिका और हर्बल वाटिका का उद्घाटन
• **स्थान** :- विधानसभा परिसर, जयपुर
• **उद्घाटन** :- 5 मई 2026, विधानसभा अध्यक्ष वासुदेव देवनानी द्वारा 5 राज्यों के स्पीकर्स के साथ।

## 🔶 रावतभाटा परमाणु संयंत्र: ईंधन में आत्मनिर्भरता
• **स्थान**: रावतभाटा (कोटा)।
• एशिया के सबसे बड़े न्यूक्लियर फ्यूल कॉम्प्लेक्स (NFC) ने 140 यूरेनियम फ्यूल बंडल की पहली बड़ी खेप राजस्थान परमाणु बिजलीघर को सौंपी है।
• **महत्व**: अब रावतभाटा की 7वीं और 8वीं इकाई (प्रत्येक 700 मेगावाट क्षमता) को ईंधन के लिए हैदराबाद पर निर्भर नहीं रहना पड़ेगा।`
            },

            // Page 9 (Idx 8)
            {
                type: 'content',
                text: `# चर्चित व्यक्तित्व

## 🔶 ऋषभ पारेख (संस्कृत व्याकरण विशेषज्ञ)
• जयपुर के ऋषभ पारेख को गुजरात के शंखेश्वर जैन तीर्थ में **'सिद्धहेमव्याकरण रत्न'** से सम्मानित किया गया है।
• उन्हें स्वर्ण मुद्रिका और 1 लाख रुपये का नकद पुरस्कार मिला।

## 🔶 डॉ. राजानन्द शास्त्री
• प्रसिद्ध ज्योतिषाचार्य और उनके अद्भुत शोध कार्य।
• ज्योतिष के क्षेत्र में 'पितृ दोष निवारण अभियान' के उल्लेखनीय कार्यों के लिए इनका नाम **'WORLD BOOK OF RECORDS'** में दर्ज किया गया है।

## 🔶 मनोज सेवानी (जयपुर)
• **सम्मान**: यूनाइटेड अमेरिका यूनिवर्सिटी द्वारा 'डॉक्टरेट' की मानद उपाधि से सम्मानित।
• **प्रदानकर्ता**: पूर्व केंद्रीय मंत्री मानवेंद्र सिंह द्वारा यह सम्मान दिया गया।`
            },

            // Page 10 (Idx 9)
            {
                type: 'content',
                text: `# पुरस्कार

## 🔶 नेशनल आइकॉन अवार्ड-2026
• राजस्थान के बूंदी निवासी **हरप्रीत कपूर** को राष्ट्रीय नारी सशक्तिकरण संघ द्वारा प्रतिष्ठित "नेशनल आइकॉन अवार्ड-2026" से सम्मानित किया गया।
• यह सम्मान जयपुर में आयोजित समारोह में सांसद मंजू शर्मा एवं सांसद दर्शन सिंह चौधरी द्वारा प्रदान किया गया।

## 🔶 मेघा सोनी को राष्ट्रीय रत्न सम्मान 2026
• जयपुर की मेघा सोनी को राष्ट्रीय रत्न सम्मान- 2026 से सम्मानित किया गया।
• मेघा को यह सम्मान नई दिल्ली स्थित भारत मंडपम में आयोजित समारोह में दिया गया।
• लग्जरी सिल्वर ज्वैलरी ब्रांड श्रेणी में उत्कृष्ट योगदान के लिए उन्हें यह प्रतिष्ठित सम्मान प्रदान किया गया।`
            }
        ];

        lastPageData = {
            title: 'THANK YOU',
            subtitle: 'Samyak',
            tagline: 'कोचिंग नहीं क्रांति'
        };

        activePageIndex = 0;
        contentFontSize = 13.5;
        fontSizeValSpan.textContent = `13.5px`;
        document.documentElement.style.setProperty('--content-font-size', `13.5px`);
        // Reset dynamic spacing options
        globalFontStyleSelect.value = 'modern-sans';
        globalFontWeightSelect.value = '700';
        globalLineSpacingSelect.value = '1.45';
        globalLetterSpacingSelect.value = '0px';
        
        document.documentElement.style.setProperty('--content-font-weight', '700');
        document.documentElement.style.setProperty('--content-line-height', '1.45');
        document.documentElement.style.setProperty('--content-letter-spacing', '0px');
        
        document.body.classList.remove('font-poppins-sans', 'font-traditional-serif', 'font-hybrid-style');
        
        // Reset Watermark settings in UI
        watermarkTypeSelect.value = 'none';
        watermarkSettings.type = 'none';
        watermarkSettings.imageSrc = '';
        watermarkSettings.text = 'Samyak';
        watermarkTextInput.value = 'Samyak';
        watermarkPositionSelect.value = 'center';
        watermarkSettings.position = 'center';
        watermarkRotationSelect.value = '-45';
        watermarkSettings.rotation = '-45';
        watermarkOpacitySlider.value = '15';
        watermarkOpacityVal.textContent = '15%';
        watermarkSettings.opacity = 0.15;
        watermarkSizeSlider.value = '60';
        watermarkSizeVal.textContent = '60px';
        watermarkSettings.size = 60;
        watermarkColorInput.value = '#000000';
        watermarkSettings.color = '#000000';

        watermarkTextGroup.style.display = 'none';
        watermarkColorGroup.style.display = 'none';
        watermarkImageGroup.style.display = 'none';

        // Reset End Page Settings
        lastTitleInput.value = 'THANK YOU';
        lastSubtitleInput.value = 'Samyak';
        lastTaglineInput.value = 'कोचिंग नहीं क्रांति';

        // Reset Custom Design Settings in UI and State
        designSectionSize.value = '18';
        designSectionSizeVal.textContent = '18px';
        document.documentElement.style.setProperty('--custom-section-size', '18px');
        document.documentElement.style.setProperty('--custom-section-text', '#ffffff');
        designSectionText.value = '#ffffff';
        customDesignSettings.sectionAlignment = 'left';
        if (designSectionAlign) {
            designSectionAlign.value = 'left';
        }
        customDesignSettings.sectionShape = 'rectangle';
        if (designSectionShape) {
            designSectionShape.value = 'rectangle';
        }

        designTopicSize.value = '15';
        designTopicSizeVal.textContent = '15px';
        document.documentElement.style.setProperty('--custom-topic-size', '15px');
        designTopicThick.value = '1.5';
        designTopicThickVal.textContent = '1.5px';
        document.documentElement.style.setProperty('--custom-topic-border-thickness', '1.5px');
        designTopicBorderStyle.value = 'dashed';
        document.documentElement.style.setProperty('--custom-topic-border-style', 'dashed');
        designTopicMargin.value = '4px 2px';
        document.documentElement.style.setProperty('--custom-topic-margin-top', '4px');
        document.documentElement.style.setProperty('--custom-topic-margin-bottom', '2px');
        customDesignSettings.topicMarginTop = '4px';
        customDesignSettings.topicMarginBottom = '2px';
        designTopicAlign.value = 'flex-start';
        document.documentElement.style.setProperty('--custom-topic-alignment', 'flex-start');
        customDesignSettings.topicAlignment = 'flex-start';
        customDesignSettings.topicIcon = 'orange-diamond';
        if (designTopicIcon) {
            designTopicIcon.value = 'orange-diamond';
        }
        customDesignSettings.bulletStyle = 'classic';
        if (designBulletStyle) {
            designBulletStyle.value = 'classic';
        }

        customDesignSettings.chapterNumSize = '30';
        customDesignSettings.chapterTitleSize = '20';
        customDesignSettings.chapterSubSize = '15';
        if (designChapterNumSize) {
            designChapterNumSize.value = '30';
            if (designChapterNumSizeVal) designChapterNumSizeVal.textContent = '30px';
        }
        if (designChapterTitleSize) {
            designChapterTitleSize.value = '20';
            if (designChapterTitleSizeVal) designChapterTitleSizeVal.textContent = '20px';
        }
        if (designChapterSubtitleSize) {
            designChapterSubtitleSize.value = '15';
            if (designChapterSubtitleSizeVal) designChapterSubtitleSizeVal.textContent = '15px';
        }
        document.documentElement.style.setProperty('--custom-chapter-num-size', '30px');
        document.documentElement.style.setProperty('--custom-chapter-title-size', '20px');
        document.documentElement.style.setProperty('--custom-chapter-subtitle-size', '15px');

        designBorderThick.value = '0';
        designBorderThickVal.textContent = '0px';
        document.documentElement.style.setProperty('--custom-inner-border-thickness', '0px');
        designCornerSize.value = '10';
        designCornerSizeVal.textContent = '10px';
        document.documentElement.style.setProperty('--custom-corner-size', '10px');

        designPageNumPlace.value = 'bottom-center';
        customDesignSettings.pageNumPlacement = 'bottom-center';
        designPageNumPrefix.value = 'पेज - ';
        customDesignSettings.pageNumPrefix = 'पेज - ';
        designPageNumSize.value = '15';
        designPageNumSizeVal.textContent = '15px';
        customDesignSettings.pageNumSize = '15';

        // Reset Two-column divider settings
        customDesignSettings.dividerColor = '';
        customDesignSettings.dividerStyle = 'dashed';
        customDesignSettings.dividerThickness = '1.5';
        designDividerColor.value = '#c5a353';
        designDividerStyle.value = 'dashed';
        designDividerThick.value = '1.5';
        designDividerThickVal.textContent = '1.5px';
        document.documentElement.style.setProperty('--custom-divider-color', 'var(--secondary-color)');
        document.documentElement.style.setProperty('--custom-divider-style', 'dashed');
        document.documentElement.style.setProperty('--custom-divider-thickness', '1.5px');

        // Reset End Star Divider settings
        customDesignSettings.endStarSymbol = '✦';
        customDesignSettings.endStarColor = '';
        customDesignSettings.endStarSize = '18';
        customDesignSettings.endStarPulse = true;
        designEndStarSymbol.value = '✦';
        designEndStarColor.value = '#c5a353';
        designEndStarSize.value = '18';
        designEndStarSizeVal.textContent = '18px';
        designEndStarPulse.checked = true;
        document.documentElement.style.setProperty('--custom-end-star-color', 'var(--secondary-color)');
        document.documentElement.style.setProperty('--custom-end-star-size', '18px');
        document.documentElement.style.setProperty('--custom-end-star-animation', 'pulseStar 3s ease-in-out infinite');
        document.documentElement.style.setProperty('--custom-end-star-shadow', 'rgba(197, 162, 83, 0.35)');

        customDesignSettings.showCoverTOC = true;
        customDesignSettings.headerLogoSrc = '';
        if (headerLogoFileInput) headerLogoFileInput.value = '';
        if (headerLogoPreview) headerLogoPreview.src = '';
        if (headerLogoPreviewGroup) headerLogoPreviewGroup.style.display = 'none';

        // Reset social settings
        socialSettings = {
            telegramText: '',
            youtubeText: '',
            fontSize: 11,
            placement: 'split'
        };
        if (footerTelegramInput) footerTelegramInput.value = '';
        if (footerYoutubeInput) footerYoutubeInput.value = '';
        if (footerSocialSizeInput) footerSocialSizeInput.value = 11;
        if (footerSocialSizeVal) footerSocialSizeVal.textContent = '11px';
        if (footerSocialPlacementSelect) footerSocialPlacementSelect.value = 'split';

        localStorage.setItem('samyak-global-theme', pagesData[0].theme);
        applyTheme(pagesData[0].theme, true); // Automatically syncs colors via syncDesignControlsWithTheme()

        renderPreview();
        switchActivePage(0);
        switchSidebarTab('panel-pages');
    }

    // ==========================================================================
    // 9. CLICK-TO-EDIT SYNC (INSPECTOR)
    // ==========================================================================
    function cleanTextForSearch(text) {
        if (!text) return '';
        // Remove leading/trailing formatting characters, bullets, and emojis
        return text
            .replace(/^[🔶🔷🔸🔹♦️💎•●■▪▫\-\*\u2022\u25CF\u25AA\u25AB\s]+/u, '')
            .trim();
    }

    function findTextIndexInMarkdown(markdown, searchStr) {
        if (!markdown || !searchStr) return -1;
        
        // Clean search text to alphanumeric/Devanagari characters, cap at 40 chars for precision matching
        const cleanSearch = searchStr.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '').trim().substring(0, 40);
        if (!cleanSearch) return -1;

        let cleanMarkdown = "";
        let indexMap = [];
        
        for (let i = 0; i < markdown.length; i++) {
            const char = markdown[i];
            if (/[a-zA-Z0-9\u0900-\u097F]/.test(char)) {
                cleanMarkdown += char;
                indexMap.push(i);
            }
        }
        
        let cleanMatchIndex = cleanMarkdown.indexOf(cleanSearch);
        if (cleanMatchIndex === -1) {
            // Try matching a shorter 15 char sequence
            const shortSearch = cleanSearch.substring(0, 15);
            if (shortSearch.length >= 5) {
                cleanMatchIndex = cleanMarkdown.indexOf(shortSearch);
                if (cleanMatchIndex !== -1) {
                    const start = indexMap[cleanMatchIndex];
                    const end = indexMap[cleanMatchIndex + shortSearch.length - 1] + 1;
                    return { start, end };
                }
            }
            return -1;
        }
        
        const start = indexMap[cleanMatchIndex];
        const end = indexMap[cleanMatchIndex + cleanSearch.length - 1] + 1;
        return { start, end };
    }

    pagesContainer.addEventListener('click', (e) => {
        // Find containing A4 page
        const pageEl = e.target.closest('.a4-page');
        if (!pageEl) return;

        const pageNum = parseInt(pageEl.getAttribute('data-page'), 10);
        if (isNaN(pageNum)) return;

        // 1. Cover Page Redirect
        if (pageNum === 1) {
            switchActivePage(0);
            if (e.target.closest('.cover-title')) {
                docTitleInput.focus();
                docTitleInput.select();
            } else if (e.target.closest('.cover-tagline-box')) {
                docTaglineInput.focus();
                docTaglineInput.select();
            } else if (e.target.closest('.cover-subtitle')) {
                docSubtitleInput.focus();
                docSubtitleInput.select();
            } else {
                docTitleInput.focus();
            }
            return;
        }

        // 2. Star Divider click is handled naturally as a content page element

        // 3. Content Pages Redirect & Substring Sync Highlight
        // Switch editing panel to corresponding content page
        switchActivePage(pageNum - 1);

        // Find the specific container block that was clicked
        const targetBlock = e.target.closest('.section-heading-bar, .topic-container, .bullet-item, .highlight-box, .inserted-image-container, .markdown-table, p.body-text');
        if (!targetBlock) return;

        // Special handling for Images
        if (targetBlock.classList.contains('inserted-image-container')) {
            const imgEl = targetBlock.querySelector('img');
            if (imgEl) {
                const src = imgEl.getAttribute('src');
                let key = null;
                for (const k in uploadedImages) {
                    if (uploadedImages[k] === src) {
                        key = k;
                        break;
                    }
                }
                const searchKey = key || src;
                const index = pageContentInput.value.indexOf(searchKey);
                if (index !== -1) {
                    const startOfLine = pageContentInput.value.lastIndexOf('\n', index) + 1;
                    const endOfLine = pageContentInput.value.indexOf('\n', index);
                    const endPos = endOfLine === -1 ? pageContentInput.value.length : endOfLine;
                    pageContentInput.focus();
                    pageContentInput.setSelectionRange(startOfLine, endPos);
                    
                    const textBefore = pageContentInput.value.substring(0, startOfLine);
                    const linesBefore = textBefore.split('\n').length - 1;
                    const estimatedLineHeight = parseFloat(window.getComputedStyle(pageContentInput).lineHeight) || 22.4;
                    pageContentInput.scrollTop = Math.max(0, (linesBefore * estimatedLineHeight) - (pageContentInput.clientHeight / 2));
                }
            }
            return;
        }

        // Standard text elements: headings, bullets, paragraphs, tables
        let targetText = targetBlock.textContent;
        if (targetBlock.classList.contains('markdown-table')) {
            // Find specific table cell clicked for precision
            const cell = e.target.closest('td, th');
            if (cell) {
                targetText = cell.textContent;
            }
        }

        const searchText = cleanTextForSearch(targetText);
        const range = findTextIndexInMarkdown(pageContentInput.value, searchText);
        if (range && range !== -1) {
            pageContentInput.focus();
            pageContentInput.setSelectionRange(range.start, range.end);
            
            // Scroll textarea to the line
            const textBefore = pageContentInput.value.substring(0, range.start);
            const linesBefore = textBefore.split('\n').length - 1;
            const estimatedLineHeight = parseFloat(window.getComputedStyle(pageContentInput).lineHeight) || 22.4;
            pageContentInput.scrollTop = Math.max(0, (linesBefore * estimatedLineHeight) - (pageContentInput.clientHeight / 2));
        }
    });

    // ==========================================================================
    // 10. DRAGGABLE SIDEBAR RESIZER
    // ==========================================================================
    const editorPanel = document.querySelector('.editor-panel');
    const resizeHandle = document.getElementById('sidebar-resize-handle');
    let isResizing = false;

    if (resizeHandle && editorPanel) {
        // Load saved width from localStorage if present
        const savedWidth = localStorage.getItem('editor_panel_width');
        if (savedWidth) {
            editorPanel.style.width = savedWidth;
        }

        // Toggle Sidebar Drawer Handle Button
        const toggleBtn = document.getElementById('sidebar-toggle-btn');
        if (toggleBtn) {
            const toggleSidebar = (forceState = null) => {
                const willCollapse = forceState !== null ? forceState : !editorPanel.classList.contains('collapsed');
                if (willCollapse) {
                    editorPanel.classList.add('collapsed');
                    toggleBtn.textContent = '▶';
                    toggleBtn.setAttribute('title', 'Expand Sidebar');
                    resizeHandle.style.cursor = 'default';
                } else {
                    editorPanel.classList.remove('collapsed');
                    toggleBtn.textContent = '◀';
                    toggleBtn.setAttribute('title', 'Collapse Sidebar');
                    resizeHandle.style.cursor = 'col-resize';
                }
                localStorage.setItem('sidebar_collapsed', willCollapse ? 'true' : 'false');
                
                // Force preview recalculation & scroll containment re-measure
                cachedMaxContentHeight = null;
                renderPreview();
            };

            // Prevent drag-resize on button interactions
            toggleBtn.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });
            toggleBtn.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            });

            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSidebar();
            });

            // Initialize saved collapse state
            const savedCollapsed = localStorage.getItem('sidebar_collapsed');
            if (savedCollapsed === 'true') {
                editorPanel.classList.add('collapsed');
                toggleBtn.textContent = '▶';
                toggleBtn.setAttribute('title', 'Expand Sidebar');
                resizeHandle.style.cursor = 'default';
            }
        }

        resizeHandle.addEventListener('mousedown', (e) => {
            if (editorPanel.classList.contains('collapsed')) return; // Disable resizing when collapsed!
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            resizeHandle.classList.add('resizing');
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            // Bound the panel resizing width to maximize editor space without showing horizontal scrollbar in A4 preview
            const maxAllowedWidth = Math.max(380, window.innerWidth - 860);
            const newWidth = Math.max(380, Math.min(maxAllowedWidth, e.clientX));
            editorPanel.style.width = `${newWidth}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                resizeHandle.classList.remove('resizing');
                document.body.style.userSelect = '';
                // Persist user selected panel width
                localStorage.setItem('editor_panel_width', editorPanel.style.width);
            }
        });
    }

    // ==========================================================================
    // 11. DRAG-AND-DROP BLOCK REORDERING LOGIC
    // ==========================================================================
    let draggedBlockId = null;

    pagesContainer.addEventListener('dragstart', (e) => {
        const target = e.target.closest('[data-block-id]');
        if (target) {
            draggedBlockId = parseInt(target.getAttribute('data-block-id'), 10);
            e.dataTransfer.setData('text/plain', draggedBlockId);
            target.classList.add('dragging-block');
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    pagesContainer.addEventListener('dragend', (e) => {
        const target = e.target.closest('[data-block-id]');
        if (target) {
            target.classList.remove('dragging-block');
        }
        document.querySelectorAll('[data-block-id]').forEach(el => {
            el.classList.remove('drag-hover-before', 'drag-hover-after');
        });
        draggedBlockId = null;
    });

    function getClosestBlock(pageContent, clientX, clientY) {
        const children = pageContent.querySelectorAll('[data-block-id]');
        let closestNode = null;
        let minDistance = Infinity;

        children.forEach(child => {
            const rect = child.getBoundingClientRect();
            // Calculate distance to the closest point of the bounding box of the child
            const px = Math.max(rect.left, Math.min(clientX, rect.right));
            const py = Math.max(rect.top, Math.min(clientY, rect.bottom));

            const dx = clientX - px;
            const dy = clientY - py;
            const distance = dx * dx + dy * dy;

            if (distance < minDistance) {
                minDistance = distance;
                closestNode = child;
            }
        });

        return closestNode;
    }

    pagesContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const pageContent = e.target.closest('.page-content');
        if (!pageContent || draggedBlockId === null) return;

        const target = getClosestBlock(pageContent, e.clientX, e.clientY);
        if (target) {
            const dropBlockId = parseInt(target.getAttribute('data-block-id'), 10);
            if (draggedBlockId === dropBlockId) return;

            // Remove drag hover classes from all other blocks
            document.querySelectorAll('[data-block-id]').forEach(el => {
                if (el !== target) {
                    el.classList.remove('drag-hover-before', 'drag-hover-after');
                }
            });

            const rect = target.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            e.dataTransfer.dropEffect = 'move';

            if (e.clientY < midpoint) {
                target.classList.add('drag-hover-before');
                target.classList.remove('drag-hover-after');
            } else {
                target.classList.add('drag-hover-after');
                target.classList.remove('drag-hover-before');
            }
        }
    });

    pagesContainer.addEventListener('dragleave', (e) => {
        const target = e.target.closest('[data-block-id]');
        if (target) {
            target.classList.remove('drag-hover-before', 'drag-hover-after');
        }
    });

    pagesContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const pageContent = e.target.closest('.page-content');
        if (!pageContent || draggedBlockId === null) return;

        const target = getClosestBlock(pageContent, e.clientX, e.clientY);
        if (target) {
            const dropBlockId = parseInt(target.getAttribute('data-block-id'), 10);
            if (draggedBlockId === dropBlockId) return;

            const isBefore = target.classList.contains('drag-hover-before');
            target.classList.remove('drag-hover-before', 'drag-hover-after');

            reorderMarkdownBlocks(draggedBlockId, dropBlockId, isBefore);
        }
    });

    function reorderMarkdownBlocks(draggedId, dropId, isBefore) {
        saveCurrentInputState(); // capture latest values
        
        // 1. Get unified content markdown
        const fullContent = pagesData.slice(1).map(p => p.text).join('\n');
        
        // 2. Parse into blocks
        const blocks = parseTextToBlocks(fullContent);
        
        
        // Assign original IDs to match drag states
        blocks.forEach((b, idx) => {
            b.id = idx;
        });
        
        // 3. Find the block objects
        const draggedBlockIndex = blocks.findIndex(b => b.id === draggedId);
        if (draggedBlockIndex === -1) return;
        
        const [draggedBlock] = blocks.splice(draggedBlockIndex, 1);
        
        const dropBlockIndex = blocks.findIndex(b => b.id === dropId);
        if (dropBlockIndex === -1) return;
        
        const insertIndex = isBefore ? dropBlockIndex : dropBlockIndex + 1;
        blocks.splice(insertIndex, 0, draggedBlock);
        
        // 4. Join back to single markdown string
        const newMarkdown = blocks.map(b => b.markdown).join('\n');
        
        // 5. Update pagesData content pages with this unified markdown, preserving all layouts
        const cover = pagesData[0];
        const layouts = pagesData.slice(1).map(p => p.layout || 'single');
        if (layouts.length === 0) {
            layouts.push('single');
        }
        const newPages = layouts.map((lay, idx) => ({
            type: 'content',
            text: (idx === 0) ? newMarkdown : '',
            layout: lay
        }));
        pagesData = [cover, ...newPages];
        
        // 6. Run preview to reflow, paginate and save
        renderPreview();
        saveWorkspaceToLocalStorage();
    }


    // Clear height cache on window resize
    window.addEventListener('resize', () => {
        cachedMaxContentHeight = null;
    });

    // 8. INITIALIZE WORKSPACE ON LAUNCH
    loadWorkspaceFromLocalStorage().then(loaded => {
        if (!loaded) {
            clearWorkspaceContent();
        }
        updateZoom();
    }).catch(err => {
        console.error("Error during startup workspace load:", err);
        clearWorkspaceContent();
        updateZoom();
    });

    // ==========================================================================
    // CUSTOM SEARCHABLE AND PINNABLE THEME DROPDOWN SYSTEM
    // ==========================================================================
    (() => {
        const trigger = document.getElementById('theme-menu-trigger');
        const dropdown = document.getElementById('custom-theme-dropdown');
        const searchInput = document.getElementById('theme-search-input');
        const listContainer = dropdown.querySelector('.theme-list-container');
        const nativeSelect = document.getElementById('doc-theme');

        // All defined themes with their respective preview colors (Primary, Secondary, Accent)
        const themes = [
            { value: 'maroon-gold', name: 'Samyak Maroon & Gold', category: 'classic', colors: ['#850f0f', '#c5a353', '#1d6ea5'] },
            { value: 'royal-navy', name: 'Royal Navy & Gold', category: 'classic', colors: ['#0e2743', '#c49429', '#be2e2e'] },
            { value: 'emerald-cream', name: 'Emerald Forest & Cream', category: 'classic', colors: ['#083c2a', '#b77a20', '#2b6cb0'] },
            { value: 'midnight-gold', name: 'Midnight Slate & Gold', category: 'classic', colors: ['#151b26', '#c99324', '#2b8c8a'] },
            { value: 'minimal-compact', name: 'Samyak Minimal', category: 'classic', colors: ['#1e293b', '#94a3b8', '#6366f1'] },
            { value: 'sakura-plum', name: '🌸 Sakura Blossom & Plum', category: 'classic', colors: ['#5c1d3b', '#f472b6', '#be185d'] },
            { value: 'nordic-rust', name: '🌲 Nordic Forest & Warm Rust', category: 'classic', colors: ['#064e3b', '#c2410c', '#b45309'] },
            { value: 'cyber-teal', name: '⚡ Cyber Midnight & Glowing Cyan', category: 'classic', colors: ['#0f172a', '#06b6d4', '#3b82f6'] },
            { value: 'crimson-luxury', name: '🍷 Crimson Premium & Platinum', category: 'classic', colors: ['#991b1b', '#4b5563', '#dc2626'] },
            { value: 'vintage-bronze', name: '🏺 Antique Amber & Rich Bronze', category: 'classic', colors: ['#451a03', '#d97706', '#b45309'] },
            { value: 'lavender-dusk', name: '🔮 Lavender Dusk & Royal Indigo', category: 'classic', colors: ['#1e1b4b', '#a78bfa', '#6d28d9'] },
            { value: 'sand-espresso', name: '☕ Golden Sand & Rich Espresso', category: 'classic', colors: ['#271a15', '#c5a880', '#8a5e38'] },

            { value: 'mono-classic', name: '🖨️ Mono High Contrast (Ink-Saver)', category: 'print', colors: ['#111111', '#6b7280', '#000000'] },
            { value: 'print-navy', name: '🖨️ Elegant Print Navy (Ink-Saver)', category: 'print', colors: ['#0f172a', '#64748b', '#1e3a8a'] },
            { value: 'print-teal', name: '🖨️ Professional Print Teal (Ink-Saver)', category: 'print', colors: ['#115e59', '#4b5563', '#0f766e'] },
            { value: 'print-burgundy', name: '🖨️ Deep Print Burgundy (Ink-Saver)', category: 'print', colors: ['#581c25', '#881337', '#701a2c'] },

            { value: 'cyber-synth', name: '🔮 Morphing Cyber Synthwave', category: 'morphing', colors: ['#0c0721', '#ff007f', '#00f0ff'] },
            { value: 'origami-slate', name: '📐 Morphing Modern Origami', category: 'morphing', colors: ['#1e293b', '#94a3b8', '#0f766e'] },
            { value: 'royal-durbar', name: '👑 Lokbandhu Official', category: 'morphing', colors: ['#7a3109', '#de790f', '#b85d08'] },
            { value: 'emerald-empire', name: '🔱 Morphing Emerald Empire', category: 'morphing', colors: ['#064e3b', '#d97706', '#059669'] },
            { value: 'gothic-velvet', name: '🏰 Morphing Gothic Velvet', category: 'morphing', colors: ['#2e1065', '#b45309', '#db2777'] },
            { value: 'kyoto-zen', name: '⛩️ Morphing Kyoto Zen', category: 'morphing', colors: ['#991b1b', '#fbcfe8', '#4b5563'] },

            // 10 Brand New Ultra-Premium Shape-Shifting Themes
            { value: 'lokbandhu-surya', name: '🌅 Lokbandhu Surya Sandhya', category: 'ultra-premium', colors: ['#8c1d1d', '#f59e0b', '#c2410c'] },
            { value: 'lokbandhu-madhu', name: '🍯 Lokbandhu Madhu-Keshara', category: 'ultra-premium', colors: ['#78350f', '#f97316', '#eab308'] },
            { value: 'lokbandhu-agni', name: '🔥 Lokbandhu Agni-Tejas', category: 'ultra-premium', colors: ['#3b160b', '#ea580c', '#d97706'] },
            { value: 'lokbandhu-chandan', name: '🪵 Lokbandhu Chandan-Kastha', category: 'ultra-premium', colors: ['#5c3a21', '#c29b53', '#855a30'] },
            { value: 'gothic-royal', name: '🏰 Gothic Royal Black', category: 'ultra-premium', colors: ['#4a0e17', '#b8860b', '#1a1a1a'] },
            { value: 'kyoto-ink', name: '⛩️ Zen Kyoto & Ink', category: 'ultra-premium', colors: ['#111111', '#b22222', '#cda557'] },
            { value: 'athenian-gold', name: '🏛️ Athenian Temple Gold', category: 'ultra-premium', colors: ['#0b2240', '#c5a059', '#4a5d3e'] },
            { value: 'autumn-vintage', name: '🍁 Warm Autumn Vintage', category: 'ultra-premium', colors: ['#5c2e16', '#d48227', '#1a4329'] },
            { value: 'maharaja-gold', name: '👑 Maharaja Palace Gold', category: 'ultra-premium', colors: ['#800020', '#e6a100', '#008080'] },
            { value: 'victorian-prestige', name: '⚜️ Baroque Victorian Prestige', category: 'ultra-premium', colors: ['#004743', '#a3761a', '#8b1e3f'] },
            { value: 'neo-gothic', name: '⚡ Neo-Gothic Obsidian', category: 'ultra-premium', colors: ['#1a1a1a', '#e8a838', '#ab4b3c'] },
            { value: 'royal-sapphire', name: '💎 Royal Sapphire Luxury', category: 'ultra-premium', colors: ['#0f2b5c', '#d4af37', '#5c6b73'] },
            { value: 'jade-emperor', name: '🐉 Imperial Jade Emperor', category: 'ultra-premium', colors: ['#0c3d2e', '#d4af37', '#5a8f7b'] },
            { value: 'vintage-oasis', name: '🌴 Sun-Drenched Vintage Oasis', category: 'ultra-premium', colors: ['#8a4b2d', '#c9a25d', '#3a5f43'] },
            { value: 'diamond-column', name: '💎 Diamond Column Premium', category: 'ultra-premium', colors: ['#0f172a', '#3b82f6', '#64748b'] },
            { value: 'theme-raaz', name: '🔥 RAAZ Ultimate Premium', category: 'ultra-premium', colors: ['#0a0a0a', '#d4af37', '#800020'] },
            // Coaching Brand Presets as First-Class Themes
            { value: 'coaching-samyak', name: '🏫 Coaching: Samyak Maroon & Gold', category: 'classic', colors: ['#850f0f', '#c5a353', '#ffffff'] },
            { value: 'coaching-springboard', name: '🏫 Coaching: Springboard Navy', category: 'classic', colors: ['#1d6ea5', '#a0a0a0', '#ffffff'] },
            { value: 'coaching-utkarsh', name: '🏫 Coaching: Utkarsh Green', category: 'classic', colors: ['#0d7a5f', '#f47c20', '#ffffff'] },
            { value: 'coaching-vision', name: '🏫 Coaching: Vision IAS Gray', category: 'classic', colors: ['#2b2d42', '#8d99ae', '#ffffff'] },
            { value: 'coaching-drishti', name: '🏫 Coaching: Drishti IAS Saffron', category: 'classic', colors: ['#b83a14', '#d4af37', '#ffffff'] }
        ];

        // Load pinned themes from localStorage
        let pinnedList = JSON.parse(localStorage.getItem('samyak-pinned-themes') || '["maroon-gold", "royal-durbar"]');
        let deletedThemeList = JSON.parse(localStorage.getItem('samyak-deleted-themes') || '[]');

        function savePinnedThemes() {
            localStorage.setItem('samyak-pinned-themes', JSON.stringify(pinnedList));
        }

        function saveDeletedThemes() {
            localStorage.setItem('samyak-deleted-themes', JSON.stringify(deletedThemeList));
        }

        // Render the dropdown panel list dynamically
        function renderDropdownList(searchQuery = '') {
            listContainer.innerHTML = '';
            const query = searchQuery.trim().toLowerCase();

            // Filter out deleted themes
            const visibleThemes = themes.filter(t => !deletedThemeList.includes(t.value));

            // 1. Group pinned themes together at the very top!
            const pinnedObjects = visibleThemes.filter(t => pinnedList.includes(t.value));
            const filteredPinned = pinnedObjects.filter(t => t.name.toLowerCase().includes(query));

            if (filteredPinned.length > 0) {
                const section = createSectionElement('📌 Pinned Themes', filteredPinned);
                listContainer.appendChild(section);
            }

            // 2. Classify other themes by categories
            const categories = [
                { id: 'ultra-premium', name: '👑 Ultra-Premium Shape-Shifting' },
                { id: 'morphing', name: '🎭 Shape-Morphing Themes' },
                { id: 'print', name: '🖨️ Print-Friendly Themes' },
                { id: 'classic', name: '✨ Classic Themes' }
            ];

            categories.forEach(cat => {
                const catThemes = visibleThemes.filter(t => t.category === cat.id && !pinnedList.includes(t.value));
                const filteredCatThemes = catThemes.filter(t => t.name.toLowerCase().includes(query));

                if (filteredCatThemes.length > 0) {
                    const section = createSectionElement(cat.name, filteredCatThemes);
                    listContainer.appendChild(section);
                }
            });

            // If absolutely nothing matches the query
            if (listContainer.children.length === 0) {
                const noResult = document.createElement('div');
                noResult.className = 'theme-group-title';
                noResult.style.textAlign = 'center';
                noResult.style.padding = '20px 10px';
                noResult.style.border = 'none';
                noResult.textContent = '❌ No themes found';
                listContainer.appendChild(noResult);
            }
        }

        function createSectionElement(title, items) {
            const section = document.createElement('div');
            section.className = 'theme-group-section';

            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'theme-group-title';
            sectionTitle.textContent = title;
            section.appendChild(sectionTitle);

            items.forEach(theme => {
                const item = document.createElement('div');
                item.className = 'theme-item';
                if (nativeSelect.value === theme.value) {
                    item.classList.add('active');
                }
                item.setAttribute('data-theme', theme.value);

                // Preview dots
                const dots = document.createElement('div');
                dots.className = 'theme-dots';
                theme.colors.forEach(col => {
                    const dot = document.createElement('span');
                    dot.className = 'theme-dot';
                    dot.style.backgroundColor = col;
                    dots.appendChild(dot);
                });
                item.appendChild(dots);

                // Name
                const name = document.createElement('span');
                name.className = 'theme-name';
                name.textContent = theme.name;
                item.appendChild(name);

                // Pin button
                const pinBtn = document.createElement('button');
                pinBtn.className = 'theme-pin-btn';
                if (pinnedList.includes(theme.value)) {
                    pinBtn.classList.add('pinned');
                }
                pinBtn.textContent = '📌';
                pinBtn.setAttribute('data-theme-id', theme.value);
                pinBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    togglePinTheme(theme.value);
                });
                item.appendChild(pinBtn);

                // Delete button
                const delBtn = document.createElement('button');
                delBtn.className = 'theme-del-btn';
                delBtn.textContent = '🗑️';
                delBtn.title = 'Delete this theme';
                delBtn.style.background = 'none';
                delBtn.style.border = 'none';
                delBtn.style.cursor = 'pointer';
                delBtn.style.fontSize = '12px';
                delBtn.style.opacity = '0.4';
                delBtn.style.marginLeft = '4px';
                delBtn.style.transition = 'opacity 0.2s';
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to hide the theme "${theme.name}"?`)) {
                        deletedThemeList.push(theme.value);
                        saveDeletedThemes();
                        renderDropdownList(searchInput.value);
                    }
                });
                delBtn.addEventListener('mouseenter', () => delBtn.style.opacity = '1');
                delBtn.addEventListener('mouseleave', () => delBtn.style.opacity = '0.4');
                item.appendChild(delBtn);

                // Select Theme Action on click
                item.addEventListener('click', () => {
                    selectTheme(theme.value);
                });

                section.appendChild(item);
            });

            return section;
        }

        function togglePinTheme(themeValue) {
            const idx = pinnedList.indexOf(themeValue);
            if (idx > -1) {
                pinnedList.splice(idx, 1);
            } else {
                pinnedList.push(themeValue);
            }
            savePinnedThemes();
            renderDropdownList(searchInput.value);
        }

        function selectTheme(themeValue) {
            nativeSelect.value = themeValue;
            nativeSelect.dispatchEvent(new Event('change'));
            dropdown.style.display = 'none';
        }

        // Toggle dropdown open/close
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.style.display === 'flex';
            if (isOpen) {
                dropdown.style.display = 'none';
            } else {
                // Close other panels if open
                dropdown.style.display = 'flex';
                searchInput.value = '';
                searchInput.focus();
                renderDropdownList();
            }
        });

        // Search filtering
        searchInput.addEventListener('input', () => {
            renderDropdownList(searchInput.value);
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== trigger) {
                dropdown.style.display = 'none';
            }
        });

        // Sync custom dropdown active highlight whenever nativeSelect is changed (e.g. workspace load)
        nativeSelect.addEventListener('change', () => {
            // Update active state in visual items
            const activeItems = listContainer.querySelectorAll('.theme-item');
            activeItems.forEach(item => {
                const themeVal = item.getAttribute('data-theme');
                if (themeVal === nativeSelect.value) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });

        // Initialize render
        renderDropdownList();
    })();

    // ==========================================================================
    // RAAZ PROFILE MODAL CONTROLLER & FIREWORKS
    // ==========================================================================
    const raazModal = document.getElementById('raaz-profile-modal');
    const authorNameBtn = document.getElementById('author-name-btn');
    const closeRaazModalBtn = document.getElementById('close-raaz-modal-btn');
    const closeRaazBtn = document.getElementById('close-raaz-btn');
    const fireworksCanvas = document.getElementById('raaz-fireworks-canvas');

    let isFireworksActive = false;
    let fireworksAnimationFrameId = null;

    function runFireworksSimulation() {
        if (!fireworksCanvas) return;
        const ctx = fireworksCanvas.getContext('2d');
        isFireworksActive = true;

        const resizeCanvas = () => {
            fireworksCanvas.width = fireworksCanvas.parentElement.clientWidth;
            fireworksCanvas.height = fireworksCanvas.parentElement.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let particles = [];
        let rockets = [];

        class Rocket {
            constructor() {
                // Shoot from sides of the screen to keep center (profile card) clear
                this.fromLeft = Math.random() < 0.5;
                this.x = this.fromLeft ? Math.random() * (fireworksCanvas.width * 0.2) : fireworksCanvas.width - Math.random() * (fireworksCanvas.width * 0.2);
                this.y = fireworksCanvas.height;
                
                this.targetY = fireworksCanvas.height * 0.15 + Math.random() * (fireworksCanvas.height * 0.4);
                this.targetX = this.fromLeft 
                    ? fireworksCanvas.width * 0.12 + Math.random() * (fireworksCanvas.width * 0.18) 
                    : fireworksCanvas.width * 0.7 + Math.random() * (fireworksCanvas.width * 0.18);
                
                const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
                const speed = 11 + Math.random() * 6;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                
                // Cyan/blue lightning theme colors
                this.color = Math.random() < 0.6 ? '#00f0ff' : (Math.random() < 0.5 ? '#38bdf8' : '#8b5cf6');
                this.trail = [];
            }

            update() {
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 6) this.trail.shift();
                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                ctx.beginPath();
                this.trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            shouldExplode() {
                return this.vy >= 0 || this.y <= this.targetY || (this.fromLeft ? this.x >= this.targetX : this.x <= this.targetX);
            }

            explode() {
                const count = 35 + Math.floor(Math.random() * 25);
                for (let i = 0; i < count; i++) {
                    particles.push(new Particle(this.x, this.y, this.color));
                }
            }
        }

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 1.5;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.008;
                this.gravity = 0.06;
            }

            update() {
                this.x += this.vx;
                this.vy += this.gravity;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1.5 + Math.random() * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        function animationLoop() {
            if (!isFireworksActive) return;
            
            // clear rect with slight transparency for trail effect
            ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

            if (Math.random() < 0.045 && rockets.length < 5) {
                rockets.push(new Rocket());
            }

            rockets.forEach((rocket, idx) => {
                rocket.update();
                rocket.draw();
                if (rocket.shouldExplode()) {
                    rocket.explode();
                    rockets.splice(idx, 1);
                }
            });

            particles.forEach((p, idx) => {
                p.update();
                p.draw();
                if (p.alpha <= 0) {
                    particles.splice(idx, 1);
                }
            });

            fireworksAnimationFrameId = requestAnimationFrame(animationLoop);
        }

        animationLoop();

        return () => {
            isFireworksActive = false;
            cancelAnimationFrame(fireworksAnimationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        };
    }

    let stopFireworksSimulation = null;

    if (authorNameBtn && raazModal) {
        authorNameBtn.addEventListener('click', (e) => {
            e.preventDefault();
            raazModal.classList.add('active');
            // Trigger fireworks on all devices
            if (stopFireworksSimulation) stopFireworksSimulation();
            stopFireworksSimulation = runFireworksSimulation();
        });

        const hideRaazModal = () => {
            raazModal.classList.remove('active');
            if (stopFireworksSimulation) {
                stopFireworksSimulation();
                stopFireworksSimulation = null;
            }
        };

        if (closeRaazModalBtn) closeRaazModalBtn.addEventListener('click', hideRaazModal);
        if (closeRaazBtn) closeRaazBtn.addEventListener('click', hideRaazModal);

        raazModal.addEventListener('click', (e) => {
            if (e.target === raazModal) {
                hideRaazModal();
            }
        });
    }

    // 100% Data Safety: Flush any pending unsaved work to IndexedDB instantly on page exit/reload/tab-switch
    window.addEventListener('beforeunload', () => {
        saveWorkspaceToLocalStorage();
    });
    window.addEventListener('pagehide', () => {
        saveWorkspaceToLocalStorage();
    });

    // ==========================================================================
    // SAMYAK PREMIUM MOBILE-FRIENDLY COLOR PICKER SYSTEM
    // ==========================================================================
    let activeColorInputTarget = null;
    const customColorPickerModal = document.getElementById('custom-color-picker-modal');
    const colorPickerPreviewBox = document.getElementById('color-picker-preview-box');
    const colorPickerHexInput = document.getElementById('color-picker-hex-input');
    const closeColorPickerBtn = document.getElementById('close-color-picker-btn');
    const applyCustomColorBtn = document.getElementById('apply-custom-color-btn');
    const colorPickerTitle = document.getElementById('color-picker-title');
    const swatchesGrid = customColorPickerModal ? customColorPickerModal.querySelector('.swatches-grid') : null;

    const samyakSwatches = [
        '#850F0F', '#C5A353', '#1D6EA5', '#083C2A',
        '#0F172A', '#0E2743', '#B45309', '#C2410C',
        '#FF007F', '#00F0FF', '#991B1B', '#271A15',
        '#5C1D3B', '#111111', '#4B5563', '#FFFFFF'
    ];

    if (customColorPickerModal && colorPickerPreviewBox && colorPickerHexInput) {
        // Intercept native color pickers
        const nativeColorInputs = document.querySelectorAll('input[type="color"]');
        nativeColorInputs.forEach(input => {
            input.addEventListener('click', (e) => {
                e.preventDefault();
                activeColorInputTarget = input;
                
                // Retrieve visual label
                let labelText = 'Pick Color';
                const parentItem = input.closest('.option-item');
                if (parentItem) {
                    const labelEl = parentItem.querySelector('label');
                    if (labelEl) labelText = labelEl.textContent.trim();
                }
                colorPickerTitle.textContent = labelText || 'Pick Premium Color';
                
                const currentColor = input.value || '#000000';
                updateCustomPickerColor(currentColor);
                
                // Build swatches
                if (swatchesGrid) {
                    swatchesGrid.innerHTML = '';
                    samyakSwatches.forEach(hex => {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'color-swatch-btn';
                        btn.style.backgroundColor = hex;
                        btn.setAttribute('data-color', hex);
                        btn.title = hex;
                        
                        if (hex.toUpperCase() === currentColor.toUpperCase()) {
                            btn.classList.add('active');
                        }
                        
                        btn.addEventListener('click', () => {
                            swatchesGrid.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            updateCustomPickerColor(hex);
                        });
                        
                        swatchesGrid.appendChild(btn);
                    });
                }
                
                customColorPickerModal.classList.add('active');
            });
        });

        function updateCustomPickerColor(hex) {
            colorPickerPreviewBox.style.backgroundColor = hex;
            colorPickerHexInput.value = hex.toUpperCase();
        }

        colorPickerHexInput.addEventListener('input', () => {
            let val = colorPickerHexInput.value.trim();
            if (val && !val.startsWith('#')) {
                val = '#' + val;
                colorPickerHexInput.value = val;
            }
            if (/^#[A-Fa-f0-9]{6}$/.test(val)) {
                colorPickerPreviewBox.style.backgroundColor = val;
                
                // Sync swatches active state
                if (swatchesGrid) {
                    swatchesGrid.querySelectorAll('.color-swatch-btn').forEach(b => {
                        b.classList.toggle('active', b.getAttribute('data-color').toUpperCase() === val.toUpperCase());
                    });
                }
            }
        });

        if (closeColorPickerBtn) {
            closeColorPickerBtn.addEventListener('click', () => {
                customColorPickerModal.classList.remove('active');
            });
        }

        customColorPickerModal.addEventListener('click', (e) => {
            if (e.target === customColorPickerModal) {
                customColorPickerModal.classList.remove('active');
            }
        });

        if (applyCustomColorBtn) {
            applyCustomColorBtn.addEventListener('click', () => {
                let val = colorPickerHexInput.value.trim();
                if (val && !val.startsWith('#')) val = '#' + val;
                
                if (/^#[A-Fa-f0-9]{6}$/.test(val)) {
                    if (activeColorInputTarget) {
                        activeColorInputTarget.value = val;
                        
                        // Fire both input and change listeners in app.js
                        const inputEvent = new Event('input', { bubbles: true });
                        activeColorInputTarget.dispatchEvent(inputEvent);
                        
                        const changeEvent = new Event('change', { bubbles: true });
                        activeColorInputTarget.dispatchEvent(changeEvent);
                    }
                    customColorPickerModal.classList.remove('active');
                } else {
                    alert('Please enter a valid Hex color code (e.g. #850F0F)');
                }
            });
        }
    }

    // ==========================================================================
    // SAMYAK DESIGN TAB ACCORDION AND DRAG-AND-DROP REORDER SYSTEM
    // ==========================================================================
    const settingsAccordionContainer = document.getElementById('settings-accordion-container');
    const collapsibleSections = document.querySelectorAll('.collapsible-section');

    // 1. Accordion Toggles
    collapsibleSections.forEach(section => {
        const header = section.querySelector('.collapsible-header');
        const content = section.querySelector('.collapsible-content');
        
        if (header && content) {
            header.addEventListener('click', (e) => {
                // Ignore clicks on drag grip if they bubbled
                if (e.target.classList.contains('drag-grip')) return;
                
                const isActive = section.classList.contains('active');
                
                // Toggle active state
                section.classList.toggle('active', !isActive);
                content.style.display = isActive ? 'none' : 'block';
            });
        }
    });

    // 2. HTML5 Drag-and-Drop Reordering
    let draggedElement = null;

    collapsibleSections.forEach(section => {
        section.addEventListener('dragstart', (e) => {
            draggedElement = section;
            section.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', section.id);
        });

        section.addEventListener('dragend', () => {
            section.classList.remove('dragging');
            collapsibleSections.forEach(s => s.classList.remove('drag-over'));
            draggedElement = null;
            saveAccordionOrder();
        });

        section.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggedElement && draggedElement !== section) {
                section.classList.add('drag-over');
            }
            return false;
        });

        section.addEventListener('dragleave', () => {
            section.classList.remove('drag-over');
        });

        section.addEventListener('drop', (e) => {
            e.preventDefault();
            section.classList.remove('drag-over');
            
            if (draggedElement && draggedElement !== section) {
                // Determine whether to place before or after the target
                const bounding = section.getBoundingClientRect();
                const offset = e.clientY - bounding.top;
                const isAfter = offset > bounding.height / 2;
                
                if (isAfter) {
                    section.after(draggedElement);
                } else {
                    section.before(draggedElement);
                }
                saveAccordionOrder();
            }
        });
    });

    // Save current sequence of elements to localStorage
    function saveAccordionOrder() {
        if (!settingsAccordionContainer) return;
        const currentOrder = Array.from(settingsAccordionContainer.querySelectorAll('.collapsible-section'))
            .map(section => section.id);
        localStorage.setItem('samyak-design-accordion-order', JSON.stringify(currentOrder));
    }

    // Restore saved sequence of elements from localStorage on load
    function restoreAccordionOrder() {
        if (!settingsAccordionContainer) return;
        const savedOrderStr = localStorage.getItem('samyak-design-accordion-order');
        if (savedOrderStr) {
            try {
                const savedOrder = JSON.parse(savedOrderStr);
                if (Array.isArray(savedOrder)) {
                    savedOrder.forEach(id => {
                        const element = document.getElementById(id);
                        if (element && element.parentNode === settingsAccordionContainer) {
                            settingsAccordionContainer.appendChild(element);
                        }
                    });
                }
            } catch (e) {
                console.error('Error restoring settings accordion order:', e);
            }
        }
    }

    // Run order restoration instantly
    restoreAccordionOrder();
});
