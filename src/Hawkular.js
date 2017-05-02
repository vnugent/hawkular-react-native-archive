import base64 from 'base-64';
import _ from 'lodash';


export default class Hawkular {
    constructor(url, basic_auth) {
        this.url = url;
        this.basic_auth = basic_auth;
        this.metrics_path ='/hawkular/metrics';
    }

    _basicAuthHeader = () => ('Basic ' + base64.encode(`${this.basic_auth.username}:${this.basic_auth.password}`))



    /**
     * Low level http request method
     */
    request = (path, options) => {
        const request_options = {
            method: 'GET', 
            tenant: 'hawkular',
            data: undefined,
            okHandler: (data) => {console.log(data)}, 
            errorHandler: (e) => {console.log(e)}
        }
        _.merge(request_options, options);
        
        console.log(request_options);

        const outgoingOpts = {
            method: request_options.method,
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json', 
                'Authorization': this._basicAuthHeader(),
                'Hawkular-Tenant': request_options.tenant,
            },
        };

        if (request_options.method === 'POST' && request_options.data) {
            outgoingOpts.body = JSON.stringify(options.data);
        }

        console.log(outgoingOpts);

        const url = path === undefined ? this.url : this.url + path;

        fetch(url, outgoingOpts)
            .then((response) => {
                if (response.status === 200) {
                    return response.headers.get("content-length") > 0 ? response.json() : {};
                } else {
                    request_options.errorHandler(response);
                }
            })
            .then((json) => {
                request_options.okHandler(json);
            })
            .catch((error) => {
                request_options.errorHandler(error);
            });
    }


    getStatus = (fnCallback) => {
        this.request('/hawkular/status', {okHandler: fnCallback});
    }


    _prepareParams = (value, okHandler, errorHandler) => {
        return {
            method: 'POST',
            okHandler: okHandler,
            errorHandler: errorHandler,
            data: [{
                timestamp: + new Date(),
                value: value
            }]
        }        
    }


    sendCounter = (name, value, okHandler, errorHandler) => {
        const options = this._prepareParams(value, okHandler, errorHandler);
        const path = `${this.metrics_path}/counters/${name}/raw`;
        this.request(path, options);
    }


    pushGauge = (name, value, okHandler, errorHandler) => {
        const options = this._prepareParams(value, okHandler, errorHandler);
        const path = `${this.metrics_path}/gauges/${name}/raw`;
        this.request(path, options);
    }
}