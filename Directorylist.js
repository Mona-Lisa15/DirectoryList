document.addEventListener("DOMContentLoaded", function () {
  const app = document.getElementById('directory-app');
  const modal = document.getElementById('modal');
  const addForm = document.getElementById('addForm');
  const infoTooltip = document.getElementById('info-tooltip');
  let currentDirectory = null;

  // Directory Structure
  const root = {
      name: 'ROOT',
      children: [],
  };

  function createPanel(directory) {
      const panel = document.createElement('div');
      panel.className = 'panel';

      const header = document.createElement('div');
      header.className = 'directory-header';
      header.innerHTML = `
          <span>${directory.name}</span>
          <span class="info-icon">ℹ️</span>
          <span class="delete-btn">🗑️</span>
      `;

      // Add meta information
      const metaInfo = document.createElement('div');
      metaInfo.className = 'meta-info';
      metaInfo.innerHTML = `
          Name: ${directory.name}<br>
          Folders: ${countImmediateFolders(directory)}<br>
          Files: ${countImmediateFiles(directory)}
      `;
      header.appendChild(metaInfo);

      // Handle directory click to expand
      header.addEventListener('click', () => {
          if (directory.children && directory.children.length > 0) {
              renderDirectory(directory);
          }
      });

      // Handle delete functionality
      header.querySelector('.delete-btn').addEventListener('click', (event) => {
          event.stopPropagation();
          deleteDirectory(directory, root);
          renderDirectory(root);
      });

      // Handle tooltip
      header.querySelector('.info-icon').addEventListener('mouseover', (e) => showTooltip(e, directory));
      header.querySelector('.info-icon').addEventListener('mouseout', hideTooltip);

      panel.appendChild(header);

      // Add button to add new directories/files
      const addButton = document.createElement('button');
      addButton.className = 'add-btn';
      addButton.textContent = '+ Add';
      addButton.addEventListener('click', (event) => {
          event.stopPropagation();
          currentDirectory = directory;
          modal.style.display = 'block';
      });

      panel.appendChild(addButton);

      app.appendChild(panel);
  }

  function renderDirectory(directory) {
      app.innerHTML = '';
      function render(dir) {
          createPanel(dir);
          if (dir.children && dir.children.length > 0) {
              dir.children.forEach(render);
          }
      }
      render(directory);
  }

  function countImmediateFolders(directory) {
      return directory.children ? directory.children.filter(child => child.children).length : 0;
  }

  function countImmediateFiles(directory) {
      return directory.children ? directory.children.filter(child => !child.children).length : 0;
  }

  function countSubdirectories(directory) {
      let count = 0;
      function traverse(dir) {
          if (dir.children) {
              count += dir.children.filter(child => child.children).length;
              dir.children.forEach(traverse);
          }
      }
      traverse(directory);
      return count;
  }

  function countFiles(directory) {
      let count = 0;
      function traverse(dir) {
          if (dir.children) {
              count += dir.children.filter(child => !child.children).length;
              dir.children.forEach(traverse);
          }
      }
      traverse(directory);
      return count;
  }

  function showTooltip(event, directory) {
      const { name } = directory;
      const totalDirs = countSubdirectories(directory);
      const totalFiles = countFiles(directory);
      const immediateDirs = countImmediateFolders(directory);
      const immediateFiles = countImmediateFiles(directory);

      infoTooltip.innerHTML = `
          <strong>Name:</strong> ${name}<br>
          <strong>Immediate Sub-directories:</strong> ${immediateDirs}<br>
          <strong>Immediate Files:</strong> ${immediateFiles}<br>
          <strong>Total Sub-directories:</strong> ${totalDirs}<br>
          <strong>Total Files:</strong> ${totalFiles}
      `;

      infoTooltip.style.left = `${event.clientX + 10}px`;
      infoTooltip.style.top = `${event.clientY + 10}px`;
      infoTooltip.classList.remove('hidden');
  }

  function hideTooltip() {
      infoTooltip.classList.add('hidden');
  }

  function deleteDirectory(directoryToDelete, parentDirectory) {
      const index = parentDirectory.children.indexOf(directoryToDelete);
      if (index !== -1) {
          parentDirectory.children.splice(index, 1);
      } else {
          for (let child of parentDirectory.children) {
              if (child.children) {
                  deleteDirectory(directoryToDelete, child);
              }
          }
      }
  }

  document.querySelector('.close').addEventListener('click', () => {
      modal.style.display = 'none';
  });

  addForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const type = addForm.elements['type'].value;
      const name = document.getElementById('itemName').value;

      if (currentDirectory && name) {
          if (type === 'file') {
              currentDirectory.children.push({ name });
          } else if (type === 'directory') {
              currentDirectory.children.push({ name, children: [] });
          }
          renderDirectory(root);
      }

      modal.style.display = 'none';
      addForm.reset();
  });

  // Initialize rendering
  renderDirectory(root);
});


