window.onload = function () {
    console.log("bullet-proxy.js loading");
    var MainBullet = /** @class */ (function () {
        function MainBullet(el, opts) {
            console.log('constructor -> 进入主线程');
            this.root = document.querySelector("" + el);
            this._options = opts;
            this._isActive = true;
            this._data = [];
            this._channel = new Channel(this.root);
            this._bulletQueue = [];
            this._options = Object.assign({}, {
                type: 'json',
                dataMap: function (res) {
                    if (res.length > 0) {
                        return res.map(function (item) {
                            return {
                                id: item.id,
                                text: item.text,
                                duration: item.duration * 1,
                                color: item.text_color.replace('0x', '#'),
                                scale: item.text_scale * 1,
                                start: item.offset_time * 1,
                                avatarUrl: item.avatarUrl
                            };
                        });
                    }
                    else {
                        return [];
                    }
                }
            }, opts);
            this.init();
        }
        MainBullet.prototype.init = function () {
            console.log("init -> \u542F\u52A8\u5F39\u5E55\u6E32\u67D3\u8FDB\u7A0B");
            if (this._isActive) {
                this.createBulletContainer(true);
            }
            else {
                this.createBulletContainer(false);
            }
            var data = this._options.dataMap.call(null, this._options.data);
            this._data = data;
            var el = document.createElement('div');
            el.style.padding = "0px";
            el.style.position = 'absolute';
            el.style.left = '-99999px';
            el.className = "xx-xxx-xxxx-xxx";
            document.body.appendChild(el);
            var size;
            this._data.forEach(function (item, index) {
                el.textContent = item.text;
                el.style.fontSize = 20 * item.scale + "px";
                size = el.getBoundingClientRect();
                item.width = size.width;
                item.height = size.height;
                item._index = ++index;
            });
            document.body.removeChild(document.querySelector('.xx-xxx-xxxx-xxx'));
            this.readData();
            // console.log(this._data)
        };
        // TODO: 自动创建元素
        MainBullet.prototype.createBulletContainer = function (isActive) {
            var bullet = C.createDom('dm-bullet-control', "<span class=" + (isActive ? 'start' : 'paused') + ">" + (isActive ? '开始' : '暂停') + "</span>", {}, 'dm-bullet-container');
            this.root.appendChild(bullet);
        };
        MainBullet.prototype.readData = function () {
            // 过滤下没有id的
            var bulletDataList = this._data.filter(function (item) { return item.id; });
            var bullet;
            var container = this.root.querySelector('.bullet-wrapper');
            bulletDataList.forEach(function (item) {
                bullet = new Bullet(container, item);
            });
        };
        return MainBullet;
    }());
    /**
     *  [ channel 弹幕的跑道]
     * @type { Class }
     */
    var Channel = /** @class */ (function () {
        function Channel(root) {
            console.log("constructor -> \u6B63\u5728\u521D\u59CB\u5316\u8DD1\u9053");
            this._root = root;
            this.reset();
        }
        Channel.prototype.reset = function () {
            console.log("\u6B63\u5728\u521D\u59CB\u5316\u8DD1\u9053");
        };
        return Channel;
    }());
    /**
     * [ Bullet 弹幕构造类 ]
     * @type Bullet
     */
    var Bullet = /** @class */ (function () {
        function Bullet(container, bulletOptions) {
            this._index = bulletOptions._index;
            this.duration = bulletOptions.duration;
            this.id = bulletOptions.id;
            this.width = bulletOptions.width;
            this.height = bulletOptions.height;
            this.start = bulletOptions.start;
            this.text = bulletOptions.text;
            this.container = container;
            var $el = document.createElement('div');
            $el.style.cssText = "color: " + this.color + ";";
            $el.textContent = "" + this.text;
            this.containerBoundingPos = this.container.getBoundingClientRect();
            this.left = this.containerBoundingPos.left;
            this._el = $el;
            this.end = -this.width;
            this.step = (this.containerBoundingPos.width + this.width) / this.duration / 60;
            // console.log(`constructor -> 正在初始化第${ this._index }条弹幕实例`);
        }
        return Bullet;
    }());
    window.createBullet = function (el, opts) {
        return new MainBullet(el, opts);
    };
    var damData = [
        {
            text: '我是一条弹幕',
            id: '3888',
            type: 2,
            text_color: 'black',
            duration: 1000,
            text_scale: 1,
            offset_time: 1000,
            avatarUrl: 'http://active.qiutianaimeili.com/one_year_head_3.jpg'
        },
        {
            text: '我是一条弹幕------111111',
            id: '3888',
            type: 2,
            text_color: 'black',
            duration: 1000,
            text_scale: 1,
            offset_time: 1000,
            avatarUrl: 'http://active.qiutianaimeili.com/one_year_head_3.jpg'
        }
    ];
    window.createBullet('#bullet-1', { data: damData });
};
