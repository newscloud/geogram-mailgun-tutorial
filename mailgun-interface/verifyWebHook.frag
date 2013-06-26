// this verifies that the post was actually sent from Mailgun and is not malicious
// see http://documentation.mailgun.com/user_manual.html#events-webhooks
public function verifyWebHook($timestamp='', $token='', $signature='') {
  // Concatenate timestamp and token values
  $combined=$timestamp.$token;
  // Encode the resulting string with the HMAC algorithm
  // (using your API Key as a key and SHA256 digest mode)
  $result= hash_hmac('SHA256', $combined, Yii::app()->params['mailgun']['api_key']);
  if ($result == $signature)
    return true;
   else
   return false;    
}
