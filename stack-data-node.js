class StackNode
{
    constructor(val) {
        this.value = val;
        this.next = null;
    }
}

class Stack
{
    constructor() {
        this.top = null;
        this.size = 0;
    }
    
    push(val) {
        if (this.size === 0) {
            this.top = new StackNode(val);
        } else {
            const newNode = new StackNode(val);
            newNode.next = this.top;
            this.top = newNode;
        }
        this.size++;
    }

    pop() {
        if (this.size === 0) {
            return null;
        }
        const poppedValue = this.top.value;
        this.top = this.top.next;
        this.size--;
        return poppedValue;
    }

    getTop() {
        return this.top ? this.top.value : null;
    }
}

const stack = new Stack();
stack.push('a');
stack.push('b');
stack.push('c');

console.log('Top element:', stack.getTop()); // Output: Top element: c
console.log('Popped element:', stack.pop()); // Output: Popped element: c
console.log('New top element:', stack.getTop()); // Output: New top element: b

console.log('stack', stack);
