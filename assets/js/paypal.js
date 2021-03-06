/*!
 * If you're interested in seeing the uncompressed version,
 * it's here: http://eric.ritchey.io/assets/js/paypal.js
*/

$(document).ready(function(){

  // a function to hide/show an element based on the action on the input
  function hideOrShowElement(element, action) {

    if (action === 'focus') {
      element.fadeIn(100, function() {
        $(this).removeClass('hide').removeAttr('style');
      });
    } else if(action === 'blur') {
      element.fadeOut(100, function() {
        $(this).addClass('hide').removeAttr('style');
      });
    }

  }

  function newCurrencyValue(value, currency) {
    var newValue, characters;
    
    // make it a string (I don't trust the internets)
    // also normalize by removing commas and periods
    newValue = value.split('.').join('').split(',').join('');

    characters = newValue.split('');

    // now time to reinsert comma or period
    if(currency === 'dollar' || currency === 'yen') {
      characters.splice(-2, 0, '.');
    } else {
      characters.splice(-2, 0, ',');
    }

    // join the array back together
    newValue = characters.join('');

    // split on comma or period
    if(currency === 'dollar' || currency === 'yen') {
      newValue = newValue.split('.');
    } else {
      newValue = newValue.split(',');
    }
    

    if (newValue[0].length >= 4) {
      if(currency === 'dollar') {
        newValue[0] = newValue[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        // newValue = newValue.slice(0, (value.indexOf('.')) + 3);
      } else if (currency === 'euro') {
        newValue[0] = newValue[0].replace(/(\d)(?=(\d{3})+$)/g, '$1.');
        // newValue = newValue.slice(0, (value.indexOf(',')) + 3);
      } else {
        newValue[0] = newValue[0];
      }
    }

    if (newValue[1] && newValue[1].length >= 5) {
      newValue[1] = newValue[1].replace(/(\d{3})/g, '$1 ');
    }

    if(currency === 'dollar' || currency === 'yen') {
      value = newValue.join('.');
    } else {
      value = newValue.join(',');
    }

    return value;
  }

  function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
  }

  function decoderRing (decodeMe) {
    var decoded = decodeURIComponent(decodeMe);
  
    return decoded;
  
  }

  // payment recipient selection
  $('.payment-type').on('click', '.payment-choice', function(e) {
    e.stopPropagation();
    var $this = $(this);

    $('.payment-type').removeClass('form-warning');
    $('.payment-choice').removeClass('selected');
    $this.addClass('selected');
    $this.children('input[type="radio"]').attr('checked', true);
  });
  
  // when focusing on the amount field, we want to do some stuff
  $('#amount-to-send').on('focus', function(){
    
    var $this = $(this),
        currencySelector = $this.closest('.input-contain').find('#currency-type');

    hideOrShowElement(currencySelector, 'focus');
  });

  // changing the currency placeholder and symbol when the user changes it
  $('#currency-type').on('change', function(){

    var $this                  = $(this),
        currencyContainer      = $this.closest('.input-contain'),
        currencyInput          = currencyContainer.find('#amount-to-send'),
        currencyInputValue     = currencyInput.val(),
        currentCurrencySymbol  = currencyContainer.find('.currency-type').children('i'),
        selectedCurrencySymbol = $(this).children('option:selected').data('toggle'),
        newCurrencyInputValue;

        // reset the placeholder text and focus the input
        if (selectedCurrencySymbol === 'euro' && currencyInputValue === '') {
          currencyInput.attr('placeholder', '1.234,56').focus();
        } else if (selectedCurrencySymbol === 'yen' && currencyInputValue === '') {
          currencyInput.attr('placeholder', '1234,56').focus();
        } else if (selectedCurrencySymbol === 'dollar' && currencyInputValue === '') {
          currencyInput.attr('placeholder', '1,234.56').focus();
        }

        if(currencyInputValue !== '') {
          newCurrencyInputValue = newCurrencyValue(currencyInputValue, selectedCurrencySymbol);
        }
        currencyInput.val(newCurrencyInputValue);
        
        // replace the old with the new
        currentCurrencySymbol.removeClass().addClass('icon-' + selectedCurrencySymbol);
        $('#currency-symbol').val(selectedCurrencySymbol);
  });

  // stop the form from firing momentarily
  $('#submit-payment').on('submit', function(e) {
    
    // prevent the form from submitting to perform actions
    e.preventDefault();

    var thisForm = this;
    
    $('.send-to input').trigger('blur');
    $('.amount input').trigger('blur');

    if($('.payment-type input[name="payment-for"]:checked').val() === undefined) {
      $('.payment-type').addClass('form-warning');
    }

    // if there aren't any form errors, we can proceed
    if($('.paypal').find('.form-warning').length === 0) {
      
      // add readonly to inputs, select and textarea on form submission
      $('input, select, textarea').attr('readonly', true);
      
      // add blur classes
      $('.paypal-header, .paypal-form').addClass('blur-me');
    
      // display overlay
      $('.paypal .overlay').removeClass('hide');
    
      // TODO: randomize the time it takes for timeout
      setTimeout(function() {
      
        // submit the form now that we have performed
        // some interactions and validated all the inputs
        thisForm.submit();
      }, 3500);
    }

  });
  
  // reset the form when 'clear' button clicked
  $(':reset').on('click', function(){
    $('.payment-choice').removeClass('selected');
    $('.input-contain').removeClass('form-warning');
    $('.icon-ok, .icon-warning-sign').addClass('hide');
  });

  // toggling classes on input containers
  $('.send-to, .amount, .message').on('focus blur', 'input, textarea, select', function() {
    var $this = $(this),
    inputContain = $this.closest('.input-contain');

    inputContain.toggleClass('active');

  });
  

  // TODO: Allow for phone numbers in "To:" field
  // if user types phone number, switch input type
  // enter dash if necessary
  // $('.send-to').on('keypress', 'input', function(e) {
  //   var keyCode = window.event ? e.keyCode : e.which;
  //   
  //   // console.log(keyCode);
  // 
  // });
  
  // only allow numbers and commas in amount field
  $('.amount').on('keypress', 'input', function(e) {
    
      var keyCode = window.event ? e.keyCode : e.which;

      // only allow 0-9
      if (keyCode < 48 || keyCode > 57) {
          // allow codes for the following: backspace, delete, enter, comma(44) and period (46)
          if (keyCode !== 0 && keyCode !== 8 && keyCode !== 13 && keyCode !== 46 && keyCode !== 44 && !e.ctrlKey) {
              e.preventDefault();
          }
      }

  });
  
  // when leaving amount, check if it needs .00 or ,00 then send it to the converter
  $('.amount').on('blur', 'input', function() {
    var $this = $(this),
        value = $this.val(),
        myContainer = $this.closest('.input-contain'),
        currencyType = $this.parent('label').siblings('select').find('option:selected').data('toggle');

    // need to treat yen, dollars and euros differently.
    if((currencyType === 'dollar' || currencyType === 'yen')) {

      if(value.indexOf('.') !== -1) {
        value = value.slice(0, (value.indexOf('.')) + 3);
      } else {
        if($this.val() !== ''){ value = value + '.00'; }
      }
    } else {
      if(value.indexOf(',') !== -1) {
        value = value.slice(0, (value.indexOf(',')) + 3);
      } else {
        if($this.val() !== ''){ value = value + ',00'; }
      }
    }

    if(value !== '') {
      value = newCurrencyValue(value, currencyType);
      myContainer.removeClass('form-warning');
      myContainer.find('.icon-ok').removeClass('hide');
      myContainer.find('.icon-warning-sign').addClass('hide');
    } else {
      myContainer.addClass('form-warning');
      myContainer.find('.icon-ok').addClass('hide');
    }
    $this.val(value);

  });

  // validation messaging
  $('.send-to').on('blur', 'input', function() {
    var $this = $(this),
    myContainer = $this.closest('.input-contain');
    
    // is email?
    if($this.attr('type') === 'email') {
      
      // is not empty?
      if($this.val() !== '') {

        // did is pass validation?
        if(!isValidEmailAddress($this.val())) {
          
          // add warning class to parent container
          myContainer.addClass('form-warning');

          // in case it already was visible
          myContainer.find('.icon-ok').addClass('hide');


          // display the warning sign
          myContainer.find('.icon-warning-sign').fadeIn(100, function(){
            $(this).removeClass('hide').removeAttr('style');
          });
          
          // disable form submission
          $(':submit').attr('disabled', true).val('Please correct errors.');

        } else {
          myContainer.removeClass('form-warning');

          // hide the warning sign since validation passed
          myContainer.find('.icon-warning-sign').addClass('hide');

          // display success icon since validation passed
          myContainer.find('.icon-ok').fadeIn(100, function(){
            $(this).removeClass('hide').removeAttr('style');
          });

          // enable form submission
          $(':submit').attr('disabled', false).val('Submit Payment');

        }

      } else {
        myContainer.find('.icon-ok').addClass('hide');
        myContainer.addClass('form-warning');
      }

    } else if($this.attr('type') === 'tel') {
      // TODO: allow phone numbers.. didn't have time to get to this one thought.. :(
    } else {
      // not email or tel, then text or amount
      
    }

  });

  // logic for the 'thanks' page. some of this unnecessary if this were a production system.
  if($('body').hasClass('paypal-submit')) {
    var query = window.location.search,
        paramArray = query.split('?'),
        paymentValuesArray = paramArray[1].split('&'),
        paymentValues = [],
        recipient,
        amountSent,
        messageSent,
        paymentType,
        currencyType,
        currencyText,
        paymentMessage;
    
    for(var i = 0; i < paymentValuesArray.length; i++) {
      paymentValues.push(paymentValuesArray[i].split('=')[1]);
    }
    
    recipient    = decoderRing(paymentValues[0]);
    amountSent   = decoderRing(paymentValues[1]);
    messageSent  = decoderRing(paymentValues[2]);
    paymentType  = decoderRing(paymentValues[3]);
    currencyType = decoderRing(paymentValues[4]);

    if(currencyType === 'dollar')    { currencyText = 'USD'; }
    else if(currencyType === 'euro') { currencyText = 'Euro'; }
    else if(currencyType === 'yen')  { currencyText = 'Yen'; }

    amountSent = newCurrencyValue(amountSent, currencyType);
    paymentMessage = messageSent.replace(/\+/g, ' ');

    $('.send-money-to').text(recipient);
    $('.amount-to-send').html('<i class="icon-' + currencyType + '" />' + amountSent + ' ' + currencyText);
    
    // if there isn't a payment message, no need to display that section, so just remove it from the code before showing it.
    if(paymentMessage !== '') {
      $('.payment-message blockquote').text(paymentMessage);
    } else {
      $('.payment-message').remove();
    }
    
    // avoid flash of no content (FONC);
    setTimeout(function() {
      
      $('.confirmation-text').fadeIn('fast', function(){
        $(this).removeClass('hide').removeAttr('style');
      });
    }, 100);

  } else {

    $('textarea').autosize();

    // spinner graphic
    var opts, target, spinner;
    opts = {
      lines: 15,            // The number of lines to draw
      length: 0,            // The length of each line
      width: 11,            // The line thickness
      radius: 50,           // The radius of the inner circle
      corners: 1,           // Corner roundness (0..1)
      rotate: 35,           // The rotation offset
      direction: 1,         // 1: clockwise, -1: counterclockwise
      color: '#fff',        // #rgb or #rrggbb or array of colors
      speed: 1.3,           // Rounds per second
      trail: 64,            // Afterglow percentage
      shadow: false,        // Whether to render a shadow
      hwaccel: true,        // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9,          // The z-index (defaults to 2000000000)
      top: 'auto',          // Top position relative to parent in px
      left: 'auto'          // Left position relative to parent in px
    };
    target = document.getElementById('spinner');
    spinner = new Spinner(opts).spin(target);


  }

});