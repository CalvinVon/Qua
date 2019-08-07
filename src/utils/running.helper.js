import ReactDOM from 'react-dom';
import RouteHelper from './route.helper';

let widgetList = [];
let subscriptionId = 0;
let subscriptions = [];
const RUNNING_SIGN = '__RUNNING__';

const RunningHelper = {
    add(context) {
        // NOTE: 该组件必须有 路由参数传入，现已由 RouteHelper 返回 withRouter 的 HOC 组件
        const route = RouteHelper.getRouteMetaByPath(context.props.location.pathname);
        const widget = new Widget(route, context).notifyRun();
        widgetList.filter(it => it.id !== widget.id);
        widgetList.push(widget);

        notifyListeners(widget, widgetList);
    },
    stop(widgetOrId) {
        let widget;
        if (widgetOrId instanceof Widget) {
            widget = widgetOrId.stop();
        }
        else {
            widget = RunningHelper.getWidget(widgetOrId);
            if (widget) widget.stop();
        }

        widgetList = widgetList.filter(it => it !== widget);
    },
    getWidget(id) {
        return widgetList.find(widget => widget.id === id);
    },

    isRunning(widgetOrId) {
        if (widgetOrId instanceof Widget) {
            return Boolean(widgetOrId[RUNNING_SIGN]);
        }
        return Boolean((RunningHelper.getWidget(widgetOrId) || {})[RUNNING_SIGN]);
    },

    subscribe(listener) {
        const subscription = {
            id: ++subscriptionId,
            listener,
            unsubscribe() {
                subscriptions = subscriptions.filter(sub => sub.id !== this.id);
            }
        }
        subscriptions.push(subscription);
        return subscription;
    },
};

function notifyListeners(...args) {
    subscriptions.forEach(sub => sub(...args));
}

class Widget {
    constructor(route, component) {
        this.id = route.path;
        this.route = route;
        this.component = component;
        this.dom = ReactDOM.findDOMNode(component);
    }

    // 通知 RunningHelper 开始运行（组件已经 mounted）
    notifyRun() {
        this.route[RUNNING_SIGN] = true;
        return this;
    }

    stop() {
        if (this.dom) {
            ReactDOM.unmountComponentAtNode(this.dom);
        }
        return this;
    }
}

export default RunningHelper;