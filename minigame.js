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
                document.getElementById('modalTitle').innerHTML = 'Porta Desbloqueada! 🔓';
                document.getElementById('modalDesc').innerHTML = 'Excelente! Assim como no jogo, um <strong>Caso de Teste</strong> funciona como uma chave exata no sistema real.<br><br>Sem todas as informações estruturadas (Pré-condição, Dados, Passos, Resultado), seu relatório não consegue abrir o caminho para identificar defeitos reais.';
                modal.classList.remove('hidden');
                document.getElementById('nextLevelBtn').onclick = () => {
                    modal.classList.add('hidden');
                    document.getElementById('level1').style.display = 'none';
                    document.getElementById('level2').style.display = 'block';
                    document.getElementById('levelIndicator').textContent = '- Nível 2: Revisão';
                };
            }, 1200);
        } else {
            alert("A chave falhou! A estrutura do Caso de Teste está na ordem errada.\n\nDica: Pense na ordem lógica:\n1. Onde você está (Pré-condição)\n2. O que você usa (Dados)\n3. O que você faz (Passos)\n4. O que você ganha (Resultado)");
        }
    });

    // Level 2 Logic
    const level2Btns = document.querySelectorAll('.answer-btn');
    level2Btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.classList.contains('correct')) {
                document.getElementById('modalTitle').innerHTML = 'Revisão Aprovada! ✅';
                document.getElementById('modalDesc').innerHTML = 'Exatamente! A chave do seu colega estava sem o <strong>Resultado Esperado</strong>. Sem saber o que esperar, é impossível validar se o sistema funcionou direito!';
                modal.classList.remove('hidden');
                document.getElementById('nextLevelBtn').onclick = () => {
                    modal.classList.add('hidden');
                    document.getElementById('level2').style.display = 'none';
                    document.getElementById('level3').style.display = 'block';
                    document.getElementById('levelIndicator').textContent = '- Nível 3: Defeitos';
                };
            } else {
                alert('Incorreto! Olhe bem para a chave quebrada: tem Círculo (Pré-condição), Retângulo (Dados) e Ziguezague (Passos)... Falta a última peça!');
            }
        });
    });

    // Level 3 Logic
    const level3Btns = document.querySelectorAll('.answer-btn3');
    level3Btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.classList.contains('correct3')) {
                document.getElementById('modalTitle').innerHTML = 'Bug Capturado! 👾';
                document.getElementById('modalDesc').innerHTML = 'Perfeito! O Bug da Hidra é de severidade <strong>ALTA</strong> porque ele gera dados incorretos e corrompe o fluxo de negócios (impede que um chamado morra de verdade).<br><br>Você sabe documentar falhas!';
                modal.classList.remove('hidden');
                document.getElementById('nextLevelBtn').textContent = 'Finalizar Treinamento';
                document.getElementById('nextLevelBtn').onclick = () => {
                    modal.classList.add('hidden');
                    document.getElementById('level3').style.display = 'none';
                    document.getElementById('level4').style.display = 'block';
                    document.getElementById('levelIndicator').textContent = '- Certificado QA';
                };
            } else {
                alert('Tente novamente! Pense bem: se um sistema não permite que você encerre algo e fica criando lixo no banco de dados automaticamente... isso é só um problema visual?');
            }
        });
    });
});
