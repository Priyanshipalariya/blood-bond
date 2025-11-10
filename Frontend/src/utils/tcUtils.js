// Terms and Conditions utility functions

export const isTCAccepted = () => {
  return localStorage.getItem('tcAccepted') === 'true';
};

export const acceptTC = () => {
  localStorage.setItem('tcAccepted', 'true');
};

export const rejectTC = () => {
  localStorage.removeItem('tcAccepted');
};




