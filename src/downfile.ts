import { CheckPlatform } from './check';

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
}

export declare const DownTypes: ['json', 'csv', 'xlsx'];
export type DownType = typeof DownTypes[number];

class DownFile<T = any>  extends CheckPlatform{
  cfg: Opts<T>;
  #filename: string = 'download';
  /** 原始数据 */
  data: T;
  #downData: T;

  constructor(data: T, cfg: Opts<T> = {}) {
    super();
    this.cfg = cfg;
    this.data = data;
    this.#downData = data;
    this.#filename = this.filename;
  }

  /** download file default type = csv */
  public downLoad(type: DownType = 'csv') {
    const aDom = document.createElement('a');
    aDom.style.display = 'none';
    if (!this.canSave(aDom)) {
      aDom.setAttribute('target', '_blank');
    } else {
      aDom.setAttribute('download', this.filename);
    }

    aDom.href = this.link;
    document.body.appendChild(aDom);
    if (typeof this.cfg.downBefore === 'function') {
      const beforeBol = this.cfg.downBefore();
      if (beforeBol === false) {
        return;
      }
    }

    aDom.click();
    document.body.removeChild(aDom);

    return this;
  }

  /** copy data */
  public copy(type: DownType = 'csv') {
    console.log(this.#downData);
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

  public transform(cb: (data: T) => T) {
    this.updateData(cb(this.data));
  }

  get link() {
    return '';
  }

  private canSave(dom?: HTMLAnchorElement) {
    const aDom = dom instanceof HTMLAnchorElement ? dom : document.createElement('a');
    return aDom.download !== undefined;
  }
}

export default DownFile;