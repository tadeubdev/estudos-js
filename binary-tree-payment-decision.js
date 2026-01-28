/**
    Problema real: Sistema de Regras / Segmentação (Decision Tree)
    - O lead tem orçamento acima de X?
    - O cliente já está ativo?
    - O pagamento está atrasado?
    - Cada condição divide em dois caminhos:
        esquerda = NÃO
        direita = SIM
    Objetivo do exercício
    Implementar uma função que, dado um usuário, percorre a árvore e retorna a ação final.
*/

class DecisionNode {
    constructor(question, yesBranch = null, noBranch = null) {
        this.question = question; // Função que retorna true/false
        this.yesBranch = yesBranch; // Nó filho para resposta SIM
        this.noBranch = noBranch;   // Nó filho para resposta NÃO
    }
}

class ActionNode {
    constructor(action) {
        this.action = action; // Ação final a ser tomada
    }
}

const mountTree = (jsonData) => {
    if (jsonData.type === "action") {
        return new ActionNode(jsonData.action);
    } else if (jsonData.type === "decision") {
        return new DecisionNode(
            jsonData.question,
            mountTree(jsonData.yesBranch),
            mountTree(jsonData.noBranch)
        );
    }
    return null;
}

const tree = mountTree({
    type: "decision",
    question: (user) => user.budget > 1000,
    yesBranch: {
        type: "decision",
        question: (user) => user.isActive,
        yesBranch: {
            type: "decision",
            question: (user) => user.isPaymentLate,
            yesBranch: {
                type: "action",
                action: "Enviar lembrete de pagamento"
            },
            noBranch: {
                type: "action",
                action: "Oferecer upgrade de serviço"
            }
        },
        noBranch: {
            type: "action",
            action: "Ativar conta do cliente"
        }
    },
    noBranch: {
        type: "action",
        action: "Enviar proposta de orçamento"
    }
});

const evaluate = (node, user) => {
    const stack = [node];
    while (stack.length > 0) {
        const current = stack.pop();
        if (current instanceof ActionNode) {
            return current.action;
        } else if (current instanceof DecisionNode) {
            if (current.question(user)) {
                stack.push(current.yesBranch);
            } else {
                stack.push(current.noBranch);
            }
        }
    }
};

const user1 = { budget: 1500, isActive: true, isPaymentLate: false, expectedAction: "Oferecer upgrade de serviço" };
const user2 = { budget: 800, isActive: false, isPaymentLate: false, expectedAction: "Enviar proposta de orçamento" };
const user3 = { budget: 2000, isActive: false, isPaymentLate: false, expectedAction: "Ativar conta do cliente" };
const user4 = { budget: 1200, isActive: true, isPaymentLate: true, expectedAction: "Enviar lembrete de pagamento" };

console.log('Ação para user1:', evaluate(tree, user1));
console.log('Ação para user2:', evaluate(tree, user2));
console.log('Ação para user3:', evaluate(tree, user3));
console.log('Ação para user4:', evaluate(tree, user4));

console.log('');

// arvore para decidir se o aluno passa de ano
const tree2 = mountTree({
    type: "decision",
    question: (student) => student.attendance >= 75,
    yesBranch: {
        type: "decision",
        question: (student) => student.averageGrade >= 60,
        yesBranch: {
            type: "action",
            action: "Aprovado"
        },
        noBranch: {
            type: "action",
            action: "Recuperação"
        }
    },
    noBranch: {
        type: "action",
        action: "Reprovado por faltas"
    }
});

const student1 = { attendance: 80, averageGrade: 70, expectedAction: "Aprovado" };
const student2 = { attendance: 70, averageGrade: 90, expectedAction: "Reprovado por faltas" };
const student3 = { attendance: 90, averageGrade: 50, expectedAction: "Recuperação" };

console.log('Decisão para student1:', evaluate(tree2, student1));
console.log('Decisão para student2:', evaluate(tree2, student2));
console.log('Decisão para student3:', evaluate(tree2, student3));

console.log('');

// arvore para decidir se o cliente recebe desconto
const tree3 = mountTree({
    type: "decision",
    question: (customer) => customer.loyaltyYears > 5,
    yesBranch: {
        type: "decision",
        question: (customer) => customer.totalSpent > 1000,
        yesBranch: {
            type: "action",
            action: "Desconto de 20%"
        },
        noBranch: {
            type: "action",
            action: "Desconto de 10%"
        }
    },
    noBranch: {
        type: "decision",
        question: (customer) => customer.totalSpent > 500,
        yesBranch: {
            type: "action",
            action: "Desconto de 5%"
        },
        noBranch: {
            type: "decision",
            question: () => new Date().getDay() === 5, // sexta-feira
            yesBranch: {
                type: "action",
                action: "Desconto especial de 5% de sexta-feira"
            },
            noBranch: {
                type: "action",
                action: "Sem desconto"
            }
        }
    }
});

const customer1 = { loyaltyYears: 6, totalSpent: 1500, expectedAction: "Desconto de 20%" };
const customer2 = { loyaltyYears: 3, totalSpent: 600, expectedAction: "Desconto de 5%" };
const customer3 = { loyaltyYears: 2, totalSpent: 300, expectedAction: "Sem desconto" };

console.log('Decisão para customer1:', evaluate(tree3, customer1));
console.log('Decisão para customer2:', evaluate(tree3, customer2));
console.log('Decisão para customer3:', evaluate(tree3, customer3));

console.log('');

const mountTreeByArray = (arr) => {
    const nodesMap = new Map();
    arr.forEach(item => {
        if (item.type === "action") {
            nodesMap.set(item.id, new ActionNode(item.action));
        } else if (item.type === "decision") {
            nodesMap.set(item.id, new DecisionNode(item.question));
        }
    });
    arr.forEach(item => {
        if (item.type === "decision") {
            const node = nodesMap.get(item.id);
            node.yesBranch = nodesMap.get(item.yesBranchId);
            node.noBranch = nodesMap.get(item.noBranchId);
        }
    });
    return nodesMap.get(arr[0].id);
};

const treeByArray = mountTreeByArray([
    {
        id: 1,
        type: "decision",
        question: (user) => user.budget > 1000,
        yesBranchId: 2,
        noBranchId: 3
    },
    {
        id: 2,
        type: "action",
        action: "Enviar proposta de orçamento"
    },
    {
        id: 3,
        type: "decision",
        question: (user) => user.isActive,
        yesBranchId: 4,
        noBranchId: 5
    },
    {
        id: 4,
        type: "action",
        action: "Ativar conta do cliente"
    },
    {
        id: 5,
        type: "decision",
        question: (user) => user.isPaymentLate,
        yesBranchId: 6,
        noBranchId: 7
    },
    {
        id: 6,
        type: "action",
        action: "Enviar lembrete de pagamento"
    },
    {
        id: 7,
        type: "action",
        action: "Oferecer upgrade de serviço"
    }
]);

console.log('Decisão para user1 com árvore por array:', evaluate(treeByArray, user1));