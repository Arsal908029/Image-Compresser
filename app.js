(() => {
  const input = document.querySelector('#file-input');
  if (!input) return;
  const dropZone = document.querySelector('#drop-zone');
  const editor = document.querySelector('#editor');
  const quality = document.querySelector('#quality');
  const qualityValue = document.querySelector('#quality-value');
  const format = document.querySelector('#format');
  const status = document.querySelector('#status');
  const result = document.querySelector('#result');
  const compressButton = document.querySelector('#compress-button');
  const resetButton = document.querySelector('#reset-button');
  let sourceFile = null;
  let originalUrl = null;
  let outputUrl = null;
  const MAX_BYTES = 15 * 1024 * 1024;
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);

  const sizeLabel = bytes => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  const clearUrls = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    originalUrl = null;
    outputUrl = null;
  };
  const setStatus = message => { status.textContent = message; };

  function loadFile(file) {
    setStatus('');
    result.hidden = true;
    if (!file) return;
    if (!allowed.has(file.type)) {
      setStatus('Unsupported file. Please choose a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus('This file is larger than 15 MB. Please choose a smaller image.');
      return;
    }
    clearUrls();
    sourceFile = file;
    originalUrl = URL.createObjectURL(file);
    document.querySelector('#file-name').textContent = file.name;
    document.querySelector('#original-meta').textContent = `${sizeLabel(file.size)} • ${file.type.split('/')[1].toUpperCase()}`;
    document.querySelector('#original-preview').src = originalUrl;
    document.querySelector('#original-size').textContent = sizeLabel(file.size);
    editor.hidden = false;
    setStatus('Image ready. Adjust settings, then compress.');
  }

  input.addEventListener('change', () => loadFile(input.files && input.files[0]));
  quality.addEventListener('input', () => { qualityValue.value = `${quality.value}%`; qualityValue.textContent = `${quality.value}%`; });
  format.addEventListener('change', () => {
    const png = format.value === 'image/png';
    quality.disabled = png;
    qualityValue.textContent = png ? 'N/A for PNG' : `${quality.value}%`;
  });
  ['dragenter', 'dragover'].forEach(eventName => dropZone.addEventListener(eventName, event => {
    event.preventDefault(); dropZone.classList.add('dragging');
  }));
  ['dragleave', 'drop'].forEach(eventName => dropZone.addEventListener(eventName, event => {
    event.preventDefault(); dropZone.classList.remove('dragging');
  }));
  dropZone.addEventListener('drop', event => loadFile(event.dataTransfer.files && event.dataTransfer.files[0]));

  compressButton.addEventListener('click', async () => {
    if (!sourceFile) { setStatus('Choose an image first.'); return; }
    compressButton.disabled = true;
    result.hidden = true;
    setStatus('Compressing image…');
    try {
      const bitmap = await createImageBitmap(sourceFile);
      if (bitmap.width * bitmap.height > 40000000) {
        bitmap.close();
        throw new Error('This image has very large dimensions. Try a smaller image.');
      }
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { bitmap.close(); throw new Error('Your browser could not start image processing.'); }
      // JPEG has no transparency, so draw on white instead of black.
      if (format.value === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      const mime = format.value;
      const blob = await new Promise(resolve => canvas.toBlob(resolve, mime, Number(quality.value) / 100));
      canvas.width = 0; canvas.height = 0;
      if (!blob) throw new Error('The browser could not create this output format. Try another format.');
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      outputUrl = URL.createObjectURL(blob);
      document.querySelector('#compressed-preview').src = outputUrl;
      document.querySelector('#compressed-size').textContent = sizeLabel(blob.size);
      document.querySelector('#original-size').textContent = sizeLabel(sourceFile.size);
      const delta = ((sourceFile.size - blob.size) / sourceFile.size) * 100;
      const saving = document.querySelector('#saving-value');
      if (delta >= 0) saving.textContent = `${delta.toFixed(1)}% smaller`;
      else saving.textContent = `${Math.abs(delta).toFixed(1)}% larger`;
      const extension = mime === 'image/jpeg' ? 'jpg' : mime.split('/')[1];
      const link = document.querySelector('#download-button');
      link.href = outputUrl;
      link.download = `${sourceFile.name.replace(/\.[^.]+$/, '')}-compressed.${extension}`;
      result.hidden = false;
      setStatus('Compression complete. Check the preview and file size before downloading.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Compression failed. Please try another image.');
    } finally {
      compressButton.disabled = false;
    }
  });
  resetButton.addEventListener('click', () => {
    clearUrls();
    sourceFile = null;
    input.value = '';
    editor.hidden = true;
    result.hidden = true;
    setStatus('Choose an image to get started.');
  });
  window.addEventListener('beforeunload', clearUrls);
})();
