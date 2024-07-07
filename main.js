document.addEventListener('DOMContentLoaded', () => {
    const editorInput = document.querySelector('.editor-input');
    const addBlock = document.getElementById('add-block');
    let isCommandActive = false;
    let commandText = '';
  
    const commands = {
      heading1: () => transformTextToHeading(false),
      expandableHeading1: () => transformTextToHeading(true),
    };
  
    editorInput.addEventListener('keydown', handleEditorKeydown);
    document.querySelectorAll('.single-command').forEach(command =>
      command.addEventListener('click', handleCommandClick)
    );
  
    editorInput.addEventListener('input', handleEditorInput);
    document.addEventListener('click', handleDocumentClick);
  
    function handleEditorKeydown(event) {
      if (event.key === '/' && !isCommandActive) {
        isCommandActive = true;
        commandText = '/';
        return;
      }
  
      if (event.key === ' ' && (editorInput.textContent === '#' || editorInput.textContent === '>>#')) {
        event.preventDefault();
        addBlock.style.display = 'none';
        if (editorInput.textContent === '#') {
          editorInput.textContent = '';
          transformTextToHeading(false);
        } else if (editorInput.textContent === '>>#') {
          editorInput.textContent = '';
          transformTextToHeading(true);
        }
        resetCommandState();
        return;
      }
  
      if (isCommandActive) {
        if (event.key === 'Backspace') {
          commandText = commandText.slice(0, -1);
          if (commandText.length < 2) {
            addBlock.style.display = 'none';
            isCommandActive = false;
          } else {
            checkCommand();
          }
          return;
        }
  
        commandText += event.key;
        checkCommand();
  
        if (event.key === 'Escape') {
          resetCommandState();
        }
  
        if (event.key === 'Enter') {
          event.preventDefault();
          addBlock.style.display = 'none';
          if (commandText === '/1') {
            editorInput.textContent = '';
          }
          resetCommandState();
        }
      }
    }
  
    function handleCommandClick() {
      const type = this.dataset.command;
      addBlock.style.display = 'none';
      if (commands[type]) {
        commands[type]();
      }
    }
  
    function handleEditorInput() {
      if (editorInput.textContent.trim() === '') {
        editorInput.classList.add('empty');
      } else {
        editorInput.classList.remove('empty');
      }
      checkCommand();
    }
  
    function handleDocumentClick(event) {
      if (event.target.matches('.h1-wrapper h1, .expandable-h1-wrapper h1')) {
        event.target.contentEditable = true;
        event.target.focus();
      }
    }
  
    function checkCommand() {
      if (commandText === '/1') {
        const rect = editorInput.getBoundingClientRect();
        addBlock.style.top = `${rect.bottom}px`;
        addBlock.style.left = `${rect.left}px`;
        addBlock.style.display = 'block';
      } else {
        addBlock.style.display = 'none';
      }
    }
  
    function transformTextToHeading(isExpandable) {
      editorInput.textContent = '';
      const inputField = document.createElement('input');
      inputField.type = 'text';
      inputField.placeholder = 'Heading 1';
      inputField.className = 'h1-input';
  
      const style = document.createElement('style');
      style.innerHTML = `
        .h1-input::placeholder {
          color: #d1d5db;
        }
      `;
      document.head.appendChild(style);
  
      inputField.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          createHeadingElement(inputField.value, isExpandable);
          resetCommandState();
          editorInput.focus();
        }
      });
  
      editorInput.appendChild(inputField);
      inputField.focus();
    }
  
    function createHeadingElement(text, isExpandable) {
      const h1Wrapper = document.createElement('div');
      h1Wrapper.className = isExpandable ? 'expandable-h1-wrapper' : 'h1-wrapper';
  
      const h1 = document.createElement('h1');
      h1.contentEditable = true;
      h1.textContent = text;
      h1.style.outline = 'none';
  
      h1Wrapper.appendChild(h1);
  
      if (isExpandable) {
        const content = document.createElement('div');
        content.className = 'expandable-content';
        h1Wrapper.appendChild(content);
      }
  
      editorInput.parentNode.insertBefore(h1Wrapper, editorInput);
      editorInput.innerHTML = '';
      editorInput.dataset.placeholder = 'Type / for blocks, @ to link docs or people';
    }
  
    function resetCommandState() {
      isCommandActive = false;
      commandText = '';
      addBlock.style.display = 'none';
    }
  });
  