class Node {
  constructor(value, left = null, right = null) {
    this.value = value
    this.left = left
    this.right = right
  }
}

function tokenize(expr) {
  const cleaned = expr.replace(/\s+/g, "")
  const tokens = cleaned.match(/\d*\.\d+|\d+|[+*/()\-]/g)
  if (!tokens) throw new Error("Expressão vazia ou inválida")
  return tokens
}

console.log(tokenize("1+2+3*5"))
// ["1", "+", "2", "+", "3", "*", "5"]
console.log(tokenize("(1+2)*3"))
// ["(", "1", "+", "2", ")", "*", "3"]
console.log(tokenize("10/(5-3)+8*2"))
// ["10", "/", "(", "5", "-", "3", ")", "+", "8", "*", "2"]

function parse(tokens) {
  const ops = []
  const values = []

  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 }

  function applyOp() {
    const op = ops.pop()
    const right = values.pop()
    const left = values.pop()
    if (!left || !right) throw new Error("Expressão inválida (operandos faltando)")
    values.push(new Node(op, left, right))
  }

  // Se true, estamos esperando um "valor": número ou "(" ou unário (+/-)
  let expectingValue = true

  for (const token of tokens) {
    // número (inteiro ou decimal)
    if (!isNaN(token)) {
      values.push(new Node(Number(token)))
      expectingValue = false
      continue
    }

    if (token === "(") {
      ops.push(token)
      expectingValue = true
      continue
    }

    if (token === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") applyOp()
      if (!ops.length) throw new Error("Parênteses desbalanceados: faltou '('")
      ops.pop()
      expectingValue = false
      continue
    }

    // operador
    if (token in precedence) {
      // trata unário: se estamos esperando valor, + ou - vira 0 +/- ...
      if (expectingValue && (token === "+" || token === "-")) {
        values.push(new Node(0))
        // continua como se fosse binário normal
      } else if (expectingValue) {
        // "*" ou "/" não pode ser unário
        throw new Error(`Operador '${token}' em posição inválida`)
      }

      while (
        ops.length &&
        ops[ops.length - 1] in precedence &&
        precedence[ops[ops.length - 1]] >= precedence[token]
      ) {
        applyOp()
      }

      ops.push(token)
      expectingValue = true
      continue
    }

    throw new Error("Token inválido: " + token)
  }

  while (ops.length) {
    const top = ops[ops.length - 1]
    if (top === "(") throw new Error("Parênteses desbalanceados: faltou ')'")
    applyOp()
  }

  if (values.length !== 1) throw new Error("Expressão inválida (sobrou coisa na pilha)")
  return values[0]
}

function evaluate(node) {
  if (typeof node.value === "number") return node.value

  const left = evaluate(node.left)
  const right = evaluate(node.right)

  switch (node.value) {
    case "+": return left + right
    case "-": return left - right
    case "*": return left * right
    case "/": return left / right
    default: throw new Error("Operador desconhecido: " + node.value)
  }
}

function calc(expr) {
  return evaluate(parse(tokenize(expr)))
}

console.log('1+2+3*5 =', calc("1+2+3*5"))
// 1+2+3*5 = 18
console.log('(1+2)*3 =', calc("(1+2)*3"))
// (1+2)*3 = 9
console.log('10/(5-3)+8*2 =', calc("10/(5-3)+8*2"))
// 10/(5-3)+8*2 = 21
// very hard expression 
console.log('3+5*2-(8/4+1)*6+7 =', calc("3+5*2-(8/4+1)*6+7"))

console.log("1+2+3*5 =", calc("1+2+3*5"))            // 18
console.log("(1+2)*3 =", calc("(1+2)*3"))            // 9
console.log("10/(5-3)+8*2 =", calc("10/(5-3)+8*2"))       // 21

console.log("-5+2 =", calc("-5+2"))               // -3
console.log("-(1+2)*3 =", calc("-(1+2)*3"))           // -9
console.log("3*-2 =", calc("3*-2"))               // -6
console.log("2+(-3*4) =", calc("2+(-3*4)"))           // -10

console.log(".5 + 1.25*2 =", calc(".5 + 1.25*2"))        // 3