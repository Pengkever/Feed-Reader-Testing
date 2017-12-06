/* feedreader.js
 *
 * 这是 Jasmine 会读取的spec文件，它包含所有的要在你应用上面运行的测试。
 */

/* 我们把所有的测试都放在了 $() 函数里面。因为有些测试需要 DOM 元素。
 * 我们得保证在 DOM 准备好之前他们不会被运行。
 */
$(function() {
    /* 这是我们第一个测试用例 - 其中包含了一定数量的测试。这个用例的测试
     * 都是关于 Rss 源的定义的，也就是应用中的 allFeeds 变量。
    */
    describe('RSS Feeds', function() {

        // 创建函数，测试目标已经被声明且不为空
        function isTruthy(target) {
            expect(target).toBeDefined();
            expect(target.length).not.toBe(0);
        }
        /* 这是我们的第一个测试 - 它用来保证 allFeeds 变量被定义了而且
         * 不是空的。在你开始做这个项目剩下的工作之前最好实验一下这个测试
         * 比如你把 app.js 里面的 allFeeds 变量变成一个空的数组然后刷新
         * 页面看看会发生什么。
        */
        it('Defined and nonempty', function() {
            // expect(allFeeds).toBeDefined();
            // expect(allFeeds.length).not.toBe(0);
            isTruthy(allFeeds);
        });


        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有链接字段而且链接不是空的。
         */
        // 规范url的正则表达式，用于测试 feed.url 是否规范
        var regularExpressionUrl = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;

        for(const feed of allFeeds) {
            it((feed.name + 'url is defined and it is real url'), function() {
                // 测试 feed.url 是否已被申明且非空
                isTruthy(feed.url);
                // 测试 url 是否规范
                expect(feed.url).toMatch(regularExpressionUrl);
            });
        }



        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有名字字段而且不是空的。
         */
        allFeeds.forEach(function(feed) {
            it((feed.name + 'url is defined and it is not empty'), function() {
                // 测试 feed.name 是否已被申明且非空
                isTruthy(feed.name);
            });
        });

    });


    /* TODO: 写一个叫做 "The menu" 的测试用例 */
    describe('The menu', function() {
        // 定义isHidden变量，true表示隐藏状态，false表示显示状态。将isHidden 提升，减少内存使用
        var isHidden;

        /* TODO:
         * 写一个测试用例保证菜单元素默认是隐藏的。你需要分析 html 和 css
         * 来搞清楚我们是怎么实现隐藏/展示菜单元素的。
         */
        it('Default hidden', function() {
            // 获取body当前的class
            isHidden = $('body').hasClass('menu-hidden');
            expect(isHidden).toBe(true);
        });

         /* TODO:
          * 写一个测试用例保证当菜单图标被点击的时候菜单会切换可见状态。这个
          * 测试应该包含两个 expectation ： 党点击图标的时候菜单是否显示，
          * 再次点击的时候是否隐藏。
          */
        it('Menu toggle', function() {
            // 点击一次
            $('.menu-icon-link').click();
            // 查看当前body的className是否有menu-hidden；
            isHidden = $('body').hasClass('menu-hidden');
            // 期望为false，表示body没有menu-hidden的className，即为菜单处于显示状态
            expect(isHidden).toBe(false);
            // 再次点击
            $('.menu-icon-link').click();
            // 再次查看当前body的className是否有menu-hidden；
            isHidden = $('body').hasClass('menu-hidden');
            // 期望为true，表示body有menu-hidden的className，即为菜单处于隐藏状态
            expect(isHidden).toBe(true);
        });
    });

    /* TODO: 13. 写一个叫做 "Initial Entries" 的测试用例 */
    describe('Initial Entries', function() {

        /* TODO:
         * 写一个测试保证 loadFeed 函数被调用而且工作正常，即在 .feed 容器元素
         * 里面至少有一个 .entry 的元素。
         *
         * 记住 loadFeed() 函数是异步的所以这个而是应该使用 Jasmine 的 beforeEach
         * 和异步的 done() 函数。
         */
        beforeEach(function(done) {
            loadFeed(0, done);
        });

        it('Feed has entry', function() {
            // 检测 .feed 容器元素内的html元素是否为空
            expect($('.feed').html().length).not.toBe(0);
            // 遍历 .feed 容器元素的所有后代，是否最少有一个 .entry 元素，期望为true;
            expect($('.feed').find('*').is('.entry')).toBe(true);
        });
    });

    /* TODO: 写一个叫做 "New Feed Selection" 的测试用例 */
    describe('New feed Selection', function() {

        /* TODO:
         * 写一个测试保证当用 loadFeed 函数加载一个新源的时候内容会真的改变。
         * 记住，loadFeed() 函数是异步的。
         */

        // 获取当前已加载内容
        var tmpContent = $('.entry h2').text();
        // 第一次initial时已传入id = 0的feed，故而从1开始
        var index = 1;
        // 获取jasmine正常的超时时间
        var originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

        function checkContent() {
            // 加载新源完成后，获取当前加载内容
            var currentContent = $('.entry h2').text();
            // 测试当前内容与加载前内容是否相同，期望为：不同。
            expect(currentContent).not.toEqual(tmpContent);
            // 将之前加载内容替换为当前加载内容
            tmpContent = currentContent;
            // 增加index为下一次载入内容id
            index++;
        }

        beforeEach(function(done) {
            // 提升jasmine的超时时间，防止：Timeout - Async callback was not invoked within timeout specified by jasmine
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
            // 加载新的源
            loadFeed(index, done);
            // jasmine.clock.install();
        });

        afterEach(function() {
            // 每次测试后，将jasmine的超时时间还原
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        // 由于allFeeds已经加载过一次，所以，i从1开始，使得循环执行测试次数减一次
        for(var i = 1; i < allFeeds.length; i++) {
            it(('Content changed ' + i), function() {
                checkContent();
            });
        }
        // allFeeds的所有源内容比较完毕
    });
}());
