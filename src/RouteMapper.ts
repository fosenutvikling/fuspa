import * as hasher from 'hasher';
import * as UrlPattern from 'url-pattern';

export class RouteMapper {
    private static _instance: RouteMapper;

    private _runOnNextChange: Function;
    private _runOnChange: Function;

    private routes: { pattern: UrlPattern; fn: Function }[];
    private _initialized: boolean;

    public static get instance(): RouteMapper {
        if (this._instance == null) this._instance = new RouteMapper();
        return this._instance;
    }

    private constructor() {
        this._runOnChange = null;
        this._runOnNextChange = null;
        this.routes = [];
        this._initialized = false;
    }

    public listen() {
        if (this._initialized == false) {
            this._initialized = true;
            this.setupListeners();
        } else throw Error('RouteMapper already initialized');
    }

    private setupListeners() {
        //add hash change listener
        hasher.changed.add((newHash, oldHash) => this.onHashChange(newHash, oldHash));

        //add initialized listener (to grab initial value in case it is already set)
        hasher.initialized.add((newHash, oldHash) => this.onHashChange(newHash, oldHash));
        hasher.init(); //initialize hasher (start listening for history changes)
    }

    private onHashChange(newHash: string, oldHash: string) {
        if (this._runOnNextChange !== null) {
            this._runOnNextChange();
            this._runOnNextChange = null;
        }

        if (this._runOnChange !== null) this._runOnChange();

        /**
         * Append foreward slash, as it is not added by hasher, and UrlParser doesn't support an empty string
         * Making it possible to match a "default page" => /
         */
        this.parse('/' + newHash);
    }

    private parse(check: string) {
        for (let i = 0; i < this.routes.length; ++i) {
            let matched = this.routes[i].pattern.match(check);
            if (matched != null) {
                let parameters = this.createCallbackParameterArray(matched);
                this.routes[i].fn.apply(this, parameters);
                return matched;
            }
        }
        return false;
    }

    private createCallbackParameterArray(parsedData: any[] | Object | any) {
        let parameterArray = [];

        if (parsedData instanceof Array) {
            parameterArray = parsedData;
        } else if (parsedData instanceof Object) {
            // Important to clean the local data before appending new, as the last request has its data stored here already
            Object.keys(parsedData).forEach(key => {
                if (key !== '')
                    // Don't want to append an empty key to the data array
                    parameterArray.push(parsedData[key]);
            });
        } else throw new Error('Unknown type of parsedData data, expected Array || Object, got ' + typeof parsedData); // If parsedData variable is neither of an Array or Object, it's not recognized, and don't know how to handle it

        return parameterArray;
    }

    public set runOnNextChange(fn: Function) {
        this._runOnNextChange = fn;
    }

    public set runOnChange(fn: Function) {
        this._runOnChange = fn;
    }

    /**
     * Add a route which should be matched on a hashChange event
     * @param pattern 
     * @param fn 
     */
    public addRoute(pattern: string, fn: Function) {
        this.routes.push({
            pattern: new UrlPattern(pattern),
            fn: fn
        });
    }

    /**
     * Changes the current hash and prevent any parsing and redirecting of hash
     * @param  {string} hash to silently change
     */
    public setHashSilently(hash: string): void {
        // Disable changed signal.set hash without dispatching changed signal
        hasher.changed.active = false;
        hasher.setHash(hash);
        // Re-enable signal
        hasher.changed.active = true;
    }
}
