import Schedule from '../views/schedule';
import EasyPs from '../modules/easy-ps';

const routeMetas = [
    {
        name: '📅 课程表',
        path: '/main/schedule',
        desc: '记录每天的课程以及一些备忘笔记',
        component: Schedule,
        inDev: true
    },
    {
        name: '🔔 提醒列表',
        path: '/main/reminder',
        desc: '共享提醒我们的重要事项',
        component: Schedule,
        inDev: true
    },
    {
        name: '🔍 集成搜索',
        path: '/main/search',
        desc: '集成教材、教案、PPT等资源多网站搜索',
        component: Schedule,
        inDev: true
    },
    {
        name: '🎴 快速P图',
        path: '/main/easy-ps',
        desc: '快速地对图片进行基本处理，PPT伴侣！',
        component: EasyPs,
        inDev: false
    },
    {
        name: '🚛 文件传输',
        path: '/main/transfer',
        desc: '连上局域网，马上开启文件自由传输',
        component: Schedule,
        inDev: true
    },
    {
        name: '✈️ 机票自动查询',
        path: '/main/query-ticket',
        desc: '自动查询飞机票、火车票等',
        component: Schedule,
        inDev: true
    },
    {
        name: '🙋 答案之书',
        path: '/main/book-of-answer',
        desc: 'The Book of Answers. 什么都是略懂略懂~',
        component: Schedule,
        inDev: true
    },
    {
        name: '🕹️ 做决定',
        path: '/main/decider',
        desc: '让我来帮你这个纠结症一把吧！',
        component: Schedule,
        inDev: false
    },
    {
        name: '🏝️ 定时休息',
        path: '/main/rest-timer',
        desc: '关爱秋呀的工作作息，要时常休息呀',
        component: Schedule,
        inDev: true
    },
    {
        name: '📖 谷歌百度翻译',
        path: '/main/translator',
        desc: '集成百度翻译和谷歌翻译',
        component: Schedule,
        inDev: true
    },
    {
        name: '📰 新闻头条',
        path: '/main/news',
        desc: '集成百度、头条、微博热搜等每日新闻',
        component: Schedule,
        inDev: true
    },
];

export default routeMetas;
