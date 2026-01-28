class Node
{
    constructor(value)
    {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

const a = new Node('a');
const b = new Node('b');
const c = new Node('c');
const d = new Node('d');
const e = new Node('e');
const f = new Node('f');

a.left = b;
a.right = c;
b.left = d;
b.right = e;
c.right = f;

const breadthFirstPrint = (root) => {
    const queue = [root];
    while (queue.length > 0) {
        const current = queue.shift();
        if (current.left !== null) {
            queue.push(current.left);
        }
        if (current.right !== null) {
            queue.push(current.right);
        }
    }
};

breadthFirstPrint(a);

const depthFirstPrint = (root, target) => {
    const stack = [root];
    while (stack.length > 0) {
        const current = stack.pop();
        if (current.value === target) {
            return true;
        }
        if (current.left !== null) {
            stack.push(current.left);
        }
        if (current.right !== null) {
            stack.push(current.right);
        }
    }
    return false;
};

console.log('Depth First Search for "e":', depthFirstPrint(a, 'e')); // true
console.log('Depth First Search for "z":', depthFirstPrint(a, 'z')); // false

const a1 = new Node(1);
const b1 = new Node(2);
const c1 = new Node(3);
const d1 = new Node(4);
const e1 = new Node(5);
const f1 = new Node(6);
const g1 = new Node(7);

a1.left = b1;
a1.right = c1;
b1.left = d1;
b1.right = e1;
c1.left = f1;
c1.right = g1;

const treeSum = (root) => {
    let sum = 0;
    const stack = [root];
    while (stack.length > 0) {
        const current = stack.pop();
        sum += current.value;
        if (current.left !== null) {
            stack.push(current.left);
        }
        if (current.right !== null) {
            stack.push(current.right);
        }
    }
    return sum;
};

console.log('Tree Sum:', treeSum(a1)); // 28

