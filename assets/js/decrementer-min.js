/*!
 * @ritcheyer: http://jsfiddle.net/ritcheyer/bYZkS/
 */function updateCountdown(e){var t=e,n=t.next(),r=t.data("maxlength"),i=t.val().length,s=20,o="msg-focused",u=15,a="msg-almost",f=10,l="msg-warn",c=5,h="msg-whoa",p=0,d="msg-ludicrous",v=o+" "+a+" "+l+" "+h+" "+d;i=r-i;i>s?n.removeClass(v):i<=u?i<=f?i<=c?i===p?n.removeClass(v).addClass(d):n.removeClass(v).addClass(h):n.removeClass(v).addClass(l):n.removeClass(v).addClass(a):n.removeClass(v).addClass(o);n.text(i)}$("document").ready(function(){$("input[type=text], textarea").focus(function(){$(this).data("countdown")&&updateCountdown($(this))}).change(function(){updateCountdown($(this))}).keyup(function(){updateCountdown($(this))})});