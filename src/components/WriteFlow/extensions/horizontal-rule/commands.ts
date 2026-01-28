import { WFCommand } from '../../types';
import { isNumber } from 'lodash-es';

export interface InsertHorizontalRuleOptions {
  end?: number;
  start?: number;
}

export const insertHorizontalRule: WFCommand<InsertHorizontalRuleOptions> = (
  { writeFlow },
  options,
) => {
  const { start, end } = options ?? {};
  const { state, schema, dispatch } = writeFlow;
  const { tr } = state;

  if (isNumber(start) && isNumber(end)) {
    tr.delete(start, end);
  }

  const hr = schema.nodes.horizontal_rule.create();
  tr.replaceSelectionWith(hr);
  dispatch(tr);
  return true;
};
