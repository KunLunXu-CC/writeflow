import { v4 as uuid } from 'uuid';
import { WFCommand } from '../../types';
import { UPLOAD_STATUS } from './types';
import { readFileAsDataURL } from './utils';

/**
 * 更新图片节点属性 - 通过 uploadId
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @param {object} options - 命令选项
 * @param {string} options.uploadId - 上传 ID
 * @param {object} options.newAttrs - 新的节点属性
 * @return boolean - 命令执行结果
 */
export const setImageByUploadId: WFCommand<{
  uploadId: string;
  newAttrs: any;
}> = async ({ writeFlow }, options) => {
  const { uploadId, newAttrs } = options || {};

  if (!uploadId || !newAttrs) {
    return false;
  }

  const { state, dispatch } = writeFlow;

  // 1. 查找图片节点位置
  let foundPos = null;
  state.doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs['uploadId'] === uploadId) {
      foundPos = pos;
      return false;
    }
  });

  // 2. 如果没找到, 则返回 false
  if (foundPos === null) {
    return false;
  }

  // 3. 更新节点属性
  const tr = state.tr
    .setNodeMarkup(foundPos, null, {
      ...state.doc.nodeAt(foundPos)?.attrs,
      ...newAttrs,
    })
    .setMeta('addToHistory', false);

  dispatch(tr);

  return true;
};

/**
 * 插入图片命令 - 通过文件
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const insertImageByFile: WFCommand<{ file?: File }> = async (
  { writeFlow, extension },
  options,
) => {
  const { file } = options || {};
  const uploadId = uuid();
  const { state, dispatch, schema } = writeFlow;

  if (!file) {
    return false;
  }

  const { upload } = extension.options || {};

  // 1. 先插入一个占位符图片节点
  const imageNode = schema.nodes.image.create({
    uploadId,
    status: UPLOAD_STATUS.UPLOAD_ING,
  });
  dispatch(state.tr.replaceSelectionWith(imageNode));

  // 2. 读取文件内容, 转成 base64 URL
  readFileAsDataURL(file).then((src) => {
    writeFlow.commands.setImageByUploadId({
      uploadId,
      newAttrs: {
        src,
        status: upload ? UPLOAD_STATUS.UPLOAD_ING : UPLOAD_STATUS.UPLOAD_DONE,
      },
    });
  });

  // 3. 调用上传接口上传图片文件
  if (upload) {
    const { url } = await upload({ file });
    writeFlow.commands.setImageByUploadId({
      uploadId,
      newAttrs: {
        src: url,
        status: UPLOAD_STATUS.UPLOAD_DONE,
      },
    });
  }

  return true;
};

/**
 * 插入图片命令 - 通过 URL
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const insertImageByUrl: WFCommand<{ url?: string }> = async ({ writeFlow }, options) => {
  const { url } = options || {};
  const { dispatch, state, schema } = writeFlow;

  if (!url) {
    return false;
  }

  const imageNode = schema.nodes.image.create({ src: url });
  dispatch(state.tr.replaceSelectionWith(imageNode));

  return true;
};
