/* ========================================================================
   PROJECT MAGMA - POPUP CONTROL PANEL
   Version 2.1 - Fixed for Comet API
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Element references
  const setupView = document.getElementById('setup-view');
  const mainInterface = document.getElementById('main-interface');
  const slashOverlay = document.getElementById('slash-overlay');
  const statusDisplay = document.getElementById('status-display');

  // Buttons
  const activateBtn = document.getElementById('activate-btn');
  const deactivateBtn = document.getElementById('deactivate-btn');
  const saveKeyBtn = document.getElementById('save-key-btn');
  const updateKeyBtn = document.getElementById('update-key-btn');
  const clearFsBtn = document.getElementById('clear-fs-btn');
  const exportJsonBtn = document.getElementById('export-json-btn');

  // Inputs
  const apiKeyInput = document.getElementById('api-key-input');
  const apiKeyUpdate = document.getElementById('api-key-update');

  // Stats
  const fileCountEl = document.getElementById('file-count');
  const folderCountEl = document.getElementById('folder-count');

  /**
   * Initialize popup
   */
  function init() {
    checkMagmaStatus();
    loadStats();
    attachEventListeners();
    // Load the saved model when you open the popup
    chrome.storage.local.get(['selectedModel'], (result) => {
      if (result.selectedModel) {
        document.getElementById('model-select').value = result.selectedModel;
      }
    });
  }

  /**
   * Check if Magma is already active
   */
  function checkMagmaStatus() {
    chrome.storage.local.get(['magmaActive', 'cometApiKey'], (result) => {
      if (result.magmaActive) {
        showMainInterface();
      } else {
        showSetupView();
      }

      if (result.cometApiKey) {
        updateStatus('Comet API key configured ✓', 'success');
        activateBtn.disabled = false;
      }
    });
  }

  /**
   * Load filesystem statistics
   */
  function loadStats() {
    chrome.storage.local.get(['virtualFS'], (result) => {
      if (result.virtualFS) {
        const fs = result.virtualFS;
        const fileCount = countFiles(fs);
        const folderCount = countFolders(fs);

        fileCountEl.textContent = fileCount;
        folderCountEl.textContent = folderCount;
      }
    });
  }

  /**
   * Count files in filesystem
   */
  function countFiles(fs) {
    let count = Object.keys(fs.files || {}).length;

    function countInFolder(folderObj) {
      count += Object.keys(folderObj.files || {}).length;
      for (const subfolder of Object.values(folderObj.subfolders || {})) {
        countInFolder(subfolder);
      }
    }

    for (const folder of Object.values(fs.folders || {})) {
      countInFolder(folder);
    }

    return count;
  }

  /**
   * Count folders in filesystem
   */
  function countFolders(fs) {
    let count = Object.keys(fs.folders || {}).length;

    function countInFolder(folderObj) {
      count += Object.keys(folderObj.subfolders || {}).length;
      for (const subfolder of Object.values(folderObj.subfolders || {})) {
        countInFolder(subfolder);
      }
    }

    for (const folder of Object.values(fs.folders || {})) {
      countInFolder(folder);
    }

    return count;
  }

  /**
   * Attach event listeners
   */
  function attachEventListeners() {
    // Save API key
    saveKeyBtn.addEventListener('click', saveApiKey);
    updateKeyBtn.addEventListener('click', updateApiKey);

    // Activate/Deactivate
    activateBtn.addEventListener('click', activateMagmaMode);
    deactivateBtn.addEventListener('click', deactivateMagmaMode);

    // Filesystem management
    clearFsBtn.addEventListener('click', clearFilesystem);
    exportJsonBtn.addEventListener('click', exportFilesystem);

    // Enter key support
    apiKeyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') saveApiKey();
    });

    apiKeyUpdate.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') updateApiKey();
    });
    // Save the model as soon as you change the dropdown
    document.getElementById('model-select').addEventListener('change', (e) => {
      const model = e.target.value;
      chrome.storage.local.set({ selectedModel: model }, () => {
        statusDisplay.textContent = `Model switched to: ${model}`;
        setTimeout(() => { statusDisplay.textContent = "Magma mode active!"; }, 2000);
      });
    });
  }

  /**
   * Save API key
   */
  function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();



    // Save as 'cometApiKey'
    chrome.storage.local.set({ cometApiKey: apiKey }, () => {
      updateStatus('✅ Comet API Key saved successfully!', 'success');
      apiKeyInput.value = '';

      // Enable activate button
      activateBtn.disabled = false;
    });
  }

  /**
   * Update API key
   */
  function updateApiKey() {
    const apiKey = apiKeyUpdate.value.trim();



    chrome.storage.local.set({ cometApiKey: apiKey }, () => {
      updateStatus('✅ API key updated successfully!', 'success');
      apiKeyUpdate.value = '';
    });
  }

  /**
   * Activate Magma Mode with smooth animation
   */
  function activateMagmaMode() {
    chrome.storage.local.get(['cometApiKey'], (result) => {
      if (!result.cometApiKey) {
        updateStatus('❌ Please save your Comet API key first', 'error');
        return;
      }

      // Start activation sequence
      document.body.classList.add('shake-hard');

      // Slash animation
      slashOverlay.style.opacity = '1';
      slashOverlay.style.transition = 'width 0.25s ease-out';
      slashOverlay.style.width = '150%';

      setTimeout(() => {
        // Fade out slash
        slashOverlay.style.opacity = '0';
        document.body.classList.remove('shake-hard');

        // Activate in storage
        chrome.storage.local.set({ magmaActive: true }, () => {
          // Send message to content script to activate
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: 'activate_magma'
              });
            }
          });

          // Switch to main interface
          setTimeout(() => {
            showMainInterface();
            updateStatus('🌋 Magma mode activated! Visit Gemini to see the magic.', 'success');
          }, 200);
        });
      }, 450);
    });
  }

  /**
   * Deactivate Magma Mode
   */
  function deactivateMagmaMode() {
    if (!confirm('Are you sure you want to deactivate Magma mode? (Your filesystem will be preserved)')) {
      return;
    }

    chrome.storage.local.set({ magmaActive: false }, () => {
      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'deactivate_magma'
          });
        }
      });

      showSetupView();
      updateStatus('Magma mode deactivated', 'success');
    });
  }

  /**
   * Clear filesystem
   */
  function clearFilesystem() {
    if (!confirm('⚠️ This will delete all files and folders in your virtual filesystem. Continue?')) {
      return;
    }

    const emptyFS = { folders: {}, files: {} };

    chrome.storage.local.set({ virtualFS: emptyFS }, () => {
      updateStatus('✅ Filesystem cleared', 'success');
      fileCountEl.textContent = '0';
      folderCountEl.textContent = '0';

      // Notify content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'clear_filesystem'
          });
        }
      });
    });
  }

  /**
   * Export filesystem as JSON
   */
  function exportFilesystem() {
    chrome.storage.local.get(['virtualFS'], (result) => {
      const fs = result.virtualFS || { folders: {}, files: {} };

      const exportData = {
        name: "Project Magma Export",
        version: "2.1",
        exported: new Date().toISOString(),
        fileCount: countFiles(fs),
        folderCount: countFolders(fs),
        filesystem: fs
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `magma_filesystem_${timestamp}.json`;

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);

      updateStatus(`✅ Filesystem exported: ${filename}`, 'success');
    });
  }

  /**
   * Show setup view
   */
  function showSetupView() {
    setupView.classList.add('active');
    mainInterface.classList.remove('active');
  }

  /**
   * Show main interface
   */
  function showMainInterface() {
    setupView.classList.remove('active');
    mainInterface.classList.add('active');
    loadStats();
  }

  /**
   * Update status display
   */
  function updateStatus(text, type = '') {
    statusDisplay.textContent = text;
    statusDisplay.className = type;
  }

  /**
   * Shake animation class
   */
  const style = document.createElement('style');
  style.textContent = `
    .shake-hard {
      animation: shakeIntense 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    @keyframes shakeIntense {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      10%, 30%, 50%, 70%, 90% { transform: translate(-4px, 1px) rotate(-0.5deg); }
      20%, 40%, 60%, 80% { transform: translate(4px, -1px) rotate(0.5deg); }
    }
  `;
  document.head.appendChild(style);

  // Initialize
  init();

  // Refresh stats every 2 seconds when interface is active
  setInterval(() => {
    if (mainInterface.classList.contains('active')) {
      loadStats();
    }
  }, 2000);
});

/**
 * Listen for messages from content script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'update_stats') {
    const fileCountEl = document.getElementById('file-count');
    const folderCountEl = document.getElementById('folder-count');

    if (fileCountEl && folderCountEl) {
      chrome.storage.local.get(['virtualFS'], (result) => {
        if (result.virtualFS) {
          const fs = result.virtualFS;

          let fileCount = Object.keys(fs.files || {}).length;
          let folderCount = Object.keys(fs.folders || {}).length;

          function countInFolder(folderObj) {
            fileCount += Object.keys(folderObj.files || {}).length;
            folderCount += Object.keys(folderObj.subfolders || {}).length;
            for (const subfolder of Object.values(folderObj.subfolders || {})) {
              countInFolder(subfolder);
            }
          }

          for (const folder of Object.values(fs.folders || {})) {
            countInFolder(folder);
          }

          fileCountEl.textContent = fileCount;
          folderCountEl.textContent = folderCount;
        }
      });
    }
  }
});

console.log('🌋 Magma popup loaded! Version 2.9.1');
