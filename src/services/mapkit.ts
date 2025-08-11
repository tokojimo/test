export async function loadMapKit() {
  if ((window as any).mapkit) {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.onload = () => {
      const token = (import.meta as any).env.VITE_MAPKIT_TOKEN || '';
      (window as any).mapkit.init({
        authorizationCallback: function (done: (token: string) => void) {
          done(token);
        },
      });
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
