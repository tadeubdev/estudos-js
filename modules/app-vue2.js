module.exports = {
    name: 'Fake Vue Component',
    data() {
        return {
            lorem: 'ipsum',
        };
    },
    methods: {
        sum(a, b) {
            return a + b;
        },
    },
    simulateHtmlContent() {
        console.log(`Lorem ${this.lorem}`);
        console.log(`The sum of: 1 + 2 = `, this.sum(1, 2));
    },
};