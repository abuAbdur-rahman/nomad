export const keybindings = {
  row1: [
    { label: 'Tab', code: 'Tab', key: '\t' },
    { label: '{', code: 'OpenBrace', key: '{' },
    { label: '}', code: 'CloseBrace', key: '}' },
    { label: '(', code: 'OpenParen', key: '(' },
    { label: ')', code: 'CloseParen', key: ')' },
    { label: '[', code: 'OpenBracket', key: '[' },
    { label: ']', code: 'CloseBracket', key: ']' },
    { label: ';', code: 'Semicolon', key: ';' },
    { label: ':', code: 'Colon', key: ':' },
    { label: "'", code: 'Quote', key: "'" },
    { label: '"', code: 'DoubleQuote', key: '"' },
    { label: '→', code: 'ArrowRight', key: 'Right' },
  ],
  row2: [
    { label: '←', code: 'ArrowLeft', key: 'Left' },
    { label: '⌫', code: 'Backspace', key: 'Backspace' },
    { label: '↑', code: 'ArrowUp', key: 'Up' },
    { label: '↓', code: 'ArrowDown', key: 'Down' },
    { label: '→', code: 'ArrowRight', key: 'Right' },
    { label: '=', code: 'Equal', key: '=' },
    { label: '-', code: 'Minus', key: '-' },
    { label: '_', code: 'Underscore', key: '_' },
    { label: '+', code: 'Plus', key: '+' },
    { label: '/', code: 'Slash', key: '/' },
    { label: '\\', code: 'Backslash', key: '\\' },
    { label: '|', code: 'Pipe', key: '|' },
  ],
}

export const defaultKeybindingRows = {
  showRow1: true,
  showRow2: true,
}
