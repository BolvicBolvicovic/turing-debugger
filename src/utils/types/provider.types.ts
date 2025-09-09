import http from 'http';

export interface Provider {
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
