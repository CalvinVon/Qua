const request = window.require('util').promisify(window.require('request'));
const cheerio = window.require('cheerio');

const CommonHeaders = {
    'Cache-Control': 'no-cache',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'DNT': '1',
    'Pragma': 'no-cache',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'
}

// 爬取百度热点
async function getBaiduNews() {
    const DOMAIN = 'https://www.baidu.com';
    CommonHeaders['Host'] = 'www.baidu.com';

    const { body } = await request({
        uri: DOMAIN + '/s',
        method: 'GET',
        headers: CommonHeaders,
        qs: {
            'wd': 'vue-mount'
        }
    });

    const $ = cheerio.load(body);
    const newsTableNode = $('#content_right').find('table.c-table.opr-toplist1-table').get(0);
    const news = $(newsTableNode).find('tr').map((rowIndex, row) => {
        const a = $($(row).find('td').get(0)).find('a');
        const name = a.text();
        const link = DOMAIN + a.attr('href');
        const count = $(row).find('.opr-toplist1-right').text();
        return {
            name,
            link,
            count,
            index: rowIndex + 1,
            isNew: !!$($(row).find('td').get(0)).has('.opr-toplist1-new').length,
            isRising: !!$($(row).find('td').get(1)).has('.c-icon-up').length,
            isDeclining: !!$($(row).find('td').get(1)).has('.c-icon-down').length
        }
    });

    return news.toArray();
}

// 爬取微博热点
async function getWeiboNews() {
    const DOMAIN = 'https://s.weibo.com';
    CommonHeaders['Host'] = 's.weibo.com';

    const { body } = await request({
        uri: DOMAIN + '/top/summary',
        method: 'GET',
        headers: CommonHeaders,
        qs: {
            cate: 'realtimehot'
        },
    });

    const $ = cheerio.load(body);
    const newsTableNode = $('#pl_top_realtimehot').find('tbody').get(0);
    const news = $(newsTableNode).find('tr').map((rowIndex, row) => {
        const a = $($(row).find('.td-02 a').get(0));
        const name = a.text();
        const link = DOMAIN + a.attr('href');

        const count = $($(row).find('.td-02 span').get(0)).text();
        const extraImage = $(row).find('.td-02 img').get(0);
        return {
            name,
            link,
            count,
            index: rowIndex,
            isNew: !!$($(row).find('.td-03').get(0)).has('.icon-txt-new').length,

            // 微博特殊字段
            // 是否置顶
            isRoof: !!$($(row).find('.td-01').get(0)).has('.icon-top').length,
            isHot: !!$($(row).find('.td-03').get(0)).has('.icon-txt-hot').length,
            isBoil: !!$($(row).find('.td-03').get(0)).has('.icon-txt-boil').length,
            extraImage: extraImage ? 'https:' + $(extraImage).attr('src') : null
        }
    });

    return news.toArray();
}

// 爬取 Hao123热点
// 该网站返回多个类型的热点
async function getHao123News() {
    const DOMAIN = 'https://tuijian.hao123.com';
    CommonHeaders['Host'] = 'tuijian.hao123.com';

    const { body } = await request({
        uri: DOMAIN + '/hotrank',
        method: 'GET',
        headers: CommonHeaders,
    });

    const $ = cheerio.load(body);
    const newsTableNode = $('#tops').find('.top-wrap');
    function getTopNews(index, element) {
        const cate = $(element).find('.title').text();
        return {
            cate,
            list: $(element).find('.point').map((rowIndex, row) => {
                const a = $($(row).find('.point-title').get(0));
                const name = a.text();
                const link = 'https://www.baidu.com/s?wd=' + name;

                const count = $(row).find('.point-index').text();
                return {
                    name,
                    link,
                    count,
                    index: rowIndex + 1,
                    isRising: !!$(row).has('.point-state-rise').length,
                    isDeclining: !!$(row).has('.point-state-fall').length,
                }
            })
        }
    }

    return newsTableNode.map(getTopNews).toArray();
}

module.exports = {
    getBaiduNews,
    getWeiboNews,
    getHao123News,
};