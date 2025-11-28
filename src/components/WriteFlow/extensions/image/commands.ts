import { WFCommand } from '../../types';
import { EditorState } from 'prosemirror-state';

export const findUploadingImageNode = (
  state: EditorState,
  uploadId: string,
) => {
  let foundPos = null;
  state.doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs['src'] === 'url') {
      foundPos = pos;
      return false;
    }
  });
  return foundPos;
};

// com

/**
 * 插入图片命令 - 通过文件
 * @param {object} writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const insertImageByFile: WFCommand<{ file?: File }> = async (
  writeFlow,
  options,
) => {
  const { file } = options || {};
  const { commands, state, dispatch, schema } = writeFlow;

  if (!file) {
    return false;
  }

  const tr = state.tr.insert(
    state.selection.from,
    schema.nodes.image.create({ src: 'url' }),
  );

  dispatch(tr);

  const reader = new FileReader();
  reader.onload = async () => {
    const base64Url = reader.result as string;

    await new Promise((resolve) => setTimeout(resolve, 1000 * 10));

    // 4. 这一行也会触发文档更新,但设置了 addToHistory: false ✅
    // 遍历文档中所有节点
    const nodePos = findUploadingImageNode(writeFlow.state, 'url');

    console.log(
      '%c [ base64Url ]-40',
      'font-size:13px; background:pink; color:#bf2c9f;',
      base64Url,
      nodePos,
    );

    if (nodePos !== null) {
      writeFlow.dispatch(
        writeFlow.state.tr
          .setNodeMarkup(nodePos, null, {
            src: base64Url,
          })
          .setMeta('addToHistory', false),
      );

      // .setMeta('addToHistory', false), // 不记录历史,但会触发更新
    }

    // commands.insertImageByUrl({ url: base64Url });
  };
  reader.readAsDataURL(file);

  return true;
};

/**
 * 插入图片命令 - 通过 URL
 * @param {object} writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const insertImageByUrl: WFCommand<{ url?: string }> = async (
  writeFlow,
  options,
) => {
  const { url } = options || {};
  const { dispatch, state, schema } = writeFlow;

  if (!url) {
    return false;
  }

  const node = schema.nodes.image.create({ src: url });
  const transaction = state.tr.insert(state.selection.from, node);
  dispatch(transaction);

  return true;
};
