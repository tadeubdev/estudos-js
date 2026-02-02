// Linguagem simples em PT-BR: DIZ, LET, expressões aritméticas e concatenação.

class Lexer {
  constructor(input) {
    // remove comentários (# até fim da linha)
    this.input = input.replace(/#.*$/gm, "");
    this.i = 0;
  }

  peek() { return this.input[this.i] ?? ""; }
  next() { return this.input[this.i++] ?? ""; }
  eof() { return this.i >= this.input.length; }

  isSpace(ch) { return /\s/.test(ch); }
  isDigit(ch) { return /[0-9]/.test(ch); }
  isAlpha(ch) { return /[A-Za-z_À-ÿ]/.test(ch); } // suporta acentos simples

  readWhile(fn) {
    let s = "";
    while (!this.eof() && fn(this.peek())) s += this.next();
    return s;
  }

  readNumber() {
    // inteiro ou decimal: 10, 3.14, .5
    let s = "";
    if (this.peek() === ".") s += this.next();
    s += this.readWhile(ch => this.isDigit(ch));
    if (this.peek() === ".") {
      s += this.next();
      s += this.readWhile(ch => this.isDigit(ch));
    }
    return { type: "NUMBER", value: Number(s) };
  }

  readString() {
    // "texto" com escapes básicos \" e \n
    let out = "";
    this.next(); // abre aspas
    while (!this.eof()) {
      const ch = this.next();
      if (ch === '"') break;
      if (ch === "\\") {
        const esc = this.next();
        if (esc === "n") out += "\n";
        else if (esc === "t") out += "\t";
        else if (esc === '"') out += '"';
        else if (esc === "\\") out += "\\";
        else out += esc;
      } else {
        out += ch;
      }
    }
    return { type: "STRING", value: out };
  }

  readIdent() {
    const id = this.readWhile(ch => this.isAlpha(ch) || this.isDigit(ch));
    const upper = id.toUpperCase();
    if (upper === "DIZ") return { type: "KW_DIZ", value: "DIZ" };
    if (upper === "LET") return { type: "KW_LET", value: "LET" };
    return { type: "IDENT", value: id };
  }

  nextToken() {
    this.readWhile(ch => this.isSpace(ch));
    if (this.eof()) return { type: "EOF" };

    const ch = this.peek();

    // strings
    if (ch === '"') return this.readString();

    // números (começa com dígito ou ".")
    if (this.isDigit(ch) || (ch === "." && this.isDigit(this.input[this.i + 1] ?? ""))) {
      return this.readNumber();
    }

    // identificadores / keywords
    if (this.isAlpha(ch)) return this.readIdent();

    // operadores e símbolos
    const single = this.next();
    const map = {
      "+": "PLUS",
      "-": "MINUS",
      "*": "STAR",
      "/": "SLASH",
      "(": "LPAREN",
      ")": "RPAREN",
      "=": "EQUAL",
      ";": "SEMI"
    };
    if (map[single]) return { type: map[single], value: single };

    throw new Error(`Caractere inesperado: '${single}'`);
  }

  tokenize() {
    const tokens = [];
    while (true) {
      const t = this.nextToken();
      tokens.push(t);
      if (t.type === "EOF") break;
    }
    return tokens;
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  cur() { return this.tokens[this.pos]; }
  eat(type) {
    const t = this.cur();
    if (t.type !== type) {
      throw new Error(`Esperado ${type}, veio ${t.type}`);
    }
    this.pos++;
    return t;
  }

  match(type) {
    if (this.cur().type === type) { this.pos++; return true; }
    return false;
  }

  parseProgram() {
    const body = [];
    while (this.cur().type !== "EOF") {
      // permite ; opcional e linhas vazias (spaces já foram removidos no lexer)
      if (this.match("SEMI")) continue;
      body.push(this.parseStmt());
      this.match("SEMI");
    }
    return { type: "Program", body };
  }

  parseStmt() {
    const t = this.cur();
    if (t.type === "KW_DIZ") return this.parseDiz();
    if (t.type === "KW_LET") return this.parseLet();
    throw new Error(`Comando desconhecido: ${t.type}`);
  }

  parseDiz() {
    this.eat("KW_DIZ");
    const expr = this.parseExpr();
    return { type: "Print", expr };
  }

  parseLet() {
    this.eat("KW_LET");
    const name = this.eat("IDENT").value;
    this.eat("EQUAL");
    const expr = this.parseExpr();
    return { type: "Let", name, expr };
  }

  // Expressões com precedência: (+ -) < (* /)
  parseExpr() {
    return this.parseAddSub();
  }

  parseAddSub() {
    let node = this.parseMulDiv();
    while (this.cur().type === "PLUS" || this.cur().type === "MINUS") {
      const op = this.cur().value; this.pos++;
      const right = this.parseMulDiv();
      node = { type: "Binary", op, left: node, right };
    }
    return node;
  }

  parseMulDiv() {
    let node = this.parseUnary();
    while (this.cur().type === "STAR" || this.cur().type === "SLASH") {
      const op = this.cur().value; this.pos++;
      const right = this.parseUnary();
      node = { type: "Binary", op, left: node, right };
    }
    return node;
  }

  parseUnary() {
    if (this.cur().type === "PLUS" || this.cur().type === "MINUS") {
      const op = this.cur().value; this.pos++;
      const expr = this.parseUnary();
      return { type: "Unary", op, expr };
    }
    return this.parsePrimary();
  }

  parsePrimary() {
    const t = this.cur();
    if (t.type === "NUMBER") { this.pos++; return { type: "Number", value: t.value }; }
    if (t.type === "STRING") { this.pos++; return { type: "String", value: t.value }; }
    if (t.type === "IDENT")  { this.pos++; return { type: "Var", name: t.value }; }

    if (t.type === "LPAREN") {
      this.eat("LPAREN");
      const expr = this.parseExpr();
      this.eat("RPAREN");
      return expr;
    }

    throw new Error(`Expressão inválida perto de: ${t.type}`);
  }
}

class Interpreter {
  constructor() {
    this.env = new Map(); // variáveis
  }

  run(ast) {
    for (const stmt of ast.body) this.execStmt(stmt);
  }

  execStmt(stmt) {
    if (stmt.type === "Let") {
      const val = this.evalExpr(stmt.expr);
      this.env.set(stmt.name, val);
      return;
    }
    if (stmt.type === "Print") {
      const val = this.evalExpr(stmt.expr);
      process.stdout.write(String(val) + "\n");
      return;
    }
    throw new Error("Stmt não suportado: " + stmt.type);
  }

  evalExpr(expr) {
    switch (expr.type) {
      case "Number": return expr.value;
      case "String": return expr.value;
      case "Var": {
        if (!this.env.has(expr.name)) throw new Error(`Variável não definida: ${expr.name}`);
        return this.env.get(expr.name);
      }
      case "Unary": {
        const v = this.evalExpr(expr.expr);
        if (expr.op === "+") return +v;
        if (expr.op === "-") return -v;
        throw new Error("Unary op inválido: " + expr.op);
      }
      case "Binary": {
        const l = this.evalExpr(expr.left);
        const r = this.evalExpr(expr.right);

        // regra simples: se tiver string em +, concatena
        if (expr.op === "+") {
          if (typeof l === "string" || typeof r === "string") return String(l) + String(r);
          return l + r;
        }
        if (expr.op === "-") return l - r;
        if (expr.op === "*") return l * r;
        if (expr.op === "/") return l / r;

        throw new Error("Binary op inválido: " + expr.op);
      }
      default:
        throw new Error("Expr não suportada: " + expr.type);
    }
  }
}

// ======= Demo =======
const program = `
# meu primeiro programinha
DIZ "Olá mundo!"

LET a = 1+2+3*5
DIZ a

LET nome = "Tadeu"
DIZ "Oi, " + nome + "!"
DIZ -(1+2)*3
DIZ 10/(5-3)+8*2
`;

const tokens = new Lexer(program).tokenize();
const ast = new Parser(tokens).parseProgram();
new Interpreter().run(ast);
