/**
 * 编译、渲染模板 (基于Micro-Templating,修复单引号问题)
 * <pre>
 * http://ejohn.org/blog/javascript-micro-templating/
 * http://www.west-wind.com/weblog/posts/2008/Oct/13/Client-Templating-with-jQuery
 * </pre>
 * <pre>
 *  $.fn.template = require('../../../mod/base/template');
 *  1) $(templateID).template() 读取模版并预编译, 返回预编译后的函数
 *  2) $(templateID).template(data) 读取模版并编译渲染, 返回渲染后的字符串
 *  3) $(templateID).template('{{', '}}') 配置开始结束符并读取模版, 返回预编译后的函数
 *  4) $(templateID).template('{{', '}}', data) 配置开始结束符并读取模版并编译渲染, 返回渲染后的字符串
 * </pre>
 *
 * <pre>
 * 模板格式：
 * &lt;script id="templateID" type="text/x-template"&gt;&lt;/script&gt;
 * &lt;% for(var i = 0; i < data.length;i++) {%&gt;
 *  &lt;li&gt;&lt;%= data[i].name %&gt;&lt;/li&gt;
 * &lt;%}%&gt;
 * *lt;/script&gt;
 * </pre>
 * @class template
 * @module base
 * @author taylenxu
 *
 */

(function() {
    var START = '<%',
        END = '%>',
        cache = {};

    $.fn.template = function tmpl() {
        var args = Array.prototype.slice.call(arguments),
            str = $(this).html(),
            selector = $(this).selector, // 以选择符作缓存
            data,
            s, e;

        if (args.length == 2 && $.type(args[0]) == 'string' && $.type(args[1]) == 'string' && args[0].length == 2 && args[1].length == 2) { // 自定义开始结束标签, 并且开始结束符必须为两位(不要使用正则敏感符号)
            s = args[0];
            e = args[1];
            data = args[2];
        } else {
            s = START;
            e = END;
            data = args[0];
        }

        // 提取开始结束符的分界符, <% -- %;  %> -- %
        var s_sep = s.substr(s.length - 1),
            e_sep = e.substr(0, 1);

        // 正则匹配
        var reg = new RegExp(s + "=(.+?)" + e , "g"), // /<%=(.+?)%>/g
            reg_e = new RegExp("'(?=[^" + e_sep + "]*" + e + ")", "g"); // /'(?=[^%]*%>)/g


        var fn = cache[selector] ||
            // generator (and which will be cached).
            new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
             str.replace(/[\r\t\n]/g, " ")
                .replace(reg_e, "\t")
                .split("'").join("\\'")
                .split("\t").join("'")
                .replace(reg, "',$1,'")
                .split(s).join("');")
                .split(e)
                .join("p.push('") +
            "');}return p.join('');");

        // cache
        cache[selector] = fn;

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();
