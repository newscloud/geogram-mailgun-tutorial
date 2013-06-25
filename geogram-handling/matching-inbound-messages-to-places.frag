// Lookup place from slug / get place_id / create new message
// e.g. match place-name@geogram.com to a specific place 
// check that sender is a valid member - allowed to post
// create a new post in the database - which will get picked up by next processing loop
  $place = Place::model()->findByAttributes(array('slug'=>$slug));  	    
    if ($place === null) {
      // send alert - we don't know that address
      OutboundMail::alertUnknownPlace($sender->email);
    } else {        
        if (!$commandRequest) {
        	// verify sender is a member of place
          if (Place::model()->isMember($sender->id,$place->id)) 
          {
            $this->log_item('IsMember - preparing msgpost');
            // Prepare message for sending
        	  $msg=new Post; 
          	$msg->subject = $cmd['subject'];
          	$msg->body = $body;
            $msg->status = Post::STATUS_PENDING;
          	$msg->place_id = $place->id;
            $msg->author_id = $sender->id;
            $msg->type = $outbound_msg_type;
        	  // submit to the outbox
        	  $msg->save();	
          } else {
            // send alert - you're not a member      
            OutboundMail::alertNotMember($sender->email,$place);
          }                          
        // end of commandRequest false block
        }
        // end of post / reply to message block
    }
