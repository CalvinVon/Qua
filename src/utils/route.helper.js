import { withRouter } from 'react-router-dom';
import orignalRouteMetas from '../consts/route-metas.const';
import utils from '../utils/common.utils';
import StorageManager from './storage.manager';

const storage = new StorageManager('route', StorageManager.StorageEngine.default);
storage.checkVersionAndReplace(orignalRouteMetas);

function reorder(items) {
    return utils.deduplication(items.sort((prev, next) => {
        if (prev.inDev) return 1;
        if (next.inDev) return -1;
        return 0;
    }), 'path');
}

export default {
    getRouteMetas(refresh) {
        const value = storage.get(refresh);
        this.setRouteMetas(value);
        return value;
    },

    getRouteMetaByPath(path) {
        const [route] = orignalRouteMetas.filter(it => it.path === path);
        return route;
    },

    setRouteMetas(routeMetas) {
        const value = reorder(routeMetas);
        storage.set(value);
    },
    

    // 返回 route path 映射的 component 类
    getRouteComponent(path) {
        const component = (this.getRouteMetaByPath(path) || {}).component;
        return withRouter(component);
    }
}