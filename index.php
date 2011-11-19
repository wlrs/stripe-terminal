<?

// comment this out to allow http:
if($_SERVER['SERVER_PORT'] == 80){
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    die();
}

$key_publishable    = '';
$key_secret         = '';
$note_prefix        = 'Terminal'; //this will be used in the charge's description
$title              = 'Terminal';
$currency           = 'usd';
$currency_symbol    = '$';
$demo_mode          = false;

if(!$key_publishable || !$key_secret) die('Please set stripe API keys');

if($_POST){
    require_once 'stripe-php/lib/Stripe.php';

    $note_parts = array();
    if($note_prefix) $note_parts[] = $note_prefix;
    if($_POST['note']) $note_parts[] = $_POST['note'];

    $params = array(
        'amount'        => $_POST['amount'],
        'currency'      => $currency,
        'card'          => $_POST['token'],
        'description'   => implode(' - ', $note_parts)
    );

    $response = array(
        'success' => false
    );

    try{
        Stripe::setApiKey($key_secret);
        $charge = Stripe_Charge::create($params);

        $response['success']    = true;
        $response['id']         = $charge->id;
        $response['amount']     = number_format($charge->amount / 100, 2);
        $response['fee']        = number_format($charge->fee / 100, 2);
        $response['card_type']  = $charge->card->type;
        $response['card_last4'] = $charge->card->last4;
    }catch (Exception $e) {
        $response['error'] = $e->getMessage();
    }

    echo json_encode($response);
    die();
}

?>
<!DOCTYPE html>
<html>
    <head>
        <title><?= $title ?></title>
        <link rel="stylesheet" type="text/css" media="screen" href="layout.css?<?= filemtime('layout.css') ?>" />
        <meta name="viewport" content="width=480px" />
        <meta name="viewport" content="user-scalable=no" />
    </head>
    <body>
        <div id="wrap">
            <h2><?= $title ?></h2>

            <? if($demo_mode){ ?>
                <div id="demo_warning">
                    This is a <b>DEMO</b>. Please don't enter real payment info. You can use <b>4242424242424242</b> as a valid card number. <a href="https://stripe.com/docs/testing">Stripe Testing FAQ</a>
                </div>
            <? } ?>

            <form action="" method="POST" id="payment_form">
                
                <label>Amount</label>

                <div class="form_input">
                    <input id="input_amount" type="text" placeholder="Ex: <?=$currency_symbol?>19.99" />
                </div>
                
                <div class="clear"></div>
                <div id="error_amount" class="error_wrapper"></div>


                <label>Card Number</label>

                <div class="form_input">
                    <input id="input_number" type="text" pattern="[0-9]*"/>
                </div>
                
                <div class="clear"></div>
                <div id="error_number" class="error_wrapper"></div>


                <label>CVC</label>

                <div class="form_input">
                    <input id="input_cvc" type="text" pattern="[0-9]*" />
                </div>

                <div class="clear"></div>
                <div id="error_cvc" class="error_wrapper"></div>

                
                <label>Expiration</label>

                <div class="form_input">
                    <input id="input_exp_month" type="text" pattern="[0-9]*" placeholder="MM" />
                    <span> / </span>
                    <input id="input_exp_year" type="text" pattern="[0-9]*" placeholder="YYYY" />
                </div>
                    
                <div class="clear"></div>
                <div id="error_exp_month" class="error_wrapper"></div>
                <div id="error_exp_year" class="error_wrapper"></div>


                <label>Note</label>

                <div class="form_input">
                    <input id="input_note" type="text" placeholder="A short note" />
                </div>
                
                <div class="clear"></div>
                <div id="error_note" class="error_wrapper"></div>


                <div id="transaction_error"></div>
                <div class="left" id="progress_message"></div>

                <div class="right" style="margin-top: 10px;">
                    <button id="submit_button" type="submit">Submit</button>
                </div>

                <div class="clear"></div>
            </form>
        </div>

        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
        <script type="text/javascript" src="https://js.stripe.com/v1/"></script>
        <script type="text/javascript" src="form.js?<?= filemtime('form.js') ?>"></script>
        <script type="text/javascript">
            Stripe.setPublishableKey('<?= $key_publishable ?>');
        </script>
    </body>
</html>