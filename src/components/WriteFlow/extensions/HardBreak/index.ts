import { NodeSpec } from 'prosemirror-model';
import { Node } from '@/components/WriteFlow/core/Node';

export const HardBreak = Node.create({
  name: 'hard_break',

  addSchema: () =>
    ({
      inline: true,
      group: 'inline',
      selectable: false,
      toDOM: () => ['br'],
      parseDOM: [{ tag: 'br' }],
    }) as NodeSpec,

  addCommands: () => {
    return {
      // setHardBreak: () => (state, dispatch) => {
      //   if (dispatch) {
      //     dispatch(state.tr.replaceSelectionWith(this.type.create()).scrollIntoView());
      //   }
      //   return true;
      // },
    };
  },

  addKeymap: () => {
    return {
      // Shift + Enter: 在段落内插入换行符
      'Shift-Enter': (state, dispatch) => {
        const { hard_break: hardBreakType } = state.schema.nodes;

        if (!dispatch) {
          return true;
        }

        dispatch(
          state.tr
            .replaceSelectionWith(hardBreakType.create())
            .scrollIntoView(),
        );

        return true;
      },
      // Shift + Enter: 在段落内插入换行符
      // 'Shift-Enter': chainCommands(exitCode, (state, dispatch) => {
      //   if (dispatch) {
      //     dispatch(state.tr.replaceSelectionWith(this.type.create()).scrollIntoView());
      //   }
      //   return true;
      // }),
    };
  },
});
