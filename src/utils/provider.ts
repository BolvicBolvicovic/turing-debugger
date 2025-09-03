import http from 'http';

interface Provider {
  /**
   * Wrapper for HTTP GET requests.
   * @param url The URL to send the GET request to.
   * @param headers Optional headers to include in the request.
   * @returns A promise that resolves to the response data as a string.
   */
  get(url: string, headers?: http.OutgoingHttpHeaders): Promise<string>;
}

function resolveData(res: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      resolve(data);
    });
    res.on('error', reject);
  });
}

function get(url: string, headers?: http.OutgoingHttpHeaders): Promise<string> {
  return new Promise((resolve, reject) => {
    http
      .get(url, { headers }, async res => {
        try {
          const data = await resolveData(res);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}

export const provider: Provider = {
  get,
};
