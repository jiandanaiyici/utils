// https://www.npmjs.com/package/react-csv-downloader

export interface AppendOpts {
  separator: string;
  quoted?: boolean;
}

const newLine = '\r\n';
const defaults = {
  separator: ',',
  quoted: false
};

const appendLine = (content: any, row: any[], { separator, quoted }: AppendOpts) => {
  const line = row.map(data => {
    if (!quoted) return data;
    // quote data
    data = typeof data === 'string' ? data.replace(/"/g, '"') : data;
    return `"${data}"`;
  });
  content.push(line.join(separator));
};


class CSV {
  #content: string[];
  constructor() {
    this.#content = [];
    this.column = [];
  }

  
}