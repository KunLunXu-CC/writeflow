// @ts-nocheck

import { useEffect, useRef } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { schema } from 'prosemirror-schema-basic';
import { Schema, DOMParser } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import getPlugins from '@/components/Editor/plugins';
import nodeViews from '@/components/Editor/nodeViews';

import '@/components/Editor/theme';

export default function Editor() {
  const editorRef = useRef<EditorView | null>(null);
  const editorDom = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;

    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks,
    });

    const doc = DOMParser.fromSchema(mySchema).parse(document.createElement('div'));

    editorRef.current = new EditorView(editorDom.current, {
      nodeViews,
      state: EditorState.create({
        doc,
        plugins: getPlugins(mySchema),
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
