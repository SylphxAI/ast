# @sylphlab/ast-core

The core package provides generic AST/CST node interfaces and types that serve as the foundation for all language parsers.

## Installation

::: code-group
```bash [pnpm]
pnpm add @sylphlab/ast-core
```

```bash [npm]
npm install @sylphlab/ast-core
```

```bash [yarn]
yarn add @sylphlab/ast-core
```
:::

## Overview

`@sylphlab/ast-core` defines the fundamental building blocks for Abstract Syntax Trees (AST) and Concrete Syntax Trees (CST):

- **Zero dependencies** - Lightweight and standalone
- **TypeScript native** - Full type safety
- **Generic interfaces** - Works with any language parser
- **Position tracking** - Source location information

## Core Types

### CstNode

Base interface for all nodes in the Concrete Syntax Tree (CST).

```typescript
interface CstNode {
  /** The type of the syntax node */
  type: string;

  /** The exact source text covered by this node */
  text: string;

  /** Location of the node in the source file */
  position: Position;

  /** Child nodes (for non-terminal nodes) */
  children?: CstNode[];
}
```

**Example:**

```typescript
import type { CstNode } from '@sylphlab/ast-core';

const node: CstNode = {
  type: 'Identifier',
  text: 'greeting',
  position: {
    startOffset: 6,
    endOffset: 14
  }
};
```

### Token

Base interface for a token (leaf node in the CST).

```typescript
interface Token extends CstNode {
  children?: undefined;  // Tokens don't have children
}
```

Tokens are the atomic units of syntax - they represent individual lexical elements like keywords, identifiers, operators, etc.

### Position

Represents a span of content in a source file.

```typescript
interface Position {
  /** The starting character index (0-based) of the span */
  startOffset: number;

  /** The ending character index (0-based, exclusive) of the span */
  endOffset: number;
}
```

**Example:**

```typescript
const position: Position = {
  startOffset: 0,
  endOffset: 15
};

// Extract text using position
const sourceText = code.substring(position.startOffset, position.endOffset);
```

### Point

Represents a specific location in a source file.

```typescript
interface Point {
  /** Character index (0-based) in the source file */
  offset: number;
}
```

## Common Token Types

The core package provides several common token types:

### Whitespace

```typescript
interface Whitespace extends Token {
  type: 'Whitespace';  // Includes spaces and tabs
}
```

### Newline

```typescript
interface Newline extends Token {
  type: 'Newline';
}
```

### Word

```typescript
interface Word extends Token {
  type: 'Word';  // General text content
}
```

### Punctuation

```typescript
interface Punctuation extends Token {
  type: 'Punctuation';  // e.g., '.', '!', '?'
}
```

## Markdown-Specific Types

The core package includes specialized types for Markdown parsing:

### HeadingMarker

```typescript
interface HeadingMarker extends Token {
  type: 'HeadingMarker';
  depth: 1 | 2 | 3 | 4 | 5 | 6;
}
```

### ListItemMarker

```typescript
interface ListItemMarker extends Token {
  type: 'ListItemMarker';
  markerType: '*' | '-' | '+' | '.' | ')';
}
```

### EmphasisMarker

```typescript
interface EmphasisMarker extends Token {
  type: 'EmphasisMarker';
  marker: '*' | '_';
}
```

### CodeDelimiter

```typescript
interface CodeDelimiter extends Token {
  type: 'CodeDelimiter';
  marker: '`' | '```';
}
```

## Block-Level Nodes

### ParagraphBlock

```typescript
interface ParagraphBlock extends CstNode {
  type: 'Paragraph';
  children: CstNode[];
}
```

### HeadingBlock

```typescript
interface HeadingBlock extends CstNode {
  type: 'Heading';
  children: CstNode[];
}
```

### CodeBlock

```typescript
interface CodeBlock extends CstNode {
  type: 'CodeBlock';
  children: CstNode[];
}
```

### ListBlock

```typescript
interface ListBlock extends CstNode {
  type: 'List';
  children: ListItem[];
}

interface ListItem extends CstNode {
  type: 'ListItem';
  children: CstNode[];
}
```

## Inline Nodes

### EmphasisInline

```typescript
interface EmphasisInline extends CstNode {
  type: 'Emphasis';
  children: CstNode[];
}
```

### StrongInline

```typescript
interface StrongInline extends CstNode {
  type: 'Strong';
  children: CstNode[];
}
```

### CodeSpan

```typescript
interface CodeSpan extends CstNode {
  type: 'CodeSpan';
  children: CstNode[];
}
```

## Usage Examples

### Basic Node Creation

```typescript
import type { CstNode, Position, Token } from '@sylphlab/ast-core';

// Create a token
const identifier: Token = {
  type: 'Identifier',
  text: 'myVariable',
  position: {
    startOffset: 0,
    endOffset: 10
  }
};

// Create a node with children
const paragraph: CstNode = {
  type: 'Paragraph',
  text: 'Hello, world!',
  position: {
    startOffset: 0,
    endOffset: 13
  },
  children: [
    {
      type: 'Word',
      text: 'Hello',
      position: { startOffset: 0, endOffset: 5 }
    },
    {
      type: 'Punctuation',
      text: ',',
      position: { startOffset: 5, endOffset: 6 }
    },
    // ... more children
  ]
};
```

### Type Guards

```typescript
import type { CstNode, Token } from '@sylphlab/ast-core';

function isToken(node: CstNode): node is Token {
  return node.children === undefined;
}

function hasChildren(node: CstNode): boolean {
  return Array.isArray(node.children) && node.children.length > 0;
}

// Usage
if (isToken(node)) {
  console.log('Leaf node:', node.text);
} else if (hasChildren(node)) {
  console.log('Parent node with', node.children.length, 'children');
}
```

### Tree Traversal

```typescript
import type { CstNode } from '@sylphlab/ast-core';

function traverse(node: CstNode, callback: (node: CstNode) => void): void {
  callback(node);

  if (node.children) {
    for (const child of node.children) {
      traverse(child, callback);
    }
  }
}

// Usage
traverse(root, (node) => {
  console.log(`${node.type}: ${node.text}`);
});
```

### Extract Text

```typescript
import type { CstNode } from '@sylphlab/ast-core';

function extractText(node: CstNode): string {
  if (!node.children || node.children.length === 0) {
    return node.text;
  }

  return node.children.map(extractText).join('');
}

// Usage
const fullText = extractText(rootNode);
```

## Building Custom Parsers

When building your own parser, extend the core types:

```typescript
import type { CstNode, Token, Position } from '@sylphlab/ast-core';

// Define language-specific tokens
export interface MyLanguageKeyword extends Token {
  type: 'Keyword';
  keyword: string;
}

export interface MyLanguageIdentifier extends Token {
  type: 'Identifier';
  name: string;
}

// Define language-specific nodes
export interface MyLanguageFunction extends CstNode {
  type: 'FunctionDeclaration';
  name: MyLanguageIdentifier;
  parameters: MyLanguageIdentifier[];
  body: CstNode[];
}

// Create parser
export function parseMyLanguage(code: string): CstNode {
  // Your parsing logic here
  // Return root CstNode
}
```

## TypeScript Configuration

For optimal use with TypeScript:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

## Package Information

| Property | Value |
|----------|-------|
| **Name** | @sylphlab/ast-core |
| **Version** | 0.0.0 |
| **License** | MIT |
| **Dependencies** | None |
| **Bundle Size** | ~10 KB (minified) |

## API Reference

### Exports

```typescript
// Core interfaces
export type { CstNode };
export type { Token };
export type { Position };
export type { Point };

// Common tokens
export type { Whitespace };
export type { Newline };
export type { Word };
export type { Punctuation };

// Markdown tokens
export type { HeadingMarker };
export type { ListItemMarker };
export type { EmphasisMarker };
export type { CodeDelimiter };
export type { LinkLabelStart };
export type { LinkLabelEnd };
export type { LinkUrlStart };
export type { LinkUrlEnd };

// Block nodes
export type { ParagraphBlock };
export type { HeadingBlock };
export type { CodeBlock };
export type { ListBlock };
export type { ListItem };

// Inline nodes
export type { EmphasisInline };
export type { StrongInline };
export type { CodeSpan };

// Version
export { version };
```

## Best Practices

### 1. Always Track Positions

Include position information for all nodes:

```typescript
const node: CstNode = {
  type: 'MyNode',
  text: 'content',
  position: {
    startOffset: 0,
    endOffset: 7
  }
};
```

### 2. Use Specific Types

Extend base types with language-specific information:

```typescript
interface JavaScriptIdentifier extends Token {
  type: 'Identifier';
  name: string;
  // Add JavaScript-specific properties
}
```

### 3. Validate Node Structure

Ensure nodes have all required properties:

```typescript
function validateNode(node: CstNode): boolean {
  return (
    typeof node.type === 'string' &&
    typeof node.text === 'string' &&
    typeof node.position === 'object' &&
    typeof node.position.startOffset === 'number' &&
    typeof node.position.endOffset === 'number'
  );
}
```

### 4. Immutable Updates

Treat nodes as immutable:

```typescript
// Good: Create new node
const updated = { ...node, text: 'newText' };

// Avoid: Mutate existing node
node.text = 'newText';  // Don't do this
```

## Related Packages

- [@sylphlab/ast-javascript](/packages/javascript) - JavaScript parser
- More language parsers coming soon!

## Contributing

Want to extend the core types? Check out:
- [Development Guide](/development/)
- [Adding Languages](/guide/adding-languages)
- [GitHub Repository](https://github.com/SylphxAI/ast)

---

Questions? [Open an issue](https://github.com/SylphxAI/ast/issues) or [contact us](mailto:hi@sylphx.com).
