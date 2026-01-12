// Aguarda o carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. DADOS E CATEGORIAS
    // ============================================

    let transactions = [];

        const categoryOptions = {
        entrada: [
            "Mensalidade de Sócio",
            "Doação / Patrocínio",
            "Venda de Produtos",
            "Renda de Eventos",
            "PIX Recebido",
            "Outros"
        ],
        saida: [
            // Contas Básicas
            "Conta de Água",
            "Conta de Energia",
            "Aluguel do Espaço",
            "Internet e Telefone",
            
            // Manutenção
            "Manutenção Predial (Reformas)",
            "Manutenção de Equipamentos",
            "Limpeza e Conservação",
            
            // Compras
            "Compras - Material de Escritório",
            "Compras - Alimentos/Lanche",
            "Compras - Equipamentos Novos",
            
            // Pessoal
            "Pagamento de Pessoal",
            "Transporte",
            "Outros"
        ]
    };

    // ============================================
    // 2. ATUALIZAR CATEGORIAS (Select Dinâmico)
    // ============================================

    const typeSelect = document.getElementById('type');
    const categorySelect = document.getElementById('category');

    function updateCategories() {
        const selectedType = typeSelect.value; // 'entrada' ou 'saida'
        
        // Limpa as opções atuais
        categorySelect.innerHTML = "";

        // Pega a lista correta
        const options = categoryOptions[selectedType];

        // Cria as novas opções
        options.forEach(function(option) {
            const el = document.createElement('option');
            el.value = option;
            el.textContent = option;
            categorySelect.appendChild(el);
        });
    }

    // Monitora a mudança no campo "Tipo"
    typeSelect.addEventListener('change', updateCategories);

    // Carrega as categorias iniciais
    updateCategories();

    // ============================================
    // 3. ADICIONAR LANÇAMENTO
    // ============================================

    const financeForm = document.getElementById('financeForm');

    financeForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const desc = document.getElementById('desc').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;

        if (!desc || isNaN(amount) || amount <= 0) {
            alert('Preencha a descrição e um valor válido.');
            return;
        }

        const transaction = {
            id: Date.now(),
            desc: desc,
            amount: amount,
            type: type,
            category: category
        };

        transactions.push(transaction);
        updateScreen();
        
        financeForm.reset();
        updateCategories(); // Volta as categorias para o padrão
    });

    // ============================================
    // 4. ATUALIZAR TELA (Tabela e Cards)
    // ============================================

    function updateScreen() {
        const list = document.getElementById('transactionsList');
        const totalIncomeEl = document.getElementById('totalIncome');
        const totalExpenseEl = document.getElementById('totalExpense');
        const totalBalanceEl = document.getElementById('totalBalance');

        list.innerHTML = "";
        
        let income = 0;
        let expense = 0;

        transactions.forEach(function(t) {
            
            if (t.type === 'entrada') {
                income += t.amount;
            } else {
                expense += t.amount;
            }

            const row = document.createElement('tr');
            
            // Define classes e textos visuais
            const typeClass = t.type === 'entrada' ? 'entry-in' : 'entry-out';
            const typeLabel = t.type === 'entrada' ? 'Entrada' : 'Saída';

            row.innerHTML = `
                <td>${t.desc}</td>
                <td>${t.category}</td>
                <td class="${typeClass}">${typeLabel}</td>
                <td>R$ ${t.amount.toFixed(2)}</td>
                <td>
                    <button class="delete-btn" onclick="removeTransaction(${t.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            list.appendChild(row);
        });

        // Atualiza os totais
        totalIncomeEl.innerText = `R$ ${income.toFixed(2)}`;
        totalExpenseEl.innerText = `R$ ${expense.toFixed(2)}`;
        
        const balance = income - expense;
        totalBalanceEl.innerText = `R$ ${balance.toFixed(2)}`;
        
        // Muda cor do saldo se negativo
        totalBalanceEl.style.color = balance < 0 ? '#e74c3c' : '#003049';
    }

    // ============================================
    // 5. REMOVER ITEM
    // ============================================
    
    window.removeTransaction = function(id) {
        if(confirm('Deseja excluir este item?')) {
            transactions = transactions.filter(function(t) {
                return t.id !== id;
            });
            updateScreen();
        }
    };
});
