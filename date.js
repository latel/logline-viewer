/**
 * 一些和时期相关的处理方法
 * @class date
 * @module base
 * @author taylenxu & zawaliang
*/
(function() {

    $.Date = {
        /**
         * 格式化日期文本为日期对象
         *
         * @method str2Date
         * @param {String} date 文本日期
         * @param {String} [p:%Y-%M-%d %h:%m:%s] 文本日期的格式
         * @return {Date}
         */
        str2Date: function(date, p) {
            p = p || '%Y-%M-%d %h:%m:%s';
            p = p.replace(/\-/g, '\\-');
            p = p.replace(/\|/g, '\\|');
            p = p.replace(/\./g, '\\.');
            p = p.replace(/\+/g, '\\+');
            p = p.replace('%Y', '(\\d{4})');
            p = p.replace('%M', '(\\d{1,2})');
            p = p.replace('%d', '(\\d{1,2})');
            p = p.replace('%h', '(\\d{1,2})');
            p = p.replace('%m', '(\\d{1,2})');
            p = p.replace('%s', '(\\d{1,2})');

            var regExp = new RegExp('^' + p + '$'),
                group = regExp.exec(date),
                Y = (group[1] || 0) - 0,
                M = (group[2] || 1) - 1,
                d = (group[3] || 0) - 0,
                h = (group[4] || 0) - 0,
                m = (group[5] || 0) - 0,
                s = (group[6] || 0) - 0;

            return new Date(Y, M, d, h, m, s);
        },
        /**
         * 格式化日期为指定的格式
         *
         * @method date2Str
         * @param {Date} date
         * @param {String} p 输出格式, %Y/%M/%d/%h/%m/%s的组合
         * @param {Boolean} [isFill:false] 不足两位是否补0
         * @return {String}
         */
        date2Str: function(date, p, isFill) {
            var Y = date.getFullYear(),
                M = date.getMonth() + 1,
                d = date.getDate(),
                h = date.getHours(),
                m = date.getMinutes(),
                s = date.getSeconds();

            if (isFill) {
                M = (M < 10) ? ('0' + M) : M;
                d = (d < 10) ? ('0' + d) : d;
                h = (h < 10) ? ('0' + h) : h;
                m = (m < 10) ? ('0' + m) : m;
                s = (s < 10) ? ('0' + s) : s;
            }
            p = p || '%Y-%M-%d %h:%m:%s';
            p = p.replace(/%Y/g, Y).replace(/%M/g, M).replace(/%d/g, d).replace(/%h/g, h).replace(/%m/g, m).replace(/%s/g, s);
            return p;
        },

        /**
         * 日期比较(d1 - d2)
         *
         * @method dateDiff
         * @param {Date} d1
         * @param {Date} d2
         * @param {String} [cmpType:ms] 比较类型, 可选值: Y/M/d/h/m/s/ms -> 年/月/日/时/分/妙/毫秒
         * @return {Float}
         */
        dateDiff: function(d1, d2, cmpType) {
            var diff = 0;
            switch(cmpType) {
                case 'Y':
                    diff = d1.getFullYear() - d2.getFullYear();
                    break;
                case 'M':
                    diff = (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth());
                    break;
                case 'd':
                    diff = (d1 - d2) / 86400000;
                    break;
                case 'h':
                    diff = (d1 - d2) / 3600000;
                    break;
                case 'm':
                    diff = (d1 - d2) / 60000;
                    break;
                case 's':
                    diff = (d1 - d2) / 1000;
                    break;
                default:
                    diff = d1 - d2;
                    break;
            }
            return diff;
        },
        /**
         * 日期相加
         *
         * @method dateAdd
         * @param char interval 间隔参数
         *        y 年
         *        q 季度
         *        n 月
         *        d 日
         *        w 周
         *        h 小时
         *        m 分钟
         *        s 秒
         *        i 毫秒
         * @param {Date} indate 输入的日期
         * @param {Number} offset 差值
         * @return {Date} date 相加后的日期
         */
        dateAdd : function(interval, indate, offset){
            switch(interval){
                case 'y':
                    indate.setFullYear(indate.getFullYear() + offset);
                    break;
                case 'q':
                    indate.setMonth(indate.getMonth() + (offset * 3));
                    break;
                case 'n':
                    indate.setMonth(indate.getMonth() + offset);
                    break;
                case 'd':
                    indate.setDate(indate.getDate() + offset);
                    break;
                case 'w':
                    indate.setDate(indate.getDate() + (offset * 7));
                    break;
                case 'h':
                    indate.setHours(indate.getHours() + offset);
                    break;
                case 'm':
                    indate.setMinutes(indate.getMinutes() + offset);
                    break;
                case 's':
                    indate.setSeconds(indate.getSeconds() + offset);
                    break;
                case 'i':
                    indate.setMilliseconds(indate.getMilliseconds() + offset);
                    break;
                default:
                    indate.setMilliseconds(indate.getMilliseconds() + offset);
                    break;
            }
            return indate;
        },
         /**
         * 判断是否是闰年
         *
         * @method leapYear
         * @param {Date} indate 输入的日期
         * @return {Object} 对象(是否是闰年，各月份的天数集，当前月的天数)
         */
        leapYear : function(indate){
            var _days = [31,28,31,30,31,30,31,31,30,31,30,31];
            var _is = false;
            var _d = 365;

            if ((indate.getFullYear() % 4 === 0 && indate.getFullYear() % 100 !== 0) || indate.getFullYear() % 400 === 0){
                _days.splice(1,1,29);
                _is = true;
                _d = 366;
            }else{
                _days.splice(1,1,28);
                _is = false;
                _d = 365;
            }
            return {isLeapYear:_is, days:_days, yearDays:_d, monthDays:_days[indate.getMonth()]};
        }
    };
})();
