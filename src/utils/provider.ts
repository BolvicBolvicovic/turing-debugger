import http from 'http';

interface Provider {
  /**
   * Wrapper for HTTP GET requests.
   * @param url The URL to send the GET request to.
   * @param headers Optional headers to include in the request.
   * @returns A promise that resolves to the response data as a string.
   */
  get(url: string, headers?: http.OutgoingHttpHeaders): Promise<string>;

  /**
   * Wrapper for HTTP POST requests.
   * @param url The URL to send the POST request to.
   * @param body The body of the POST request as a string.
   * @param headers Optional headers to include in the request.
   * @returns A promise that resolves to the response data as a string.
   */
  post(url: string, body: string, headers?: http.OutgoingHttpHeaders): Promise<string>;

  /**
   * Wrapper for HTTP DELETE requests.
   * @param url The URL to send the DELETE request to.
   * @param body Optional body of the DELETE request as a string.
   * @param headers Optional headers to include in the request.
   * @returns A promise that resolves to the response data as a string.
   */
  del(url: string, body?: string, headers?: http.OutgoingHttpHeaders): Promise<string>;
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

function post(url: string, body: string, headers?: http.OutgoingHttpHeaders): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const req = http.request(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            ...headers,
          },
        },
        async res => {
          try {
            const data = await resolveData(res);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        }
      );

      req.write(body);
      req.end();
    } catch (error) {
      reject(error);
    }
  });
}

function del(url: string, body?: string, headers?: http.OutgoingHttpHeaders): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      url,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body ? Buffer.byteLength(body) : 0,
          ...headers,
        },
      },
      async res => {
        try {
          const data = await resolveData(res);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }
    );

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

export const provider: Provider = {
  get,
  post,
  del,
};
