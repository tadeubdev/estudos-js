class History
{
    constructor() {
        this.stack = [];
    }

    act(state) {
        console.log(`Action performed: ${state}`);
        this.stack.push(state);
    }

    undo() {
        if(this.stack.length === 0){
            return null;
        }
        return this.stack.pop();
    }

    currentState() {
        if(this.stack.length === 0){
            return null;
        }
        return this.stack[this.stack.length - 1];
    }
}

const history = new History();

history.act('Add a rectangle');
history.act('Add a circle');

console.log('Current state:', history.currentState());

const lastAction = history.undo();
console.log('Undid action:', lastAction);

console.log('Current state after undo:', history.currentState());

const anotherAction = history.undo();
console.log('Undid action:', anotherAction);

console.log('Current state after another undo:', history.currentState());

const noAction = history.undo();
console.log('Undid action:', noAction);

console.log('Current state after trying to undo with empty stack:', history.currentState());