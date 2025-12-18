export const SERVICE_CATALOG = [
  {
    id: 'MOBILE',
    name: 'Mobile Recharge',
    icon: '📱',
    identifierLabel: 'Mobile Number',
    identifierPlaceholder: 'e.g. 9876543210',
    identifierHint: 'Enter the 10-digit prepaid mobile number you want to recharge.',
    identifierPattern: /^[6-9]\d{9}$/,
    amountLabel: 'Plan amount',
    planRequired: true,
  },
  {
    id: 'DTH',
    name: 'DTH Recharge',
    icon: '📡',
    identifierLabel: 'Subscriber ID',
    identifierPlaceholder: 'e.g. 1234567890',
    identifierHint: 'Provide the numeric subscriber ID shared by your DTH provider.',
    identifierPattern: /^\d{6,12}$/,
    amountLabel: 'Recharge amount',
    planRequired: false,
  },
  {
    id: 'BILL',
    name: 'Bill Payments',
    icon: '🧾',
    identifierLabel: 'Account / Consumer Number',
    identifierPlaceholder: 'e.g. EB12345',
    identifierHint: 'Enter the consumer/account number exactly as it appears on your bill.',
    identifierPattern: /^[A-Z0-9]{6,18}$/i,
    amountLabel: 'Bill amount',
    planRequired: false,
  },
  {
    id: 'DATA',
    name: 'Data Packs',
    icon: '📶',
    identifierLabel: 'Mobile Number',
    identifierPlaceholder: 'e.g. 9876543210',
    identifierHint: 'Recharge the prepaid number you want to boost with data.',
    identifierPattern: /^[6-9]\d{9}$/,
    amountLabel: 'Data pack amount',
    planRequired: true,
  },
];

export const SERVICE_TYPE_IDS = SERVICE_CATALOG.map((service) => service.id);

export const getServiceDefinition = (serviceType) =>
  SERVICE_CATALOG.find((service) => service.id === serviceType) || null;
