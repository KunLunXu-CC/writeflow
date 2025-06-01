import { useEffect, useRef } from 'react';
import { DOMParser } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import getPlugins from '@/components/Editor/plugins';
import nodeViews from '@/components/Editor/nodeViews';
import mySchema from '@/components/Editor/schema';
import '@/components/Editor/theme';

export default function Editor() {
  const editorRef = useRef<EditorView | null>(null);
  const editorDom = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;

    const doc = DOMParser.fromSchema(mySchema).parse(document.createElement('div'));

    editorRef.current = new EditorView(editorDom.current, {
      nodeViews,
      state: EditorState.create({
        doc,
        plugins: getPlugins(mySchema),
      }),
    });
  }, []);

  // const handleInsertTable = () => {
  //   let rowCount = 2;
  //   let colCount = 2;

  //   const cells: Node[] = [];

  //   while (colCount--) {
  //     cells.push(mySchema.nodes.table_cell.createAndFill() as Node);
  //   }
  //   const rows: Node[] = [];
  //   while (rowCount--) {
  //     rows.push(mySchema.nodes.table_row.createAndFill(null, cells) as Node);
  //   }
  //   const table = mySchema.nodes.table.createAndFill(null, rows) as Node;
  //   editorRef.current?.dispatch(editorRef.current?.state.tr.replaceSelectionWith(table));
  // };

  return (
    <>
      {/* <div onClick={handleInsertTable}>插入表格</div> */}
      <div
        ref={editorDom}
        className="w-[800px] h-[800px] markdown-preview-light [&_.ProseMirror]:outline-none [&_.ProseMirror]:bg-[#fafafa] [&_.ProseMirror]:min-h-[600px] [&_.ProseMirror]:p-1"
      />
    </>
  );
}
