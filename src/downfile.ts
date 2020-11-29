import { EventEmitter } from 'events';
import { CheckPlatform } from './check';
import Clipboard from './copy';

export interface Opts<T> {
  /** 失败回调 */
  onError?(): void;
  /** 成功回调 */
  onSuccess?(): void;
  /** 转换数据 */
  transform?(): T;
  /** 下载前事件: false 阻止下载, true | undefined 继续下载 */
  downBefore?(): boolean | undefined;
  /** 下载名称 */
  filename?: string;
  type?: DownType;
}

const check = new CheckPlatform();

export declare const DownTypes: ['json', 'csv', 'xlsx'];
export type DownType = typeof DownTypes[number];

class DownFile<T = any> extends EventEmitter {
  cfg: Opts<T>;
  #filename: string = 'download';
  /** 原始数据 */
  data: T;
  #downData: string;
  #mimeType: string;

  constructor(data: T, cfg: Opts<T> = {}) {
    super();
    this.cfg = cfg;
    this.data = data;
    // updateData 之后更新数据 copy
    this.#downData = '';
    this.#filename = this.filename;
    this.#mimeType = '';
  }

  private success() {
    this.on('success', () => {
      if (typeof this.cfg.onSuccess === 'function') {
        this.cfg.onSuccess();
      }
    });
  }

  private ieDown() {
    const oWin = window.top.open('about:blank', '_blank') as Window;
    // @ts-ignore
    oWin.document.charset = 'utf-8';
    if (typeof this.cfg.downBefore === 'function') {
      const beforeBol = this.cfg.downBefore();
      if (beforeBol === false) {
        return;
      }
    }
    oWin.document.write(this.#downData);
    oWin.document.close();
    oWin.document.execCommand('SaveAs', this.#filename as any);
    oWin.close();
    this.success();
  }

  private edgeDown() {
    const BOM = '\uFEFF';
    const text = new Blob([BOM + this.#downData], { type: 'text/csv' });
    if (typeof this.cfg.downBefore === 'function') {
      const beforeBol = this.cfg.downBefore();
      if (beforeBol === false) {
        return;
      }
    }
    navigator.msSaveBlob(text, this.#filename);
  }

  private normal(type: DownType) {
    const aDom = document.createElement('a');
    aDom.style.display = 'none';
    if (!this.canSave(aDom)) {
      aDom.setAttribute('target', '_blank');
    } else {
      aDom.setAttribute('download', this.filename);
    }

    aDom.href = this.getDownloadUrl('', type);
    document.body.appendChild(aDom);
    if (typeof this.cfg.downBefore === 'function') {
      const beforeBol = this.cfg.downBefore();
      if (beforeBol === false) {
        return;
      }
    }

    aDom.click();
    document.body.removeChild(aDom);
    this.success();
  }

  /** download file default type = csv */
  public downLoad(type: DownType = 'csv'): DownFile {
    if (check.has('ie') && check.has('ie') < 10) {
      this.ieDown();
    }

    if (check.has('ie') === 10 || check.isIE11() || check.isEdge) {
      this.edgeDown();
    }

    if (!check.isIE11() && !check.isEdge()) {
      this.normal(type);
    }

    return this;
  }

  /** copy data */
  public copy(type: DownType = 'csv') {
    let clipboard: Clipboard | null = null;
    if (!clipboard) {
      clipboard = new Clipboard();
    }
    console.log(clipboard, this.#downData);
    return this;
  }

  public get filename(): string {
    return this.cfg.filename || this.#filename;
  }

  public setFilename(filename: string): DownFile {
    this.#filename = filename;
    return this;
  }

  public updateData(newData: T): DownFile {
    this.data = newData;
    return this;
  }

  public updateCfg(cfg: Opts<T> = {}) {
    this.cfg = Object.assign(this.cfg, cfg);
    return this;
  }

  public transform(cb: (data: T) => T) {
    this.updateData(cb(this.data));
  }

  /** 适配 mimetype */
  private adaptMimeType(type: DownType): string {
    return '';
  }

  public getDownloadUrl(text: string, type: DownType): string {
    const BOM = '\uFEFF';
    // Add BOM to text for open in excel correctly
    if (window.Blob && window.URL && window.URL.createObjectURL) {
      const csvData = new Blob([BOM + text], { type: 'text/csv' });
      return URL.createObjectURL(csvData);
    } else {
      return 'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text);
    }
  }

  private canSave(dom?: HTMLAnchorElement) {
    const aDom = dom instanceof HTMLAnchorElement ? dom : document.createElement('a');
    return aDom.download !== undefined;
  }
}

export default DownFile;