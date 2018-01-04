
module.exports = {
    'ExceptionFullName': function(){ return $('#exceptionFullName') },
    'Message': function(){ return $("td.details ul.li-items li:eq(4) b") },
    'StackTrace': function(){ return $("td.details ul.li-items li:eq(7) b") },
    'Username': function(){ return $('#select1.username option:eq(0)') },
    'Browser': function(){ return $("td.details ul.li-items li:eq(0) >span:eq(1)") },
    'CatchClassName': function(){ return $('#catchClassFullName') },
    'UserAgent': function(){ return $("td.details ul.li-items li:eq(11) b") },
    'AppName': function(){ return $("#appName") }
}