/*
 PHP example of sending message via curl to Mailgun
  - rewritten function for standard php mail() function
*/
public function php_mail($email ='',$subject='',$message='',$headers='') {
  $ch = $this->setup_curl('messages');
  curl_setopt($ch, CURLOPT_POSTFIELDS, array('from' => Yii::app()->params['supportEmail'],
                                             'to' => $email,
                                             'subject' => $subject,
                                             'text' => $message,
                                             'o:tracking' => false
                                             ));
  $result = curl_exec($ch);
  curl_close($ch);
  return $result;
}
