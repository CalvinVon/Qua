import { version } from '../../package.json';
import compare from 'compare-version';

export default class StorageManager {
    static StorageEngine = {
        default: localStorage,
        session: sessionStorage
    }

    _cache;
    constructor(key, storageEngine) {
        this.key = `__${key}__`;
        this.storageEngine = storageEngine || StorageManager.StorageEngine.default;
    }

    checkVersionAndReplace(replacement) {
        const checkKey = this.key + 'check';
        const lastVersion = this.storageEngine.getItem(checkKey);
        if (lastVersion) {
            if (compare(version, lastVersion)) {
                this.set(replacement);
            }
        }
        else {
            this.set(replacement);
        }

        this.storageEngine.setItem(checkKey, version);
    }

    set(value) {
        this.storageEngine.setItem(
            this.key,
            JSON.stringify(value)
        );

        this._cache = value;
    }

    get(force) {
        if (force) {
            return getRealValue.call(this);
        }
        
        if (this._cache) {
            return this._cache;
        }

        return getRealValue.call(this);

        function getRealValue() {
            const raw = this.storageEngine.getItem(this.key);
            return this._cache = JSON.parse(raw);
        }
    }

    clear() {
        this.storageEngine.set(null);
    }
}