/*
 Find external thread ID from message headers
 - this is used to track posts & reply in a single conversation thread
*/
$msg_headers=json_decode($cmd['message-headers']);
$reference_exists=false;
foreach ($msg_headers as $header) {
  if (strcasecmp($header[0],'References') ==0 ) {
    $references = $header[1];
    // lookup original post that thread refers to
    $thread = OutboundMail::model()->findByAttributes(array('ext_id'=>$references));
    if (!empty($thread)) {
  	  $outbound_parent_id=$thread->post_id;
  	  $outbound_msg_type = Post::TYPE_REPLY;
  	  $this->log_item('reply to thread: '.$thread->post_id);
  	} else {
  	  $outbound_parent_id=0;
  	}
  } 
  if (strcasecmp($header[0],'In-Reply-To')==0) {
    $inreplyto = $header[1];
    $this->log_item('replyto: '.$inreplyto);
    // lookup reply that inbound msg refers to
    $thread = OutboundMail::model()->findByAttributes(array('ext_id'=>$inreplyto));
    if (!empty($thread)) {
  	  $outbound_in_reply_to=$thread->post_id;
  	  $this->log_item('reply to: '.$thread->post_id);                  	  
  	  $outbound_msg_type = Post::TYPE_REPLY;
  	} else {
  	  $outbound_in_reply_to = 0;
  	}                    
  	// end reply-to ext-id search
  }
  // end foreach headers
}                  
