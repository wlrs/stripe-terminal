stripe-terminal: A simple credit card terminal for Stripe.com
=============================================================

stripe-terminal is a single form that allows anyone with a [Stripe.com](https://stripe.com/) account to submit credit card charges from any web browser.

Features:

 * Simple javascript validation of data
 * Stripe.js token generation (credit card data doesn't touch your server)
 * Mobile browser friendly

Requirements:

 * Stripe account 
 * PHP web environment serving pages via https

Stripe accounts are free but require a US-based checking account to actually create charges. Test charges can be made from a page served over http.

Setup:
 
 * Set `$key_publishable` and `$key_secret` in index.php

Stripe.com provides "test" and "live" API keys, you should start with your test keys and refer to the [Stripe Testing FAQ](https://stripe.com/docs/testing). 
