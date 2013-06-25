/* 
  Controller called when Mailgun posts data from inbound mail
    - Places data into inbox table in serialized form
*/
public function actionInbound()
{
  // optional - verify Mailgun tokens for security
  $bundle = serialize($_POST);
  $inboxItem = new Inbox;
  $inboxItem->addBundle($bundle);
}
