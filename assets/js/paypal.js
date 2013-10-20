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
    
    // make it a newValueing (I don't trust the internets)
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


  // Only fire on the form page, not the 'thanks' page
  if(!$('body').hasClass('paypal-submit')) { $('textarea').autosize(); }
  
  // payment recipient selection
  $('.paypal').on('click', '.payment-choice', function(e) {
    e.stopPropagation();
    var $this = $(this);
    $('.payment-choice').removeClass('selected');
    
    $this.addClass('selected');
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

  });

  $('.send-to, .amount, .message').on('focus blur', 'input, textarea, select', function() {
    $(this).closest('.input-contain').toggleClass('active');
  });
  
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
  
  $('.amount').on('blur', 'input', function() {
    var $this = $(this),
        value = $this.val(),
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
    }
    $this.val(value);

  });


  if($('body').hasClass('paypal-submit')) {
    var query = window.location.search;
    var paramArray = query.split('?');
    var paymentValuesArray = paramArray[1].split('&');
    var paymentValues = new Array();
    
    for(var i = 0; i < paymentValuesArray.length; i++) {
      paymentValues.push(paymentValuesArray[i].split('=')[1]);
    }

    $('.send-money-to').text(decodeURIComponent(paymentValues[0]));
    
    var amountSent = decodeURIComponent(paymentValues[1]);
    amountSent = newCurrencyValue(amountSent, paymentValues[4]);
    
    var currencyText;

    if(paymentValues[4] === 'dollar')    { currencyText = 'USD'; }
    else if(paymentValues[4] === 'euro') { currencyText = 'Euro'; }
    else if(paymentValues[4] === 'yen')  { currencyText = 'Yen'; }

    $('.amount-to-send').html('<i class="icon-' + paymentValues[4] + '"> ' + amountSent + ' ' + currencyText);
    $('.payment-message').text(decodeURIComponent(paymentValues[2]));
    
    setTimeout(function() {
      
      $('.confirmation-text').fadeIn('fast', function(){
        $(this).removeClass('hide').removeAttr('style');
      });
    }, 100);
    
  }

});