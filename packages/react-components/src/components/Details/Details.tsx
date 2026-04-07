import {
  DetailsFamilyBase,
  type DetailsFamilyProps,
} from '../_internal/DetailsFamily';

export type DetailsProps = DetailsFamilyProps;

export const Details = (props: DetailsProps) => (
  <DetailsFamilyBase
    {...props}
    variant="details"
  />
);

Details.displayName = 'Details';
