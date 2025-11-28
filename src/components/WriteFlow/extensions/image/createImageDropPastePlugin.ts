// @ts-nocheck
import { Plugin, PluginKey } from 'prosemirror-state';
import { WriteFlow } from '../../types';
import {
  EditorView,
  Decoration,
  DecorationSet,
  EditorProps,
} from 'prosemirror-view';

/**
 * 插件 Key，用于管理 loading 状态
 */
const imageUploadKey = new PluginKey('imageUpload');

/**
 * 生成唯一 ID
 */
const generateId = () => `image-upload-${Date.now()}-${Math.random()}`;

/**
 * 创建 loading 占位符 DOM 元素
 */
const createLoadingPlaceholder = (): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'wf-image-upload-placeholder';
  container.contentEditable = 'false';

  const spinner = document.createElement('div');
  spinner.className = 'wf-image-upload-spinner';

  const text = document.createElement('div');
  text.className = 'wf-image-upload-text';
  text.textContent = 'Uploading image...';

  container.appendChild(spinner);
  container.appendChild(text);

  return container;
};

/**
 * 处理图片文件
 */
const filterImageFiles = (files?: FileList): File[] => {
  if (!files) {
    return [];
  }

  const imageFiles = Array.from(files).filter((file) =>
    file.type.startsWith('image/'),
  );

  return imageFiles;
};

/**
 * 处理文件上传，返回图片 URL
 * 这里示例使用 Base64，实际项目中应该上传到服务器
 */
const uploadFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 插入 loading 占位符
 */
const insertLoadingPlaceholder = (
  view: EditorView,
  pos: number,
  uploadId: string,
) => {
  const placeholder = createLoadingPlaceholder();
  const decoration = Decoration.widget(pos, placeholder, {
    id: uploadId,
  });

  const { tr } = view.state;
  const pluginState = imageUploadKey.getState(view.state) || {
    decorations: DecorationSet.empty,
  };

  const decorations = pluginState.decorations.add(tr.doc, [decoration]);

  view.dispatch(
    tr.setMeta(imageUploadKey, {
      add: { decoration, uploadId },
      decorations,
    }),
  );
};

/**
 * 移除 loading 占位符
 */
const removeLoadingPlaceholder = (view: EditorView, uploadId: string) => {
  const { tr } = view.state;
  const pluginState = imageUploadKey.getState(view.state);

  if (!pluginState) return;

  const decorations = pluginState.decorations.find(
    undefined,
    undefined,
    (spec: { id: string }) => spec.id !== uploadId,
  );

  view.dispatch(
    tr.setMeta(imageUploadKey, {
      remove: { uploadId },
      decorations: DecorationSet.create(tr.doc, decorations),
    }),
  );
};

/**
 * 插入图片到编辑器
 */
const insertImage = (view: EditorView, url: string, pos: number) => {
  const { schema } = view.state;
  const node = schema.nodes.image.create({ src: url });

  const transaction = view.state.tr.insert(pos, node);
  view.dispatch(transaction);
};

/**
 * 处理拖拽和粘贴的图片文件
 */
const handleImageFiles = async (
  view: EditorView,
  files: FileList | File[],
  pos: number,
) => {
  const imageFiles = Array.from(files).filter((file) =>
    file.type.startsWith('image/'),
  );

  for (const file of imageFiles) {
    try {
      const url = await uploadFile(file);
      insertImage(view, url, pos);
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }

  return imageFiles.length > 0;
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
      const hasImageFiles = Array.from(files).some((file) =>
        file.type.startsWith('image/'),
      );

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
