public function send_broadcast_message($from='support@yourdomain.com',$subject='',$body='',$recipient_list='',$recipient_vars='',$post_id=0) {
        $ch = $this->setup_curl('messages');
        curl_setopt($ch,
                    CURLOPT_POSTFIELDS,
                    array('from' => $from,
                          'to' => trim($recipient_list,','),
                          'subject' => $subject,
                          'text' => $body,
                          'recipient-variables' => $recipient_vars ,
                          'v:post_id' => $post_id)
                          );
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
      }
  