export function register() {
  if (
    process.env.PUBLIC_URL === 'production' &&
    'serviceWorker' in navigator &&
    Notification.permission === 'granted'
  ) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then(() => console.log('Service Worker registerd!!!'))
        .catch((err) => console.log('Error:', err.message));
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((resgistration) => {
        resgistration.unregister();
      })
      .catch((err) => {
        console.log('Error:', err.message);
      });
  }
}
