import React from 'react';
import RunningHelper from '../../utils/running.helper';
import './index.scss';
import { Modal } from 'antd';
import $ from 'jquery';

const list = "迪奥(Dior)唇釉💄 魅可(MAC)唇釉💄 香奈儿(Chanel)香水🐰 范思哲(VERACE)香水🐰 古驰(GUCCI)香水🐰 雅漾(Avene)喷雾🐰 卡哇伊的多肉植物🌿 美味蛋糕🍰 巧克力礼盒🍫 粉色猫耳耳机🎧 项链📿 耳环👂 耳链👂 耳钉👂 戒指💍 新裙子👗 「包」治百病👝 一场演唱会🎤 一次说走就走的旅行✈️ 10个抱抱💕 10次举高高💕 10个亲亲💏 兰芝(LANEIGE)礼盒🎁 悦诗风吟(Innisfree)礼盒🎁 兰芝(LANEIGE)隔离霜🎁 平板电脑🎮 来一组面膜🐹 一场电影📺 永生花🌹 一捧鲜花💐 一束璨烂的满天星💐 彩妆工具🎁 韩束洗护套装🎁 心理学书籍📚 酷酷的墨镜🕶️ 一场求婚💍 滚床单吧🏩 洛斐熊本熊键盘⌨️ airpods🎧 零食空投😋 回忆童年的娃哈哈😋 车厘子🍒 樱桃🍒 芒果芒果😋 卫龙女孩😋 爱敬(AGE)气垫BB😀 销魂香辣蟹味小浣熊🥕 可爱的荷包👛 轻便的运动鞋👟 AppleWatch⌚ 一台显示器📺 一只喵🐈 一只狗狗🐩 蓝牙音箱📻 气质高跟鞋👡 电动牙刷😁 拉杆登机箱🛅 新床品🛌🏼 可爱手机壳📱 手表⌚ 腮红🦄 欠你的情书💌 合适的抹胸🐤 手机📱 电脑💻 《此生多珍重》📔 西餐🍽️ 美容仪🦄 迷你加湿器🚿 睡衣👚 化妆镜🐭 定制相册📷 大声说爱你👀 懒人沙发💺";

export default class Decider extends React.Component {
    render() {
        return (
            <div className="decider">
                <article id="martix">
                    <p id="title">送可爱的你一件礼物!</p>
                    <p id="unicorn"></p>
                    <input type="button" id="pick" defaultValue="Go Go Go!" />
                    <div id="diy">自定义清单</div>
                    <div className="hide" id="content">
                        <textarea id="book" rows="9" cols="53" defaultValue={list}></textarea>
                        <button id="submit">确定</button>
                    </div>
                </article>
            </div>
        );
    }

    componentDidMount() {
        RunningHelper.add(this);

        function warning(msg) {
            Modal.warning({
                title: msg
            });
        }

        let btn = document.getElementById('pick'),
            book = document.getElementById('book'),
            unicorn = document.getElementById('unicorn'),
            title = document.getElementById('title'),
            diy = document.getElementById('diy'),
            content = document.getElementById('content'),
            submit = document.getElementById('submit'),
            timer = null,
            run = 0,
            index = 0;

        // 随机挑选礼物
        btn.addEventListener('click', function () {
            // 删除多余空格，分割字符串
            let lollipop = book.value.replace(/ +/g, " ").replace(/^ | $/g, "").split(/ |\n/).filter(Boolean)
            if (!run) {
                btn.value = 'Stop'
                title.innerText = ''
                timer = setInterval(function () {
                    // Math.ceil 向上取整
                    // Math.random() 方法可返回介于 0 ~ 1 之间的一个随机数
                    let props = Math.ceil(Math.random() * lollipop.length),
                        propsTop = Math.ceil((Math.random() * (window.document.body.offsetHeight - 48)) + 48),
                        propsLeft = Math.ceil(Math.random() * (window.document.body.offsetWidth - 140)),
                        propsSize = Math.ceil(Math.random() * (24 - 12) + 12),
                        surge = lollipop[props - 1],
                        telegram = document.createElement('div')
                    telegram.setAttribute('class', 'telegram')
                    telegram.innerText = surge
                    unicorn.innerText = surge
                    telegram.style.cssText = `top: ${propsTop}px;left: ${propsLeft}px;color: "rgba(0,0,0,." + Math.random() + ")";font-size: ${propsSize}px`
                    $('.decider').append(telegram)
                    // 动画
                    $('.telegram').fadeIn("slow", function () {
                        $(this).fadeOut("slow", function () {
                            $(this).remove()
                        })
                    })
                    run = 1
                }, 50)
            } else {
                title.innerText = '喵喵喵！就决定是你啦!'
                clearInterval(timer)
                btn.value = 'Try 一 Try'
                run = 0
            }
            index++
            if (index == 7) {
                warning('女人！ 我劝你善良！')
                index = 0
            }
        })
        // 自定义菜单
        diy.addEventListener('click', function () {
            content.classList.remove('hide')
        })
        // 提交新菜单
        submit.addEventListener('click', function () {
            content.classList.add('hide')
        })
    }
}