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
# Interpreters - Parsing
#### Khai-Yiu Soh

---
### Overview

+ Introduction to Parsing
+ Building AST for Lua

---
### Previously...

+ Created a lexer to generate a stream of tokens
+ Defined a set of syntax rules with CFG
+ Next: Using rules and tokens, generate an AST
---
### Recursive Descent Parser

+ Simple implementation
+ Top down parser
+ Constructing from outer to inner grammar rules

```
chunk     --> block ;
block     --> (statement)* returnStatement?
statement --> ...
```

---
<style scoped>
  .table {
    text-align: left;
  }
</style>
### How to implement

+ Translate grammar rules into code
+ Each rule becomes a function

<div class="table">

| Grammar      | Code translation             | Explanation                    |
| ------------ | ---------------------------- | ------------------------------ |
| Terminal     | Match and consume the token  | Basic building block           |
| Non-terminal | Call the rule's function     | Create a subexpression         |
| \|           | If or switch statement       | Consider different cases       |
| *            | Loop                         | Repetition of clause           |
| ?            | If statement                 | Binary case, exists or doesn't |
</div>

---
### Example of translation

+ Each rule becomes a function

```
returnStatement --> 'return' expressionList ;
```
```JavaScript
1  function returnStatement() {
2
3  }
```
---
### Translation of terminal

+ Match and consume the token

```
returnStatement --> 'return' expressionList ;
```
```JavaScript
1  function returnStatement() {
2      ...
3  
4      consume('RETURN')
5  
6      ...
7  }
```
---
### Translation of non-terminal

+ Call the rule's function

```
returnStatement --> 'return' expressionList ;
```
```JavaScript
1  function returnStatement() {
2      ...
3  
4      consume('RETURN')
5      const expressions = expressionList()
6  
7      ...
8  }
```
---
<style scoped>
  code {
    font-size: 20px;
  }
</style>
### Translation of | (pt. 1)

+ If or switch statement to handle cases

```
statement --> 'if' expression 'then' block 
              ('elseif' expression 'then' block)*
              ('else' block)? 
              'end' |

              'while' expression 'do' block 'end' |
              
              'repeat' block 'until' expression |

              'for' identifier '=' expression ',' expression
              (',' expression)?
              'do' block 'end' |

              'for' identifierList 'in' expressionList 'do' block 'end' |

              'function' functionName body |

              'local function' identifier body ;
```
---
### Translation of | (pt. 2)

```JavaScript
1   function statement() {
2       switch(tokenType) {
3           case 'IF': ...
4           case 'FOR': ...
5           case 'WHILE': ...
6           case 'REPEAT': ...
7           case 'FUNCTION': ...
8           ...
9       }
10  }
```
---
### Translation of *

+ Loop to handle repetition

```
expressionList --> expression (',' expression)* ;
```
```JavaScript
1  function expressionList() {
2      ...
3  
4      do
5          ...
6      while (match('COMMA'))
7  
8      ...
9  }
```
---
### Translation of ?

+ If statement to handle optional case

```
block --> (statement)* returnStatement? ;
```
```JavaScript
1  function expressionList() {
2      ...
3  
4      if (check('RETURN')) {
5          const returnStatement = returnStatement()
6      }
7  
8      ...
9  }
```
---
### Expressions

---
### Statements

---
### Evaluation