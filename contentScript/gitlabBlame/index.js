
var gotoLine = (function(opt) {

    var targetLine = opt['line'] + '';
    var targetFnName = opt['fnName'];
    var pagContainers = $('.lines.blame-numbers pre');

    for(var p = 0; p < pagContainers.length; p++) {
        var pagContainer = $(pagContainers[p]);
        var pagList = pagContainer.text().split('\n');

        var lineHasMatched = false;
        for(var i = 0; i < pagList.length; i++) {
            var pageNum = pagList[i];
            // 找到了对应的行
            if(pageNum == targetLine) {
                // 对应行高亮
                var lines = pagContainer.closest('tr').find('code .line');

                var tarHllElement = null;

                // 判断是否包含改行对应的code. (eg:空行的情况)
                if((pagList.length) == lines.length) {
                    tarHllElement = lines[i];
                } else {
                    // 找不到对应行号, 使用fnName去查找
                    var hasMatchedViaFnName = false;
                    for(var h = 0; h < lines.length; h++) {
                        var lineText = $(lines[h]).text();
                        // 找到了函数所在的行
                        if(lineText.match(new RegExp(targetFnName))) {
                            tarHllElement = lines[h];
                            hasMatchedViaFnName = true;
                            break;
                        }
                    }
                    // 如果找不到line,组里匹配不到fnName, 就把整个分组高亮
                    if(!hasMatchedViaFnName) {
                        tarHllElement = pagContainer.closest('tr').find('.lines');
                        tarHllElement.addClass('tms-et-group-hll')
                        // throw new Error('The targetLine('+ targetLine +') hasn\'t matched, mabe this line is empty.');
                    }
                }

                // 高亮行
                var targetLineElement = $(tarHllElement);
                targetLineElement.addClass('tms-line-hll');
                // scoroll to
                var scrollTop = targetLineElement.offset().top;
                window.scroll( 100, scrollTop );

                // 给组里面所有的行号添加span标签
                for( var j = 0; j < pagList.length; j++) {
                    var pn = pagList[j];
                    pagList[j] = [ '<span class="tms-num">', pn, '</span>' ].join('');
                    // 把行号高亮
                    if(j == i) {
                        pagList[i] = [ '<span class="tms-num-hll">', pn, '</span>' ].join('');        
                    }
                }
                pagContainer.html(pagList.join(''));
                lineHasMatched = true;
                break;
            }
        }
        // 跳出
        if(lineHasMatched) break;
    }
});

// L500&FN:errRenderNum
var urlExp = window.location.href.match(/^[\S\s]+?\#L(\d+?)\&FN\:([\S]+?)$/);
var line = urlExp ? urlExp[1] : null;
var fnName = urlExp ? urlExp[2] : null;

line && gotoLine({ line: line, fnName: fnName });