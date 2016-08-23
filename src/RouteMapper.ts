import * as crossroads from 'crossroads';

export class RouteMapper {

    public static runOnNextChange: Function = null;

    static init(): void {

        hasher.changed.add(RouteMapper.hashChange);//add hash change listener
        hasher.initialized.add(RouteMapper.hashChange); //add initialized listener (to grab initial value in case it is already set)

        hasher.init(); //initialize hasher (start listening for history changes)
    }

    /**
     * Changes the current hash without notifying Crossroads, to prevent any parsing and redirecting of hash
     * @param  {string} hash to silently change
     */
    static setHashSilently(hash: string): void {
        hasher.changed.active = false; //disable changed signal.set hash without dispatching changed signal
        RouteMapper.setHash(hash);
        hasher.changed.active = true; //re-enable signal
    }

    static setHash(hash: string) {
        hasher.setHash(hash);
    }

    static isHash(hash: string): boolean {
        return hash === hasher.getHash();
    }


    /**
     * Add a route to which should be searched on a hashChange event
     * @param  {string} path to listen for
     * @param  {Function} func to run if route matches
     */
    static addRoute(path: string, func: Function): void {
        crossroads.addRoute(path, func);
    }

    static hashChange(newHash: string, oldHash: string): void {
        if (RouteMapper.runOnNextChange !== null) {
            RouteMapper.runOnNextChange();
            RouteMapper.runOnNextChange = null;
        }
        crossroads.parse(newHash);
    }

}