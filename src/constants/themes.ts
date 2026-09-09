export const themes = {
  dracula: {
    name: 'Dracula',
    colors: {
      background: '#282a36',
      foreground: '#f8f8f2',
      selection: '#44475a',
      comment: '#6272a4',
      red: '#ff5555',
      orange: '#ffb86c',
      yellow: '#f1fa8c',
      green: '#50fa7b',
      purple: '#bd93f9',
      cyan: '#8be9fd',
      pink: '#ff79c6',
    },
  },
  oneDark: {
    name: 'One Dark',
    colors: {
      background: '#282c34',
      foreground: '#abb2bf',
      selection: '#3e4451',
      comment: '#5c6370',
      red: '#e06c75',
      orange: '#d19a66',
      yellow: '#e5c07b',
      green: '#98c379',
      purple: '#c678dd',
      cyan: '#56b6c2',
      pink: '#c678dd',
    },
  },
  githubLight: {
    name: 'GitHub Light',
    colors: {
      background: '#ffffff',
      foreground: '#24292e',
      selection: '#c8e1ff',
      comment: '#6a737d',
      red: '#d73a49',
      orange: '#e36209',
      yellow: '#b08800',
      green: '#22863a',
      purple: '#6f42c1',
      cyan: '#005cc5',
      pink: '#6f42c1',
    },
  },
  monokai: {
    name: 'Monokai',
    colors: {
      background: '#272822',
      foreground: '#f8f8f2',
      selection: '#49483E',
      comment: '#75715e',
      red: '#f92672',
      orange: '#fd971f',
      yellow: '#f4bf75',
      green: '#a6e22e',
      purple: '#ae81ff',
      cyan: '#66d9ef',
      pink: '#f92672',
    },
  },
}

export type ThemeName = keyof typeof themes

export const getMonacoTheme = (themeName: ThemeName) => {
  const theme = themes[themeName]
  return {
    base: 'vs-dark' as const,
    inherit: true,
    rules: [
      { token: 'comment', foreground: theme.colors.comment, fontStyle: 'italic' },
      { token: 'keyword', foreground: theme.colors.purple },
      { token: 'string', foreground: theme.colors.green },
      { token: 'number', foreground: theme.colors.orange },
      { token: 'type', foreground: theme.colors.cyan },
    ],
    colors: {
      'editor.background': theme.colors.background,
      'editor.foreground': theme.colors.foreground,
      'editor.selectionBackground': theme.colors.selection,
      'editor.lineHighlightBackground': theme.colors.selection,
    },
  }
}
