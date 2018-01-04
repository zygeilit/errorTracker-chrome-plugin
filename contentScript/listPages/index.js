chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if( request['operate'] == "et-tableLoadCompleted" ) {
        chrome.storage.sync.get([ 'etCloseBtn' ], function(results){
            results.etCloseBtn && listPageApi.reload();
        });
    }
    else if( request['operate'] == 'et-reloadPage' ){
        location.reload()
    }
});

var solve = function self_solve(idArr, ETstatus){
    if(!idArr || idArr.length < 1) {
        alert('处理完毕');
        $('#search').click();
        return;
    }
    var perErrorId = idArr[0];
    var text = (ETstatus == 2) ? "已经处理" : '无需报警';
    $.ajax({
        url: 'http://..',
        type: 'POST',
        data: {
            errorId: perErrorId,
            solution: text,
            completeTime: datePattern.apply(new Date(), [ 'yyyy-MM-dd hh:mm:ss' ]),
            status: ETstatus,
            rootException: text
        },
        success: function() {
            idArr = idArr.slice(1,idArr.length);
            if(idArr && idArr.length > 0) self_solve(idArr, ETstatus);
        },
        error: function(resp) {
            idArr = idArr.slice(1,idArr.length);
            if(idArr && idArr.length > 0) self_solve(idArr, ETstatus);
        }
    })
}

var closeAll = function _self_closeAll(num, l){
    if(num < 1) {
        console.dir(l);
        return
    }
    if(!l) l = [];

    $.ajax({
        url: 'http://../../GetExceptionCounts',
        type: 'POST',
        data: {
            Group: '',
            AppName: 'ux.pc.recruit.tms.com',
            ErrorType: '',
            Status:0,
            Start: '',
            End: '',
            ErrorID: '',
            RootException: '',
            isSearch:1,
            keywords:0,
            searchText:'',
            startIndex:0,
            pageSize:30,
        },
        success: function(resp){
            var list = resp['aaData'];
            for(var i=0; i<list.length; i++){
                var o = list[i];
                l.push(o['ErrorID'])
            }
            solve(l, 3);
            l = [];
            num = num - 1;
            setTimeout(function(){
                _self_closeAll(num, l)
            }, 5000)
        }
    })
}

var datePattern = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

var listPageApi = (function(){

    var hasTh = false;
    var hasBtnList = false;
    var hasReCalCss = false;

    var currentAppName = function() {

        return $('[data-id="AppName"] span').text();
    }

    var reloadTable = function( firstTime ){

        //添加td:checkbox
        $("#tblException tbody tr").each(function( state, tr ){
            var firstTd = $(tr).find('td:eq(0)');
            var td = $('<td><input type="checkbox" class="et-error"/></td>');
            td.insertBefore( firstTd );
        });
    };

    var addTh = function(){
        if( hasTh ) return;
        
        hasTh = true;
        //添加th
        var thFirst = $("#tblException thead tr th:eq(0)");
        var th = $('<th width="3%"></th>');
        th.insertBefore( thFirst );
    }

    var addBtnList = function(){
        if( hasBtnList ) return;

        hasBtnList = true;
        //添加操作按钮
        var btnList = $([
            '<ul class="et-btn-list">',
            '<li class="et-choose">',
            '<a href="javascript:void(0)" target="_blank" class="btn btn-white btn-sm">',
            '<span>全选</span>',
            '</a>',
            '</li>',
            '<li class="et-close">',
            '<a href="javascript:void(0)" target="_blank" class="btn btn-white btn-sm">',
            '<span>无需报警</span>',
            '</a>',
            '</li>',
            '<li class="et-close">',
            '<a href="javascript:void(0)" target="_blank" class="btn btn-white btn-sm">',
            '<span class="et-ok">已解决</span>',
            '</a>',
            '</li>',
            // '<li class="et-close-all">',
            // '<a href="javascript:void(0)" target="_blank" class="btn btn-white btn-sm">',
            // '<span>关闭15页</span>',
            // '</a>',
            // '</li>',
            '</ul>'
        ].join(''));

        var userName = $(".username option:eq(0)").text().replace(/^\s+|\s+$/,'')||'undefined';

        btnList.find('.et-close').bind('click', function(e){
            var selectedErrorIds = [];
            $("#tblException [type='checkbox'].et-error:checked").each(function( state, cbx ){
                var processHref = $(cbx).closest('tr').find("td:eq(7) a:eq(1)").attr('href');
                var matches = processHref.match(/^[\S]+errorId\=([\S]+$)/);
                var errorId = matches[1];
                selectedErrorIds.push(errorId);
            });
            var status = $(e.target).is(".et-ok")?2:3;
            solve(selectedErrorIds, status);
        });
        btnList.find('.et-choose').bind('click', function(e){
            var boxes = $("#tblException [type='checkbox'].et-error");
            boxes.eq(0).attr("checked")?boxes.attr("checked", false):boxes.attr("checked", true);
        });
        btnList.insertAfter( $(".search-hidden") );

        // btnList.find('.et-close-all').click(function(){
        //     closeAll(15)
        // })
    }

    var reCalculateCss = function(){
        if( hasReCalCss ) return;

        hasReCalCss = true;
        $("#tblException thead tr th:eq(1)").attr("width","16%"); //站点
        $("#tblException thead tr th:eq(4)").attr("width","32%"); //异常类型
        $("#tblException thead tr th:eq(5)").attr("width","7%");  //处理人
        $("#tblException thead tr th:eq(6)").attr("width","11%"); //操作
    }

    return {

        init: function(){
            addBtnList();
            addTh();
            reloadTable();
            reCalculateCss();
        },

        reload: function(){
            addBtnList();
            addTh();
            reloadTable();
            reCalculateCss();
        }
    }
})();

chrome.storage.sync.get([ 'etCloseBtn' ], function(results){
    results.etCloseBtn && listPageApi.init();
});