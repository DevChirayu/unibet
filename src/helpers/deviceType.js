export const getDeviceType = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  const isWebView = (() => {
    const isIOS = /iPhone|iPod|iPad/i.test(ua);
    const isSafari = /Safari/.test(ua);
    const isStandalone = window.navigator.standalone;

    if (isIOS) {
      return !isSafari && !isStandalone;
    }

    const isAndroid = /Android/.test(ua);
    const isWebviewRegex = /; wv\)|; wv;|\bVersion\/[\d.]+/i;
    if (isAndroid && isWebviewRegex.test(ua)) {
      return true;
    }

    return false;
  })();

  if (isWebView) return 'webview';

  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  return isMobile ? 'mobile' : 'desktop';
};
