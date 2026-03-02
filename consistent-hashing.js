// Consistent Hashing Implementation in JavaScript

class ConsistentHashing {
    constructor(replicas = 100) {
        this.replicas = replicas; // Number of virtual nodes per real node
        this.ring = new Map(); // Hash ring
        this.nodes = new Set(); // Set of real nodes
    }
    
    // Hash function to compute the hash of a key
    hash(key) {
        const input = String(key);
        let hash = 0x811c9dc5; // FNV-1a 32-bit offset basis

        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash = Math.imul(hash, 0x01000193);
        }

        return hash >>> 0; // Unsigned 32-bit integer
    }
    
    // Add a node to the hash ring
    addNode(node) {
        this.nodes.add(node);
        for (let i = 0; i < this.replicas; i++) {
            const virtualNodeKey = `${node}:${i}`;
            const virtualNodeHash = this.hash(virtualNodeKey);
            this.ring.set(virtualNodeHash, node);
        }
    }
    
    // Remove a node from the hash ring
    removeNode(node) {
        this.nodes.delete(node);
        for (let i = 0; i < this.replicas; i++) {
            const virtualNodeKey = `${node}:${i}`;
            const virtualNodeHash = this.hash(virtualNodeKey);
            this.ring.delete(virtualNodeHash);
        }
    }
    
    // Get the node responsible for a given key
    getNode(key) {
        if (this.ring.size === 0) {
            return null; // No nodes in the ring
        }

        const keyHash = this.hash(key);
        const sortedHashes = [...this.ring.keys()].sort((a, b) => a - b);

        for (const hash of sortedHashes) {
            if (hash >= keyHash) {
                return this.ring.get(hash);
            }
        }

        // Wrap around to the smallest hash in the ring
        return this.ring.get(sortedHashes[0]);
    }
}

// Example usage
const ch = new ConsistentHashing();
ch.addNode('NodeA');
ch.addNode('NodeB');
ch.addNode('NodeC');

const sampleKeys = [
    'myKey1',
    'myKey2',
    'user:1001',
    'user:1002',
    'payment:pix:001',
    'payment:card:009',
    'session:abc',
    'session:def'
];

console.log('\n--- Mapping BEFORE removing NodeB ---');
const before = new Map();
for (const key of sampleKeys) {
    const keyHash = ch.hash(key);
    const node = ch.getNode(key);
    before.set(key, node);
    console.log(`${key} (hash=${keyHash}) -> ${node}`);
}

ch.removeNode('NodeB');

console.log('\n--- Mapping AFTER removing NodeB ---');
let remappedCount = 0;
for (const key of sampleKeys) {
    const keyHash = ch.hash(key);
    const node = ch.getNode(key);
    const moved = before.get(key) !== node;
    if (moved) remappedCount++;
    console.log(`${key} (hash=${keyHash}) -> ${node}${moved ? '  [REMAPPED]' : ''}`);
}

console.log(`\nTotal keys remapped: ${remappedCount}/${sampleKeys.length}`);

console.log('Current nodes in the ring:', [...ch.nodes]);
console.log('Current hash ring:', [...ch.ring.entries()]);