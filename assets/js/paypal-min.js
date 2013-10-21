$(document).ready(function(){function e(e,t){t==="focus"?e.fadeIn(100,function(){$(this).removeClass("hide").removeAttr("style")}):t==="blur"&&e.fadeOut(100,function(){$(this).addClass("hide").removeAttr("style")})}function t(e,t){var n,r;n=e.split(".").join("").split(",").join("");r=n.split("");t==="dollar"||t==="yen"?r.splice(-2,0,"."):r.splice(-2,0,",");n=r.join("");t==="dollar"||t==="yen"?n=n.split("."):n=n.split(",");n[0].length>=4&&(t==="dollar"?n[0]=n[0].replace(/(\d)(?=(\d{3})+$)/g,"$1,"):t==="euro"?n[0]=n[0].replace(/(\d)(?=(\d{3})+$)/g,"$1."):n[0]=n[0]);n[1]&&n[1].length>=5&&(n[1]=n[1].replace(/(\d{3})/g,"$1 "));t==="dollar"||t==="yen"?e=n.join("."):e=n.join(",");return e}function n(e){var t=new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);return t.test(e)}function r(e){var t=decodeURIComponent(e);return t}$(".payment-type").on("click",".payment-choice",function(e){e.stopPropagation();var t=$(this);$(".payment-type").removeClass("form-warning");$(".payment-choice").removeClass("selected");t.addClass("selected")});$("#amount-to-send").on("focus",function(){var t=$(this),n=t.closest(".input-contain").find("#currency-type");e(n,"focus")});$("#currency-type").on("change",function(){var e=$(this),n=e.closest(".input-contain"),r=n.find("#amount-to-send"),i=r.val(),s=n.find(".currency-type").children("i"),o=$(this).children("option:selected").data("toggle"),u;o==="euro"&&i===""?r.attr("placeholder","1.234,56").focus():o==="yen"&&i===""?r.attr("placeholder","1234,56").focus():o==="dollar"&&i===""&&r.attr("placeholder","1,234.56").focus();i!==""&&(u=t(i,o));r.val(u);s.removeClass().addClass("icon-"+o);$("#currency-symbol").val(o)});$("#submit-payment").on("submit",function(e){e.preventDefault();var t=this;$(".send-to input").trigger("blur");$(".amount input").trigger("blur");$('.payment-type input[name="payment-for"]:checked').val()===undefined&&$(".payment-type").addClass("form-warning");if($(".paypal").find(".form-warning").length==0){$("input, select, textarea").attr("readonly",!0);$(".paypal-header, .paypal-form").addClass("blur-me");$(".paypal .overlay").removeClass("hide");setTimeout(function(){t.submit()},3500)}});$(":reset").on("click",function(){$(".payment-choice").removeClass("selected");$(".input-contain").removeClass("form-warning");$(".icon-ok, .icon-warning-sign").addClass("hide")});$(".send-to, .amount, .message").on("focus blur","input, textarea, select",function(){var e=$(this),t=e.closest(".input-contain");t.toggleClass("active")});$(".amount").on("keypress","input",function(e){var t=window.event?e.keyCode:e.which;(t<48||t>57)&&t!==0&&t!==8&&t!==13&&t!==46&&t!==44&&!e.ctrlKey&&e.preventDefault()});$(".amount").on("blur","input",function(){var e=$(this),n=e.val(),r=e.closest(".input-contain"),i=e.parent("label").siblings("select").find("option:selected").data("toggle");i==="dollar"||i==="yen"?n.indexOf(".")!==-1?n=n.slice(0,n.indexOf(".")+3):e.val()!==""&&(n+=".00"):n.indexOf(",")!==-1?n=n.slice(0,n.indexOf(",")+3):e.val()!==""&&(n+=",00");if(n!==""){n=t(n,i);r.removeClass("form-warning");r.find(".icon-ok").removeClass("hide");r.find(".icon-warning-sign").addClass("hide")}else{r.addClass("form-warning");r.find(".icon-ok").addClass("hide")}e.val(n)});$(".send-to").on("blur","input",function(){var e=$(this),t=e.closest(".input-contain");if(e.attr("type")==="email")if(e.val()!=="")if(!n(e.val())){t.addClass("form-warning");t.find(".icon-ok").addClass("hide");t.find(".icon-warning-sign").fadeIn(100,function(){$(this).removeClass("hide").removeAttr("style")});$(":submit").attr("disabled",!0).val("Please correct errors first.");console.log("invalid email")}else{console.log("valid email");t.removeClass("form-warning");t.find(".icon-warning-sign").addClass("hide");t.find(".icon-ok").fadeIn(100,function(){$(this).removeClass("hide").removeAttr("style")});$(":submit").attr("disabled",!1).val("Submit Payment")}else{t.find(".icon-ok").addClass("hide");t.addClass("form-warning")}else e.attr("type")==="tel"});if($("body").hasClass("paypal-submit")){var i=window.location.search,s=i.split("?"),o=s[1].split("&"),u=new Array,a,f,l,c,h,p;for(var d=0;d<o.length;d++)u.push(o[d].split("=")[1]);a=r(u[0]);f=r(u[1]);l=r(u[2]);c=r(u[3]);h=r(u[4]);h==="dollar"?p="USD":h==="euro"?p="Euro":h==="yen"&&(p="Yen");f=t(f,h);paymentMessage=l.replace(/\+/g," ");$(".send-money-to").text(a);$(".amount-to-send").html('<i class="icon-'+h+'" />'+f+" "+p);paymentMessage!==""?$(".payment-message blockquote").text(paymentMessage):$(".payment-message").remove();setTimeout(function(){$(".confirmation-text").fadeIn("fast",function(){$(this).removeClass("hide").removeAttr("style")})},100)}else{$("textarea").autosize();var v,m,g;v={lines:15,length:0,width:11,radius:50,corners:1,rotate:35,direction:1,color:"#fff",speed:1.3,trail:64,shadow:!1,hwaccel:!0,className:"spinner",zIndex:2e9,top:"auto",left:"auto"};m=document.getElementById("spinner");g=(new Spinner(v)).spin(m)}});