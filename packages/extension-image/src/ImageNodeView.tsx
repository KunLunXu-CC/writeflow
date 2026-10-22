import {
  useCallback,
  useMemo,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import {
  Resizable,
  type HandleClassName,
  type HandleComponent,
  type HandleStyles,
  type ResizeCallback,
} from 're-resizable';
import { AlignCenter, AlignLeft, AlignRight, MoveDiagonal2 } from 'lucide-react';
import { WFNodeView, type WFNodeViewProps } from '@kunlunxu/wf-core';

const RESIZE_DIRECTIONS = {
  top: false,
  right: false,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: true,
  bottomLeft: false,
  topLeft: false,
};

const RESIZE_HANDLE_CLASSES: HandleClassName = {
  bottomRight: 'wf-image-resize-handle-wrapper',
};

const RESIZE_HANDLE_STYLES: HandleStyles = {
  bottomRight: {
    right: 4,
    bottom: 4,
    width: 'auto',
    height: 'auto',
    zIndex: 3,
  },
};

interface ImageSize {
  width: number | 'auto';
  height: number | 'auto';
}

type ImageAlignment = 'left' | 'center' | 'right';

const ALIGNMENT_ITEMS = [
  { value: 'left', label: '居左', Icon: AlignLeft },
  { value: 'center', label: '居中', Icon: AlignCenter },
  { value: 'right', label: '居右', Icon: AlignRight },
] as const;

const handleAlignmentStart = (
  event: ReactMouseEvent<HTMLButtonElement> | ReactTouchEvent<HTMLButtonElement>,
) => {
  event.preventDefault();
  event.stopPropagation();
};

export const ImageNodeViewComponent = ({ node, nodeView }: WFNodeViewProps) => {
  const imageNodeView = nodeView as ImageNodeView;
  const nodeWidth = node.attrs.width as number | null;
  const src = node.attrs.src as string | null;
  const align = node.attrs.align as ImageAlignment;
  const displaySrc = imageNodeView.resolveUrl(src);

  const size = useMemo<ImageSize>(
    () => ({ width: nodeWidth ?? 'auto', height: 'auto' }),
    [nodeWidth],
  );

  const handleComponent = useMemo<HandleComponent>(
    () => ({
      bottomRight: (
        <div className="wf-image-toolbar">
          {ALIGNMENT_ITEMS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={align === value}
              onMouseDown={handleAlignmentStart}
              onTouchStart={handleAlignmentStart}
              onClick={() => imageNodeView.setAlign(value)}
              className={`wf-image-toolbar-button${align === value ? ' is-active' : ''}`}>
              <Icon size={13} />
            </button>
          ))}
          <button
            type="button"
            className="wf-image-toolbar-button wf-image-resize-handle"
            aria-label="调整图片大小">
            <MoveDiagonal2 size={13} />
          </button>
        </div>
      ),
    }),
    [align, imageNodeView],
  );

  const handleResizeStop = useCallback<ResizeCallback>(
    (_event, _direction, element) => {
      imageNodeView.setWidth(element.offsetWidth);
    },
    [imageNodeView],
  );

  return (
    <Resizable
      size={size}
      minWidth={80}
      maxWidth="100%"
      lockAspectRatio
      data-align={align}
      className="wf-image-wrapper"
      onResizeStop={handleResizeStop}
      handleComponent={handleComponent}
      handleStyles={RESIZE_HANDLE_STYLES}
      handleClasses={RESIZE_HANDLE_CLASSES}
      data-upload-status={node.attrs.status}
      enable={imageNodeView.view.editable ? RESIZE_DIRECTIONS : false}>
      <img
        className="wf-image"
        alt={node.attrs.alt}
        title={node.attrs.title}
        src={displaySrc || void 0}
      />
      <div className="wf-image-mask" />
    </Resizable>
  );
};

export class ImageNodeView extends WFNodeView {
  public static component = ImageNodeViewComponent;

  public override stopEvent(event: Event): boolean {
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      target.closest('.wf-image-resize-handle, .wf-image-resize-handle-wrapper')
    ) {
      return true;
    }

    return super.stopEvent(event);
  }

  public resolveUrl(src: string | null): string {
    if (!src) {
      return '';
    }

    return this.context.extension.options?.resolveUrl?.(src) ?? src;
  }

  public setWidth(width: number): void {
    this.setAttrs({ width });
  }

  public setAlign(align: ImageAlignment): void {
    this.setAttrs({ align });
  }

  private setAttrs(attrs: Record<string, unknown>): void {
    if (!this.view.editable) {
      return;
    }

    const pos = this.getPos();

    if (pos === undefined) {
      return;
    }

    const node = this.view.state.doc.nodeAt(pos);

    if (
      !node ||
      node.type !== this.node.type ||
      Object.entries(attrs).every(([key, value]) => node.attrs[key] === value)
    ) {
      return;
    }

    this.view.dispatch(
      this.view.state.tr.setNodeMarkup(pos, null, {
        ...node.attrs,
        ...attrs,
      }),
    );
  }
}
