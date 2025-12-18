export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusMeta = (status) => {
  switch (status) {
    case 'SUCCESS':
      return { label: 'Success', tone: 'success' };
    case 'FAILED':
      return { label: 'Failed', tone: 'failed' };
    case 'PENDING':
      return { label: 'Pending', tone: 'pending' };
    default:
      return { label: status || 'Unknown', tone: 'default' };
  }
};

export const maskMobileNumber = (mobileNumber) => {
  if (!mobileNumber) return '—';
  return `${mobileNumber.slice(0, 2)}xxxx${mobileNumber.slice(-4)}`;
};

export const maskIdentifier = (value, serviceType) => {
  if (!value) return '—';
  const normalized = value.toString();
  if (serviceType === 'MOBILE' || serviceType === 'DATA') {
    return maskMobileNumber(normalized);
  }
  if (normalized.length <= 4) {
    return normalized;
  }
  const visible = normalized.slice(-4);
  const masked = '*'.repeat(Math.max(0, normalized.length - 4));
  return `${masked}${visible}`;
};

export const getServiceDisplay = (serviceType) => {
  switch (serviceType) {
    case 'MOBILE':
      return { id: 'MOBILE', name: 'Mobile Recharge', icon: '📱' };
    case 'DTH':
      return { id: 'DTH', name: 'DTH Recharge', icon: '📡' };
    case 'BILL':
      return { id: 'BILL', name: 'Bill Payments', icon: '🧾' };
    case 'DATA':
      return { id: 'DATA', name: 'Data Packs', icon: '📶' };
    default:
      return { id: serviceType, name: serviceType || 'Unknown', icon: '✨' };
  }
};
