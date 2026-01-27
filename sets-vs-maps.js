const myArray = [1, 2, 3, 4, 5, 5, 5, 6, 7, 8, 8, 9];
const mySet = new Set(myArray);

console.log('Original Array:', myArray);
console.log('Set (unique values):', mySet);

const uniqueArray = [...mySet];
console.log('Array from Set (unique values):', uniqueArray);

mySet.add(10);
console.log('Set after adding 10:', mySet);

mySet.delete(5);
console.log('Set after deleting 5:', mySet);

console.log('Does the Set contain 3?', mySet.has(3));
console.log('Size of the Set:', mySet.size);

mySet.clear();
console.log('Set after clearing all elements:', mySet);

const myMap = new Map([
    ['name', 'Alice'],
    ['age', 30],
    ['city', 'New York']
]);

console.log('Original Map:', myMap);

console.log('Value for key "name":', myMap.get('name'));

myMap.set('country', 'USA');
console.log('Map after adding country:', myMap);

myMap.delete('age');
console.log('Map after deleting age:', myMap);

console.log('Does the Map contain key "city"?', myMap.has('city'));
console.log('Size of the Map:', myMap.size);

const objectFromMap = Object.fromEntries(myMap);
console.log('Object from Map:', objectFromMap);

const mapFromObject = new Map(Object.entries({ hobby: 'reading', profession: 'developer' }));
console.log('Map from Object:', mapFromObject);

myMap.clear();
console.log('Map after clearing all entries:', myMap);