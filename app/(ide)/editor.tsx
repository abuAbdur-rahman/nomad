import { useRef, useCallback, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'
import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { EditorTabs } from '@/components/editor/EditorTabs'
import { ExtraKeyToolbar } from '@/components/editor/ExtraKeyToolbar'
import { FileTreeOverlay } from '@/components/filetree/FileTreeOverlay'
import { useEditorStore } from '@/stores/editor.store'
import { useFileTreeStore } from '@/stores/filetree.store'

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

export default function EditorScreen() {
  const webViewRef = useRef<WebView>(null)
  const [showFileTree, setShowFileTree] = useState(false)
  const { openFiles, activeTabId, updateContent } = useEditorStore()
  const { currentProjectPath } = useFileTreeStore()

  const activeFile = openFiles.find(f => f.id === activeTabId)

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      
      if (data.type === 'contentChange' && activeTabId === data.modelId) {
        updateContent(data.modelId, data.content)
      }
    } catch (e) {
      // Ignore non-JSON messages
    }
  }, [activeTabId, updateContent])

  const handleKeyPress = (key: string, code: string) => {
    webViewRef.current?.injectJavaScript(`
      window.monacoInsertKey('${key}');
      true;
    `)
  }

  const closeFileTree = () => setShowFileTree(false)

  return (
    <View className="flex-1 bg-dark-100">
      <StatusBar style="light" />
      
      <View className="pt-[50px] px-3 pb-3 bg-dark-200 flex-row items-center gap-3">
        <TouchableOpacity 
          className="p-1"
          onPress={() => setShowFileTree(true)}
        >
          <MaterialCommunityIcons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text className="flex-1 text-lg font-semibold text-white" numberOfLines={1}>
          {currentProjectPath ? currentProjectPath.split('/').pop() : 'No project open'}
        </Text>
        
        <TouchableOpacity className="p-1">
          <MaterialCommunityIcons name="source-branch" size={24} color="#8888aa" />
        </TouchableOpacity>
      </View>

      <EditorTabs />

      {activeFile ? (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: MONACO_HTML }}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          className="flex-1 bg-dark-100"
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <MaterialCommunityIcons name="code-tags" size={64} color="#4a4a6a" />
          <Text className="text-base text-dark-500 mt-4">Open a file to start editing</Text>
        </View>
      )}

      <ExtraKeyToolbar onKeyPress={handleKeyPress} />

      <FileTreeOverlay visible={showFileTree} onClose={closeFileTree} />
    </View>
  )
}
