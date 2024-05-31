---
marp: true
theme: uncover
class: invert
paginate: true
style: |
  section { 
    justify-content: start; 
  }

  /* Main topics with inverted colours and centric title */
  section.topic {
    justify-content: center;
  }

  /* Position bullet points and code blocks side by side */
  .container {
    display: flex;
    align-items: flex-start;
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  li {
    margin-right: 20px;
    font-size: 25px;
    margin-bottom: 30px;
  }

  code {
    border-radius: 10px;
  }

  .code-block-normal {
    flex: 1;
    font-size: 30px;
    padding: 0.2em;
  }

  img {
    align-self: center;
    padding: 0.2em;
  }

  tr {
    font-size: 22px;
  }
---
<!-- _class: topic -->
# Interpreters - Context Free Grammar
#### Khai-Yiu Soh

---
### What is Context Free Grammar?

---
### Regular vs Context Free

---
### Components of CFG

+ head
+ body
    + terminal
    + nonterminal

---
### Example

```Bash
identifier --> (letter | "_") (letter | digit | "_")*
letter     --> 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 
               'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | 
               'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 
               'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
digit      --> '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
```

+ A programming language's grammar is composed of statements and expressions
```Bash
program    --> (statement)* ;
statement  --> ?? ;
expression --> ?? ;
```
---
### Expressions and statements

+ An expression is evaluated to produce a value
  
  + Values (ex. `10`)
  + Operators (ex. `4 + 8 / 2`)
  + Function calls (ex. `max(a, b)`)

+ A statement is an instruction that can be executed to perform an action

  + Assignments
  + Control flow (conditions, loops)
  + Function and class definitions
  + Expression statements (ex. `print(x)`)
---
### Statements

+ There are many types of statements to consider
+ Define a set of grammar rules for:
  
  + Variable assignments / declarations
  + Blocks
  + Control structures
  + Function calls

---
### Variables

+ There are global, local variables and table fields
+ An identifier represents a variable (`myTable`, `x`, `_variable`)
+ Square brackets are used to index a table (`myTable["key"]`, `myTable[2]`)
+ Using "." is analogous to using square brackets (`myTable.key`)

```Bash
variable --> identifier | 
             prefixExpression '[' expression ']' | 
             prefixExpression '.' identifier ;

```
---
### Variable assignments

+ Multiple assignments allowed

+ Left side: List of variables
+ Right side: List of expressions
+ Delimiter: **,**

```Lua
a = 3
x = {}
b, c, x[a] = a - 1, "Hello", 20
```
---
### Variables grammar

```bash
statement      --> variableList '=' expressionList ;
variableList   --> variable (',' variable)* ;
expressionList --> expression (',' expression)* ;
variable       --> identifier | 
                   prefixExpression '[' expression ']' | 
                   prefixExpression '.' identifier ;
```
---
### Local declarations

+ Local declarations are statements
+ Can specify attributes with **< >** (`local x<const> = 10` )

```Bash
statement   --> variableList '=' expressionList |

                'local' attrVarList ('=' expressionList)? ;

attrVarList --> identifier attribute (',' identifier attribute)* ;
attribute   --> ('<' identifier '>')? ;
```
---
### Blocks

+ Blocks are a list of statements executed sequentially

  + A program can have 0 or many statements
  + Blocks sometimes have a return statement

```bash
block --> (statement)* returnStatement?
```

---
### Chunks

+ In Lua, a "chunk" represents a sequence of statements followed optionally by a return statement
+ Represents a complete or part of a Lua script
+ Syntactically, a chunk is just a block

  + Source files are treated as a chunk
  + Using **load** function to execute a string of Lua code
  + Blocks of anonymous functions

```bash
chunk --> block
```
---
### Control structures

+ **if**, **then** and **end** are required
+ 0 or more **elseif**
+ Optional **else**
+ Blocks containing statements to execute
```Lua
if x > 0 then
    print("Number is positive")
elseif x == 0 then
    print("Number is zero")
else
    print("Number is negative")
end
```
---
### Updated statement rule

```bash
statement --> variableList '=' expressionList |

              'local' attrVarList ('=' expressionList)? |

              'if' expression 'then' block 
              ('elseif' expression 'then' block)*
              ('else' block)? 
              'end' ;

```
---
### While loop

* **while**, **do** and **end** keywords
+ Block containing statements to execute

```Lua
count = 10

while count > 0 do
    print(count)
    count = count - 1
end
```
---
### Updated statement rule

```bash
statement --> ... |

              'while' expression 'do' block 'end' ;

```
---
### Repeat until loop

+ **repeat** and **until** keywords
+ Block containing statements to execute
+ Expression at the end

```Lua
count = 0

repeat
    print(count)
    count = count + 1
until count == 10
```
---
### Updated statement rule
```bash
statement --> ... |

              'repeat' block 'until' expression ;

```
---
### For loops

+ Numerical for loop

  + Block is repeated as a variable undergoes arithmetic progression
+ Generic for loop (iterators)

  + Block is repeated as long as iterator function can produce a new value
---
### Numerical for loop

+ **for**, **do** and **end** keywords
+ Block containing statements to execute
+ Can specify three values for initial, min / max value, increment

```Lua
for i = 1, 5, 2 do
    print("Iteration", i)
end
```
---
### Updated statement rule

```Bash
statement --> ... |

              'for' identifier '=' expression ',' expression
              (',' expression)?
              'do' block 'end' ;

```
---
### Generic for loop

+ **for**, **do** and **end** keywords
+ List of variable names
+ Block containing statements to execute

```Lua
local person = {
    name = "Bob",
    age = 30,
    city = "Perth"
}

for key, value in pairs(person) do
    print(key, ":", value)
end
```
---
### Updated statement rule

```Bash
statement --> ... |

              'for' identifierList 'in' expressionList 'do' block 'end' ;

identifierList  --> identifier (',' identifier)* ;
```
---
### Function calls

+ Can be executed to simply perform actions with no return value

```Lua
function greet(name)
    print("Hello, " .. name)
end

greet("Bob")
```
```Bash
statement --> ... |

              functionCall
```
---
### Function definitions

+ Optionally, use **local** keyword
+ **function** and **end** required
+ Name, optional list of parameters, function body
```Lua
function greet()
    print("Hello")
end
```
```Lua
local function greet()
    print("Hello")
end
```
---
### Function names

+ Identifier
+ Declare functions in table fields (global)
+ Declare functions with colon syntax (global)

```Lua
function table.nestedTable.greet()
    print("Hello")
end
```
```Lua
function table:greet()
    print("Hello from: ", self)
end
```
---
### Function parameters

+ Empty
+ List of identifiers
+ Optionally, use spread syntax at the end for variadic functions
```Lua
function f(a, b, ...)
  print(...)  -- 3, 4
end

f(1, 2, 3, 4)
```
---
### Updated statement rule

```Bash
statement     --> ... |

                  'function' functionName body |
                  'local function' identifier body ;

functionName  --> identifier ('.' identifier)* (':' identifier)? ;
body          --> '(' (parameterList)? ')' block 'end' ;
parameterList --> identifierList (',' '...')? | '...' ;
```
---
### Expressions

+ Types of expressions to consider:

  + Literals (number, string, boolean, table, anonymous function)
  + Unary operations
  + Binary operations
  + Prefix expressions

---
### Expressions in Lua

```Bash
expression     --> literal | 
                  unaryOp expression |
                  expression binaryOp expression |
                  prefixExpression ;
  
literal        --> NUMBER | STRING | "true" | "false" | "nil" | table | functionDef | '...' ;
unaryOp        --> "-" | "~" | "not" | "#"
binaryOp       --> "==" | "~=" | "<" | "<=" | ">" | ">=" | "+" | "-" | "*" | "/" |
                  "^" | "%" | ".." | "|" | "//" | "%" | "&"| "<<" | ">>" | 
                  "and" | "or" ;
  
functionDef    --> 'function' body ;
  
table          --> '{' fieldList? '}' ;
fieldList      --> field (fieldSeparator field)* fieldSeparator? ;
field          --> '[' expression ']' '=' expression | identifier '=' expression | expression ;
fieldSeparator --> ',' | ';'
```
---
<style scoped>
  li {
    font-size: 20px;
  }
</style>
### Precedence and associativity in Lua

+ Highest to lowest precedence:

  + ^
  + not, #, -, ~
  + *, /, //, %
  + +, -
  + ..
  + <<, >>
  + &
  + ~
  + |
  + <, >, <=, >=, ~=, ==
  + and
  + or

---
### New grammar for expressions

```Bash
expression    --> logical_or ;
logical_or    --> logical_and ("or" logical_and)* ;
logical_and   --> comparison ("and" comparison)* ;
comparison    --> bitwise_or (( "==" | "~=" | ">" | ">=" | "<" | "<=" ) bitwise_or)* ;
bitwise_or    --> bitwise_xor ( "|" bitwise_xor )* ;
bitwise_xor   --> bitwise_and ( "~" bitwise_and )* ;
bitwise_and   --> shift ( "&" shift )* ;
shift         --> concatenation ( ( "<<" | ">>" ) concatenation )* ;
concatenation --> term ( ".." concatenation )* ;
term          --> factor (( "+" | "-" ) factor)* ;
factor        --> unary (( "*" | "/" | "//" | "%" ) unary)* ;
unary         --> ( "-" | "not" | "#" | "~" ) unary | power ;
power         --> primary ("^" power)* ;
primary       --> NUMBER | STRING | BOOLEAN | NIL | "(" expression ")" ;

```
---
### References

+ Precendence list: https://www.lua.org/pil/3.5.html