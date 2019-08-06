import orignalRouteMetas from '../consts/route-metas.const';
const STORAGE_ROUTE = '__route__';
const Engine = localStorage;
let cache;

function reorder(items) {
    return items.sort((prev, next) => {
        if (prev.inDev) return 1;
        if (next.inDev) return -1;
        return 0;
    });
}

export default {
    getRouteMetas(refresh) {
        if (cache) return cache;

        // 强制重新从 consts 获取
        if (!refresh) {
            const fromStorage = JSON.parse(Engine.getItem(STORAGE_ROUTE) || null);
            if (fromStorage) {
                return cache = reorder(fromStorage);
            }
        }

        this.setRouteMetas(orignalRouteMetas);
        return cache;
    },

    setRouteMetas(routeMetas) {
        cache = reorder(routeMetas);
        Engine.setItem(STORAGE_ROUTE, JSON.stringify(cache));
    },
    
    getRouteComponent(path) {
        const [route = {}] = orignalRouteMetas.filter(it => it.path === path);
        return route.component;
    }
}