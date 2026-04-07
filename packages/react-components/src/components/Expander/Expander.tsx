import {
  DetailsFamilyBase,
  type DetailsFamilyProps,
} from '../_internal/DetailsFamily';

export type ExpanderProps = DetailsFamilyProps;

export const Expander = (props: ExpanderProps) => (
  <DetailsFamilyBase
    {...props}
    variant="expander"
  />
);

Expander.displayName = 'Expander';
