function show_error(input, message){
    $('#input_' + input).addClass('error');
    $('#error_' + input).html(message).show();
    return false
}

function clear_error(input){
    $('#input_' + input).removeClass('error');
    $('#error_' + input).html('').hide();
}

function lock_inputs(){
    $('input').attr('disabled', 'disabled');
    $('#submit_button').attr('disabled', 'disabled');
    $('#transaction_error').hide();
}

function unlock_inputs(){
    $('input').removeAttr('disabled');
    $('#submit_button').removeAttr('disabled');
    $('#progress_message').hide();
}           

function validate(field, value){
    if(field == 'number'){
        if(!value.length) return show_error(field, 'Please enter a credit card number');
    }

    if(field == 'cvc'){
        if(!value.length) return show_error(field, 'Please enter a CVC');
    }

    if(field == 'exp_month'){
        if(!value.length) return show_error(field, 'Please enter a month');
        if(value < 1 || value > 12) return show_error(field, 'Month should be between 1 and 12');
    }                   

    if(field == 'exp_year'){
        if(!value.length) return show_error(field, 'Please enter a year');
    }

    if(field == 'amount'){
        if(!value.length) return show_error(field, 'Please enter an amount');
        if(value < 0.50) return show_error(field, 'Minimum charge is $0.50');
    }

    clear_error(field);
    return true;
}

function sanitize(field){
    var input = $('#input_' + field);
    var value = $.trim(input.val());

    if(field == 'number'){
        value = value.replace(/[^\d]+/g, '');
    }

    if(field == 'cvc'){
        value = value.replace(/[^\d]+/g, '');   
    }

    if(field == 'exp_month'){
        value = value.replace(/[^\d]+/g, '');
        value = value.replace(/^0+/, '');
    }

    if(field == 'exp_year'){
        value = value.replace(/[^\d]+/g, '');
        if(value.length == 2) value = '20' + value;
    }

    if(field == 'amount'){
        value = value.replace(/[^\d\.]+/g, '');
        if(value.length) value = parseFloat(value).toFixed(2);
    }

    input.val(value);
}


$(function(){
    $('input').attr('autocomplete', 'off');

    unlock_inputs();

    $('input').blur(function(){
        var input = $(this);
        var name = input.attr('id').replace(/^input_/, '');

        sanitize(name);
        validate(name, input.val());
    });

    $('input').keydown(function(){
        $('#transaction_error').hide();
    });

    $('#payment_form').submit(function(){
        $('input').blur(); //trigger sanitize/validate functions

        if($('input.error').length > 0){
            unlock_inputs()
            $('input.error:first').focus();
            return false;
        }

        lock_inputs();

        var params = {};
        params['number']    = $('#input_number').val();
        params['cvc']       = $('#input_cvc').val();
        params['exp_month'] = $('#input_exp_month').val();
        params['exp_year']  = $('#input_exp_year').val();

        var amount = $('#input_amount').val().replace(/\./g, '');

        $('#progress_message').html('Validating card data...').show();

        Stripe.createToken(params, amount, function(status, response){              
            if(response.error){
                $('#transaction_error').html(response.error.message).slideDown();
                unlock_inputs();
                return false;
            }

            var charge = {};
            charge['token'] = response['id'];
            charge['amount'] = amount;
            charge['note'] = $('#input_note').val();
            $('#progress_message').html('Submitting charge...').show();
            $.post(location.href, charge, function(response){

                try{
                    response = JSON.parse(response);
                }catch(err){
                    //first way to fail: server returns something that's not json
                    if(!$.trim(response).length){
                        response = {error: 'Server returned empty response during charge attempt'};
                    }else{
                        response = {error: 'Server returned invalid response:<br /><br />' + response};
                    }
                }
                
                if(response['success']){
                    $('#wrap').html("<h2>MISSION ACCOMPLISHED</h2><b>$" + response['amount'] + " is making its way to our bank account.</b><br />Transaction ID: " + response['id'] + "<br /><br />").css('background-color', '#fff');
                    $("<a href='javascript:void(0);' class='red'>Make another charge</a>").click(function(){ location.href = location.href; }).appendTo('#wrap');
                }else{
                    //second way to fail: stripe declined the charge
                    $('#transaction_error').html(response['error']).slideDown();
                    unlock_inputs();
                }
            }).error(function(response){
                //third way to fail: server responds with an error code
                $('#transaction_error').html('Error on charge attempt:<br /><br />' + response.responseText).slideDown();
                unlock_inputs();
            });
        
        });

        return false;
    });
});