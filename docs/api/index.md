# API Reference

Complete API documentation for all AST toolkit packages.

## Overview

The AST toolkit provides a clean, type-safe API for parsing JavaScript code and working with Abstract Syntax Trees.

## Packages

### @sylphlab/ast-core

Core types and interfaces for AST/CST nodes.

[View @sylphlab/ast-core documentation →](/packages/core)

### @sylphlab/ast-javascript

JavaScript parser powered by ANTLR v4.

[View @sylphlab/ast-javascript documentation →](/packages/javascript)

## Quick Reference

### Parsing

```typescript
import { parseJavaScript } from '@sylphlab/ast-javascript';

// Parse JavaScript code
const ast = parseJavaScript(code);
```

### Type Imports

```typescript
import type { CstNode, Token, Position } from '@sylphlab/ast-core';
import type {
  Program,
  Statement,
  Expression,
  VariableDeclaration
} from '@sylphlab/ast-javascript';
```

## Core API

### parseJavaScript()

Parse JavaScript source code into an AST.

```typescript
function parseJavaScript(text: string): CstNode | null
```

**Parameters:**
- `text: string` - JavaScript source code

**Returns:**
- `CstNode | null` - Root AST node, or null on parse error

**Example:**

```typescript
const ast = parseJavaScript('const x = 42;');

if (ast) {
  console.log('Type:', ast.type);
  console.log('Text:', ast.text);
  console.log('Position:', ast.position);
}
```

## Type Definitions

### CstNode

Base interface for all CST (Concrete Syntax Tree) nodes.

```typescript
interface CstNode {
  type: string;
  text: string;
  position: Position;
  children?: CstNode[];
}
```

**Properties:**
- `type: string` - Node type identifier
- `text: string` - Exact source text
- `position: Position` - Location in source
- `children?: CstNode[]` - Optional child nodes

### Token

Base interface for leaf nodes (tokens).

```typescript
interface Token extends CstNode {
  children?: undefined;
}
```

Tokens represent atomic units like keywords, identifiers, operators.

### Position

Source location information.

```typescript
interface Position {
  startOffset: number;
  endOffset: number;
}
```

**Properties:**
- `startOffset: number` - Start index (0-based)
- `endOffset: number` - End index (0-based, exclusive)

### Point

Specific location in source.

```typescript
interface Point {
  offset: number;
}
```

## JavaScript Types

### Program

Root node of a JavaScript AST.

```typescript
interface Program extends JsNode {
  type: 'Program';
  body: Statement[];
}
```

### Statement Types

#### VariableDeclaration

```typescript
interface VariableDeclaration extends Statement {
  type: 'VariableDeclaration';
  declarations: VariableDeclarator[];
  kind: 'var' | 'let' | 'const';
}
```

#### ExpressionStatement

```typescript
interface ExpressionStatement extends Statement {
  type: 'ExpressionStatement';
  expression: Expression;
}
```

#### BlockStatement

```typescript
interface BlockStatement extends Statement {
  type: 'BlockStatement';
  body: Statement[];
}
```

#### IfStatement

```typescript
interface IfStatement extends Statement {
  type: 'IfStatement';
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}
```

### Expression Types

#### AstIdentifier

```typescript
interface AstIdentifier extends Expression, Pattern {
  type: 'Identifier';
  name: string;
}
```

#### AstLiteral

```typescript
interface AstLiteral extends Expression {
  type: 'Literal';
  value: string | number | boolean | null | RegExp;
  raw?: string;
}
```

## Utility Functions

### Tree Traversal

Walk through all nodes in an AST:

```typescript
function traverse(
  node: CstNode,
  callback: (node: CstNode) => void
): void {
  callback(node);

  if (node.children) {
    for (const child of node.children) {
      traverse(child, callback);
    }
  }
}

// Usage
traverse(ast, (node) => {
  console.log(node.type);
});
```

### Find Nodes by Type

Find all nodes of a specific type:

```typescript
function findNodesByType(
  root: CstNode,
  type: string
): CstNode[] {
  const results: CstNode[] = [];

  traverse(root, (node) => {
    if (node.type === type) {
      results.push(node);
    }
  });

  return results;
}

// Usage
const identifiers = findNodesByType(ast, 'Identifier');
```

### Extract Text

Get the full source text for a node:

```typescript
function getSourceText(
  node: CstNode,
  source: string
): string {
  return source.substring(
    node.position.startOffset,
    node.position.endOffset
  );
}

// Usage
const code = 'const x = 42;';
const ast = parseJavaScript(code);
if (ast) {
  const text = getSourceText(ast, code);
}
```

### Type Guards

Check node types safely:

```typescript
function isToken(node: CstNode): node is Token {
  return node.children === undefined;
}

function isStatement(node: CstNode): boolean {
  return node.type.endsWith('Statement') ||
         node.type.endsWith('Declaration');
}

function isExpression(node: CstNode): boolean {
  return node.type.endsWith('Expression') ||
         node.type === 'Identifier' ||
         node.type === 'Literal';
}
```

## Advanced Usage

### Custom Visitors

Implement a visitor pattern for AST traversal:

```typescript
interface Visitor {
  visitProgram?(node: Program): void;
  visitVariableDeclaration?(node: VariableDeclaration): void;
  visitIdentifier?(node: Identifier): void;
  // Add more visit methods...
}

class MyVisitor implements Visitor {
  visitProgram(node: Program): void {
    console.log('Visiting program with', node.body.length, 'statements');
    node.body.forEach(stmt => this.visit(stmt));
  }

  visitVariableDeclaration(node: VariableDeclaration): void {
    console.log('Variable declaration:', node.kind);
  }

  visit(node: CstNode): void {
    const methodName = `visit${node.type}`;
    if (methodName in this) {
      (this as any)[methodName](node);
    }

    if (node.children) {
      node.children.forEach(child => this.visit(child));
    }
  }
}

// Usage
const visitor = new MyVisitor();
visitor.visit(ast);
```

### AST Transformation

Transform an AST:

```typescript
function transformNode(
  node: CstNode,
  transformer: (node: CstNode) => CstNode
): CstNode {
  const transformed = transformer(node);

  if (transformed.children) {
    return {
      ...transformed,
      children: transformed.children.map(
        child => transformNode(child, transformer)
      )
    };
  }

  return transformed;
}

// Usage: Rename all identifiers
const renamed = transformNode(ast, (node) => {
  if (node.type === 'Identifier') {
    return {
      ...node,
      text: node.text + '_renamed'
    };
  }
  return node;
});
```

### AST Filtering

Filter nodes based on criteria:

```typescript
function filterNodes(
  node: CstNode,
  predicate: (node: CstNode) => boolean
): CstNode | null {
  if (!predicate(node)) {
    return null;
  }

  if (!node.children) {
    return node;
  }

  const filteredChildren = node.children
    .map(child => filterNodes(child, predicate))
    .filter((child): child is CstNode => child !== null);

  return {
    ...node,
    children: filteredChildren
  };
}

// Usage: Keep only identifiers
const onlyIdentifiers = filterNodes(ast, (node) =>
  node.type === 'Program' ||
  node.type === 'Identifier'
);
```

## Error Handling

### Parse Errors

```typescript
const ast = parseJavaScript('invalid @#$ syntax');

if (ast === null) {
  console.error('Parse failed - syntax error');
} else {
  console.log('Parse successful');
}
```

### Type Validation

```typescript
function validateNode(node: CstNode): boolean {
  if (!node.type || typeof node.type !== 'string') {
    return false;
  }

  if (!node.text || typeof node.text !== 'string') {
    return false;
  }

  if (!node.position ||
      typeof node.position.startOffset !== 'number' ||
      typeof node.position.endOffset !== 'number') {
    return false;
  }

  return true;
}
```

## TypeScript Tips

### Strict Type Checking

Enable strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### Type Assertions

Use type assertions when you know the node type:

```typescript
const ast = parseJavaScript(code);

if (ast && ast.type === 'Program') {
  const program = ast as Program;
  program.body.forEach(statement => {
    // Process statements
  });
}
```

### Generic Helpers

Create generic helper functions:

```typescript
function findFirst<T extends CstNode>(
  root: CstNode,
  predicate: (node: CstNode) => node is T
): T | null {
  if (predicate(root)) {
    return root;
  }

  if (root.children) {
    for (const child of root.children) {
      const found = findFirst(child, predicate);
      if (found) return found;
    }
  }

  return null;
}

// Usage
const firstIdentifier = findFirst(ast, (node): node is Identifier =>
  node.type === 'Identifier'
);
```

## Performance Tips

### 1. Minimize Traversals

Collect multiple pieces of data in a single traversal:

```typescript
interface Stats {
  identifiers: number;
  statements: number;
  expressions: number;
}

function gatherStats(node: CstNode): Stats {
  const stats: Stats = {
    identifiers: 0,
    statements: 0,
    expressions: 0
  };

  traverse(node, (n) => {
    if (n.type === 'Identifier') stats.identifiers++;
    if (isStatement(n)) stats.statements++;
    if (isExpression(n)) stats.expressions++;
  });

  return stats;
}
```

### 2. Use Early Returns

Stop traversing when you find what you need:

```typescript
function hasIdentifier(node: CstNode, name: string): boolean {
  if (node.type === 'Identifier' && node.text === name) {
    return true;
  }

  if (node.children) {
    for (const child of node.children) {
      if (hasIdentifier(child, name)) {
        return true;
      }
    }
  }

  return false;
}
```

### 3. Cache Results

Cache expensive computations:

```typescript
const cache = new WeakMap<CstNode, any>();

function cachedComputation(node: CstNode): any {
  if (cache.has(node)) {
    return cache.get(node);
  }

  const result = expensiveOperation(node);
  cache.set(node, result);
  return result;
}
```

## Examples

### Count Variables

```typescript
function countVariables(ast: CstNode): number {
  let count = 0;

  traverse(ast, (node) => {
    if (node.type === 'VariableDeclaration') {
      count += (node as any).declarations?.length || 0;
    }
  });

  return count;
}
```

### Extract Function Names

```typescript
function extractFunctionNames(ast: CstNode): string[] {
  const names: string[] = [];

  traverse(ast, (node) => {
    if (node.type === 'FunctionDeclaration') {
      const nameNode = (node as any).id;
      if (nameNode?.type === 'Identifier') {
        names.push(nameNode.name);
      }
    }
  });

  return names;
}
```

### Find Unused Variables

```typescript
function findUnusedVariables(ast: CstNode): string[] {
  const declared = new Set<string>();
  const used = new Set<string>();

  traverse(ast, (node) => {
    if (node.type === 'VariableDeclarator') {
      const id = (node as any).id;
      if (id?.type === 'Identifier') {
        declared.add(id.name);
      }
    } else if (node.type === 'Identifier') {
      used.add(node.text);
    }
  });

  return Array.from(declared).filter(name => !used.has(name));
}
```

## Next Steps

- [View Package Documentation](/packages/)
- [Read Architecture Guide](/guide/architecture)
- [Explore Examples](/development/)

---

Questions? [Open an issue](https://github.com/SylphxAI/ast/issues) or [contact us](mailto:hi@sylphx.com).
