const StorageKeys = {
  CUSTOM_MODS: 'physics_playground_custom_mods',
  ACTIVE_MODS: 'physics_playground_active_mods'
};

// Initialize activeMods from localStorage
export const activeMods = JSON.parse(localStorage.getItem(StorageKeys.ACTIVE_MODS)) || {
  furniture: false,
  building: false,
  power: false,
  hazards: false
};

// Save activeMods whenever they change
function saveActiveMods() {
  localStorage.setItem(StorageKeys.ACTIVE_MODS, JSON.stringify(activeMods));
}

// Add custom mods storage
let customMods = JSON.parse(localStorage.getItem(StorageKeys.CUSTOM_MODS)) || {};

export function addCustomMod(name, description, code) {
  const modId = name.toLowerCase().replace(/\s+/g, '-');
  
  // Create the mod object
  customMods[modId] = { 
    name, 
    description, 
    code,
    spawn: new Function('x', 'y', 'Matter', 'world', code) 
  };
  
  activeMods[modId] = false;
  
  // Save to localStorage
  localStorage.setItem(StorageKeys.CUSTOM_MODS, JSON.stringify(customMods));
  saveActiveMods();
  
  // Save to localStorage
  localStorage.setItem('customMods', JSON.stringify(customMods));
  
  // Render the mod in UI
  renderCustomMod(modId, name, description);
  
  // Add spawn button to UI
  addCustomModSpawnButton(modId, name);
}

export function deleteCustomMod(modId) {
  // Remove from activeMods
  delete activeMods[modId];
  
  // Remove from customMods
  delete customMods[modId];
  
  localStorage.setItem(StorageKeys.CUSTOM_MODS, JSON.stringify(customMods));
  saveActiveMods();
  
  // Remove mod from UI
  const modElement = document.querySelector(`.mod-item[data-mod-id="${modId}"]`);
  if (modElement) {
    modElement.remove();
  }
  
  // Remove category button and items
  const categoryButton = document.querySelector(`.spawn-category[data-category="${modId}"]`);
  const categoryItems = document.querySelector(`.category-items[data-category="${modId}"]`);
  if (categoryButton) categoryButton.remove();
  if (categoryItems) categoryItems.remove();
}

function addCustomModSpawnButton(modId, name) {
  // Create category if it doesn't exist
  let categoryContainer = document.querySelector(`.category-items[data-category="${modId}"]`);
  if (!categoryContainer) {
    // Add category button
    const categoriesContainer = document.querySelector('.spawn-categories');
    const categoryButton = document.createElement('button');
    categoryButton.className = 'spawn-category';
    categoryButton.dataset.category = modId;
    categoryButton.textContent = name;
    categoryButton.style.display = 'none'; // Hidden by default until mod is enabled
    categoriesContainer.appendChild(categoryButton);
    
    // Add category items container
    categoryContainer = document.createElement('div');
    categoryContainer.className = 'category-items';
    categoryContainer.dataset.category = modId;
    categoryContainer.style.display = 'none';
    document.querySelector('.spawn-items').appendChild(categoryContainer);
  }
  
  // Add spawn button
  const spawnButton = document.createElement('button');
  spawnButton.className = 'spawn-item';
  spawnButton.id = `custom-${modId}`;
  spawnButton.innerHTML = `
    <div class="item-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="4" y="4" width="16" height="16"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>
    </div>
    ${name}
  `;
  categoryContainer.appendChild(spawnButton);
  
  // Add spawn functionality
  spawnButton.addEventListener('click', () => {
    const mod = customMods[modId];
    try {
      mod.spawn(render.canvas.width / 2, 50, Matter, world);
    } catch (error) {
      console.error('Error spawning custom mod:', error);
    }
  });
}

export function renderCustomMod(modId, name, description) {
  const modList = document.querySelector('.mod-list');
  const modItem = document.createElement('div');
  modItem.className = 'mod-item';
  modItem.dataset.modId = modId;
  modItem.innerHTML = `
    <div class="mod-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="4" y="4" width="16" height="16"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>
    </div>
    <div class="mod-info">
      <h3>${name}</h3>
      <p>${description}</p>
    </div>
    <div class="mod-buttons">
      <button class="mod-button" data-mod-id="${modId}">Enable</button>
      <button class="delete-mod-button" data-mod-id="${modId}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 6l12 12M6 18L18 6"/>
        </svg>
      </button>
    </div>
  `;
  
  modList.appendChild(modItem);
  const enableButton = modItem.querySelector('.mod-button');
  enableButton.addEventListener('click', () => toggleMod(modId));
  
  const deleteButton = modItem.querySelector('.delete-mod-button');
  deleteButton.addEventListener('click', () => deleteCustomMod(modId));
}

export function loadCustomMods() {
  Object.entries(customMods).forEach(([modId, mod]) => {
    activeMods[modId] = false;
    renderCustomMod(modId, mod.name, mod.description);
    addCustomModSpawnButton(modId, mod.name);
  });
}

export function toggleMod(modId) {
  activeMods[modId] = !activeMods[modId];
  saveActiveMods();
  
  const buttons = document.querySelectorAll('.mod-button');
  buttons.forEach(button => {
    if (button.dataset.modId === modId) {
      button.classList.toggle('enabled');
      button.textContent = activeMods[modId] ? 'Disable' : 'Enable';
    }
  });

  // Update visibility of category buttons
  const categoryButtons = {
    furniture: document.querySelector('.spawn-category[data-category="furniture"]'),
    building: document.querySelector('.spawn-category[data-category="building"]'),
    power: document.querySelector('.spawn-category[data-category="power"]'),
    hazards: document.querySelector('.spawn-category[data-category="hazards"]'),
    ...Object.fromEntries(
      Object.keys(customMods).map(modId => [
        modId,
        document.querySelector(`.spawn-category[data-category="${modId}"]`)
      ])
    )
  };
  
  Object.keys(categoryButtons).forEach(mod => {
    if (categoryButtons[mod]) {
      categoryButtons[mod].style.display = activeMods[mod] ? 'block' : 'none';
    }
  });
  
  // Update visibility of category items
  const categoryItems = {
    furniture: document.querySelector('.category-items[data-category="furniture"]'),
    building: document.querySelector('.category-items[data-category="building"]'),
    power: document.querySelector('.category-items[data-category="power"]'),
    hazards: document.querySelector('.category-items[data-category="hazards"]'),
    ...Object.fromEntries(
      Object.keys(customMods).map(modId => [
        modId,
        document.querySelector(`.category-items[data-category="${modId}"]`)
      ])
    )
  };
  
  Object.keys(categoryItems).forEach(mod => {
    if (categoryItems[mod]) {
      categoryItems[mod].style.display = activeMods[mod] ? 'block' : 'none';
    }
  });
}

// Update the add mod form to include code editor
document.querySelector('.add-mod-form').innerHTML = `
  <input type="text" id="mod-name" placeholder="Mod Name">
  <textarea id="mod-description" placeholder="Mod Description"></textarea>
  <textarea id="mod-code" placeholder="Custom JavaScript Code
Example:
// x, y: spawn position
// Matter: physics engine
// world: physics world
const body = Matter.Bodies.circle(x, y, 20, {
  render: {
    fillStyle: '#FFFFFF',
    strokeStyle: '#000000',
    lineWidth: 3
  }
});
Matter.Composite.add(world, body);"></textarea>
  <div class="form-buttons">
    <button id="save-mod">Save Mod</button>
    <button id="cancel-mod">Cancel</button>
  </div>
`;

// Initialize save mod button event listener
document.getElementById('save-mod').addEventListener('click', () => {
  const name = document.getElementById('mod-name').value;
  const description = document.getElementById('mod-description').value;
  const code = document.getElementById('mod-code').value;
  
  addCustomMod(name, description, code);
  
  // Clear form fields
  document.getElementById('mod-name').value = '';
  document.getElementById('mod-description').value = '';
  document.getElementById('mod-code').value = '';
});

// Initialize cancel mod button event listener
document.getElementById('cancel-mod').addEventListener('click', () => {
  // Clear form fields
  document.getElementById('mod-name').value = '';
  document.getElementById('mod-description').value = '';
  document.getElementById('mod-code').value = '';
});

// Load custom mods on page load
loadCustomMods();