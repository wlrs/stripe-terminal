A simple terminal to submit credit card charges.
================================================

stripe-terminal is a single form that allows anyone with a stripe.com account to submit credit card charges from any web browser.

Features:

 * Simple javascript validation of data
 * Stripe.js token generation (credit card data doesn't touch your server)
 * Mobile browser friendly

Requirements:

 * stripe.com account 
 * PHP web environment serving pages via https

Stripe accounts are free but require a US-based checking account to actually create charges. Test charges can be made from a page served over http.

Setup:
 
 * Set `$key_publishable` and `$key_secret` in index.php

