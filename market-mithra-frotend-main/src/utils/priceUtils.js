// Utility function to safely render price values from MongoDB Decimal128 objects
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '0';
  if (typeof price === 'object' && price.$numberDecimal) {
    return price.$numberDecimal;
  }
  return price.toString();
};

// Utility function to get numeric value from price
export const getNumericPrice = (price) => {
  if (price === null || price === undefined) return 0;
  if (typeof price === 'object' && price.$numberDecimal) {
    return parseFloat(price.$numberDecimal);
  }
  return parseFloat(price);
};