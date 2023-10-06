export const getDate = (dateInMillis, style) => {
  const option = style ?? { dateStyle: 'short' };
  const dateStyle = new Intl.DateTimeFormat('en-IN', option);

  return dateStyle.format(dateInMillis);
};

export const getTime = (dateInMillis) => {
  const timeStyle = new Intl.DateTimeFormat('en-IN', {
    timeStyle: 'short',
  });

  return timeStyle.format(dateInMillis);
};
