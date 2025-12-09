import { Plugin, PluginKey } from 'prosemirror-state';
import { WriteFlow } from '../../types';
import { EditorProps } from 'prosemirror-view';

/** 过滤出图片文件 */
const filterImageFiles = (files?: FileList): File[] => {
  if (!files) {
    return [];
  }

  const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

  return imageFiles;
};

/** 图片拖拽粘贴插件 */
export class ImageDropPastePlugin extends Plugin {
  writeFlow: WriteFlow;

  constructor(opts: { writeFlow: WriteFlow }) {
    super({});
    this.writeFlow = opts.writeFlow;
  }

  insert = (args: { files?: FileList; event: Event }): boolean => {
    const { files, event } = args;
    const imageFiles = filterImageFiles(files);

    if (imageFiles.length === 0) {
      return false;
    }

    event.preventDefault();

    imageFiles.forEach((file) => {
      this.writeFlow.commands.insertImageByFile({ file });
    });

    return true;
  };

  props: EditorProps<Plugin> = {
    // 处理拖拽文件
    handleDrop: (view, event, _slice, moved) => {
      // moved: 是否是移动编辑器的内容
      // moved = true: 表示用户正在拖拽编辑器内已有的内容到另一个位置(内部移动)
      // moved = false: 表示用户从外部拖入内容(例如从文件系统拖入图片)
      if (moved) {
        return false;
      }

      return this.insert({ files: event.dataTransfer?.files, event });
    },

    // 处理粘贴文件
    handlePaste: (view, event, _slice) => this.insert({ files: event.clipboardData?.files, event }),
  };
}
