import * as http from 'http';
import * as https from 'https';

export type DataType = 'json' | 'xml' | 'script' | 'html';
export type Protocol = 'http' | 'https';

export interface iOptions {
    protocol: Protocol, // Whether to use https or regular http
    encoding: string, // Character encoding for received result
    port?: number, // Port of remote server
    type?: DataType, // Date type to be received from server (xml, json, script, html). Used to parse received data to its corresponding type
    error: Function // function to run on error with request
}

export class HttpClient {
    private url: string; //Domain name or IP address to send http request to
    private headers: Object; //headers to append to query
    private options: iOptions; //data type to be sent with query

    private error: Function;//function to run on error with request

    constructor(url: string, options: iOptions = { protocol: 'http', encoding: 'utf8', error: null }) {

        if (options.protocol === undefined)
            options.protocol = 'http';
        if (options.encoding === 'utf8')
            options.encoding = 'utf8';

        this.url = url;
        this.headers = {};
        this.options = options;
        this.error = options.error;
    }

    setError(error: Function) {
        this.error = error;
    }

    addHeader(key: string, value: string) {
        this.headers[key] = value;
    }

    setHeader(headers: Object) {
        this.headers = headers;
    }

    getHeaders(): Object {
        return this.headers;
    }

    /**
      * do a GET request to given path of the global URL defined for the class
      * @param  {string}   path the path which to do a get request
      * @param  {object}   data that should be sent with request
      * @param  {Function} next function to run when request is done
      */
    get(path: string, data: Object, next: Function) {
        this.request("GET", path, data, next);
    }

    /**
     * do a POST request to given path of the global URL defined for the class
     * @param  {string}   path the path which to do a get request
     * @param  {object}   data that should be sent with request
     * @param  {Function} next function to run when request is done
     */
    post(path: string, data: Object, next: Function) {
        this.request("POST", path, data, next);
    }

    /**
     * do a PUT request to given path of the global URL defined for the class
     * @param  {string}   path the path which to do a get request
     * @param  {object}   data that should be sent with request
     * @param  {Function} next function to run when request is done
     */
    put(path: string, data: Object, next: Function) {
        this.request("PUT", path, data, next);
    }

    /**
     * do a DELETE request to given path of the global URL defined for the class
     * @param  {string}   path the path which to do a get request
     * @param  {object}   data that should be sent with request
     * @param  {Function} next function to run when request is done
     */
    delete(path: string, data: Object, next: Function) {
        this.request("DELETE", path, data, next);
    }

    request(type: string, path: string, data: Object, next: Function) {
        var request: http.ClientRequest;
        var self = this;

        // Generate options for creating a request against the specified url-endpoint
        var options: http.RequestOptions = {
            hostname: this.url,
            port: this.options.port,
            path: path,
            method: type,
            headers: this.headers,
            protocol: this.options.protocol
        };

        // Device whether http or https should be used
        if (this.options.protocol === 'http')
            request = http.request(options, function (res) { self.responseHandler(res, next) });
        else if (this.options.protocol === 'https')
            request = https.request(options, function (res) { self.responseHandler(res, next) });
        else {
            this.error({
                code: 102,
                message: 'Unsupported protocol: ' + this.options.protocol
            });
            return;
        }

        // Handle any errors 
        request.on('error', function (error) {
            self.error(error);
        });

        if (data !== null || data !== undefined)
            request.write(data);
        request.end();
    }

    private responseHandler(response: http.IncomingMessage, next: Function) {
        response.setEncoding('utf8');

        var data: any;
        var self = this;

        // Combine all retrieved data
        response.on('data', function (chunkData) {
            data += chunkData;
        });

        // Request have ended, and data needs to be parsed based on specified type
        response.on('end', function () {

            switch (self.options.type) {
                case "json":
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        self.error(e);
                    }
                    break;

                case "xml":
                case "script":
                case "html":
                    break;

                default:
                    self.error({
                        code: 101,
                        message: 'Unsupported DataType for http request specified: ' + self.options.type
                    });
                    break;
            }
            next(data);
        });
    }
}