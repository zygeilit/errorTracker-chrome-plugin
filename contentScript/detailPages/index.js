
(function(){

    var detailComponents = window['detailComponents'];
    
    var lastDetailTr = null;

    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

        chrome.storage.sync.get([ 'formatMessage', 'formatStackTrace' ], function(results){

            if( request['operate'] == "et-visualDetail" ){
                if( lastDetailTr ){
                    lastDetailTr.prev().find("td:eq(0) img").click();
                    lastDetailTr.remove();
                    lastDetailTr = null;
                }
                lastDetailTr = $("td.details").closest('tr');

                var messageContainer = detailComponents.Field.Message();
                var messageJsonStr = messageContainer.text();
                detailComponents.Store.set('ori_message', messageJsonStr);

                var stContainer = detailComponents.Field.StackTrace();
                detailComponents.Store.set('ori_stacklist', stContainer.text());

                results.formatMessage && detailVisualApi.message();
                results.formatStackTrace && detailVisualApi.stackTrace();

                (function startBestPractice() {
                    // 最佳实践
                    var detailsContainer = $("td.details ul.li-items");
                    detailsContainer.css({ 'position': 'relative' });
                    var practiceBtns = new detailComponents.PracticeBtns();
                    detailsContainer.append(practiceBtns.$el);
                    //添加原始html
                    var excTypeDom = detailComponents.Field.ExceptionFullName();
                    if(!excTypeDom.attr('data-oriHtml')) excTypeDom.attr('data-oriHtml', excTypeDom.html());
                })();
            }
        });

    });

    var detailVisualApi = (function(){

        return {

            message: function(){

                var messageContainer = detailComponents.Field.Message();
                var messageJsonStr = messageContainer.text();
                var messageJSON = JSON.parse(messageJsonStr);
                var messageTable = $("<table class='et-detail-message-container'/>");

                detailComponents.Store.set('message', messageJSON);

                for( var meKey in messageJSON )(function( key, data ){

                    var val = data[key];
                    var tr = $('<tr class="'+( 'et-mes-'+key )+'"/>');

                    if(key == 'userLogoPath') {
                        key = 'logo';
                        if( val ){
                            val = $('<span><img style="width:200px" src="'+ val +'"></span>');
                        }else{
                            val = $('<span>""</span>');
                        }
                    } else if(key == 'pagePath') {
                        val = $('<a target="_blank" href="'+ val +'">'+ val +'</a>');
                        key = 'path';
                    } else if(key.toLowerCase() == 'xmlhttprequest') {
                        if(val['data'] && typeof val['data'] == 'string') {
                            val['data'] = JSON.parse(val['data']);
                        }
                        var v = JSON.stringify(val, null, '\t');
                        val = $('<pre style="">'+ v +'</pre>');
                        key = 'XHR';
                    } else {
                        val = $('<span>'+ JSON.stringify(val) +'</span>');
                    }

                    tr.append([
                        $('<td>'+ key +':</td>'),
                        $('<td style="position: relative"/>').append(val)
                    ]);

                    messageTable.append(tr);

                })( meKey, messageJSON );
                messageContainer.empty().append(messageTable);

                detailComponents.FieldTips.message();
            },

            stackTrace: function(){

                var def = $.Deferred();

                var stContainer = detailComponents.Field.StackTrace();
                var errorId = $("td.details ul.li-items li:eq(3) span:eq(3)").text();
                var appName = $("#applicationName").val();

                var stacklist = new detailComponents.Stacklist({
                    errorId: errorId,
                    appName: appName,
                    container: stContainer
                });

                stacklist.init().done(function(){
                    detailComponents.Store.set('stacklist', stacklist.stacklist);
                    def.resolve();
                });

                return def.promise()
            }
        }
    })()
})()
