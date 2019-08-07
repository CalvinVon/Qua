import ReactDOM from 'react-dom';
import RouteHelper from './route.helper';

let widgetList = [];
let subscriptionId = 0;
let subscriptions = [];

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
            widget = widgetOrId.notifyStop();
        }
        else {
            widget = RunningHelper.getWidget(widgetOrId);
            if (widget) widget.notifyStop();
        }

        if (widget) {
            widgetList = widgetList.filter(it => it !== widget);
            notifyListeners(widget, widgetList);
        }
    },
    getWidget(id) {
        return widgetList.find(widget => widget.id === id);
    },

    isRunning(widgetOrId) {
        if (widgetOrId instanceof Widget) {
            return Boolean(widgetOrId.running);
        }
        return Boolean((RunningHelper.getWidget(widgetOrId) || {}).running);
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
    subscriptions.forEach(sub => sub.listener(...args));
}

class Widget {
    constructor(route, instance) {
        this.id = route.path;
        this.route = route;
        this.instance = instance;
        this.running = false;
        this.dom = ReactDOM.findDOMNode(instance);
    }

    // 通知 RunningHelper 开始运行（组件已经 mounted）
    notifyRun() {
        this.running = true;
        return this;
    }

    notifyStop() {
        // if (this.dom) {
        //     ReactDOM.unmountComponentAtNode(this.dom);
        // }
        this.running = false;
        return this;
    }
}

console.log(ReactDOM)
export default RunningHelper;