// https://github.com/view-design/ViewUI/blob/master/src/utils/csv.js

export class CheckPlatform {
  public has(browser: string) {
    const ua = navigator.userAgent;
    if (browser === 'ie') {
      const isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1;
      if (isIE) {
        const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
        reIE.test(ua);
        return parseFloat(RegExp['$1']);
      } else {
        return false;
      }
    } else {
      return ua.indexOf(browser) > -1;
    }
  }

  public isIE11() {
    let iev = 0;
    const ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
    const trident = !!navigator.userAgent.match(/Trident\/7.0/);
    const rv = navigator.userAgent.indexOf('rv:11.0');

    if (ieold) {
      iev = Number(RegExp.$1);
    }
    if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
      iev = 10;
    }
    if (trident && rv !== -1) {
      iev = 11;
    }

    return iev === 11;
  }

  public isEdge() {
    return /Edge/.test(navigator.userAgent);
  }
} 