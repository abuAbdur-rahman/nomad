import { WebView, WebViewProps } from 'react-native-webview'
import { useRef, useCallback, useEffect } from 'react'
import { useEditorStore } from '@/stores/editor.store'
import { useSettingsStore } from '@/stores/settings.store'
import { getMonacoTheme } from '@/constants/themes'

interface MonacoEditorProps extends WebViewProps {
  onReady?: () => void
}

const MONACO_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #editor { width: 100%; height: 100%; overflow: hidden; }
    body { background-color: #1a1a2e; }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js"></script>
</head>
<body>
  <div id="editor"></div>
  <script>
    let editor = null;
    let currentModel = null;
    
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
    
    require(['vs/editor/editor.main'], function () {
      editor = monaco.editor.create(document.getElementById('editor'), {
        value: '',
        language: 'plaintext',
        theme: 'vs-dark',
        fontSize: 14,
        tabSize: 2,
        automaticLayout: true,
        minimap: { enabled: true },
        wordWrap: 'off',
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        renderLineHighlight: 'all',
        folding: true,
        fontFamily: 'Fira Code, monospace',
        fontLigatures: true,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        padding: { top: 8, bottom: 8 },
      });

      editor.onDidChangeModelContent(() => {
        if (currentModel) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'contentChange',
            content: editor.getValue(),
            modelId: currentModel.id
          }));
        }
      });

      editor.onDidChangeCursorPosition((e) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'cursorChange',
          line: e.position.lineNumber,
          column: e.position.column
        }));
      });

      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
    });

    window.monacoInit = function(config) {
      if (!editor) return;
      
      if (config.content !== undefined) {
        if (currentModel && currentModel.id === config.modelId) {
          editor.setValue(config.content);
        } else {
          if (currentModel) {
            currentModel.dispose();
          }
          currentModel = monaco.editor.createModel(config.content, config.language);
          editor.setModel(currentModel);
          currentModel.id = config.modelId || Date.now().toString();
        }
      }
      
      if (config.language) {
        if (currentModel) {
          monaco.editor.setModelLanguage(currentModel, config.language);
        }
      }
      
      if (config.theme) {
        monaco.editor.setTheme(config.theme);
      }
      
      if (config.fontSize) {
        editor.updateOptions({ fontSize: config.fontSize });
      }
      
      if (config.tabSize) {
        editor.updateOptions({ tabSize: config.tabSize });
      }
      
      if (config.minimap !== undefined) {
        editor.updateOptions({ minimap: { enabled: config.minimap } });
      }
      
      if (config.wordWrap !== undefined) {
        editor.updateOptions({ wordWrap: config.wordWrap ? 'on' : 'off' });
      }
    };

    window.monacoInsertText = function(text) {
      if (!editor) return;
      var selection = editor.getSelection();
      var range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
      editor.executeEdits('', [{ range: range, text: text }]);
    };

    window.monacoInsertKey = function(key) {
      if (!editor) return;
      
      switch(key) {
        case 'Tab':
          editor.trigger('keyboard', 'tab', {});
          break;
        case 'Backspace':
          editor.trigger('keyboard', 'deleteLeft', {});
          break;
        case 'ArrowUp':
          editor.trigger('keyboard', 'cursorUp', {});
          break;
        case 'ArrowDown':
          editor.trigger('keyboard', 'cursorDown', {});
          break;
        case 'ArrowLeft':
          editor.trigger('keyboard', 'cursorLeft', {});
          break;
        case 'ArrowRight':
          editor.trigger('keyboard', 'cursorRight', {});
          break;
        default:
          editor.trigger('keyboard', 'type', { text: key });
      }
    };

    window.monacoGetPosition = function() {
      if (!editor) return { line: 1, column: 1 };
      var pos = editor.getPosition();
      return { line: pos.lineNumber, column: pos.column };
    };
  </script>
</body>
</html>
`

export function MonacoEditor({ onReady, ...props }: MonacoEditorProps) {
  const webViewRef = useRef<WebView>(null)
  const { openFiles, activeTabId, updateContent, setFontSize, setTheme } = useEditorStore()
  const settings = useSettingsStore()

  const activeFile = openFiles.find(f => f.id === activeTabId)

  const handleMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      
      switch (data.type) {
        case 'ready':
          onReady?.()
          break
        case 'contentChange':
          if (activeTabId === data.modelId) {
            updateContent(data.modelId, data.content)
          }
          break
        case 'cursorChange':
          // Could update cursor position in store
          break
      }
    } catch (e) {
      // Ignore non-JSON messages
    }
  }, [activeTabId, updateContent, onReady])

  useEffect(() => {
    if (activeFile && webViewRef.current) {
      const monacoTheme = getMonacoTheme(settings.theme)
      webViewRef.current.injectJavaScript(`
        window.monacoInit({
          modelId: '${activeFile.id}',
          content: ${JSON.stringify(activeFile.content)},
          language: '${activeFile.language}',
          theme: 'vs-dark',
          fontSize: ${settings.fontSize},
          tabSize: ${settings.tabSize},
          minimap: ${settings.minimap},
          wordWrap: ${settings.wordWrap}
        });
        true;
      `)
    }
  }, [activeFile, settings.theme, settings.fontSize, settings.tabSize, settings.minimap, settings.wordWrap])

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ html: MONACO_HTML }}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      style={{ backgroundColor: '#1a1a2e' }}
      {...props}
    />
  )
}
