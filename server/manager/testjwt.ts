import {generateToken, verifyToken} from './jwt'

let payload ={
    name: 'liguangyao',
    age: 25
}

const test = generateToken(payload)
console.log('generateTOken', test);
verifyToken(test)