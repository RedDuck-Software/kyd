type VariantKeys = 'orange-fill' | 'orange' | 'blue-fill' | 'blue' | 'violent-fill' | 'violent';

export const getShadowCardVariant = (number: number): VariantKeys => {
  if (number % 3 === 0) return 'orange';
  if (number % 3 === 1) return 'blue';
  return 'violent';
};

export const getShadowCardFilledVariant = (number: number): VariantKeys => {
  if (number % 3 === 0) return 'orange-fill';
  if (number % 3 === 1) return 'blue-fill';
  return 'violent-fill';
};
