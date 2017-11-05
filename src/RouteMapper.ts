import * as hasher from 'hasher';
import * as UrlPattern from 'url-pattern';

export class RouteMapper {

    private static _instance: RouteMapper;

    private _runOnNextChange: Function;
    private _runOnChange: Function;

    private routes: { pattern: UrlPattern, fn: Function }[];

    public static get instance(): RouteMapper {
        if (this._instance == null)
            this._instance = new RouteMapper();
        return this._instance;
    }

    private constructor() {
        this._runOnChange = null;
        this._runOnNextChange = null;
        this.routes = [];
    }

    private initialize() {
        //add hash change listener
        hasher.changed.add(this.onHashChange);

        //add initialized listener (to grab initial value in case it is already set)
        hasher.initialized.add(this.onHashChange);
        hasher.init(); //initialize hasher (start listening for history changes)
    }

    private onHashChange(newHash: string, oldHash: string) {
        if (this._runOnNextChange !== null) {
            this._runOnNextChange();
            this._runOnNextChange = null;
        }

        if (this._runOnChange !== null)
            this._runOnChange();

        this.parse(newHash);
    }

    private parse(check: string) {
        for (let i = 0; i < this.routes.length; ++i) {
            let matched = this.routes[i].pattern.match(check);
            if (matched == null) {
                this.routes[i].fn.apply(this, )
                return matched;
            }
        }
        return false;
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