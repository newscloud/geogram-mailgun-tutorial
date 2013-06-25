// update outbound_mail table with external id to track future threading
  public function recordId($result,$id) {
    // returned from mailgun send
    $resp = json_decode($result);
    if (property_exists($resp,'id')) {
      OutboundMail::model()->updateAll(array( 'ext_id' => $resp->id ), 'id = '.$id );      
    }
