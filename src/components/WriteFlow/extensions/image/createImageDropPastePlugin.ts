import { Plugin, PluginKey } from 'prosemirror-state';
import { WriteFlow } from '../../types';
import { EditorProps } from 'prosemirror-view';

/**
 * 插件 Key，用于管理 loading 状态
 */
// const imageUploadKey = new PluginKey('imageUpload');

/**
 * 处理图片文件
 */
const filterImageFiles = (files?: FileList): File[] => {
  if (!files) {
    return [];
  }

  const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

  return imageFiles;
};

/**
 * 创建图片拖拽粘贴插件
 */
export class ImageDropPastePlugin extends Plugin {
  writeFlow: WriteFlow;

  constructor(opts: { writeFlow: WriteFlow }) {
    super({});
    this.writeFlow = opts.writeFlow;
  }

  props: EditorProps<Plugin> = {
    // 处理拖拽文件
    handleDrop: (view, event, _slice, moved) => {
      // 如果是移动编辑器内的内容, 不处理
      // moved = true: 表示用户正在拖拽编辑器内已有的内容到另一个位置(内部移动)
      // moved = false: 表示用户从外部拖入内容(例如从文件系统拖入图片)
      if (moved) {
        return false;
      }

      const imageFiles = filterImageFiles(event.dataTransfer?.files);

      if (imageFiles.length === 0) {
        return false;
      }

      event.preventDefault();

      imageFiles.forEach((file) => {
        this.writeFlow.commands.insertImageByFile({ file });
      });
      return true;
    },

    // 处理粘贴文件
    handlePaste(view, event, _slice) {
      const files = event.clipboardData?.files;
      if (!files || files.length === 0) return false;

      // 检查是否有图片文件
      const hasImageFiles = Array.from(files).some((file) => file.type.startsWith('image/'));

      if (!hasImageFiles) return false;

      // 阻止默认行为
      event.preventDefault();

      // 在当前光标位置插入
      const { selection } = view.state;
      // handleImageFiles(view, files, selection.from);
      return true;
    },
  };
}
