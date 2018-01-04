(function() {

    var btnClose = $("[type='checkbox'].et-close-error");
    var btnFormatMessage = $("[type='checkbox'].et-format-message");
    var btnFormatStackTrace = $("[type='checkbox'].et-format-stackTrace");

    var backGroundPage = chrome.extension.getBackgroundPage();

    chrome.storage.sync.get([ 'etCloseBtn', 'formatMessage', 'formatStackTrace' ], function(results){
        results.etCloseBtn && btnClose.prop('checked', true);
        results.formatMessage && btnFormatMessage.prop('checked', true);
        results.formatStackTrace && btnFormatStackTrace.prop('checked', true);
    });

    btnClose.bind('click', function(){
        var etCloseBtn = false;
        if( $(this).is(":checked") ){
            etCloseBtn = true;
        }else{
            etCloseBtn = false;
        }
        chrome.storage.sync.set({ 'etCloseBtn': etCloseBtn });
        backGroundPage.reloadWebPage();
    });

    btnFormatMessage.bind('click', function(){
        var formatMessage = false;
        if( $(this).is(":checked") ){
            formatMessage = true;
        }else{
            formatMessage = false;
        }
        chrome.storage.sync.set({ 'formatMessage': formatMessage });
    });

    btnFormatStackTrace.bind('click', function(){
        var formatStackTrace = false;
        if( $(this).is(":checked") ){
            formatStackTrace = true;
        }else{
            formatStackTrace = false;
        }
        chrome.storage.sync.set({ 'formatStackTrace': formatStackTrace });
    });
})()