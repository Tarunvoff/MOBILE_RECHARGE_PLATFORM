import classNames from 'classnames';
import { getStatusMeta } from '../utils/helpers';

const StatusBadge = ({ status }) => {
  const meta = getStatusMeta(status);

  return (
    <span className={classNames('badge', `status-badge--${meta.tone || 'default'}`)}>
      {meta.label}
    </span>
  );
};

export default StatusBadge;
