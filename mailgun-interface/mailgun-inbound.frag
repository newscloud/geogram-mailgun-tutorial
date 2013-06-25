/* Receives posted form from Mailgun with inbound commands
  Places data into inbox table in serialized form
*/
public function actionInbound()
{
  // optional - verify Mailgun tokens for security
  $bundle = serialize($_POST);
  $inboxItem = new Inbox;
  $inboxItem->addBundle($bundle);
}
