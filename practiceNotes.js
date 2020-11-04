

const person = {
    name: "Jonathon Mitri",
    age: 34,
    sex: "male",
    state: "Maryland"
}

console.log(person);

const lessInfo = (({name, age}) => ({name, age}))(person)

console.log(lessInfo);


const Reference = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment"