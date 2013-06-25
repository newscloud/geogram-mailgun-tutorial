/**
 * Send to user mail
 */
public static function sendMail($email,$subject,$message) {
  	$supportEmail = Yii::app()->params['supportEmail'];
    $headers = "MIME-Version: 1.0\r\nFrom: $supportEmail\r\nReply-To: $supportEmail\r\nContent-Type: text/html; charset=utf-8";
    $message = wordwrap($message, 70);
    $message = str_replace("\n.", "\n..", $message);
    $mailgun = new Mailgun();
    return $mailgun->php_mail($email,'=?UTF-8?B?'.base64_encode($subject).'?=',$message,$headers);    
    // old yii user-module standard code
    //return mail($email,'=?UTF-8?B?'.base64_encode($subject).'?=',$message,$headers);
}
