public function send_simple_message($to='',$subject='',$body='',$from='') {
  if ($from == '') 
    $from = Yii::app()->params['supportEmail'];
  $ch = $this->setup_curl('messages');
  curl_setopt($ch, CURLOPT_POSTFIELDS, array('from' => $from,
                                             'to' => $to,
                                             'subject' => $subject,
                                             'text' => $body,
                                             'o:tracking' => false,
                                             ));

  $result = curl_exec($ch);
  curl_close($ch);

  return $result;
}	
