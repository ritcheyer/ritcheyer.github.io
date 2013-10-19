$(document).ready(function(){

    // plugging the plugin
    $('textarea').autosize();
    
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
          currentCurrencySymbol  = currencyContainer.find('.currency-type').children('i'),
          selectedCurrencySymbol = $(this).children('option:selected').data('toggle');
          
          // reset the placeholder text and focus the input
          if (selectedCurrencySymbol === 'euro') {
            currencyInput.attr('placeholder', '1.234,56').focus();
          } else if (selectedCurrencySymbol === 'yen') {
            currencyInput.attr('placeholder', '1234,56').focus();
          } else {
            currencyInput.attr('placeholder', '1,234.56').focus();
          }
          
          // replace the old with the new
          currentCurrencySymbol.removeClass().addClass('icon-' + selectedCurrencySymbol);
    });

    // stop the form from firing momentarily
    $('#submit-payment').on('submit', function(e) {
      e.preventDefault();

      var thisForm = this;

      // add blur classes
      $('.paypal-header, .paypal-form').addClass('blur-me');
      
      // display overlay
      $('.paypal .overlay').removeClass('hide');

      // TODO: randomize the time it takes for timeout
      setTimeout(function() {
        thisForm.submit();
      }, 3500);

    });
    
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

});
