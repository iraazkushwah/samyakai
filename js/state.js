/* ==========================================================================
   SAMYAK - STATE CONFIGURATION (state.js)
   ========================================================================== */

// Global State Variables
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
    showCoverTOC: true,
    
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

// Dynamic Toolbar Layout Configurations & Sanitization
const defaultToolbarLayout = {
    main: ['btn-section', 'btn-topic', 'btn-bullet', 'btn-note', 'highlight-green-btn', 'highlight-pink-btn', 'btn-factbox', 'box-style-select'],
    tray: ['btn-pagebreak', 'btn-columnbreak', 'btn-chapter', 'insert-image-btn', 'insert-table-btn', 'btn-search-toggle', 'btn-help-shortcuts']
};

let currentToolbarLayout = { ...defaultToolbarLayout };

// OCR State variables
let ocrDashUploadedFile = null;
let ocrDashActiveTab = 'preview';
let ocrDashLayoutAnalysis = true;
let ocrDashAutoStructuring = true;

// Phonetic suggestion state variables
let suggestionsList = [];
let activeSuggestionIndex = 0;
let suggestionsActive = false;
let currentEnglishWord = "";
let currentWordStartIdx = -1;
let ocrFileChangeCount = 0;

// Global DOM Element Variables (to be assigned in main.js on DOMContentLoaded)
let pageTabsList, addPageBtn, deletePageBtn, gridViewBtn, pageGridModal, closeGridModalBtn, pageGridItemsContainer;
let gridTotalPagesLabel, gridAddPageBtn, themeToggleBtn, toggleToolbarBtn, importProjectBtn, exportProjectBtn;
let importProjectFile, pageLayoutSelect, applyLayoutAllBtn, compactSpacingToggle, coverTOCToggle, pageTemplateSelect;
let btnSearchToggle, searchReplacePanel, findInput, replaceInput, findBtn, replaceBtn, replaceAllBtn, searchStatus;
let compileMagazinesBtn, compilerModal, closeCompilerModalBtn, cancelCompilerBtn, compileConfirmBtn, compilerFile1, compilerFile2, compilerFile3;
let compiledTitleInput, compiledTaglineInput, compiledSubtitleInput, helpModal, btnHelpShortcuts, closeHelpModalBtn, closeHelpBtn;
let coverEditorZone, contentEditorZone, pageContentInput, docTitleInput, docTaglineInput, docSubtitleInput, docThemeInput;
let coverThemeSelect, coverBorderPatternSelect, coverEmblemSelect, docClassificationInput, coverTitleSizeSlider, coverTitleSizeVal;
let coverClassificationSizeSlider, coverClassificationSizeVal, coverTaglineSizeSlider, coverTaglineSizeVal, coverSubtitleSizeSlider, coverSubtitleSizeVal;
let lastEditorZone, lastTitleInput, lastSubtitleInput, lastTaglineInput, pagesContainer, wordCountSpan, activePageLabel;
let clearAllBtn, printPdfBtn, smartShrinkBtn, smartSpaceBtn, loadingOverlay, zoomInBtn, zoomOutBtn, zoomLevelSpan;
let mobilePreviewToggleBtn, mobilePreviewCloseBtn, previewPanel, fontDecreaseBtn, fontIncreaseBtn, fontSizeValSpan;
let globalFontStyleSelect, globalFontWeightSelect, globalLineSpacingSelect, globalLetterSpacingSelect;
let toolbarButtons, toolbarTrayTrigger, toolbarTrayDrawer, toolbarCustomizeTrigger;
let phoneticTypingToggle, ocrDragDropZone, ocrFileInput;
let openOcrDashBtn, ocrIntegratedWorkspace, ocrDashDragZone, ocrDashFileInput, ocrDashPreviewArea, ocrDashFileBadge;
let ocrDashFileName, ocrDashFileSize, ocrDashRemoveFileBtn, ocrDashScanOverlay, ocrDashPreviewImg;
let ocrDashEngineSelect, ocrDashLayoutToggle, ocrDashStructToggle, ocrDashProcessBtn, ocrDashProcessingIndicator;
let ocrDashTabPreview, ocrDashTabEditor, ocrDashTabAlerts, ocrDashAlertBadgeCount, ocrDashStatsBar, ocrDashConfidenceVal;
let ocrDashWordcountVal, ocrDashAlertsCountVal, ocrDashIdleState, ocrDashViewStructured, ocrDashRenderedHtml;
let ocrDashViewEditor, ocrDashRawTextarea, ocrDashViewAlerts, ocrDashAlertsList, ocrDashActionsBar;
let ocrDashCopyBtn, ocrDashDownloadBtn, ocrDashInsertBtn, ocrPageSelectorModal, ocrPageSelectorClose;
let ocrDestinationPageSelect, ocrPageSelectorCancel, ocrPageSelectorConfirm, phoneticSuggestionsTooltip;
let designSectionBg, designSectionAccent, designSectionText, designSectionSize, designSectionSizeVal, designSectionAlign;
let designChapterNumSize, designChapterNumSizeVal, designChapterTitleSize, designChapterTitleSizeVal, designChapterSubtitleSize, designChapterSubtitleSizeVal;
let designTopicText, designTopicBorder, designTopicBorderStyle, designTopicMargin, designTopicSize, designTopicSizeVal;
let designTopicThick, designTopicThickVal, designTopicAlign, designSectionShape, designTopicIcon, designBulletStyle;
let designInnerBorder, designCornerColor, designBorderThick, designBorderThickVal, designCornerSize, designCornerSizeVal;
let designDividerColor, designDividerStyle, designDividerThick, designDividerThickVal;
let designEndStarSymbol, designEndStarColor, designEndStarSize, designEndStarSizeVal, designEndStarPulse;
let designPageNumColor, designPageNumPlace, designPageNumPrefix, designPageNumSize, designPageNumSizeVal;
let pageMarginXInput, marginXValSpan, pageMarginYInput, marginYValSpan, pagePaddingXInput, paddingXValSpan, pagePaddingYInput, paddingYValSpan;
let headerLogoFileInput, headerLogoPreviewGroup, headerLogoPreview, removeHeaderLogoBtn;
let footerTelegramInput, footerYoutubeInput, footerSocialSizeInput, footerSocialSizeVal, footerSocialPlacementSelect;
