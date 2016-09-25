import * as http from 'http';
import * as https from 'https';

export type Protocol = 'http' | 'https';

export interface iOptions {
    protocol: Protocol, // Whether to use https or regular http
    encoding: string, // Character encoding for received result
    port?: number, // Port of remote server
    error: Function // function to run on error with request
}

export class HttpClient {
    private url: string; //Domain name or IP address to send http request to
    private headers: Object; //headers to append to query
    private options: iOptions; //data type to be sent with query

    private error: Function;//function to run on error with request

    private keepAliveAgent;

    constructor(url: string, options: iOptions = { protocol: 'http', encoding: 'utf8', error: null }) {

        if (options.protocol === undefined)
            options.protocol = 'http';
        if (options.encoding === 'utf8')
            options.encoding = 'utf8';

        this.url = url;
        this.headers = {};
        this.options = options;
        this.error = options.error;

        this.keepAliveAgent = new http.Agent({ keepAlive: true }); // Use same instance for doing requests
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
            protocol: this.options.protocol + ':', // Module requires the protocol to be specified with an ending colon, to prevent appending the local ip-address of the current running client to the request
            agent: this.keepAliveAgent
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
        let data: string = '';
        let self = this;
        let type: string;

        if (response.headers !== undefined && response.headers['content-type'] !== undefined) {
            type = response.headers['content-type'];
        }

        // Combine all retrieved data
        response.on('data', function (chunkData) {
            data += chunkData;
        });

        // Request have ended, and data needs to be parsed based on specified type
        response.on('end', function () {
            if (response.statusCode >= 400 && response.statusCode < 600)
                return self.error(data);

            switch (type) {
                case 'application/json':
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        self.error(e);
                    }
                    break;

                case 'application/xml':
                case 'text/xml':
                    break;

                case 'text/html':
                    break;

                case "script":
                    break;

                default:
                    self.error({
                        code: 101,
                        message: 'Unsupported content-type for http response received: ' + type
                    });
                    break;
            }
            next(data);
        });
    }
}