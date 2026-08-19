document.addEventListener('DOMContentLoaded', () => {
    const parts = document.querySelectorAll('.part');
    const slots = document.querySelectorAll('.slot');
    const tryBtn = document.getElementById('tryOpenBtn');
    const door = document.getElementById('door');
    const modal = document.getElementById('modalExplanation');
    const inventoryArea = document.querySelector('.parts-container');
    
    let draggedPart = null;

    // A ordem correta esperada para montar o Caso de Teste
    const requiredOrder = ['precondicao', 'dados', 'passos', 'resultado'];

    parts.forEach(part => {
        part.addEventListener('dragstart', (e) => {
            draggedPart = part;
            e.dataTransfer.effectAllowed = 'move';
            // Slight delay so the element doesn't disappear before drag starts
            setTimeout(() => part.style.opacity = '0.5', 0);
        });

        part.addEventListener('dragend', (e) => {
            part.style.opacity = '1';
            draggedPart = null;
        });
    });

    slots.forEach((slot, index) => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('hovered');
            e.dataTransfer.dropEffect = 'move';
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('hovered');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('hovered');
            
            if (draggedPart) {
                // Se já existir uma peça no slot, devolve pro inventário
                if (slot.children.length > 0) {
                    const existingPart = slot.children[0];
                    inventoryArea.appendChild(existingPart);
                }
                
                slot.appendChild(draggedPart);
                checkSlots();
            }
        });
    });

    // Permitir devolver pro inventário
    inventoryArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    
    inventoryArea.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedPart) {
            inventoryArea.appendChild(draggedPart);
            checkSlots();
        }
    });

    function checkSlots() {
        let isFull = true;
        slots.forEach(slot => {
            if (slot.children.length === 0) {
                isFull = false;
            }
        });
        
        tryBtn.disabled = !isFull;
    }

    tryBtn.addEventListener('click', () => {
        let isCorrect = true;
        
        slots.forEach((slot, index) => {
            const part = slot.children[0];
            if (!part || part.getAttribute('data-type') !== requiredOrder[index]) {
                isCorrect = false;
            }
        });

        if (isCorrect) {
            door.classList.add('open');
            setTimeout(() => {
                modal.classList.remove('hidden');
            }, 1200);
        } else {
            alert("A chave falhou! A estrutura do Caso de Teste está na ordem errada.\n\nDica: Pense na ordem lógica:\n1. Onde você está (Pré-condição)\n2. O que você usa (Dados)\n3. O que você faz (Passos)\n4. O que você ganha (Resultado)");
        }
    });
});
