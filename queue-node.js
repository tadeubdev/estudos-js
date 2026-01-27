class QueueNode
{
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class Queue
{
    constructor() {
        this.front = null;
        this.back = null;
        this.size = 0;
    }

    enqueue(value) {
        const newNode = new QueueNode(value);
        if (this.size === 0) {
            this.front = newNode;
            this.back = newNode;
        } else {
            this.back.next = newNode;
            this.back = newNode;
        }
        this.size++;
    }

    frontValue() {
        return this.front ? this.front.value : null;
    }

    backValue() {
        return this.back ? this.back.value : null;
    }

    dequeue() {
        if (this.size === 0) {
            return null;
        }
        const dequeuedValue = this.front.value;
        this.front = this.front.next;
        this.size--;
        if (this.size === 0) {
            this.back = null;
        }
        return dequeuedValue;
    }
}

const queue = new Queue();
queue.enqueue('a');
queue.enqueue('b');
queue.enqueue('c');

console.log('queue: ', queue);
console.log('front value: ', queue.frontValue());
console.log('back value: ', queue.backValue());

while (queue.size > 0) {
    console.log('dequeued value: ', queue.dequeue());
    console.log('queue after dequeue: ', queue);
}

console.log('Final queue: ', queue);