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
        /* 这是我们的第一个测试 - 它用来保证 allFeeds 变量被定义了而且
         * 不是空的。在你开始做这个项目剩下的工作之前最好实验一下这个测试
         * 比如你把 app.js 里面的 allFeeds 变量变成一个空的数组然后刷新
         * 页面看看会发生什么。
        */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有链接字段而且链接不是空的。
         */
        it('every url is not null', function() {
            for(const feed of allFeeds) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            }
        });



        /* TODO:
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有名字字段而且不是空的。
         */
        it('every name is not null', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe(0);
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
        it('default hidden', function() {
            // 获取body当前的class
            isHidden = $('body').hasClass('menu-hidden');
            expect(isHidden).toBe(true);
        });

         /* TODO:
          * 写一个测试用例保证当菜单图标被点击的时候菜单会切换可见状态。这个
          * 测试应该包含两个 expectation ： 党点击图标的时候菜单是否显示，
          * 再次点击的时候是否隐藏。
          */
        it('menu toggle', function() {
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

/*        describe('click on menu', function() {
            // 每次测试前执行相同的click menu及获取当前body的className，利用beaforEach
            // var isHidden;
            beforeEach(function() {
                $('.menu-icon-link').click();
                isHidden = $('body').hasClass('menu-hidden');
            });

            it('click to show', function() {
                // $('.menu-icon-link').click();
                // 获取body当前的class
                // var isHidden = $('body').hasClass('menu-hidden');
                expect(isHidden).toBe(false);
            });

            it('click again to hide', function() {
                // $('.menu-icon-link').click();
                // 获取body当前的class
                // var isHidden = $('body').hasClass('menu-hidden');
                expect(isHidden).toBe(true);
            });
        });*/
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

        it('feed has entry', function(done) {
            // 检测 .feed 容器元素内的html元素是否为空
            expect($('.feed').html().length).not.toBe(0);
            // 遍历 .feed 容器元素的所有后代，是否最少有一个 .entry 元素，期望为true;
            expect($('.feed').find('*').is('.entry')).toBe(true);
            done();
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
        var i = 1;

        beforeEach(function(done) {
            // 提升jasmine的超时时间，防止：Timeout - Async callback was not invoked within timeout specified by jasmine
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
            // 加载新的源
            loadFeed(i, done);
        });

        it(('Content changed 1'), function(done) {
            // 加载新源完成后，获取当前加载内容
            var currentContent = $('.entry h2').text();
            // 测试当前内容与加载前内容是否相同，期望为：不同。
            expect(currentContent).not.toEqual(tmpContent);
            // 将之前加载内容替换为当前加载内容
            tmpContent = currentContent;
            // 增加i为下一次测试id
            i++;
            done();
        });

        it(('Content changed 2'), function(done) {
            var currentContent = $('.entry h2').text();
            expect(currentContent).not.toEqual(tmpContent);
            tmpContent = currentContent;
            i++;
            done();
        });

        it(('Content changed 3'), function(done) {
            var currentContent = $('.entry h2').text();
            expect(currentContent).not.toEqual(tmpContent);
            tmpContent = currentContent;
            i++;
            done();
        });
        // allFeeds的4个源内容比较完毕
    });
}());



