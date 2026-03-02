class ConsistentHashingSimples {
    constructor(replicas = 3) {
        this.replicas = replicas;
        this.ring = new Map();
    }

    hash(texto) {
        let total = 0;
        for (const ch of String(texto)) {
            total = (total * 31 + ch.charCodeAt(0)) % 1000;
        }
        return total;
    }

    addNode(node) {
        for (let i = 0; i < this.replicas; i++) {
            const virtualKey = `${node}#${i}`;
            const h = this.hash(virtualKey);
            this.ring.set(h, node);
        }
    }

    getSortedHashes() {
        return [...this.ring.keys()].sort((a, b) => a - b);
    }

    getNode(key) {
        if (this.ring.size === 0) return null;

        const keyHash = this.hash(key);
        const sorted = this.getSortedHashes();

        for (const h of sorted) {
            if (h >= keyHash) {
                return this.ring.get(h);
            }
        }

        return this.ring.get(sorted[0]);
    }

    explainKey(key) {
        const keyHash = this.hash(key);
        const sorted = this.getSortedHashes();

        let escolhido = sorted[0];
        for (const h of sorted) {
            if (h >= keyHash) {
                escolhido = h;
                break;
            }
        }

        const node = this.ring.get(escolhido);

        console.log(`\nChave: ${key}`);
        console.log(`Hash da chave: ${keyHash}`);
        console.log(`Hashes do anel: [${sorted.join(', ')}]`);
        console.log(`Primeiro hash >= ${keyHash}: ${escolhido}`);
        console.log(`Vai para o nó: ${node}`);
    }
}

// Demonstração bem pequena
const ch = new ConsistentHashingSimples(2);
ch.addNode('A');
ch.addNode('B');
ch.addNode('C');

console.log('Anel (hash -> nó):');
for (const h of ch.getSortedHashes()) {
    console.log(`${h} -> ${ch.ring.get(h)}`);
}

const exemplos = [];
const encontradosPorNo = new Map([
    ['A', 0],
    ['B', 0],
    ['C', 0]
]);

for (let i = 0; i < 5000; i++) {
    const key = `key-${i}`;
    const node = ch.getNode(key);
    if (encontradosPorNo.get(node) < 2) {
        exemplos.push(key);
        encontradosPorNo.set(node, encontradosPorNo.get(node) + 1);
    }

    const completo = [...encontradosPorNo.values()].every((v) => v >= 2);
    if (completo) break;
}

console.log('\nExemplos encontrados para cada nó:');
console.log(exemplos.join(', '));

for (const key of exemplos) {
    ch.explainKey(key);
}
