import { useEffect, useRef } from 'react';
import { DOMParser } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { codeBlockNodeView } from '@/components/Editor/extension/codeBlock';
import mySchema from '@/components/Editor/schema';
import plugins from '@/components/Editor/plugins';
import '@/components/Editor/theme';

export default function Editor() {
  const editorRef = useRef<EditorView | null>(null);
  const editorDom = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;

    editorRef.current = new EditorView(editorDom.current, {
      nodeViews: {
        code_block: codeBlockNodeView,
      },
      state: EditorState.create({
        plugins,
        doc: DOMParser.fromSchema(mySchema).parse(
          document.createElement('div'),
        ),
      }),
    });
  }, []);

  return (
    <div
      ref={editorDom}
      className="w-[800px] h-[800px] markdown-preview-light [&_.ProseMirror]:outline-none [&_.ProseMirror]:bg-[#fafafa] [&_.ProseMirror]:min-h-[600px] [&_.ProseMirror]:p-1"
    />
  );
}
