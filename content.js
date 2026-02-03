/* ========================================================================
   PROJECT MAGMA - CONTENT SCRIPT
   Version 2.8 - Professional Edition with Gemini Flash AI
   
   FEATURES:
   - Google Gemini Flash API integration
   - Feature loss detection with visual warnings
   - Multi-site support (Gemini, ChatGPT, Claude)
   - Professional theme (no flashy animations)
   - Drag & drop file organization
   - Folder import/export with proper structure
   - Real-time file tree updates
   - Duplicate file protection
   ======================================================================== */

(function () {
  'use strict';

  let magmaActive = false;
  let virtualFS = { folders: {}, files: {} };
  const processedBlocks = new WeakSet();
  const fileSystemEvents = new EventTarget();

  // Detect current site
  const CURRENT_SITE = detectSite();

  function detectSite() {
    const hostname = window.location.hostname;
    if (hostname.includes('gemini.google.com')) return 'gemini';
    if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) return 'chatgpt';
    if (hostname.includes('claude.ai')) return 'claude';
    return 'unknown';
  }

  function getCodeBlockSelector() {
    switch (CURRENT_SITE) {
      case 'gemini':
        return 'pre > code, pre code';
      case 'chatgpt':
        return 'pre code, .code-block__code code';
      case 'claude':
        return 'pre code';
      default:
        return 'pre code';
    }
  }

  function init() {
    console.log(`🔥 Magma v2.9.1 Professional - Active on ${CURRENT_SITE}`);

    chrome.storage.local.get(['magmaActive', 'virtualFS'], (result) => {
      magmaActive = result.magmaActive || false;
      virtualFS = result.virtualFS || { folders: {}, files: {} };

      if (magmaActive) {
        activateMagma();
      }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'activate_magma') {
        activateMagma();
      } else if (request.action === 'deactivate_magma') {
        deactivateMagma();
      } else if (request.action === 'clear_filesystem') {
        virtualFS = { folders: {}, files: {} };
        saveFS();
      }
    });
  }

  function activateMagma() {
    magmaActive = true;
    console.log('✅ Magma activated - Professional mode');

    addVolcanoButton();
    addSubtleBackground();
    addLavaRivers();
    addFireParticles();
    addPulsatingGlow();
    injectCaptureButtons();
    observeCodeBlocks();
  }

  function deactivateMagma() {
    magmaActive = false;
    console.log('❌ Magma deactivated');
    document.querySelectorAll('.magma-element').forEach(el => el.remove());
    processedBlocks.clear();
  }

  /**
   * Animated volcano button with fire effects
   */
  function addVolcanoButton() {
    const existingBtn = document.getElementById('magma-volcano-btn');
    if (existingBtn) existingBtn.remove();

    const volcanoBtn = document.createElement('div');
    volcanoBtn.id = 'magma-volcano-btn';
    volcanoBtn.className = 'magma-element';
    volcanoBtn.innerHTML = '<div class="volcano-emoji">🌋</div>';

    const style = document.createElement('style');
    style.className = 'magma-element';
    style.textContent = `
      #magma-volcano-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 70px;
        height: 70px;
        background: radial-gradient(circle at 50% 50%, #ff6a00 0%, #ff4500 50%, #8b0000 100%);
        border-radius: 50%;
        box-shadow: 
          0 4px 20px rgba(255, 69, 0, 0.7),
          0 0 40px rgba(255, 69, 0, 0.4);
        cursor: pointer;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        border: 2px solid rgba(255, 140, 0, 0.6);
        animation: volcanoGlow 2s ease-in-out infinite;
      }
      
      @keyframes volcanoGlow {
        0%, 100% {
          box-shadow: 
            0 4px 20px rgba(255, 69, 0, 0.7),
            0 0 40px rgba(255, 69, 0, 0.4);
        }
        50% {
          box-shadow: 
            0 6px 30px rgba(255, 69, 0, 0.9),
            0 0 60px rgba(255, 69, 0, 0.6);
        }
      }
      
      #magma-volcano-btn:hover {
        transform: scale(1.15) translateY(-3px);
      }
      
      .volcano-emoji {
        font-size: 42px;
        animation: volcanoFloat 3s ease-in-out infinite;
        user-select: none;
      }
      
      @keyframes volcanoFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      
      #magma-volcano-btn::before,
      #magma-volcano-btn::after {
        content: '🔥';
        position: absolute;
        top: -20px;
        font-size: 18px;
        opacity: 0;
        animation: fireParticle 3s ease-out infinite;
        pointer-events: none;
      }
      
      #magma-volcano-btn::after {
        animation-delay: 1.5s;
      }
      
      @keyframes fireParticle {
        0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translate(0, -60px) scale(1.2) rotate(180deg); opacity: 0; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(volcanoBtn);
    volcanoBtn.addEventListener('click', () => showFileManager());
  }

  /**
   * Fire-themed background with subtle animation
   */
  function addSubtleBackground() {
    const existing = document.getElementById('magma-background');
    if (existing) existing.remove();

    const bg = document.createElement('div');
    bg.id = 'magma-background';
    bg.className = 'magma-element';

    const style = document.createElement('style');
    style.className = 'magma-element';
    style.textContent = `
      #magma-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        background: 
          radial-gradient(ellipse at 20% 30%, rgba(255, 69, 0, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(139, 0, 0, 0.05) 0%, transparent 50%);
        animation: subtleGlow 10s ease-in-out infinite;
      }
      @keyframes subtleGlow {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.6; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(bg);
  }

  /**
   * Lava rivers flowing on sides of screen
   */
  function addLavaRivers() {
    const container = document.createElement('div');
    container.className = 'magma-element lava-rivers-container';

    // Left side - 2 rivers
    for (let i = 0; i < 2; i++) {
      const river = document.createElement('div');
      river.className = 'lava-river';
      river.style.cssText = `
        position: fixed;
        width: 3px;
        height: 100%;
        left: ${5 + i * 8}%;
        top: 0;
        background: linear-gradient(180deg, 
          transparent 0%, 
          rgba(255, 69, 0, 0.3) 20%, 
          rgba(255, 140, 0, 0.4) 50%, 
          rgba(255, 69, 0, 0.3) 80%, 
          transparent 100%);
        opacity: 0;
        animation: lavaFlow ${14 + i * 3}s ease-in-out infinite;
        animation-delay: ${i * 2}s;
        filter: blur(2px);
        pointer-events: none;
        z-index: 0;
      `;
      container.appendChild(river);
    }

    // Right side - 2 rivers
    for (let i = 0; i < 2; i++) {
      const river = document.createElement('div');
      river.className = 'lava-river';
      river.style.cssText = `
        position: fixed;
        width: 3px;
        height: 100%;
        right: ${5 + i * 8}%;
        top: 0;
        background: linear-gradient(180deg, 
          transparent 0%, 
          rgba(255, 69, 0, 0.3) 20%, 
          rgba(255, 140, 0, 0.4) 50%, 
          rgba(255, 69, 0, 0.3) 80%, 
          transparent 100%);
        opacity: 0;
        animation: lavaFlow ${14 + i * 3}s ease-in-out infinite;
        animation-delay: ${i * 2 + 3}s;
        filter: blur(2px);
        pointer-events: none;
        z-index: 0;
      `;
      container.appendChild(river);
    }

    const style = document.createElement('style');
    style.className = 'magma-element';
    style.textContent = `
      @keyframes lavaFlow {
        0%, 100% { opacity: 0; transform: translateY(0); }
        25% { opacity: 0.7; transform: translateY(30px); }
        50% { opacity: 0.9; transform: translateY(60px); }
        75% { opacity: 0.6; transform: translateY(40px); }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(container);
  }

  /**
   * Fire particles floating around
   */
  function addFireParticles() {
    const container = document.createElement('div');
    container.className = 'magma-element fire-particles-container';

    // Create 15 fire particles split between sides
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'fire-particle';
      const isLeft = i < 8;
      const xPos = isLeft ? Math.random() * 15 : 85 + Math.random() * 15;
      const size = 8 + Math.random() * 12;
      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 5;

      particle.textContent = '🔥';
      particle.style.cssText = `
        position: fixed;
        left: ${xPos}%;
        bottom: ${Math.random() * 20}%;
        font-size: ${size}px;
        opacity: 0;
        pointer-events: none;
        z-index: 1;
        animation: floatUp ${duration}s ease-in infinite;
        animation-delay: ${delay}s;
      `;
      container.appendChild(particle);
    }

    const style = document.createElement('style');
    style.className = 'magma-element';
    style.textContent = `
      @keyframes floatUp {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 0.6;
        }
        90% {
          opacity: 0.3;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(container);
  }

  /**
   * Pulsating corner glows
   */
  function addPulsatingGlow() {
    const container = document.createElement('div');
    container.className = 'magma-element glow-container';

    const positions = [
      { top: '0', left: '0' },
      { top: '0', right: '0' },
      { bottom: '0', left: '0' },
      { bottom: '0', right: '0' }
    ];

    positions.forEach((pos, i) => {
      const glow = document.createElement('div');
      Object.assign(glow.style, {
        position: 'fixed',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 69, 0, 0.2) 0%, transparent 70%)',
        opacity: '0',
        animation: `glowPulse ${4 + i}s ease-in-out infinite`,
        animationDelay: `${i * 0.5}s`,
        pointerEvents: 'none',
        zIndex: '0',
        filter: 'blur(30px)',
        ...pos
      });
      container.appendChild(glow);
    });

    const style = document.createElement('style');
    style.className = 'magma-element';
    style.textContent = `
      @keyframes glowPulse {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(1.1); }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(container);
  }

  /**
   * Inject capture buttons - NO DUPLICATES
   */
  function injectCaptureButtons() {
    const selector = getCodeBlockSelector();
    const codeBlocks = document.querySelectorAll(selector);

    codeBlocks.forEach((block) => {
      if (processedBlocks.has(block)) return;

      const code = (block.textContent || '').trim();
      if (code.length < 10) return;

      const container = block.closest('pre');
      if (!container || container.querySelector('.magma-capture-btn')) return;

      processedBlocks.add(block);

      const btn = document.createElement('button');
      btn.className = 'magma-element magma-capture-btn';
      btn.innerHTML = '📥 Capture';
      btn.onclick = (e) => {
        e.stopPropagation();
        captureCode(block);
      };

      container.style.position = 'relative';
      container.appendChild(btn);
    });

    if (!document.getElementById('magma-btn-styles')) {
      const style = document.createElement('style');
      style.id = 'magma-btn-styles';
      style.className = 'magma-element';
      style.textContent = `
        .magma-capture-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 8px 14px;
          background: linear-gradient(135deg, #ff4500, #ff6a00, #ff8c00);
          color: white;
          border: 2px solid rgba(255, 140, 0, 0.6);
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 69, 0, 0.6);
          letter-spacing: 1px;
          animation: btnGlow 2s ease-in-out infinite;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        @keyframes btnGlow {
          0%, 100% { box-shadow: 0 4px 15px rgba(255, 69, 0, 0.6); }
          50% { box-shadow: 0 6px 25px rgba(255, 69, 0, 0.9); }
        }
        
        .magma-capture-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 25px rgba(255, 69, 0, 0.8);
          animation: btnPulse 0.6s ease-in-out infinite;
        }
        
        @keyframes btnPulse {
          0%, 100% { transform: translateY(-2px) scale(1.05); }
          50% { transform: translateY(-3px) scale(1.08); }
        }
        
        .magma-capture-btn:active {
          transform: translateY(0) scale(1);
        }
      `;
      document.head.appendChild(style);
    }
  }

  function captureCode(block) {
    const code = block.textContent || block.innerText;
    showCaptureModal(code);
  }

  function showCaptureModal(code) {
    const modal = document.createElement('div');
    modal.className = 'magma-element magma-modal';

    modal.innerHTML = `
      <div class="magma-modal-overlay"></div>
      <div class="magma-modal-content">
        <div class="magma-modal-header">
          <h2>📥 Capture Code</h2>
          <button class="magma-close-btn">✕</button>
        </div>
        <div class="magma-modal-body">
          <div class="magma-form">
            <div class="form-group">
              <label>Operation Mode</label>
              <select id="magma-mode-select" class="magma-input">
                <option value="new">Create New File</option>
                <option value="replace">Replace Existing</option>
                <option value="insert">Insert Into File</option>
              </select>
            </div>
            <div class="form-group">
              <label>Destination Folder</label>
              <select id="magma-folder-select" class="magma-input">
                <option value="/">/  (Root)</option>
                ${generateFolderOptions()}
              </select>
            </div>
            <div class="form-group">
              <label>Filename</label>
              <input type="text" id="magma-filename" class="magma-input" placeholder="component.js">
            </div>
            <div class="form-group" id="magma-original-group" style="display: none;">
              <label>Original Code</label>
              <textarea id="magma-original" class="magma-textarea" rows="6"></textarea>
              <div style="margin-top: 5px; font-size: 11px;" id="auto-load-status"></div>
            </div>
            <div class="form-group" id="magma-instruction-group" style="display: none;">
              <label>Insertion Point</label>
              <input type="text" id="magma-instruction" class="magma-input" placeholder="e.g., after imports">
            </div>
            <div class="form-group">
              <label>Code Preview</label>
              <textarea id="magma-code-preview" class="magma-textarea" rows="8" readonly>${code}</textarea>
            </div>
            <button id="magma-submit-btn" class="magma-btn magma-btn-primary" style="width: 100%;">
              💾 Save Code
            </button>
          </div>
        </div>
      </div>
    `;

    addModalStyles();
    document.body.appendChild(modal);

    const modeSelect = modal.querySelector('#magma-mode-select');
    const filenameInput = modal.querySelector('#magma-filename');
    const originalTextarea = modal.querySelector('#magma-original');
    const autoLoadStatus = modal.querySelector('#auto-load-status');

    modal.querySelector('.magma-close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.magma-modal-overlay').addEventListener('click', () => modal.remove());

    modeSelect.addEventListener('change', () => {
      const mode = modeSelect.value;
      modal.querySelector('#magma-original-group').style.display = mode !== 'new' ? 'block' : 'none';
      modal.querySelector('#magma-instruction-group').style.display = mode === 'insert' ? 'block' : 'none';
      if (mode !== 'new') tryAutoLoadFile();
    });

    filenameInput.addEventListener('input', () => {
      if (modeSelect.value !== 'new') tryAutoLoadFile();
    });

    function tryAutoLoadFile() {
      const filename = filenameInput.value.trim();
      if (!filename) {
        autoLoadStatus.textContent = '';
        return;
      }

      const existingContent = findFileInFS(filename);
      if (existingContent) {
        originalTextarea.value = existingContent;
        autoLoadStatus.textContent = `✅ Auto-loaded: ${filename}`;
        autoLoadStatus.style.color = '#38a169';
      } else {
        originalTextarea.value = '';
        autoLoadStatus.textContent = `⚠️ Not found: ${filename}`;
        autoLoadStatus.style.color = '#f6ad55';
      }
    }

    modal.querySelector('#magma-submit-btn').addEventListener('click', () => {
      const mode = modeSelect.value;
      const folder = modal.querySelector('#magma-folder-select').value;
      const filename = filenameInput.value.trim();
      const original = originalTextarea.value;
      const instruction = modal.querySelector('#magma-instruction').value;

      if (!filename) {
        alert('❌ Please enter a filename');
        return;
      }

      processCapture({ mode, folder, filename, newCode: code, original, instruction });
      modal.remove();
    });
  }

  /**
   * Process capture with feature loss detection
   */
  async function processCapture(data) {
    const { mode, folder, filename, newCode, original, instruction } = data;

    // Check for duplicate
    if (fileExists(folder, filename)) {
      const overwrite = confirm(`⚠️ File "${filename}" already exists in ${folder}\n\nOverwrite?`);
      if (!overwrite) {
        alert('❌ Operation cancelled');
        return;
      }
    }

    if (mode === 'new') {
      addFileToFS(folder, filename, newCode);
      alert('✅ File created: ' + folder + filename);
      refreshFileManager();
      return;
    }

    // Show processing indicator
    const processingModal = showProcessingModal('Analyzing code...');

    chrome.runtime.sendMessage({
      action: 'process_magma',
      payload: { mode, original, newCode, filename, instruction }
    }, async (response) => {
      processingModal.remove();

      if (!response) {
        alert('❌ Error: No response from background service.\n\nPlease reload the extension.');
        return;
      }

      if (response.requiresConfirmation && response.featureLoss) {
        // SHOW ANALYSIS MODAL (even if safe!)
        const action = await showFeatureLossWarning(response.featureLoss);

        if (action === 'cancel') {
          alert('❌ Operation cancelled');
          return;
        }

        if (action === 'proceed') {
          // Safe changes - just use new code
          addFileToFS(folder, filename, newCode);
          alert('✅ File saved: ' + folder + filename);
          refreshFileManager();
          return;
        }

        if (action === 'force') {
          // Use new code anyway (dangerous!)
          const reallyConfirm = confirm(
            '⚠️ FINAL WARNING!\n\n' +
            'You will lose these features:\n' +
            response.featureLoss.lostFeatures.join('\n') +
            '\n\nProceed anyway?'
          );

          if (reallyConfirm) {
            addFileToFS(folder, filename, newCode);
            alert('⚠️ File saved with feature loss');
            refreshFileManager();
          }
          return;
        }

        if (action === 'merge') {
          // Request merge from background
          const mergeModal = showProcessingModal('Merging code with AI...');

          chrome.runtime.sendMessage({
            action: 'process_with_merge',
            payload: { mode, original, newCode, filename, instruction }
          }, (mergeResponse) => {
            mergeModal.remove();

            if (mergeResponse && mergeResponse.success) {
              addFileToFS(folder, filename, mergeResponse.result);
              alert('✅ Code merged successfully! All features preserved.');
              refreshFileManager();
            } else {
              alert('❌ Merge failed: ' + (mergeResponse?.error || 'Unknown error'));
            }
          });
        }
      } else if (response.success) {
        addFileToFS(folder, filename, response.result);
        alert('✅ File saved: ' + folder + filename);
        refreshFileManager();
      } else {
        alert('❌ Error: ' + (response.error || 'Unknown error'));
      }
    });
  }

  function showProcessingModal(message = 'Processing...') {
    const modal = document.createElement('div');
    modal.className = 'magma-element processing-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="spinner"></div>
        <p>${message}</p>
      </div>
    `;
    addModalStyles();
    document.body.appendChild(modal);
    return modal;
  }

  /**
   * REPLACED: Updated Feature Loss Warning Modal
   */
  function showFeatureLossWarning(featureLoss) {
    return new Promise((resolve) => {
      const isSafe = featureLoss.hasLoss === false;
      const riskLevel = isSafe ? 'SAFE' : 'RISK DETECTED';
      const themeColor = isSafe ? '#38a169' : '#fc8181'; // Green vs Red
      const headerIcon = isSafe ? '✅' : '⚠️';

      const modal = document.createElement('div');
      modal.className = 'magma-element magma-modal';

      // Helper to generate list items
      const generateList = (items, emptyText) => {
        if (!items || items.length === 0) return `<div class="empty-list">${emptyText}</div>`;
        return `<ul class="feature-list">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
      };

      modal.innerHTML = `
        <div class="magma-modal-overlay"></div>
        <div class="magma-modal-content audit-panel">
          
          <div class="magma-modal-header" style="border-bottom-color: ${themeColor}">
            <div class="header-title">
              <h2>${headerIcon} AI Code Audit</h2>
              <span class="risk-badge ${isSafe ? 'safe' : 'danger'}">${riskLevel}</span>
            </div>
            <button class="magma-close-btn">✕</button>
          </div>

          <div class="magma-modal-body">
            
            <div class="audit-summary" style="border-left-color: ${themeColor}">
              <div class="summary-label">🤖 AI Analysis</div>
              <p>${featureLoss.explanation || 'No detailed analysis provided.'}</p>
            </div>

            <div class="changes-grid">
              
              <div class="change-card danger-card">
                <div class="card-header">❌ Removed Features</div>
                ${generateList(featureLoss.lostFeatures, 'No features removed')}
              </div>

              <div class="change-card warning-card">
                <div class="card-header">🔄 Modified Logic</div>
                ${generateList(featureLoss.changedFeatures, 'No logic modified')}
              </div>
              
              <div class="change-card success-card">
                <div class="card-header">✨ Added Features</div>
                ${generateList(featureLoss.addedFeatures, 'No new features')}
              </div>
            </div>

            ${featureLoss.recommendation ? `
              <div class="recommendation-box">
                <strong>💡 Suggestion:</strong> ${featureLoss.recommendation}
              </div>
            ` : ''}

            <div class="audit-actions">
              ${isSafe ? `
                <button class="magma-btn magma-btn-success btn-proceed">
                  ✅ Looks Good - Save File
                </button>
              ` : `
                <button class="magma-btn magma-btn-primary btn-merge">
                  🤖 Merge (Preserve All Features)
                </button>
                <button class="magma-btn magma-btn-danger btn-force">
                  ⚠️ Overwrite (Accept Loss)
                </button>
              `}
              <button class="magma-btn magma-btn-secondary btn-cancel">Cancel</button>
            </div>

          </div>
        </div>
      `;

      addModalStyles(); // Ensure CSS is loaded
      document.body.appendChild(modal);

      // --- Event Handlers ---

      // Close / X Out
      const closeAndCancel = () => {
        modal.classList.add('closing');
        setTimeout(() => modal.remove(), 200);
        resolve('cancel');
      };

      modal.querySelector('.magma-close-btn').addEventListener('click', closeAndCancel);
      modal.querySelector('.magma-modal-overlay').addEventListener('click', closeAndCancel);
      modal.querySelector('.btn-cancel').addEventListener('click', closeAndCancel);

      // Actions
      modal.querySelector('.btn-proceed')?.addEventListener('click', () => {
        modal.remove();
        resolve('proceed');
      });

      modal.querySelector('.btn-merge')?.addEventListener('click', () => {
        modal.remove();
        resolve('merge');
      });

      modal.querySelector('.btn-force')?.addEventListener('click', () => {
        modal.remove();
        resolve('force');
      });
    });
  }

  function showFileManager() {
    const modal = document.createElement('div');
    modal.className = 'magma-element magma-modal';
    modal.id = 'file-manager-modal';
    modal.innerHTML = `
      <div class="magma-modal-overlay"></div>
      <div class="magma-modal-content">
        <div class="magma-modal-header">
          <h2>📁 File Manager</h2>
          <button class="magma-close-btn">✕</button>
        </div>
        <div class="magma-modal-body">
          <div class="magma-stats">
            <div class="stat-item">
              <div class="stat-icon">📄</div>
              <span class="stat-value">${countFiles()}</span>
              <span class="stat-label">Files</span>
            </div>
            <div class="stat-item">
              <div class="stat-icon">📁</div>
              <span class="stat-value">${countFolders()}</span>
              <span class="stat-label">Folders</span>
            </div>
          </div>
          <div class="magma-folder-tree" id="folder-tree-container">${renderFolderTree()}</div>
          <div class="magma-actions-grid">
            <button class="magma-btn magma-btn-primary" id="magma-new-folder-btn">📁 New Folder</button>
            <button class="magma-btn magma-btn-success" id="magma-import-btn">📥 Import</button>
            <button class="magma-btn magma-btn-secondary" id="magma-export-btn">💾 Export</button>
            <button class="magma-btn magma-btn-danger" id="magma-clear-btn">🗑️ Clear All</button>
          </div>
        </div>
      </div>
    `;

    addModalStyles();
    document.body.appendChild(modal);

    modal.querySelector('.magma-close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.magma-modal-overlay').addEventListener('click', () => modal.remove());
    modal.querySelector('#magma-new-folder-btn').addEventListener('click', createNewFolder);
    modal.querySelector('#magma-import-btn').addEventListener('click', importProject);
    modal.querySelector('#magma-export-btn').addEventListener('click', exportProject);
    modal.querySelector('#magma-clear-btn').addEventListener('click', clearAllFiles);

    attachDragDropHandlers();
  }

  function refreshFileManager() {
    const fileManager = document.getElementById('file-manager-modal');
    if (fileManager) {
      const treeContainer = fileManager.querySelector('#folder-tree-container');
      if (treeContainer) {
        treeContainer.innerHTML = renderFolderTree();
        attachDragDropHandlers();
      }

      // Update stats
      const fileCount = fileManager.querySelector('.stat-item:nth-child(1) .stat-value');
      const folderCount = fileManager.querySelector('.stat-item:nth-child(2) .stat-value');
      if (fileCount) fileCount.textContent = countFiles();
      if (folderCount) folderCount.textContent = countFolders();
    }
  }

  function renderFolderTree() {
    if (countFiles() === 0 && countFolders() === 0) {
      return `<div class="empty-state">
        <div class="empty-icon">📂</div>
        <p>No files yet</p>
        <p class="empty-subtitle">Capture code to begin</p>
      </div>`;
    }

    let html = '<div class="folder-tree">';
    html += `<div class="folder-item root-folder" data-path="/">
      <span class="folder-icon">📁</span>
      <span class="folder-name">Root</span>
    </div>`;

    function renderFolder(folderObj, path, level = 1) {
      let result = '';
      for (const [name, subfolder] of Object.entries(folderObj.subfolders || {})) {
        const folderPath = path + name + '/';
        result += `<div class="folder-item" data-path="${folderPath}" style="padding-left: ${level * 20}px">`;
        result += `<span class="folder-icon">📁</span><span class="folder-name">${name}</span></div>`;
        result += renderFolder(subfolder, folderPath, level + 1);
      }
      for (const [filename, fileObj] of Object.entries(folderObj.files || {})) {
        const fileIcon = getFileIcon(filename);
        result += `<div class="file-item" draggable="true" data-filename="${filename}" data-path="${path}" style="padding-left: ${level * 20}px">`;
        result += `<span class="file-icon">${fileIcon}</span><span class="file-name">${filename}</span></div>`;
      }
      return result;
    }

    for (const [filename, fileObj] of Object.entries(virtualFS.files || {})) {
      const fileIcon = getFileIcon(filename);
      html += `<div class="file-item" draggable="true" data-filename="${filename}" data-path="/" style="padding-left: 20px">`;
      html += `<span class="file-icon">${fileIcon}</span><span class="file-name">${filename}</span></div>`;
    }

    for (const [name, folder] of Object.entries(virtualFS.folders || {})) {
      const folderPath = '/' + name + '/';
      html += `<div class="folder-item" data-path="${folderPath}" style="padding-left: 20px">`;
      html += `<span class="folder-icon">📁</span><span class="folder-name">${name}</span></div>`;
      html += renderFolder(folder, folderPath, 2);
    }

    html += '</div>';
    return html;
  }

  /**
   * NEW: Attach click handlers to files for viewing/downloading
   */
  function attachFileClickHandlers() {
    const fileItems = document.querySelectorAll('.file-item');
    
    fileItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const filename = item.dataset.filename;
        const path = item.dataset.path;
        showFileViewer(filename, path);
      });
      
      // Add visual feedback
      item.style.cursor = 'pointer';
    });
  }

  /**
   * NEW: Show file viewer modal with download/edit/delete options
   */
  function showFileViewer(filename, path) {
    const content = getFileContent(path, filename);
    
    if (!content) {
      alert('❌ File not found');
      return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'magma-element magma-modal';
    modal.innerHTML = `
      <div class="magma-modal-overlay"></div>
      <div class="magma-modal-content" style="max-width: 900px;">
        <div class="magma-modal-header">
          <h2>📄 ${filename}</h2>
          <button class="magma-close-btn">✕</button>
        </div>
        <div class="magma-modal-body">
          <div style="margin-bottom: 15px; font-size: 12px; color: #a0aec0; font-family: 'Monaco', monospace;">
            📁 Path: ${path}${filename}
          </div>
          <textarea class="magma-textarea" readonly style="min-height: 400px; font-family: 'Monaco', 'Courier New', monospace; font-size: 13px;">${content}</textarea>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 15px;">
            <button class="magma-btn magma-btn-primary" id="download-file-btn">
              💾 Download
            </button>
            <button class="magma-btn magma-btn-secondary" id="edit-file-btn">
              ✏️ Edit
            </button>
            <button class="magma-btn magma-btn-danger" id="delete-file-btn">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close handlers
    modal.querySelector('.magma-close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.magma-modal-overlay').addEventListener('click', () => modal.remove());
    
    // Download button
    modal.querySelector('#download-file-btn').addEventListener('click', () => {
      downloadSingleFile(filename, content);
      alert(`✅ Downloaded: ${filename}`);
    });
    
    // Edit button
    modal.querySelector('#edit-file-btn').addEventListener('click', () => {
      modal.remove();
      showEditFileModal(filename, path, content);
    });
    
    // Delete button
    modal.querySelector('#delete-file-btn').addEventListener('click', () => {
      if (confirm(`⚠️ Delete ${filename}?`)) {
        deleteFile(path, filename);
        modal.remove();
        refreshFileManager();
        alert(`✅ Deleted: ${filename}`);
      }
    });
  }

  /**
   * NEW: Download a single file
   */
  function downloadSingleFile(filename, content) {
    // Create blob
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Downloaded: ${filename}`);
  }

  /**
   * NEW: Show edit file modal
   */
  function showEditFileModal(filename, path, currentContent) {
    const modal = document.createElement('div');
    modal.className = 'magma-element magma-modal';
    modal.innerHTML = `
      <div class="magma-modal-overlay"></div>
      <div class="magma-modal-content" style="max-width: 900px;">
        <div class="magma-modal-header">
          <h2>✏️ Edit: ${filename}</h2>
          <button class="magma-close-btn">✕</button>
        </div>
        <div class="magma-modal-body">
          <textarea class="magma-textarea" id="edit-content" style="min-height: 400px; font-family: 'Monaco', 'Courier New', monospace; font-size: 13px;">${currentContent}</textarea>
          <button class="magma-btn magma-btn-success" id="save-edit-btn" style="width: 100%; margin-top: 15px;">
            💾 Save Changes
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.magma-close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.magma-modal-overlay').addEventListener('click', () => modal.remove());
    
    modal.querySelector('#save-edit-btn').addEventListener('click', () => {
      const newContent = modal.querySelector('#edit-content').value;
      updateFileContent(path, filename, newContent);
      modal.remove();
      refreshFileManager();
      alert(`✅ Saved: ${filename}`);
    });
  }

  /**
   * NEW: Get file content from virtual filesystem
   */
  function getFileContent(path, filename) {
    if (path === '/') {
      return virtualFS.files?.[filename]?.content || null;
    }
    
    const parts = path.split('/').filter(p => p);
    let current = virtualFS.folders;
    
    for (const part of parts) {
      if (!current[part]) return null;
      current = current[part].subfolders;
    }
    
    // Handle both direct files and nested structure
    const folder = parts.reduce((curr, part) => curr?.[part]?.subfolders || curr?.[part], virtualFS.folders);
    return folder?.files?.[filename]?.content || null;
  }

  /**
   * NEW: Update file content in virtual filesystem
   */
  function updateFileContent(path, filename, newContent) {
    if (path === '/') {
      if (virtualFS.files[filename]) {
        virtualFS.files[filename].content = newContent;
        virtualFS.files[filename].lastModified = new Date().toISOString();
      }
    } else {
      const parts = path.split('/').filter(p => p);
      let current = virtualFS.folders;
      
      for (const part of parts) {
        if (!current[part]) return;
        if (current[part].subfolders) {
          current = current[part].subfolders;
        } else {
          return;
        }
      }
      
      if (current.files && current.files[filename]) {
        current.files[filename].content = newContent;
        current.files[filename].lastModified = new Date().toISOString();
      }
    }
    
    saveFS();
  }

  /**
   * NEW: Delete file from virtual filesystem
   */
  function deleteFile(path, filename) {
    if (path === '/') {
      delete virtualFS.files[filename];
    } else {
      const parts = path.split('/').filter(p => p);
      let current = virtualFS.folders;
      
      for (const part of parts) {
        if (!current[part]) return;
        if (current[part].subfolders) {
          current = current[part].subfolders;
        } else {
          return;
        }
      }
      
      if (current.files) {
        delete current.files[filename];
      }
    }
    
    saveFS();
    
    // Notify popup to update stats
    chrome.runtime.sendMessage({ action: 'update_stats' });
  }

  function attachDragDropHandlers() {
    // Add click handlers for file viewing/downloading
    attachFileClickHandlers();
    
    const fileItems = document.querySelectorAll('.file-item[draggable="true"]');
    const folderItems = document.querySelectorAll('.folder-item');

    fileItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('filename', item.dataset.filename);
        e.dataTransfer.setData('oldpath', item.dataset.path);
        item.classList.add('dragging');
      });

      item.addEventListener('dragend', (e) => {
        item.classList.remove('dragging');
      });
    });

    folderItems.forEach(folder => {
      folder.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        folder.classList.add('drag-over');
      });

      folder.addEventListener('dragleave', (e) => {
        folder.classList.remove('drag-over');
      });

      folder.addEventListener('drop', (e) => {
        e.preventDefault();
        folder.classList.remove('drag-over');

        const filename = e.dataTransfer.getData('filename');
        const oldPath = e.dataTransfer.getData('oldpath');
        const newPath = folder.dataset.path;

        if (oldPath !== newPath) {
          moveFile(filename, oldPath, newPath);
        }
      });
    });
  }

  function moveFile(filename, fromPath, toPath) {
    const content = getFileContent(fromPath, filename);
    if (!content) {
      alert('❌ File not found');
      return;
    }

    removeFile(fromPath, filename);
    addFileToFS(toPath, filename, content);

    alert(`✅ Moved ${filename} to ${toPath}`);
    refreshFileManager();
  }

  function getFileContent(path, filename) {
    const parts = path.split('/').filter(p => p);

    if (parts.length === 0) {
      return virtualFS.files?.[filename]?.content;
    }

    let current = virtualFS.folders;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) return null;

      if (i === parts.length - 1) {
        return current[part].files?.[filename]?.content;
      } else {
        current = current[part].subfolders;
      }
    }

    return null;
  }

  function removeFile(path, filename) {
    const parts = path.split('/').filter(p => p);

    if (parts.length === 0) {
      delete virtualFS.files[filename];
    } else {
      let current = virtualFS.folders;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          delete current[part].files[filename];
        } else {
          current = current[part].subfolders;
        }
      }
    }

    saveFS();
  }

  function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
      'js': '⚡', 'jsx': '⚛️', 'ts': '💙', 'tsx': '💙', 'py': '🐍',
      'java': '☕', 'cpp': '⚙️', 'c': '⚙️', 'html': '🌐', 'css': '🎨',
      'json': '📋', 'md': '📝', 'txt': '📄', 'yml': '⚙️', 'yaml': '⚙️'
    };
    return iconMap[ext] || '📄';
  }

  function findFileInFS(filename) {
    function searchFolder(folderObj) {
      if (folderObj.files && folderObj.files[filename]) {
        return folderObj.files[filename].content;
      }
      if (folderObj.subfolders) {
        for (const subfolder of Object.values(folderObj.subfolders)) {
          const result = searchFolder(subfolder);
          if (result) return result;
        }
      }
      return null;
    }

    if (virtualFS.files && virtualFS.files[filename]) {
      return virtualFS.files[filename].content;
    }

    if (virtualFS.folders) {
      for (const folder of Object.values(virtualFS.folders)) {
        const result = searchFolder(folder);
        if (result) return result;
      }
    }

    return null;
  }

  function generateFolderOptions() {
    let options = '';
    function traverse(folderObj, path) {
      for (const [name, folder] of Object.entries(folderObj.subfolders || {})) {
        const folderPath = path + name + '/';
        options += `<option value="${folderPath}">📁 ${folderPath}</option>`;
        traverse(folder, folderPath);
      }
    }
    for (const [name, folder] of Object.entries(virtualFS.folders || {})) {
      const path = '/' + name + '/';
      options += `<option value="${path}">📁 ${path}</option>`;
      traverse(folder, path);
    }
    return options;
  }

  function fileExists(folder, filename) {
    const parts = folder.split('/').filter(p => p);

    if (parts.length === 0) {
      return virtualFS.files && virtualFS.files[filename];
    } else {
      let current = virtualFS.folders;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) return false;

        if (i === parts.length - 1) {
          return current[part].files && current[part].files[filename];
        } else {
          current = current[part].subfolders;
        }
      }
    }

    return false;
  }

  function addFileToFS(folderPath, filename, content) {
    const parts = folderPath.split('/').filter(p => p);

    if (parts.length === 0) {
      if (!virtualFS.files) virtualFS.files = {};
      virtualFS.files[filename] = { content, modified: Date.now() };
    } else {
      if (!virtualFS.folders) virtualFS.folders = {};
      let current = virtualFS.folders;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = { subfolders: {}, files: {} };
        }
        if (i === parts.length - 1) {
          current[part].files[filename] = { content, modified: Date.now() };
        } else {
          if (!current[part].subfolders) current[part].subfolders = {};
          current = current[part].subfolders;
        }
      }
    }

    saveFS();
    fileSystemEvents.dispatchEvent(new CustomEvent('filesystemChanged'));
  }

  function saveFS() {
    chrome.storage.local.set({ virtualFS });
  }

  function countFiles() {
    let count = Object.keys(virtualFS.files || {}).length;
    function traverse(folderObj) {
      count += Object.keys(folderObj.files || {}).length;
      for (const folder of Object.values(folderObj.subfolders || {})) traverse(folder);
    }
    for (const folder of Object.values(virtualFS.folders || {})) traverse(folder);
    return count;
  }

  function countFolders() {
    let count = Object.keys(virtualFS.folders || {}).length;
    function traverse(folderObj) {
      count += Object.keys(folderObj.subfolders || {}).length;
      for (const folder of Object.values(folderObj.subfolders || {})) traverse(folder);
    }
    for (const folder of Object.values(virtualFS.folders || {})) traverse(folder);
    return count;
  }

  function createNewFolder() {
    const folderPath = prompt('📁 Create New Folder:\n(e.g., src/components)');
    if (!folderPath) return;

    const parts = folderPath.split('/').filter(p => p);
    if (!virtualFS.folders) virtualFS.folders = {};
    let current = virtualFS.folders;

    for (const part of parts) {
      if (!current[part]) {
        current[part] = { subfolders: {}, files: {} };
      }
      current = current[part].subfolders;
    }

    saveFS();
    alert('✅ Folder created: ' + folderPath);
    refreshFileManager();
  }

  function clearAllFiles() {
    const confirm1 = confirm('⚠️ Delete ALL files and folders?\n\nThis cannot be undone!');
    if (!confirm1) return;

    const confirm2 = confirm('🔥 FINAL WARNING!\n\nProceed with deletion?');
    if (!confirm2) return;

    virtualFS = { folders: {}, files: {} };
    saveFS();
    alert('🗑️ All files deleted');
    refreshFileManager();
  }

  function importProject() {
    const modal = document.createElement('div');
    modal.className = 'magma-element magma-modal';
    modal.innerHTML = `
      <div class="magma-modal-overlay"></div>
      <div class="magma-modal-content">
        <div class="magma-modal-header">
          <h2>📥 Import Files</h2>
          <button class="magma-close-btn">✕</button>
        </div>
        <div class="magma-modal-body">
          <div class="import-options">
            <div class="import-option">
              <strong>📋 JSON Import</strong>
              <p>Import Magma JSON export</p>
              <input type="file" id="json-import-input" accept=".json" style="display: none;">
              <button class="magma-btn magma-btn-primary" id="json-import-btn" style="width: 100%;">
                Choose JSON File
              </button>
            </div>
            <div class="import-option" style="margin-top: 15px;">
              <strong>📁 Folder Import</strong>
              <p>Import entire folder with structure</p>
              <input type="file" id="folder-import-input" webkitdirectory directory multiple style="display: none;">
              <button class="magma-btn magma-btn-success" id="folder-import-btn" style="width: 100%;">
                Choose Folder
              </button>
            </div>
            <div class="import-option" style="margin-top: 15px;">
              <strong>📄 Multiple Files</strong>
              <p>Import files to root folder</p>
              <input type="file" id="files-import-input" multiple style="display: none;">
              <button class="magma-btn magma-btn-secondary" id="files-import-btn" style="width: 100%;">
                Choose Files
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const jsonInput = modal.querySelector('#json-import-input');
    const folderInput = modal.querySelector('#folder-import-input');
    const filesInput = modal.querySelector('#files-import-input');

    modal.querySelector('.magma-close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.magma-modal-overlay').addEventListener('click', () => modal.remove());

    modal.querySelector('#json-import-btn').addEventListener('click', () => jsonInput.click());
    modal.querySelector('#folder-import-btn').addEventListener('click', () => folderInput.click());
    modal.querySelector('#files-import-btn').addEventListener('click', () => filesInput.click());

    // JSON Import
    jsonInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          if (!data.filesystem) {
            alert('❌ Invalid Magma JSON file');
            return;
          }

          const merge = confirm('Merge with existing files?\n\nYES = Keep + Add\nNO = Replace All');

          if (merge) {
            mergeFilesystems(data.filesystem);
          } else {
            virtualFS = data.filesystem;
          }

          saveFS();
          alert('✅ JSON imported successfully!');
          modal.remove();
          refreshFileManager();
        } catch (error) {
          alert('❌ Error: ' + error.message);
        }
      };
      reader.readAsText(file);
    });

    // Folder Import
    folderInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      let imported = 0;
      const processingModal = showProcessingModal(`Importing ${files.length} files...`);

      for (const file of files) {
        const reader = new FileReader();

        await new Promise((resolve) => {
          reader.onload = (event) => {
            const content = event.target.result;
            const fullPath = file.webkitRelativePath;
            const pathParts = fullPath.split('/');
            pathParts.shift(); // Remove root folder name
            const filename = pathParts.pop();
            const folderPath = '/' + pathParts.join('/');

            ensureFolderExists(folderPath);
            addFileToFS(folderPath, filename, content);
            imported++;
            resolve();
          };
          reader.readAsText(file);
        });
      }

      processingModal.remove();
      alert(`✅ Imported ${imported} files with folder structure!`);
      modal.remove();
      refreshFileManager();
    });

    // Multiple Files Import
    filesInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      let imported = 0;
      const processingModal = showProcessingModal(`Importing ${files.length} files...`);

      for (const file of files) {
        const reader = new FileReader();

        await new Promise((resolve) => {
          reader.onload = (event) => {
            const content = event.target.result;
            addFileToFS('/', file.name, content);
            imported++;
            resolve();
          };
          reader.readAsText(file);
        });
      }

      processingModal.remove();
      alert(`✅ Imported ${imported} files to root!`);
      modal.remove();
      refreshFileManager();
    });
  }

  function ensureFolderExists(folderPath) {
    const parts = folderPath.split('/').filter(p => p);
    if (!virtualFS.folders) virtualFS.folders = {};
    let current = virtualFS.folders;

    for (const part of parts) {
      if (!current[part]) {
        current[part] = { subfolders: {}, files: {} };
      }
      if (!current[part].subfolders) current[part].subfolders = {};
      current = current[part].subfolders;
    }

    saveFS();
  }

  function mergeFilesystems(importedFS) {
    if (importedFS.files) {
      if (!virtualFS.files) virtualFS.files = {};
      Object.assign(virtualFS.files, importedFS.files);
    }

    if (importedFS.folders) {
      if (!virtualFS.folders) virtualFS.folders = {};

      function mergeFolders(target, source) {
        if (source.files) {
          if (!target.files) target.files = {};
          Object.assign(target.files, source.files);
        }

        if (source.subfolders) {
          if (!target.subfolders) target.subfolders = {};
          for (const [name, subfolder] of Object.entries(source.subfolders)) {
            if (!target.subfolders[name]) {
              target.subfolders[name] = { subfolders: {}, files: {} };
            }
            mergeFolders(target.subfolders[name], subfolder);
          }
        }
      }

      for (const [name, folder] of Object.entries(importedFS.folders)) {
        if (!virtualFS.folders[name]) {
          virtualFS.folders[name] = { subfolders: {}, files: {} };
        }
        mergeFolders(virtualFS.folders[name], folder);
      }
    }
  }

  function exportProject() {
    const modal = document.createElement('div');
    modal.className = 'magma-element magma-modal';
    modal.innerHTML = `
      <div class="magma-modal-overlay"></div>
      <div class="magma-modal-content">
        <div class="magma-modal-header">
          <h2>💾 Export Project</h2>
          <button class="magma-close-btn">✕</button>
        </div>
        <div class="magma-modal-body">
          <div class="form-group">
            <label>Export Format</label>
            <select id="export-format" class="magma-input">
              <option value="json">📋 JSON (Recommended - Re-importable)</option>
              <option value="files">📦 Individual Files (Download one-by-one)</option>
            </select>
            <div style="margin-top: 8px; font-size: 12px; color: #a0aec0;">
              💡 JSON: Single file you can re-import to Magma<br>
              💡 Individual Files: Downloads each file separately
            </div>
          </div>
          <div class="form-group">
            <label>Project Name</label>
            <input type="text" id="export-name" class="magma-input" 
                   value="magma_project_${new Date().toISOString().split('T')[0]}" />
          </div>
          <button id="export-confirm-btn" class="magma-btn magma-btn-primary" style="width: 100%;">
            💾 Export Now
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.magma-close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.magma-modal-overlay').addEventListener('click', () => modal.remove());

    modal.querySelector('#export-confirm-btn').addEventListener('click', async () => {
      const format = modal.querySelector('#export-format').value;
      const projectName = modal.querySelector('#export-name').value;

      if (format === 'json') {
        exportAsJSON(projectName);
      } else {
        exportAsIndividualFiles(projectName);
      }

      modal.remove();
    });
  }

  function exportAsJSON(projectName) {
    const exportData = {
      name: projectName,
      version: "2.9.1",
      exported: new Date().toISOString(),
      filesystem: virtualFS
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.json`;
    a.click();

    URL.revokeObjectURL(url);
    alert('✅ Exported as JSON!\n\nYou can re-import this file to Magma later.');
  }

  function exportAsIndividualFiles(projectName) {
    let fileCount = 0;
    const delay = 300; // ms between downloads to avoid browser blocking
    
    // Create a folder structure text file first
    const folderStructure = generateFolderStructureText();
    downloadFileWithDelay('_FOLDER_STRUCTURE.txt', folderStructure, 0);
    fileCount++;
    
    let delayCounter = 1;
    
    // Export root files
    for (const [filename, fileObj] of Object.entries(virtualFS.files || {})) {
      const prefixedName = `${projectName}/${filename}`;
      downloadFileWithDelay(prefixedName, fileObj.content, delayCounter * delay);
      fileCount++;
      delayCounter++;
    }

    // Export folder files
    function exportFolderFiles(folderObj, pathPrefix) {
      for (const [filename, fileObj] of Object.entries(folderObj.files || {})) {
        const fullPath = `${pathPrefix}${filename}`;
        downloadFileWithDelay(fullPath, fileObj.content, delayCounter * delay);
        fileCount++;
        delayCounter++;
      }

      for (const [name, subfolder] of Object.entries(folderObj.subfolders || {})) {
        exportFolderFiles(subfolder, `${pathPrefix}${name}/`);
      }
    }

    for (const [name, folder] of Object.entries(virtualFS.folders || {})) {
      exportFolderFiles(folder, `${projectName}/${name}/`);
    }

    alert(`✅ Exporting ${fileCount} files...\n\nFiles will download one-by-one.\nCheck your Downloads folder!\n\nTip: See _FOLDER_STRUCTURE.txt for the project layout.`);
  }

  function downloadFileWithDelay(filename, content, delay) {
    setTimeout(() => {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      console.log(`✅ Downloaded: ${filename}`);
    }, delay);
  }

  function generateFolderStructureText() {
    let structure = `PROJECT MAGMA - FOLDER STRUCTURE
Generated: ${new Date().toISOString()}

This file shows how to organize the downloaded files.
Create these folders and move the files accordingly:

`;

    structure += `📁 Root Files:\n`;
    for (const filename of Object.keys(virtualFS.files || {})) {
      structure += `   📄 ${filename}\n`;
    }
    structure += '\n';

    function addFolderStructure(folderObj, path, indent) {
      for (const [name, subfolder] of Object.entries(folderObj.subfolders || {})) {
        structure += `${indent}📁 ${name}/\n`;
        addFolderStructure(subfolder, `${path}${name}/`, indent + '   ');
      }
      
      for (const filename of Object.keys(folderObj.files || {})) {
        structure += `${indent}📄 ${filename}\n`;
      }
    }

    for (const [name, folder] of Object.entries(virtualFS.folders || {})) {
      structure += `📁 ${name}/\n`;
      addFolderStructure(folder, `${name}/`, '   ');
      structure += '\n';
    }

    structure += `\nTotal Files: ${countFiles()}\n`;
    structure += `Total Folders: ${countFolders()}\n`;
    
    return structure;
  }

  function addModalStyles() {
    if (document.getElementById('magma-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'magma-modal-styles';
    style.className = 'magma-element';
    style.textContent = `
      /* Professional Modal Styles */
      .magma-modal {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        z-index: 1000000; display: flex; align-items: center; justify-content: center;
        animation: modalFadeIn 0.2s ease-out;
      }
      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .magma-modal-overlay {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
      }
      .magma-modal-content {
        position: relative; width: 90%; max-width: 600px; max-height: 85vh;
        background: linear-gradient(135deg, #1a0000, #330000, #4a0000, #330000, #1a0000);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 69, 0, 0.8);
        border: 3px solid #ff4500;
        overflow: hidden; display: flex; flex-direction: column;
        animation: contentGlow 3s ease-in-out infinite, modalSlideUp 0.3s ease-out;
      }
      @keyframes contentGlow {
        0%, 100% { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 69, 0, 0.8); }
        50% { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(255, 69, 0, 1); }
      }
      .magma-modal-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 20px;
        background: linear-gradient(90deg, rgba(139, 0, 0, 0.8), rgba(255, 69, 0, 0.3), rgba(139, 0, 0, 0.8));
        border-bottom: 3px solid rgba(255, 69, 0, 0.6);
        position: relative; overflow: hidden;
      }
      .magma-modal-header::before {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 140, 0, 0.4), transparent);
        animation: headerSweep 3s ease-in-out infinite;
      }
      @keyframes headerSweep {
        0% { left: -100%; }
        100% { left: 200%; }
      }
      .magma-modal-header h2 {
        margin: 0; color: #ff6a00; font-size: 20px;
        font-weight: 700;
        text-shadow: 0 0 10px rgba(255, 69, 0, 0.8);
        letter-spacing: 1px;
        position: relative;
        animation: headerPulse 2s ease-in-out infinite;
      }
      @keyframes headerPulse {
        0%, 100% { text-shadow: 0 0 10px rgba(255, 69, 0, 0.8); }
        50% { text-shadow: 0 0 15px rgba(255, 69, 0, 1); }
      }
      .magma-close-btn {
        background: linear-gradient(135deg, #8b0000, #ff4500);
        border: 2px solid #ff6a00; color: #fff; font-size: 20px;
        cursor: pointer; width: 32px; height: 32px;
        display: flex; align-items: center; justify-content: center;
        border-radius: 6px; transition: all 0.3s ease;
      }
      .magma-close-btn:hover {
        transform: scale(1.2) rotate(90deg);
        background: linear-gradient(135deg, #ff4500, #ff6a00);
      }
      .magma-modal-body {
        padding: 20px; overflow-y: auto; flex: 1;
      }
      .magma-stats {
        display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;
      }
      .stat-item {
        background: linear-gradient(135deg, rgba(139, 0, 0, 0.6), rgba(74, 0, 0, 0.6));
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        border: 2px solid rgba(255, 69, 0, 0.4);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      .stat-item::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent, rgba(255, 69, 0, 0.1), transparent);
        animation: statSweep 3s linear infinite;
      }
      @keyframes statSweep {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .stat-item:hover {
        transform: translateY(-5px) rotate(2deg);
        border-color: rgba(255, 69, 0, 0.8);
        box-shadow: 0 4px 12px rgba(255, 69, 0, 0.6);
        animation: statPulse 0.6s ease-in-out infinite;
      }
      @keyframes statPulse {
        0%, 100% { box-shadow: 0 4px 12px rgba(255, 69, 0, 0.6); }
        50% { box-shadow: 0 6px 20px rgba(255, 69, 0, 0.9); }
      }
      .stat-icon {
        font-size: 32px;
        margin-bottom: 8px;
        display: block;
        animation: iconFloat 2s ease-in-out infinite;
      }
      @keyframes iconFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      .stat-value {
        display: block;
        font-size: 28px;
        font-weight: 700;
        color: #ff6a00;
        margin-bottom: 5px;
        text-shadow: 0 0 10px rgba(255, 69, 0, 0.8);
      }
      .stat-label {
        display: block;
        font-size: 11px;
        color: #ffa07a;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .magma-folder-tree {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(26, 0, 0, 0.6));
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        max-height: 300px;
        overflow-y: auto;
        border: 2px solid rgba(255, 69, 0, 0.3);
        box-shadow: inset 0 0 20px rgba(255, 69, 0, 0.1);
      }
      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #ff8c5a;
      }
      .empty-icon {
        font-size: 48px;
        margin-bottom: 15px;
        opacity: 0.5;
        animation: emptyFloat 3s ease-in-out infinite;
      }
      @keyframes emptyFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .folder-item, .file-item {
        padding: 8px 12px;
        margin: 4px 0;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #ffa07a;
        font-size: 13px;
        border: 1px solid transparent;
        position: relative;
      }
      .folder-item:hover, .file-item:hover {
        background: linear-gradient(90deg, rgba(255, 69, 0, 0.3), rgba(255, 140, 0, 0.2));
        border-color: rgba(255, 69, 0, 0.5);
        transform: translateX(8px);
        box-shadow: 0 2px 8px rgba(255, 69, 0, 0.4);
      }
      .file-item.dragging {
        opacity: 0.5;
        transform: scale(0.95);
      }
      .folder-item.drag-over {
        background: rgba(255, 69, 0, 0.3);
        border-color: #ff6a00;
        animation: dragOverPulse 0.5s ease-in-out infinite;
      }
      @keyframes dragOverPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(255, 69, 0, 0.6); }
        50% { box-shadow: 0 0 20px rgba(255, 69, 0, 0.9); }
      }
      .root-folder {
        font-weight: 600;
        color: #ff6a00;
        background: rgba(139, 0, 0, 0.3);
        border-color: rgba(255, 69, 0, 0.5);
        text-shadow: 0 0 5px rgba(255, 69, 0, 0.5);
      }
      .magma-actions-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .magma-btn {
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }
      .magma-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      .magma-btn-primary {
        background: linear-gradient(135deg, #ff4500, #ff6a00, #ff8c00);
        color: #fff;
        border-color: #ff8c00;
        box-shadow: 0 4px 20px rgba(255, 69, 0, 0.6);
      }
      .magma-btn-primary:hover {
        box-shadow: 0 6px 30px rgba(255, 69, 0, 0.8);
        animation: btnFirePulse 0.4s ease-in-out infinite;
      }
      @keyframes btnFirePulse {
        0%, 100% { transform: translateY(-2px) scale(1); }
        50% { transform: translateY(-3px) scale(1.02); }
      }
      .magma-btn-secondary {
        background: linear-gradient(135deg, #8b0000, #b22222, #dc143c);
        color: #fff;
        border-color: #dc143c;
      }
      .magma-btn-secondary:hover {
        box-shadow: 0 6px 20px rgba(220, 20, 60, 0.6);
      }
      .magma-btn-success {
        background: linear-gradient(135deg, #2f855a, #38a169);
        color: #fff;
        border-color: rgba(56, 161, 105, 0.3);
      }
      .magma-btn-danger {
        background: linear-gradient(135deg, #4a0000, #8b0000, #a00000);
        color: #fff;
        border-color: #a00000;
        box-shadow: 0 4px 20px rgba(139, 0, 0, 0.6);
      }
      .magma-btn-danger:hover {
        box-shadow: 0 6px 30px rgba(139, 0, 0, 0.8);
        animation: btnDangerShake 0.3s ease-in-out infinite;
      }
      @keyframes btnDangerShake {
        0%, 100% { transform: translateY(-2px) rotate(0deg); }
        25% { transform: translateY(-2px) rotate(-1deg); }
        75% { transform: translateY(-2px) rotate(1deg); }
      }
      .form-group {
        margin-bottom: 15px;
      }
      .form-group label {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 600;
        color: #a0aec0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .magma-input, .magma-textarea {
        width: 100%;
        padding: 10px 12px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(74, 85, 104, 0.5);
        border-radius: 6px;
        color: #e2e8f0;
        font-family: 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        transition: all 0.2s ease;
      }
      .magma-input:focus, .magma-textarea:focus {
        outline: none;
        border-color: #3182ce;
        background: rgba(0, 0, 0, 0.4);
        box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
      }
      .magma-textarea {
        resize: vertical;
        min-height: 80px;
      }
      .import-option {
        background: rgba(44, 82, 130, 0.1);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid rgba(74, 85, 104, 0.3);
        margin-bottom: 10px;
      }
      .import-option strong {
        display: block;
        margin-bottom: 6px;
        color: #3182ce;
        font-size: 14px;
      }
      .import-option p {
        margin: 6px 0;
        font-size: 12px;
        color: #a0aec0;
      }
      .processing-modal .modal-content {
        background: linear-gradient(135deg, #1a202c, #2d3748);
        padding: 40px;
        border-radius: 12px;
        text-align: center;
        color: #fff;
        min-width: 300px;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top-color: #3182ce;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 20px;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .warning-content {
        max-width: 600px;
        background: linear-gradient(135deg, #2d1111, #1a0000);
        padding: 25px;
        border: 2px solid #fc8181;
      }
      .warning-content h2 {
        color: #fc8181;
        margin-bottom: 15px;
        font-size: 20px;
      }
      .analysis-content {
        max-width: 650px;
        padding: 30px;
      }
      .analysis-content.safe {
        background: linear-gradient(135deg, #1a2d1a, #0d1f0d);
        border: 2px solid #68d391;
      }
      .analysis-content.safe h2 {
        color: #68d391;
      }
      .analysis-content.warning {
        background: linear-gradient(135deg, #2d1111, #1a0000);
        border: 2px solid #fc8181;
      }
      .analysis-content.warning h2 {
        color: #fc8181;
      }
      .analysis-section {
        margin: 15px 0;
        padding: 12px;
        border-radius: 8px;
        border-left: 3px solid;
      }
      .analysis-section.lost {
        background: rgba(252, 129, 129, 0.1);
        border-left-color: #fc8181;
      }
      .analysis-section.added {
        background: rgba(104, 211, 145, 0.1);
        border-left-color: #68d391;
      }
      .analysis-section.changed {
        background: rgba(246, 173, 85, 0.1);
        border-left-color: #f6ad55;
      }
      .analysis-section strong {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
      }
      .analysis-section.lost strong { color: #fc8181; }
      .analysis-section.added strong { color: #68d391; }
      .analysis-section.changed strong { color: #f6ad55; }
      .analysis-section ul {
        margin: 8px 0 0 20px;
        color: #e2e8f0;
      }
      .analysis-section li {
        margin: 6px 0;
        font-size: 13px;
      }
      .analysis-explanation, .analysis-recommendation {
        margin: 15px 0;
        padding: 12px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        border-left: 3px solid #4299e1;
      }
      .analysis-explanation strong, .analysis-recommendation strong {
        display: block;
        margin-bottom: 6px;
        color: #4299e1;
        font-size: 14px;
      }
      .analysis-explanation p, .analysis-recommendation p {
        margin: 0;
        color: #cbd5e0;
        font-size: 13px;
        line-height: 1.5;
      }
      .magma-btn-success {
        background: linear-gradient(135deg, #2f855a, #38a169);
        color: #fff;
        border-color: rgba(56, 161, 105, 0.3);
      }
      .magma-btn-success:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(56, 161, 105, 0.4);
      }
      .magma-modal-body::-webkit-scrollbar,
      .magma-folder-tree::-webkit-scrollbar {
        width: 8px;
      }
      .magma-modal-body::-webkit-scrollbar-track,
      .magma-folder-tree::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
      }
      .magma-modal-body::-webkit-scrollbar-thumb,
      .magma-folder-tree::-webkit-scrollbar-thumb {
        background: rgba(49, 130, 206, 0.3);
        border-radius: 4px;
      }
      .magma-modal-body::-webkit-scrollbar-thumb:hover,
      .magma-folder-tree::-webkit-scrollbar-thumb:hover {
        background: rgba(49, 130, 206, 0.5);
      }
      /* --- Audit Panel Enhancements --- */
      .audit-panel { max-width: 700px !important; }
      .audit-summary {
        background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;
        border-left: 4px solid #555; margin-bottom: 20px;
      }
      .summary-label { font-size: 11px; text-transform: uppercase; color: #888; margin-bottom: 5px; font-weight: bold; }
      .audit-summary p { margin: 0; font-size: 14px; line-height: 1.5; color: #e2e8f0; }

      .changes-grid {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px; margin-bottom: 20px;
      }

      .change-card {
        background: rgba(255,255,255,0.05); border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;
      }
      .change-card .card-header {
        padding: 8px 12px; font-size: 12px; font-weight: bold; text-transform: uppercase;
        background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      
      .change-card.danger-card .card-header { color: #fc8181; }
      .change-card.warning-card .card-header { color: #f6ad55; }
      .change-card.success-card .card-header { color: #68d391; }

      .feature-list { margin: 0; padding: 0; list-style: none; }
      .feature-list li {
        padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px;
      }
      .feature-list li:last-child { border-bottom: none; }
      .empty-list { padding: 15px; text-align: center; font-size: 12px; color: #666; font-style: italic; }

      .recommendation-box {
        margin-bottom: 20px; padding: 10px; background: rgba(66, 153, 225, 0.1);
        border: 1px solid rgba(66, 153, 225, 0.3); border-radius: 6px; font-size: 13px; color: #90cdf4;
      }
      
      .risk-badge {
        font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; letter-spacing: 1px; margin-left: 10px;
      }
      .risk-badge.safe { background: rgba(56, 161, 105, 0.2); color: #68d391; border: 1px solid #38a169; }
      .risk-badge.danger { background: rgba(252, 129, 129, 0.2); color: #fc8181; border: 1px solid #fc8181; }
      
      .audit-actions { display: flex; flex-direction: column; gap: 10px; }
      
      /* AI Suggestion Box Enhanced Styling */
      .audit-panel {
        font-family: 'Monaco', 'Courier New', 'Consolas', monospace !important;
      }
      .audit-panel .magma-modal-body {
        background: linear-gradient(135deg, #1a0000 0%, #2b0808 50%, #1a0000 100%);
        color: #eeeeee;
      }
      .audit-summary {
        background: rgba(255, 69, 0, 0.1) !important;
        border-left: 4px solid #ff4500 !important;
        font-family: 'Monaco', 'Courier New', monospace;
      }
      .audit-summary p {
        color: #e2e8f0 !important;
        font-size: 14px;
        font-family: 'Monaco', 'Courier New', monospace;
      }
      .summary-label {
        color: #ff6a00 !important;
        font-weight: bold;
        font-family: 'Monaco', 'Courier New', monospace;
      }
      .change-card {
        background: rgba(0, 0, 0, 0.4) !important;
        border: 1px solid rgba(255, 69, 0, 0.3) !important;
      }
      .change-card .card-header {
        background: rgba(255, 69, 0, 0.2) !important;
        font-family: 'Monaco', 'Courier New', monospace;
        font-weight: bold;
      }
      .feature-list {
        font-family: 'Monaco', 'Courier New', monospace;
      }
      .feature-list li {
        color: #cbd5e0 !important;
        font-size: 13px;
      }
      .recommendation-box {
        background: rgba(255, 69, 0, 0.15) !important;
        border: 1px solid rgba(255, 140, 0, 0.4) !important;
        color: #ffa500 !important;
        font-family: 'Monaco', 'Courier New', monospace;
      }
      .risk-badge {
        font-family: 'Monaco', 'Courier New', monospace !important;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }
      .risk-badge.safe {
        background: rgba(56, 161, 105, 0.3) !important;
        color: #68d391 !important;
        border: 2px solid #38a169 !important;
      }
      .risk-badge.danger {
        background: rgba(255, 69, 0, 0.3) !important;
        color: #ff6a00 !important;
        border: 2px solid #ff4500 !important;
      }
    `;

    document.head.appendChild(style);
  }

  function observeCodeBlocks() {
    const observer = new MutationObserver(() => {
      if (magmaActive) injectCaptureButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

console.log('🔥 Magma v2.9.1 Professional loaded - All features fixed');
