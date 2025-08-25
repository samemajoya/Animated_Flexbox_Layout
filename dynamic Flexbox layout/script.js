const flexContainer = document.getElementById('flexContainer');
const addBtn = document.getElementById('addItem');
const removeBtn = document.getElementById('removeItem');

let itemCount = 0;
let draggedItem = null;

// Random color generator
function getRandomColor() {
  return `hsl(${Math.random() * 360}, 70%, 50%)`;
}

// Add new flex item
function addItem() {
  itemCount++;
  const item = document.createElement('div');
  item.classList.add('flex-item');
  item.textContent = `Item ${itemCount}`;
  item.style.backgroundColor = getRandomColor();
  item.setAttribute('draggable', true);

  // Desktop drag events
  item.addEventListener('dragstart', () => {
    draggedItem = item;
    item.classList.add('dragging');
    setTimeout(() => item.style.display = 'none', 0);
  });
  item.addEventListener('dragend', () => {
    draggedItem = null;
    item.classList.remove('dragging');
    item.style.display = 'block';
    animateFlex();
  });

  // Touch events for mobile
  item.addEventListener('touchstart', (e) => {
    draggedItem = item;
    item.classList.add('dragging');
  });
  item.addEventListener('touchend', () => {
    draggedItem.classList.remove('dragging');
    draggedItem = null;
    animateFlex();
  });

  flexContainer.appendChild(item);
  animateFlex();
}

// Remove last flex item
function removeItem() {
  const lastItem = flexContainer.lastChild;
  if (!lastItem) return;

  lastItem.style.opacity = '0';
  lastItem.style.transform = 'scale(0.8)';
  setTimeout(() => {
    flexContainer.removeChild(lastItem);
    itemCount--;
    animateFlex();
  }, 300);
}

// Drag over for desktop
flexContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(flexContainer, e.clientY);
  if (!afterElement) flexContainer.appendChild(draggedItem);
  else flexContainer.insertBefore(draggedItem, afterElement);
  animateFlex();
});

// Helper to find element after drag/touch
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.flex-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
    else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Animate flex items (smooth rearrangement)
function animateFlex() {
  const items = [...flexContainer.children];
  items.forEach(item => {
    item.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  });
}

// Event listeners
addBtn.addEventListener('click', addItem);
removeBtn.addEventListener('click', removeItem);

// Add initial items
for (let i = 0; i < 6; i++) addItem();
