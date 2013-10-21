/*!
 * @ritcheyer: http://jsfiddle.net/ritcheyer/bYZkS/
 * If you're interested in seeing the uncompressed version,
 * it's here: http://eric.ritchey.io/assets/js/decrementer.js
 */

function updateCountdown(input) {
    var $input         = input,
        $countDisplay  = $input.next(),
        inputMax       = $input.data('maxlength'),
        counter        = $input.val().length,
        cntNormal    = 20,
        clsNormal    = 'msg-focused',
        cntAlmost    = 15,
        clsAlmost    = 'msg-almost',
        cntWarn      = 10,
        clsWarn      = 'msg-warn',
        cntWhoa      = 5,
        clsWhoa      = 'msg-whoa',
        cntLudicrous = 0,
        clsLudicrous = 'msg-ludicrous',
        clsSet       = clsNormal + ' ' + clsAlmost + ' ' + clsWarn + ' ' + clsWhoa + ' ' + clsLudicrous;

    counter = inputMax - counter;
    if (counter > cntNormal) {
        // normal
        $countDisplay.removeClass(clsSet);
    } else {
        if (counter <= cntAlmost) {
            if (counter <= cntWarn) {
                if (counter <= cntWhoa) {
                    if (counter === cntLudicrous) {
                        // ludicrous message
                        $countDisplay.removeClass(clsSet).addClass(clsLudicrous);
                    } else {
                        // whoa message
                        $countDisplay.removeClass(clsSet).addClass(clsWhoa);
                    }
                } else {
                    // warn message
                    $countDisplay.removeClass(clsSet).addClass(clsWarn);
                }
            } else {
                // almost message
                $countDisplay.removeClass(clsSet).addClass(clsAlmost);
            }
        } else {
            // green class
            $countDisplay.removeClass(clsSet).addClass(clsNormal);
        }
    }

    $countDisplay.text(counter);
}
$('document').ready(function() {
    $('input[type=text], textarea').focus(function() {
        if ($(this).data('countdown')) {
            updateCountdown($(this));
        }
    }).change(function() {
        updateCountdown($(this));
    }).keyup(function() {
        updateCountdown($(this));
    });
});