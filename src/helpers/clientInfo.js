export const getClientJSData = (client) => {
    const methods = [
        // 'getSoftwareVersion',
        // 'getBrowserData',
        'getFingerprint',
        // 'getCustomFingerprint',
        'getUserAgent',
        // 'getUserAgentLowerCase',
        'getBrowser',
        'getBrowserVersion',
        'getBrowserMajorVersion',
        'isIE',
        'isChrome',
        'isFirefox',
        'isSafari',
        'isMobileSafari',
        'isOpera',
        'getEngine',
        'getEngineVersion',
        'getOS',
        'getOSVersion',
        'isWindows',
        'isMac',
        'isLinux',
        'isUbuntu',
        'isSolaris',
        'getDevice',
        'getDeviceType',
        'getDeviceVendor',
        'getCPU',
        'isMobile',
        'isMobileMajor',
        'isMobileAndroid',
        'isMobileOpera',
        'isMobileWindows',
        'isMobileBlackBerry',
        'isMobileIOS',
        'isIphone',
        'isIpad',
        'isIpod',
        'getScreenPrint',
        'getColorDepth',
        'getCurrentResolution',
        'getAvailableResolution',
        'getDeviceXDPI',
        'getDeviceYDPI',
        // 'getPlugins',
        'isJava',
        'getJavaVersion',
        'isFlash',
        'getFlashVersion',
        'isSilverlight',
        'getSilverlightVersion',
        'getMimeTypes',
        'isMimeTypes',
        'isFont',
        // 'getFonts',
        'isLocalStorage',
        'isSessionStorage',
        'isCookie',
        'getTimeZone',
        'getLanguage',
        'getSystemLanguage'
    ];

    const data = {};

    methods.forEach(method => {
        try {
            if (typeof client[method] === 'function') {
                data[method] = client[method]();
            }
        } catch (e) {
            console.error(`Error calling ${method}:`, e);
        }
    });

    return data;
};
